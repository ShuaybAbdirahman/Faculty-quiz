import React, { useCallback, useEffect, useState } from "react";
import {
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  Check,
  CheckCircle2,
  Copy,
  KeyRound,
  Loader2,
  LockKeyhole,
  MessageCircle,
  Phone,
  RefreshCw,
  ShieldCheck,
  UserCheck,
} from "lucide-react";
import { useApp } from "../context/AppContext";
import {
  fetchProInfo,
  ProApiError,
  redeemProCode,
  submitProRequest,
  type ProInfo,
} from "../lib/api";
import {
  buildSafeTelUssdUrl,
  buildSafeWhatsappUrl,
  canRevealPaymentDetails,
  clearRedeemFailures,
  EVC_PAYMENT_CONFIG,
  generateSecureEvcRef,
  getPaymentCooldownRemainingMs,
  getProBillingPlan,
  getRedeemCooldownRemainingMs,
  maskPaymentNumber,
  normalizeProInfo,
  PRO_BILLING_PLANS,
  recordPaymentAttempt,
  recordRedeemFailure,
  sanitizeCheckoutName,
  saveRequestedProItem,
  saveRequestedProScope,
  validateEvcPhone,
  type ProBillingCycle,
  type ProItemKey,
} from "../lib/proSecurity";

interface Msg {
  key: string;
  ok: boolean;
}

function errKey(code: string): string {
  switch (code) {
    case "offline":
      return "Lama xiriiri karo server-ka. Hubi internetka.";
    case "duplicate_txn":
      return "Lambarka xaqiijinta hore ayaa loo isticmaalay.";
    case "rate_limited":
      return "Isku-day badan. Fadlan mar dambe isku day.";
    case "bad_phone":
      return "Lambarka taleefanka waa khalad.";
    case "bad_txn":
      return "Lambarka xaqiijinta waa khalad (4-40 xaraf ama tiro).";
    default:
      return "Wax khalad ah ayaa dhacay. Mar kale isku day.";
  }
}

export type ProPlanType = "total" | "departments" | "languages" | "school_subject" | "bridge_exam";

