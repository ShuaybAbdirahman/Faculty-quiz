import React, { useCallback, useEffect, useState } from "react";
import {
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Check,
  CheckCircle2,
  Copy,
  GraduationCap,
  KeyRound,
  Layers,
  Loader2,
  LockKeyhole,
  MessageCircle,
  Phone,
  RefreshCw,
  ShieldCheck,
  Target,
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
  getProLevelForCycle,
  getRedeemCooldownRemainingMs,
  getRukunPricing,
  maskPaymentNumber,
  normalizeProInfo,
  PRO_LEVEL_PLANS,
  recordPaymentAttempt,
  recordRedeemFailure,
  RUKUN_PLANS,
  sanitizeCheckoutName,
  saveRequestedProItem,
  saveRequestedProLevel,
  saveRequestedProScope,
  validateEvcPhone,
  type ProBillingCycle,
  type ProItemKey,
  type ProScope,
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

export type ProPlanType =
  | "school"
  | "jus"
  | "university"
  | "total"
  | "departments"
  | "languages"
  | "school_subject"
  | "bridge_exam";

export type StageChoice = "school" | "jus" | "university" | "total";

function initialStageFromPlan(plan: ProPlanType): StageChoice {
  if (plan === "school" || plan === "school_subject") return "school";
  if (plan === "jus" || plan === "bridge_exam") return "jus";
  if (plan === "total") return "total";
  return "university";
}

function scopeFromPlan(stage: StageChoice, initialPlan: ProPlanType): ProScope {
  if (stage === "total") return "full";
  if (stage === "school") return "school";
  if (stage === "jus") return "jus";
  if (initialPlan === "languages") return "languages";
  return "university";
}

function currentHHMM(): string {
  const now = new Date();
  return `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;
}

const CYCLE_ORDER: ProBillingCycle[] = ["weekly", "monthly", "yearly"];

const STAGE_BUTTONS: {
  id: Exclude<StageChoice, "total">;
  label: string;
  items: string[];
  icon: React.ComponentType<{ className?: string }>;
  activeCls: string;
}[] = [
  {
    id: "school",
    label: "School",
    items: [
      "Form 4 Predict (12 Maado)",
      "Sirta Top-10 & Maaddooyinka",
      "Ranking (Kaalmaha Sare)",
    ],
    icon: BookOpen,
    activeCls: "border-cyan-500 bg-cyan-500/15 text-cyan-800 dark:text-cyan-200 ring-1 ring-cyan-500",
  },
  {
    id: "jus",
    label: "Diyaarinta",
    items: [
      "5 Maado Gelitaan (Oct 2027)",
      "Qorshaha 90 Maalmood & Caqabadaha",
      "Ranking Gelitaanka",
    ],
    icon: Target,
    activeCls: "border-emerald-500 bg-emerald-500/15 text-emerald-800 dark:text-emerald-200 ring-1 ring-emerald-500",
  },
  {
    id: "university",
    label: "University",
    items: [
      "Qalabka Ardayga & Hagaha Waaxda",
      "Jaamacadaha & Khariidadaha",
      "Suuqa Shaqada & Luqadaha",
    ],
    icon: GraduationCap,
    activeCls: "border-indigo-500 bg-indigo-500/15 text-indigo-800 dark:text-indigo-200 ring-1 ring-indigo-500",
  },
];

export function ProPaywallScreen({
  initialPlan = "university",
  initialBilling = "monthly",
  initialItemKey,
  onBack,
  onUnlocked,
}: {
  initialPlan?: ProPlanType;
  initialBilling?: ProBillingCycle;
  initialItemKey?: ProItemKey;
  onBack: () => void;
  onUnlocked: (unlockedItemKey?: ProItemKey, unlockedStage?: StageChoice) => void;
}) {
  const { darkMode, tr, rtl, userName, deviceId, pendingAt, setPendingAt, setProUntil, refreshPro, showToast } =
    useApp();

  const [info, setInfo] = useState<ProInfo>(() => normalizeProInfo());
  const [loadingInfo, setLoadingInfo] = useState(true);
  const [stage, setStage] = useState<StageChoice>(() => initialStageFromPlan(initialPlan));
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

  const isTotal = stage === "total";
  const rukun = getRukunPricing(cycle, isTotal);
  const selectedLevel = getProLevelForCycle(cycle);
  const levelMeta = PRO_LEVEL_PLANS[selectedLevel];
  const targetScope = scopeFromPlan(stage, initialPlan);

  const stageLabel =
    stage === "school"
      ? "School"
      : stage === "jus"
        ? "Diyaarinta"
        : stage === "total"
          ? "Total (3-da Qeyb · -20%)"
          : initialPlan === "languages"
            ? "Luqadaha (EN/AR)"
            : "University";

  const activeItemsList =
    stage === "total"
      ? [
          "School: Form 4 (12 Maado), Sirta Top-10 & Ranking",
          "Diyaarinta: 5 Maado, 90 Maalmood & Ranking",
          "University: Qalabka, Waaxaha, Jaamacadaha & Khariidadaha",
        ]
      : STAGE_BUTTONS.find((b) => b.id === stage)?.items ?? STAGE_BUTTONS[2].items;

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
    onUnlocked(initialItemKey, stage);
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
      setStep2Error("Fadlan qor magacaaga buuxa.");
      return;
    }
    if (!committed) {
      setStep2Error("Calaamadee sanduuqa xaqiijinta.");
      return;
    }
    setStep2Error(null);
    setStep(3);
  };

  const useSingleItemOnly =
    Boolean(initialItemKey) &&
    ((initialPlan === "school_subject" && stage === "school") ||
      (initialPlan === "bridge_exam" && stage === "jus"));

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
    const tag = `${stage.toUpperCase()}_${cycle.toUpperCase()}`;
    const generatedRef = generateSecureEvcRef(deviceId, autoTime, phoneCheck.normalized, tag);
    const methodLabel = `EVC ${stage.toUpperCase()} L${selectedLevel} (${rukun.priceFormatted} · ${rukun.periodText})`;

    setSending(true);
    setReqMsg(null);
    try {
      saveRequestedProScope(localStorage, deviceId, targetScope);
      if (useSingleItemOnly && initialItemKey) {
        saveRequestedProItem(localStorage, deviceId, initialItemKey);
      }
      saveRequestedProLevel(localStorage, deviceId, selectedLevel);

      await submitProRequest({
        deviceId,
        phone: phoneCheck.normalized,
        method: methodLabel,
        txn: generatedRef,
        amount: `${rukun.priceFormatted} (${stageLabel} · ${levelMeta.badge})`,
        name: cleanName || undefined,
      });
      recordPaymentAttempt(localStorage, deviceId);
      setPayCooldownSec(Math.ceil(getPaymentCooldownRemainingMs(localStorage, deviceId) / 1000));
      setPendingAt(Date.now());
      setReqMsg({
        key: "Codsigaaga waa la diray. Markii la xaqiijiyo, riix “Hubi xaaladda”.",
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
          key: "Weli lama xaqiijin. Sug wax yar ama la xiriir WhatsApp.",
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
        const fallbackExp = res.expiresMs || Date.now() + rukun.days * 86400 * 1000;
        if (res.scope || (res.unlockedItems && res.unlockedItems.length > 0)) {
          await refreshPro();
        } else {
          setProUntil(
            fallbackExp,
            useSingleItemOnly ? "none" : targetScope,
            useSingleItemOnly ? initialItemKey : undefined,
            selectedLevel
          );
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
    `Salaan, waxaan bixiyay HIRAAL Pro (${stageLabel} · ${levelMeta.title} · ${rukun.priceFormatted}).\n` +
      `Tel: ${validateEvcPhone(phone).normalized || "-"}\n` +
      `Magac: ${sanitizeCheckoutName(name) || "-"}`
  );

  const ussdHref = revealPaymentNumber
    ? buildSafeTelUssdUrl(evcMethod.number, rukun.ussdAmount)
    : undefined;

  const pageBg = darkMode ? "bg-[#0B1324] text-slate-100" : "bg-slate-50 text-slate-900";
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
    <div dir="ltr" className={`min-h-screen flex flex-col ${pageBg}`}>
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
              Lacag-bixinta
            </h1>
          </div>

          <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700 dark:text-emerald-400 whitespace-nowrap shrink-0">
            <ShieldCheck className="w-4 h-4" />
            <span>Rukun · {stageLabel}</span>
          </span>
        </div>
      </header>

      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-8 pb-16 space-y-6">
        {/* Clean 3-Step Guided Progress */}
        <div
          className={`rounded-2xl p-2 sm:p-3 border ${cardCls} grid grid-cols-3 gap-1.5`}
        >
          {[
            { n: 1 as const, label: "Qeybta" },
            { n: 2 as const, label: "Xogta" },
            { n: 3 as const, label: "Bixinta" },
          ].map((st) => {
            const done = step > st.n;
            const current = step === st.n;
            const canJump = st.n < step;
            return (
              <button
                key={st.n}
                type="button"
                disabled={!canJump}
                onClick={() => canJump && setStep(st.n)}
                className={`px-2 py-1.5 rounded-xl flex items-center justify-center gap-1.5 whitespace-nowrap ${
                  current ? "bg-blue-600/12" : ""
                } ${canJump ? "cursor-pointer" : "cursor-default"}`}
              >
                <span
                  className={`w-5 h-5 sm:w-6 sm:h-6 rounded-full text-[11px] font-head font-bold flex items-center justify-center shrink-0 transition-colors ${
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
                  className={`text-[11px] sm:text-sm font-semibold truncate ${
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
            );
          })}
        </div>

        {/* Method Toggle */}
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
            <h2 className="font-head font-bold text-xl">Geli Koodhkaaga Furitaanka</h2>
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
                <span>Fur {stageLabel}</span>
              )}
            </button>
            <MsgView msg={codeMsg} />
          </section>
        ) : (
          <div className="grid lg:grid-cols-12 gap-6 items-start">
            {/* Left Column: Selected Stage + Level Summary */}
            <aside className={`lg:col-span-5 rounded-2xl p-6 border ${cardCls} space-y-5`}>
              <div className="space-y-1">
                <div className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-amber-400">
                  {stageLabel} · {levelMeta.badge}
                </div>
                <h2 className="font-head font-bold text-xl">
                  {rukun.label} ({rukun.periodText})
                </h2>
                <div className="flex items-baseline gap-2 pt-1">
                  <span className="font-head font-extrabold text-3xl tabular-nums text-blue-600 dark:text-amber-400">
                    {rukun.priceFormatted}
                  </span>
                  {isTotal && (
                    <span className="text-xs font-bold line-through opacity-50 tabular-nums">
                      {rukun.originalFormatted}
                    </span>
                  )}
                  <span className={`text-sm font-medium ${mutedCls}`}>
                    / {rukun.periodText}
                  </span>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-200 dark:border-white/10 space-y-2.5">
                {activeItemsList.map((item) => (
                  <div key={item} className="flex items-start gap-2.5 text-sm leading-snug">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                    <span className={mutedCls}>{item}</span>
                  </div>
                ))}
              </div>

              {/* Masked Security Notice (Number strictly hidden until Step 3) */}
              <div
                className={`rounded-xl p-3.5 border text-xs flex items-center gap-2.5 ${
                  darkMode
                    ? "bg-[#0B1324] border-white/10 text-slate-300"
                    : "bg-slate-50 border-slate-200 text-slate-600"
                }`}
              >
                <LockKeyhole className="w-4 h-4 text-blue-600 dark:text-amber-400 shrink-0" />
                <span>
                  {revealPaymentNumber
                    ? `Lambarka EVC: ${evcMethod.number}`
                    : `Lambarka EVC (${maskPaymentNumber(evcMethod.number)}) · Tallaabada 3aad`}
                </span>
              </div>
            </aside>

            {/* Right Column: Active Step Workspace */}
            <section className={`lg:col-span-7 rounded-2xl p-5 sm:p-6 border ${cardCls} space-y-6`}>
              {step === 1 && (
                <div className="space-y-5">
                  {/* Step 1A: 3 Stage Buttons + Optional Total (-20%) */}
                  <div className="space-y-2.5">
                    <h2 className="font-head font-bold text-lg sm:text-xl">
                      1. Dooro Qeybta (Hal Qeyb Gooni ah)
                    </h2>

                    <div className="grid grid-cols-3 gap-2.5">
                      {STAGE_BUTTONS.map((btn) => {
                        const Icon = btn.icon;
                        const active = stage === btn.id;
                        return (
                          <button
                            key={btn.id}
                            type="button"
                            onClick={() => setStage(btn.id)}
                            className={`min-h-[64px] rounded-2xl p-3 border flex flex-col items-center justify-center gap-1.5 cursor-pointer transition-all ${
                              active
                                ? btn.activeCls
                                : darkMode
                                  ? "border-white/12 bg-[#0B1324] text-slate-300 hover:border-white/30"
                                  : "border-slate-200 bg-slate-50 text-slate-700 hover:border-slate-300"
                            }`}
                          >
                            <Icon className="w-5 h-5 shrink-0" />
                            <span className="font-head font-extrabold text-xs sm:text-sm">
                              {btn.label}
                            </span>
                          </button>
                        );
                      })}
                    </div>

                    <button
                      type="button"
                      onClick={() => setStage("total")}
                      className={`w-full rounded-xl px-4 py-3 border flex items-center justify-between gap-2 cursor-pointer transition-all ${
                        isTotal
                          ? "border-amber-400 bg-amber-500/15 text-amber-900 dark:text-amber-200 ring-1 ring-amber-400"
                          : darkMode
                            ? "border-white/12 bg-[#0B1324] text-slate-300 hover:border-amber-400/50"
                            : "border-slate-200 bg-slate-50 text-slate-800 hover:border-amber-400"
                      }`}
                    >
                      <span className="inline-flex items-center gap-2 font-head font-bold text-xs sm:text-sm">
                        <Layers className="w-4 h-4 text-amber-500 shrink-0" />
                        <span>Total · Dhammaan 3-da Qeybood</span>
                      </span>
                      <span className="text-xs font-extrabold text-emerald-600 dark:text-emerald-400 whitespace-nowrap">
                        -20% Discount
                      </span>
                    </button>
                  </div>

                  {/* Step 1B: Weekly (Level 1) / Monthly (Level 2) / Yearly (Level 3+) */}
                  <div className="space-y-2.5 pt-2 border-t border-slate-200 dark:border-white/10">
                    <h3 className="font-head font-bold text-base sm:text-lg">
                      Dooro Heerka Rukun-ka (Asbuucle · Bille · Sanadle)
                    </h3>

                    <div className="grid sm:grid-cols-3 gap-3">
                      {CYCLE_ORDER.map((id) => {
                        const meta = RUKUN_PLANS[id];
                        const lvl = getProLevelForCycle(id);
                        const lvlInfo = PRO_LEVEL_PLANS[lvl];
                        const priceInfo = getRukunPricing(id, isTotal);
                        const selected = cycle === id;
                        const levelAccent =
                          lvl === 1
                            ? "text-sky-600 dark:text-sky-400"
                            : lvl === 2
                              ? "text-emerald-600 dark:text-emerald-400"
                              : "text-amber-600 dark:text-amber-400";

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
                              <div className={`text-xs font-extrabold ${levelAccent}`}>
                                {lvlInfo.badge}
                              </div>
                              <div className="font-head font-bold text-base">
                                {meta.label}
                              </div>
                            </div>

                            <div className="pt-2 border-t border-slate-200/80 dark:border-white/10 flex items-baseline justify-between gap-2">
                              <span className="font-head font-extrabold text-2xl tabular-nums">
                                {priceInfo.priceFormatted}
                              </span>
                              <span className={`text-xs font-medium ${mutedCls}`}>
                                {meta.periodText}
                              </span>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => setStep(2)}
                    className="w-full min-h-[48px] rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-head font-bold text-sm flex items-center justify-center gap-2 cursor-pointer transition-colors"
                  >
                    <span>
                      Sii wad: {stageLabel} · {rukun.priceFormatted}
                    </span>
                    {rtl ? <ArrowLeft className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
                  </button>
                </div>
              )}

              {step === 2 && (
                <div className="space-y-5">
                  <h2 className="font-head font-bold text-xl">
                    2. Xaqiiji Magacaaga &amp; Lambarkaaga EVC
                  </h2>

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
                      Waxaan diyaar u ahay bixinta{" "}
                      <strong className="tabular-nums">{rukun.priceFormatted}</strong> ({stageLabel} ·{" "}
                      {levelMeta.badge}) si loogu furo qalabkeyga keliya.
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
                      <span>Fur Lambarka Lacag-bixinta</span>
                    </button>
                  </div>
                </div>
              )}

              {step === 3 && revealPaymentNumber && (
                <div className="space-y-5">
                  <div className="flex items-start justify-between gap-3 flex-wrap">
                    <div>
                      <div className="text-xs font-semibold text-emerald-700 dark:text-emerald-400">
                        Tallaabada 3aad · {stageLabel} · {levelMeta.badge}
                      </div>
                      <h2 className="font-head font-bold text-xl mt-0.5">
                        Ku dir {rukun.priceFormatted} EVC Plus
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
                      darkMode ? "bg-[#0B1324] border-amber-400/35" : "bg-blue-50/60 border-blue-200"
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
                        {stageLabel} · {rukun.label} ({rukun.priceFormatted})
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
                          <span>*712*{evcMethod.number}*{rukun.ussdAmount}#</span>
                        </a>
                      )}
                    </div>
                  </div>

                  {pending && !reqMsg && (
                    <div className="rounded-xl px-4 py-3 bg-amber-500/12 border border-amber-500/35 text-xs text-amber-800 dark:text-amber-200">
                      Codsi hore ayaa socda; riix “Hubi xaaladda”.
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
                      <span>U dir caddaynta WhatsApp</span>
                    </a>
                  </div>

                  <MsgView msg={reqMsg} />

                  <div className="pt-4 border-t border-slate-200 dark:border-white/10 space-y-2.5">
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