function currentHHMM(): string {
  const now = new Date();
  return `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;
}

const CYCLE_ORDER: ProBillingCycle[] = ["weekly", "monthly", "yearly"];

const UNIFIED_PRO_BENEFITS = [
  "Qalabka Ardayga: Xisaabiyaha Darajada & GPA, Jadwalka Toddobaadlaha & Saacadda Focus-ka",
  "Hagaha Waaxda (70 Su'aalood), Khariidadaha Xirfadaha & Isbarbardhigga Kulliyadaha",
  "Sirta Ardayda Top-10, Predict Exams (12 Maado Form 4 + 5 Maado Gelitaan) & Kaalmaha Sare",
  "Jaamacadaha Soomaaliya, Shaqooyinka Mustaqbalka, Xirfadaha Dakhliga & Luqadaha (EN/AR)",
];

export function ProPaywallScreen({
  initialPlan = "total",
  initialBilling = "monthly",
  initialItemKey,
  onBack,
  onUnlocked,
}: {
  initialPlan?: ProPlanType;
  initialBilling?: ProBillingCycle;
  initialItemKey?: ProItemKey;
  onBack: () => void;
  onUnlocked: (unlockedItemKey?: ProItemKey) => void;
}) {
  const { darkMode, tr, rtl, userName, deviceId, pendingAt, setPendingAt, setProUntil, refreshPro, showToast } =
    useApp();

  const [info, setInfo] = useState<ProInfo>(() => normalizeProInfo());
  const [loadingInfo, setLoadingInfo] = useState(true);
  const [cycle, setCycle] = useState<ProBillingCycle>(initialBilling);
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [checkoutTab, setCheckoutTab] = useState<"evc" | "code">("evc");

  const [phone, setPhone] = useState("");
  const [name, setName] = useState(userName);
  const [committed, setCommitted] = useState(false);
  const [step2Error, setStep2Error] = useState<string | null>(null);

  const [code, setCode] = useState("");
  const [copiedNum, setCopiedNum] = useState(false);

  const [sending, setSending] = useState(false);
  const [checking, setChecking] = useState(false);
  const [redeeming, setRedeeming] = useState(false);

  const [reqMsg, setReqMsg] = useState<Msg | null>(null);
  const [statMsg, setStatMsg] = useState<Msg | null>(null);
  const [codeMsg, setCodeMsg] = useState<Msg | null>(null);

  const [payCooldownSec, setPayCooldownSec] = useState<number>(() =>
    Math.ceil(getPaymentCooldownRemainingMs(localStorage, deviceId) / 1000)
  );
  const [redeemLockSec, setRedeemLockSec] = useState<number>(() =>
    Math.ceil(getRedeemCooldownRemainingMs(localStorage, deviceId) / 1000)
  );

  const activeBilling = getProBillingPlan(cycle);

  useEffect(() => {
    if (payCooldownSec <= 0 && redeemLockSec <= 0) return;
    const t = window.setInterval(() => {
      setPayCooldownSec(Math.ceil(getPaymentCooldownRemainingMs(localStorage, deviceId) / 1000));
      setRedeemLockSec(Math.ceil(getRedeemCooldownRemainingMs(localStorage, deviceId) / 1000));
    }, 1000);
    return () => window.clearInterval(t);
  }, [payCooldownSec, redeemLockSec, deviceId]);

  const loadInfo = useCallback(async () => {
    setLoadingInfo(true);
    try {
      const i = await fetchProInfo();
      setInfo(i);
    } catch {
      setInfo(normalizeProInfo());
    } finally {
      setLoadingInfo(false);
    }
  }, []);

  useEffect(() => {
    loadInfo();
  }, [loadInfo]);

  const handleUnlocked = () => {
    showToast(tr("HIRAAL Pro waa la furay!"));
    onUnlocked(initialItemKey);
  };

  const revealPaymentNumber = canRevealPaymentDetails({
    step,
    phone,
    name,
    committed,
  });

  const evcMethod = info.methods[0] ?? {
    name: EVC_PAYMENT_CONFIG.methodName,
    number: EVC_PAYMENT_CONFIG.number,
    holder: EVC_PAYMENT_CONFIG.holder,
  };

  const handleProceedToStep3 = () => {
    const phoneCheck = validateEvcPhone(phone);
    if (!phoneCheck.ok) {
      setStep2Error("Fadlan geli lambar EVC Plus oo sax ah (ugu yaraan 7 tiro).");
      return;
    }
    const clean = sanitizeCheckoutName(name);
    const letters = clean.match(/\p{L}/gu);
    if (!letters || letters.length < 2) {
      setStep2Error("Fadlan qor magacaaga buuxa si aan u xaqiijinno codsigaaga.");
      return;
    }
    if (!committed) {
      setStep2Error("Fadlan calaamadee sanduuqa ballanqaadka si aad u aragto lambarka lacag-bixinta.");
      return;
    }
    setStep2Error(null);
    setStep(3);
  };

  const handleSendRequest = async () => {
    if (!revealPaymentNumber) {
      setStep(2);
      return;
    }

    const cooldownMs = getPaymentCooldownRemainingMs(localStorage, deviceId);
    if (cooldownMs > 0) {
      setPayCooldownSec(Math.ceil(cooldownMs / 1000));
      setReqMsg({ key: "Isku-day badan. Fadlan mar dambe isku day.", ok: false });
      return;
    }

    const phoneCheck = validateEvcPhone(phone);
    if (!phoneCheck.ok) {
      setReqMsg({ key: "Lambarka taleefanka waa khalad.", ok: false });
      return;
    }

    const cleanName = sanitizeCheckoutName(name);
    const autoTime = currentHHMM();
    const tag = cycle.toUpperCase();
    const generatedRef = generateSecureEvcRef(deviceId, autoTime, phoneCheck.normalized, tag);
    const methodLabel = `EVC ${activeBilling.id.toUpperCase()} (${activeBilling.priceText} · ${activeBilling.durationLabel})`;

    setSending(true);
    setReqMsg(null);
    try {
      saveRequestedProScope(localStorage, deviceId, "full");
      if (initialItemKey) {
        saveRequestedProItem(localStorage, deviceId, initialItemKey);
      }
      await submitProRequest({
        deviceId,
        phone: phoneCheck.normalized,
        method: methodLabel,
        txn: generatedRef,
        amount: `${activeBilling.priceText} (${activeBilling.durationLabel})`,
        name: cleanName || undefined,
      });
      recordPaymentAttempt(localStorage, deviceId);
      setPayCooldownSec(Math.ceil(getPaymentCooldownRemainingMs(localStorage, deviceId) / 1000));
      setPendingAt(Date.now());
      setReqMsg({
        key: "Codsigaaga waa la diray. Markii la xaqiijiyo, riix “Hubi xaaladda” si uu kuugu furmo.",
        ok: true,
      });
    } catch (e) {
      setReqMsg({ key: errKey(e instanceof ProApiError ? e.code : "error"), ok: false });
    } finally {
      setSending(false);
    }
  };

  const handleCheck = async () => {
    setChecking(true);
    setStatMsg(null);
    try {
      const ok = await refreshPro();
      if (ok) {
        handleUnlocked();
      } else {
        setStatMsg({
          key: "Weli lama xaqiijin. Fadlan sug wax yar ama la xiriir taageerada WhatsApp.",
          ok: false,
        });
      }
    } catch (e) {
      setStatMsg({ key: errKey(e instanceof ProApiError ? e.code : "error"), ok: false });
    } finally {
      setChecking(false);
    }
  };

  const handleRedeem = async () => {
    const lockMs = getRedeemCooldownRemainingMs(localStorage, deviceId);
    if (lockMs > 0) {
      setRedeemLockSec(Math.ceil(lockMs / 1000));
      setCodeMsg({ key: "Isku-day badan. Fadlan mar dambe isku day.", ok: false });
      return;
    }

    const cleanedCode = code.trim().toUpperCase().replace(/[^A-Z0-9-]/g, "");
    if (cleanedCode.replace(/-/g, "").length < 8) {
      setCodeMsg({ key: "Koodhku waa khalad.", ok: false });
      return;
    }

    setRedeeming(true);
    setCodeMsg(null);
    try {
      const res = await redeemProCode(deviceId, cleanedCode);
      if (res.ok) {
        clearRedeemFailures(localStorage);
        setRedeemLockSec(0);
        const fallbackExp = res.expiresMs || Date.now() + activeBilling.days * 86400 * 1000;
        if (res.scope || (res.unlockedItems && res.unlockedItems.length > 0)) {
          await refreshPro();
        } else {
          setProUntil(fallbackExp, "full", initialItemKey);
        }
        handleUnlocked();
      } else {
        const triggeredMs = recordRedeemFailure(localStorage, deviceId);
        if (triggeredMs > 0) {
          setRedeemLockSec(Math.ceil(triggeredMs / 1000));
        }
        setCodeMsg({
          key: res.error === "code_used" ? "Koodhkan hore ayaa loo isticmaalay." : "Koodhku waa khalad.",
          ok: false,
        });
      }
    } catch (e) {
      setCodeMsg({ key: errKey(e instanceof ProApiError ? e.code : "error"), ok: false });
    } finally {
      setRedeeming(false);
    }
  };

  const handleCopyNumber = async () => {
    if (!revealPaymentNumber) return;
    try {
      await navigator.clipboard.writeText(evcMethod.number);
      setCopiedNum(true);
      showToast(tr("Lambarka waa la koobiyay"));
      window.setTimeout(() => setCopiedNum(false), 2000);
    } catch {
      // ignore
    }
  };

  const pending = pendingAt > 0 && Date.now() - pendingAt < 7 * 86400 * 1000;

  const whatsappConfirmHref = buildSafeWhatsappUrl(
    info.whatsapp,
    `Salaan, waxaan bixiyay lacagta HIRAAL Pro (${activeBilling.title} · ${activeBilling.priceText} · ${activeBilling.durationLabel}).\n` +
      `Tel: ${validateEvcPhone(phone).normalized || "-"}\n` +
      `Magac: ${sanitizeCheckoutName(name) || "-"}`
  );

  const ussdHref = revealPaymentNumber
    ? buildSafeTelUssdUrl(evcMethod.number, activeBilling.ussdAmount)
    : undefined;

  const pageBg = darkMode
    ? "bg-[#0B1324] text-slate-100"
    : "bg-slate-50 text-slate-900";
  const cardCls = darkMode
    ? "bg-[#111C33] border-white/10 text-slate-100"
    : "bg-white border-slate-200 text-slate-900 shadow-xs";
  const mutedCls = darkMode ? "text-slate-300" : "text-slate-600";
  const inputCls = darkMode
    ? "bg-[#0B1324] border-white/15 text-white placeholder:text-slate-500 focus:border-blue-400"
    : "bg-slate-50 border-slate-300 text-slate-900 placeholder:text-slate-400 focus:border-blue-600";

  const MsgView = ({ msg }: { msg: Msg | null }) =>
    !msg ? null : (
      <div
        role="alert"
        className={`mt-3 rounded-xl px-4 py-3 flex items-start gap-2.5 text-xs leading-relaxed border ${
          msg.ok
            ? "bg-emerald-500/12 border-emerald-500/35 text-emerald-700 dark:text-emerald-200"
            : "bg-rose-500/12 border-rose-500/35 text-rose-700 dark:text-rose-200"
        }`}
      >
        {msg.ok ? (
          <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
        ) : (
          <AlertCircle className="w-4 h-4 text-rose-600 dark:text-rose-400 shrink-0 mt-0.5" />
        )}
        <span>{tr(msg.key)}</span>
      </div>
    );

  return (
    <div className={`min-h-screen flex flex-col ${pageBg}`}>
      {/* Clean Header without Device ID or Time Clutter */}
      <header
        className={`border-b sticky top-0 z-20 backdrop-blur-xl ${
          darkMode ? "bg-[#0B1324]/92 border-white/10" : "bg-white/92 border-slate-200"
        }`}
      >
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-3.5 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <button
              type="button"
              onClick={onBack}
              aria-label="Back"
              className={`min-h-[40px] min-w-[40px] flex items-center justify-center rounded-xl border cursor-pointer transition-colors shrink-0 ${
                darkMode
                  ? "bg-white/5 hover:bg-white/10 border-white/10 text-white"
                  : "bg-slate-100 hover:bg-slate-200 border-slate-200 text-slate-900"
              }`}
            >
              {rtl ? <ArrowRight className="w-5 h-5" /> : <ArrowLeft className="w-5 h-5" />}
            </button>
            <h1 className="font-head font-bold text-lg sm:text-xl tracking-tight truncate">
              HIRAAL Pro · Furitaanka Ammaanka ah
            </h1>
          </div>

          <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700 dark:text-emerald-400 whitespace-nowrap shrink-0">
            <ShieldCheck className="w-4 h-4" />
            <span>Lacag-bixin Xaqiijisan</span>
          </span>
        </div>
      </header>

      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-8 pb-16 space-y-6">
        {/* Clean 3-Step Guided Progress */}
        <div className={`rounded-2xl p-3.5 sm:px-5 border ${cardCls} flex items-center justify-between gap-2 overflow-x-auto hide-scrollbar`}>
          {[
            { n: 1 as const, label: "1. Dooro Xirmada" },
            { n: 2 as const, label: "2. Xogta & Ballanqaadka" },
            { n: 3 as const, label: "3. Lambarka & Bixinta" },
          ].map((st, idx) => {
            const done = step > st.n;
            const current = step === st.n;
            const canJump = st.n < step;
            return (
              <React.Fragment key={st.n}>
                <button
                  type="button"
                  disabled={!canJump}
                  onClick={() => canJump && setStep(st.n)}
                  className={`flex items-center gap-2 whitespace-nowrap shrink-0 ${
                    canJump ? "cursor-pointer" : "cursor-default"
                  }`}
                >
                  <span
                    className={`w-6 h-6 rounded-full text-xs font-head font-bold flex items-center justify-center transition-colors ${
                      done
                        ? "bg-emerald-600 text-white"
                        : current
                          ? "bg-blue-600 text-white"
                          : darkMode
                            ? "bg-white/10 text-slate-400"
                            : "bg-slate-200 text-slate-500"
                    }`}
                  >
                    {done ? <Check className="w-3.5 h-3.5" /> : st.n}
                  </span>
                  <span
                    className={`text-xs sm:text-sm font-semibold ${
                      current
                        ? "text-blue-600 dark:text-amber-400"
                        : done
                          ? "text-emerald-700 dark:text-emerald-400"
                          : mutedCls
                    }`}
                  >
                    {st.label}
                  </span>
                </button>
                {idx < 2 && (
                  <div
                    className={`h-[1px] flex-1 min-w-[20px] ${
                      darkMode ? "bg-white/10" : "bg-slate-200"
                    }`}
                  />
                )}
              </React.Fragment>
            );
          })}
        </div>

        {/* Method Toggle: EVC Plus Guided Checkout vs Activation Code */}
        <div
          className={`max-w-md rounded-xl p-1 border grid grid-cols-2 gap-1 ${
            darkMode ? "bg-[#111C33] border-white/10" : "bg-white border-slate-200"
          }`}
        >
          <button
            type="button"
            onClick={() => setCheckoutTab("evc")}
            className={`min-h-[40px] rounded-lg text-xs sm:text-sm font-head font-bold flex items-center justify-center gap-2 cursor-pointer transition-colors ${
              checkoutTab === "evc"
                ? "bg-blue-600 text-white"
                : `${mutedCls} hover:text-slate-900 dark:hover:text-white`
            }`}
          >
            <Phone className="w-4 h-4" />
            <span>Bixi EVC Plus</span>
          </button>
          <button
            type="button"
            onClick={() => setCheckoutTab("code")}
            className={`min-h-[40px] rounded-lg text-xs sm:text-sm font-head font-bold flex items-center justify-center gap-2 cursor-pointer transition-colors ${
              checkoutTab === "code"
                ? "bg-blue-600 text-white"
                : `${mutedCls} hover:text-slate-900 dark:hover:text-white`
            }`}
          >
            <KeyRound className="w-4 h-4" />
            <span>Koodh Furitaan</span>
          </button>
        </div>

        {checkoutTab === "code" ? (
          <section className={`max-w-xl rounded-2xl p-6 border ${cardCls} space-y-4`}>
            <div>
              <h2 className="font-head font-bold text-xl">Geli Koodhkaaga Furitaanka</h2>
              <p className={`text-sm mt-1 ${mutedCls}`}>
                Haddii laguu soo diray koodhka HIRAAL Pro, halkan ku qor si uu isla markiiba kuugu furmo.
              </p>
            </div>
            <div>
              <label htmlFor="pro-redeem-code" className={`block text-xs font-semibold mb-1.5 ${mutedCls}`}>
                Koodhka Furitaanka
              </label>
              <input
                id="pro-redeem-code"
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value.toUpperCase())}
                placeholder="XXXX-XXXX-XXXX"
                className={`w-full rounded-xl px-4 py-3 text-base font-mono font-bold tracking-widest border outline-none ${inputCls}`}
              />
            </div>
            <button
              type="button"
              disabled={redeeming || redeemLockSec > 0}
              onClick={handleRedeem}
              className="w-full min-h-[48px] rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-head font-bold text-sm flex items-center justify-center gap-2 cursor-pointer disabled:opacity-55 transition-colors"
            >
              {redeeming ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : redeemLockSec > 0 ? (
                <span className="tabular-nums">Sug {redeemLockSec}s...</span>
              ) : (
                <span>Fur HIRAAL Pro</span>
              )}
            </button>
            <MsgView msg={codeMsg} />
          </section>
        ) : (
          <div className="grid lg:grid-cols-12 gap-6 items-start">
            {/* Left Column: Selected Plan Summary & Unified Benefits */}
            <aside className={`lg:col-span-5 rounded-2xl p-6 border ${cardCls} space-y-5`}>
              <div className="space-y-1">
                <div className="text-xs font-semibold text-blue-600 dark:text-amber-400">
                  Hal Furitaan · Dhammaan Qeybaha Pro
                </div>
                <h2 className="font-head font-bold text-xl">{activeBilling.title}</h2>
                <div className="flex items-baseline gap-2 pt-1">
                  <span className="font-head font-extrabold text-3xl tabular-nums text-blue-600 dark:text-amber-400">
                    {activeBilling.priceText}
                  </span>
                  <span className={`text-sm font-medium ${mutedCls}`}>
                    / {activeBilling.durationLabel}
                  </span>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-200 dark:border-white/10 space-y-3">
                <div className="text-xs font-bold">Waxa kuu furmaya dhammaan:</div>
                {UNIFIED_PRO_BENEFITS.map((item) => (
                  <div key={item} className="flex items-start gap-2.5 text-sm leading-relaxed">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-1" />
                    <span className={mutedCls}>{item}</span>
                  </div>
                ))}
              </div>

              {/* Masked Security Notice (Number strictly hidden until Step 3) */}
              <div
                className={`rounded-xl p-4 border text-xs leading-relaxed flex items-start gap-2.5 ${
                  darkMode
                    ? "bg-[#0B1324] border-white/10 text-slate-300"
                    : "bg-slate-50 border-slate-200 text-slate-600"
                }`}
              >
                <LockKeyhole className="w-4 h-4 text-blue-600 dark:text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-slate-900 dark:text-white">Amniga Lambarka Lacag-bixinta:</strong>{" "}
                  {revealPaymentNumber
                    ? "Waxaad joogtaa tallaabada ugu dambeysa; lambarka rasmiga ah hadda ayuu kuu furan yahay."
                    : `Lambarka EVC Plus (${maskPaymentNumber(evcMethod.number)}) wuxuu furmayaa oo keliya tallaabada 3aad si looga ilaaliyo dadka aan dhabta ka ahayn.`}
                </div>
              </div>
            </aside>

            {/* Right Column: Active Step Workspace */}
            <section className={`lg:col-span-7 rounded-2xl p-5 sm:p-6 border ${cardCls} space-y-6`}>
              {step === 1 && (
                <div className="space-y-5">
                  <div>
                    <h2 className="font-head font-bold text-xl">
                      1. Dooro Mudada Kuugu Habboon (Weekly, Monthly, Yearly)
                    </h2>
                    <p className={`text-sm mt-1 ${mutedCls}`}>
                      Dhammaan xirmooyinku waxay furaan awoodda buuxda ee HIRAAL Pro. Dooro muddada ku habboon qorshahaaga.
                    </p>
                  </div>

                  <div className="grid sm:grid-cols-3 gap-3">
                    {CYCLE_ORDER.map((id) => {
                      const planOpt = PRO_BILLING_PLANS[id];
                      const selected = cycle === id;
                      return (
                        <button
                          key={id}
                          type="button"
                          onClick={() => setCycle(id)}
                          className={`text-start rounded-2xl p-4 border transition-all cursor-pointer flex flex-col justify-between gap-3 ${
                            selected
                              ? "border-blue-600 dark:border-amber-400 bg-blue-50/70 dark:bg-amber-400/10 ring-1 ring-blue-600 dark:ring-amber-400"
                              : darkMode
                                ? "border-white/12 bg-[#0B1324] hover:border-white/25"
                                : "border-slate-200 bg-slate-50 hover:border-slate-300"
                          }`}
                        >
                          <div className="space-y-1">
                            <div className="text-xs font-semibold text-blue-600 dark:text-amber-400">
                              {planOpt.badge ?? planOpt.durationLabel}
                            </div>
                            <div className="font-head font-bold text-base">
                              {planOpt.title}
                            </div>
                            <div className={`text-xs leading-relaxed ${mutedCls}`}>
                              {planOpt.subtitle}
                            </div>
                          </div>

                          <div className="pt-2 border-t border-slate-200/80 dark:border-white/10 flex items-baseline justify-between gap-2">
                            <span className="font-head font-extrabold text-2xl tabular-nums">
                              {planOpt.priceText}
                            </span>
                            {planOpt.savingsLabel ? (
                              <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400">
                                {planOpt.savingsLabel}
                              </span>
                            ) : (
                              <span className={`text-xs font-medium ${mutedCls}`}>
                                {planOpt.durationLabel}
                              </span>
                            )}
                          </div>
                        </button>
                      );
                    })}
                  </div>

                  <button
                    type="button"
                    onClick={() => setStep(2)}
                    className="w-full min-h-[48px] rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-head font-bold text-sm flex items-center justify-center gap-2 cursor-pointer transition-colors"
                  >
                    <span>Sii wad: Gali Xogtaada ({activeBilling.priceText})</span>
                    {rtl ? <ArrowLeft className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
                  </button>
                </div>
              )}

              {step === 2 && (
                <div className="space-y-5">
                  <div>
                    <h2 className="font-head font-bold text-xl">
                      2. Xaqiiji Magacaaga &amp; Lambarkaaga EVC
                    </h2>
                    <p className={`text-sm mt-1 ${mutedCls}`}>
                      Lambarka lacagta lagu diro wuxuu si ammaan ah kuugu soo baxayaa tallaabada xigta marka aad xaqiijiso inaad diyaar u tahay bixinta.
                    </p>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="evc-phone" className={`block text-xs font-semibold mb-1.5 ${mutedCls}`}>
                        Lambarka taleefankaaga EVC Plus
                      </label>
                      <input
                        id="evc-phone"
                        type="tel"
                        value={phone}
                        maxLength={20}
                        onChange={(e) => {
                          setPhone(e.target.value.replace(/[^0-9+ ]/g, ""));
                          setStep2Error(null);
                        }}
                        placeholder="061XXXXXXX"
                        className={`w-full rounded-xl px-4 py-3 text-sm border outline-none tabular-nums ${inputCls}`}
                      />
                    </div>

                    <div>
                      <label htmlFor="evc-name" className={`block text-xs font-semibold mb-1.5 ${mutedCls}`}>
                        Magacaaga buuxa
                      </label>
                      <input
                        id="evc-name"
                        type="text"
                        value={name}
                        maxLength={40}
                        onChange={(e) => {
                          setName(e.target.value);
                          setStep2Error(null);
                        }}
                        placeholder="Tusaale: Axmed Cali"
                        className={`w-full rounded-xl px-4 py-3 text-sm border outline-none ${inputCls}`}
                      />
                    </div>
                  </div>

                  <label
                    className={`flex items-start gap-3 rounded-xl p-4 border cursor-pointer transition-colors ${
                      committed
                        ? "border-emerald-500/50 bg-emerald-500/10"
                        : darkMode
                          ? "border-white/12 bg-[#0B1324]"
                          : "border-slate-200 bg-slate-50"
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={committed}
                      onChange={(e) => {
                        setCommitted(e.target.checked);
                        setStep2Error(null);
                      }}
                      className="mt-1 w-4 h-4 accent-blue-600 cursor-pointer shrink-0"
                    />
                    <span className="text-xs sm:text-sm leading-relaxed">
                      Waxaan si dhab ah diyaar ugu ahay inaan hadda bixiyo{" "}
                      <strong className="tabular-nums">{activeBilling.priceText}</strong> (Xirmada{" "}
                      <strong>{activeBilling.title}</strong>) ee EVC Plus si ay iigu furanto HIRAAL Pro.
                    </span>
                  </label>

                  {step2Error && (
                    <div
                      role="alert"
                      className="rounded-xl px-4 py-3 bg-rose-500/12 border border-rose-500/35 text-rose-700 dark:text-rose-200 text-xs flex items-start gap-2"
                    >
                      <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                      <span>{step2Error}</span>
                    </div>
                  )}

                  <div className="flex flex-col sm:flex-row gap-3">
                    <button
                      type="button"
                      onClick={() => setStep(1)}
                      className={`min-h-[46px] px-5 rounded-xl border font-head font-bold text-sm cursor-pointer transition-colors ${
                        darkMode
                          ? "border-white/15 hover:bg-white/8 text-slate-200"
                          : "border-slate-300 hover:bg-slate-100 text-slate-800"
                      }`}
                    >
                      Dib u noqo
                    </button>
                    <button
                      type="button"
                      onClick={handleProceedToStep3}
                      className="flex-1 min-h-[48px] rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-head font-bold text-sm flex items-center justify-center gap-2 cursor-pointer transition-colors"
                    >
                      <UserCheck className="w-4 h-4" />
                      <span>Xaqiiji oo Fur Lambarka Lacag-bixinta</span>
                    </button>
                  </div>
                </div>
              )}

              {step === 3 && revealPaymentNumber && (
                <div className="space-y-5">
                  <div className="flex items-start justify-between gap-3 flex-wrap">
                    <div>
                      <div className="text-xs font-semibold text-emerald-700 dark:text-emerald-400">
                        Tallaabada Ugu Dambeysa · Xogta Lacag-bixinta
                      </div>
                      <h2 className="font-head font-bold text-xl mt-0.5">
                        Ku dir {activeBilling.priceText} EVC Plus
                      </h2>
                    </div>
                    <button
                      type="button"
                      onClick={() => setStep(2)}
                      className="text-xs font-semibold text-blue-600 dark:text-amber-400 hover:underline cursor-pointer"
                    >
                      Beddel xogtaada
                    </button>
                  </div>

                  {/* Protected Merchant Number Card - Rendered ONLY at Step 3 */}
                  <div
                    className={`rounded-2xl p-5 border ${
                      darkMode
                        ? "bg-[#0B1324] border-amber-400/35"
                        : "bg-blue-50/60 border-blue-200"
                    } space-y-4`}
                  >
                    <div className="flex items-start justify-between gap-3 flex-wrap">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-xs font-bold text-blue-700 dark:text-amber-400">
                          <Phone className="w-3.5 h-3.5" />
                          <span>{evcMethod.name}</span>
                          {loadingInfo && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                        </div>
                        <div
                          data-testid="revealed-evc-number"
                          className="font-head font-extrabold text-3xl tracking-wider tabular-nums select-all"
                        >
                          {evcMethod.number}
                        </div>
                        <div className={`text-sm font-medium ${mutedCls}`}>
                          Magaca: <strong className="text-slate-900 dark:text-white">{evcMethod.holder}</strong>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={handleCopyNumber}
                        className="min-h-[42px] px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-head font-bold text-xs inline-flex items-center gap-2 cursor-pointer transition-colors shrink-0"
                      >
                        {copiedNum ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                        <span>{copiedNum ? "La koobiyay" : "Koobi lambarka"}</span>
                      </button>
                    </div>

                    <div className="pt-3 border-t border-slate-200 dark:border-white/10 flex items-center justify-between gap-2 flex-wrap text-xs">
                      <span className={`font-medium tabular-nums ${mutedCls}`}>
                        Xirmada: {activeBilling.title} ({activeBilling.priceText})
                      </span>
                      {ussdHref && (
                        <a
                          href={ussdHref}
                          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border font-mono font-bold transition-colors ${
                            darkMode
                              ? "bg-white/8 hover:bg-white/14 border-white/15 text-amber-300"
                              : "bg-white hover:bg-slate-100 border-slate-300 text-blue-700"
                          }`}
                        >
                          <Phone className="w-3.5 h-3.5" />
                          <span>*712*{evcMethod.number}*{activeBilling.ussdAmount}#</span>
                        </a>
                      )}
                    </div>
                  </div>

                  {pending && !reqMsg && (
                    <div className="rounded-xl px-4 py-3 bg-amber-500/12 border border-amber-500/35 text-xs text-amber-800 dark:text-amber-200">
                      Codsi hore ayaa socda; markii aad lacagta dirto riix “Hubi xaaladda”.
                    </div>
                  )}

                  <div className="space-y-2.5">
                    <button
                      type="button"
                      disabled={sending || payCooldownSec > 0}
                      onClick={handleSendRequest}
                      className="w-full min-h-[48px] rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-head font-bold text-sm flex items-center justify-center gap-2 cursor-pointer disabled:opacity-55 transition-colors"
                    >
                      {sending ? (
                        <Loader2 className="w-5 h-5 animate-spin" />
                      ) : payCooldownSec > 0 ? (
                        <span className="tabular-nums">Sug {payCooldownSec}s...</span>
                      ) : (
                        <span>Dir Codsiga Xaqiijinta</span>
                      )}
                    </button>

                    <a
                      href={whatsappConfirmHref}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`w-full min-h-[44px] rounded-xl border font-bold text-xs flex items-center justify-center gap-2 transition-colors ${
                        darkMode
                          ? "border-emerald-500/35 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300"
                          : "border-emerald-300 bg-emerald-50 hover:bg-emerald-100 text-emerald-800"
                      }`}
                    >
                      <MessageCircle className="w-4 h-4" />
                      <span>U dir caddaynta WhatsApp (Degdeg)</span>
                    </a>
                  </div>

                  <MsgView msg={reqMsg} />

                  <div className="pt-4 border-t border-slate-200 dark:border-white/10 space-y-2.5">
                    <div className={`text-xs font-medium ${mutedCls}`}>
                      Ma dirtay lacagta? Riix badhanka hoose si toos loogu furo akoonkaaga:
                    </div>
                    <button
                      type="button"
                      disabled={checking}
                      onClick={handleCheck}
                      className={`w-full min-h-[46px] rounded-xl border font-head font-bold text-sm flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 transition-colors ${
                        darkMode
                          ? "border-amber-400/50 bg-amber-400/10 hover:bg-amber-400/18 text-amber-300"
                          : "border-blue-600 bg-blue-50 hover:bg-blue-100 text-blue-700"
                      }`}
                    >
                      <RefreshCw className={`w-4 h-4 ${checking ? "animate-spin" : ""}`} />
                      <span>Hubi xaaladda</span>
                    </button>
                    <MsgView msg={statMsg} />
                  </div>
                </div>
              )}
            </section>
          </div>
        )}
      </main>
    </div>
  );
}
