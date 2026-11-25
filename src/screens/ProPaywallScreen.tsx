import React, { useCallback, useEffect, useState } from "react";
import {
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Check,
  CheckCircle2,
  Clock,
  Copy,
  GraduationCap,
  Hourglass,
  KeyRound,
  Languages,
  Loader2,
  LockKeyhole,
  MessageCircle,
  Phone,
  RefreshCw,
  ShieldCheck,
  Smartphone,
  Target,
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
  clearRedeemFailures,
  EVC_PAYMENT_CONFIG,
  formatShortDeviceId,
  generateSecureEvcRef,
  getPaymentCooldownRemainingMs,
  getRedeemCooldownRemainingMs,
  normalizeProInfo,
  recordPaymentAttempt,
  recordRedeemFailure,
  sanitizeCheckoutName,
  saveRequestedProItem,
  saveRequestedProScope,
  TOTAL_BUNDLE_CONFIG,
  calculateTotalBundlePricing,
  validateEvcPhone,
  validatePayTimeHHMM,
  type ProItemKey,
} from "../lib/proSecurity";
import { form4Subjects } from "../data/schoolForm4Data";
import { bridgeExamTracks } from "../data/bridgingPrepData";
import { ProBadge } from "../components/ModernUI";

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

export function ProPaywallScreen({
  initialPlan = "total",
  initialItemKey,
  onBack,
  onUnlocked,
}: {
  initialPlan?: ProPlanType;
  initialItemKey?: ProItemKey;
  onBack: () => void;
  onUnlocked: (unlockedItemKey?: ProItemKey) => void;
}) {
  const { tr, trf, rtl, userName, deviceId, pendingAt, setPendingAt, setProUntil, refreshPro, showToast } =
    useApp();

  const [info, setInfo] = useState<ProInfo>(() => normalizeProInfo());
  const [loadingInfo, setLoadingInfo] = useState(true);
  const [copiedNum, setCopiedNum] = useState(false);
  const [copiedDev, setCopiedDev] = useState(false);
  const [plan, setPlan] = useState<ProPlanType>(initialPlan);
  const [checkoutTab, setCheckoutTab] = useState<"evc" | "code">("evc");

  const [selectedSchoolId, setSelectedSchoolId] = useState<string>(() =>
    initialItemKey?.startsWith("school:") ? initialItemKey.slice("school:".length) : form4Subjects[0].id
  );
  const [selectedBridgeId, setSelectedBridgeId] = useState<string>(() =>
    initialItemKey?.startsWith("bridge:") ? initialItemKey.slice("bridge:".length) : bridgeExamTracks[0].id
  );

  const [phone, setPhone] = useState("");
  const [payTime, setPayTime] = useState<string>(() => currentHHMM());
  const [name, setName] = useState(userName);
  const [code, setCode] = useState("");

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

  const shortDev = formatShortDeviceId(deviceId);
  const bundlePricing = calculateTotalBundlePricing();

  const activeSchoolSubject = form4Subjects.find((s) => s.id === selectedSchoolId) ?? form4Subjects[0];
  const activeBridgeTrack = bridgeExamTracks.find((t) => t.id === selectedBridgeId) ?? bridgeExamTracks[0];
  const isSelectedExamEmpty =
    (plan === "school_subject" && activeSchoolSubject.predictQuestions.length === 0) ||
    (plan === "bridge_exam" && activeBridgeTrack.predictQuestions.length === 0);

  const resolvedItemKey: ProItemKey | undefined =
    plan === "school_subject"
      ? `school:${activeSchoolSubject.id}`
      : plan === "bridge_exam"
        ? `bridge:${activeBridgeTrack.id}`
        : undefined;

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
    showToast(tr("Unlock waa la furay!"));
    onUnlocked(resolvedItemKey);
  };

  const selectedPlanPrice = plan === "total" ? bundlePricing.formattedFinal : "$0.50";
  const selectedUssdAmount = plan === "total" ? bundlePricing.ussdAmount : EVC_PAYMENT_CONFIG.ussdAmount;

  const getMethodLabel = (): string => {
    if (plan === "total") return "EVC Total (20% Off)";
    if (plan === "languages") return "EVC Plus (Lang)";
    if (plan === "school_subject") return `EVC School: ${activeSchoolSubject.id}`;
    if (plan === "bridge_exam") return `EVC Bridge: ${activeBridgeTrack.id}`;
    return "EVC Plus (Dept)";
  };

  const getWhatsappPlanLabel = (): string => {
    if (plan === "total") return `HIRAAL Total (Dhammaan Qeybaha + Luqadaha · ${bundlePricing.formattedFinal} / 20% Off)`;
    if (plan === "languages") return "Unlock Luqadaha (English & Carabi · $0.50)";
    if (plan === "school_subject") return `School Form 4 (12 Maado + Sirta Top-10 + Ranking · $0.50)`;
    if (plan === "bridge_exam") return `Diyaarinta JUS (5 Maado + Ranking JUS · $0.50)`;
    return "University & Unlock+ Hub ($0.50)";
  };

  const getPlanRefTag = (): string => {
    if (plan === "total") return "TOTAL";
    if (plan === "languages") return "LANG";
    if (plan === "school_subject") return `SCH_${activeSchoolSubject.id}`;
    if (plan === "bridge_exam") return `BRG_${activeBridgeTrack.id.slice(0, 6)}`;
    return "DEPT";
  };

  const handleSendRequest = async () => {
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

    const tm = payTime.trim();
    if (!validatePayTimeHHMM(tm)) {
      setReqMsg({ key: "Fadlan geli saacadda aad lacagta dirtay.", ok: false });
      return;
    }

    const cleanName = sanitizeCheckoutName(name);
    const generatedRef = generateSecureEvcRef(deviceId, tm, phoneCheck.normalized, getPlanRefTag());
    const methodLabel = getMethodLabel();

    setSending(true);
    setReqMsg(null);
    try {
      if (plan === "total") {
        saveRequestedProScope(localStorage, deviceId, "full");
      } else if (plan === "languages") {
        saveRequestedProScope(localStorage, deviceId, "languages");
      } else {
        saveRequestedProScope(localStorage, deviceId, "departments");
        if (resolvedItemKey) {
          saveRequestedProItem(localStorage, deviceId, resolvedItemKey);
        }
      }
      await submitProRequest({
        deviceId,
        phone: phoneCheck.normalized,
        method: methodLabel,
        txn: generatedRef,
        amount: selectedPlanPrice,
        name: cleanName || undefined,
      });
      recordPaymentAttempt(localStorage, deviceId);
      setPayCooldownSec(Math.ceil(getPaymentCooldownRemainingMs(localStorage, deviceId) / 1000));
      setPendingAt(Date.now());
      setReqMsg({
        key: "Codsigaaga waa la helay. Waan hubin doonaa, kadibna riix “Hubi xaaladda”.",
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
          key: "Weli lama xaqiijin. Fadlan sug ama la xiriir maamulaha.",
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
        const fallbackExp = res.expiresMs || Date.now() + info.days * 86400 * 1000;
        if (res.scope || (res.unlockedItems && res.unlockedItems.length > 0)) {
          await refreshPro();
        } else if (plan === "total") {
          setProUntil(fallbackExp, "full");
        } else if (plan === "languages") {
          setProUntil(fallbackExp, "languages");
        } else {
          setProUntil(fallbackExp, "departments", resolvedItemKey);
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
    try {
      await navigator.clipboard.writeText(EVC_PAYMENT_CONFIG.number);
      setCopiedNum(true);
      showToast(tr("Lambarka waa la koobiyay"));
      window.setTimeout(() => setCopiedNum(false), 2000);
    } catch {
      // ignore
    }
  };

  const handleCopyDevice = async () => {
    try {
      await navigator.clipboard.writeText(shortDev);
      setCopiedDev(true);
      showToast(tr("Waa la koobiyeeyay"));
      window.setTimeout(() => setCopiedDev(false), 2000);
    } catch {
      // ignore
    }
  };

  const pending = pendingAt > 0 && Date.now() - pendingAt < 7 * 86400 * 1000;
  const evcMethod = info.methods[0] ?? {
    name: EVC_PAYMENT_CONFIG.methodName,
    number: EVC_PAYMENT_CONFIG.number,
    holder: EVC_PAYMENT_CONFIG.holder,
  };

  const activeStep = pending || reqMsg?.ok ? 3 : copiedNum || phone.length >= 7 ? 2 : 1;

  const whatsappSupportHref = buildSafeWhatsappUrl(
    info.whatsapp,
    `Salaan, waxaan rabaa inaan furo: ${getWhatsappPlanLabel()} (${selectedPlanPrice} · Device ID: ${shortDev})`
  );

  const whatsappConfirmHref = buildSafeWhatsappUrl(
    info.whatsapp,
    `${tr("Salaan, waxaan bixiyay lacagta Unlock")} (${selectedPlanPrice}).\n` +
      `Xirmo: ${getWhatsappPlanLabel()}\n` +
      `Tel: ${validateEvcPhone(phone).normalized || "-"}\n` +
      `Saacadda EVC: ${payTime || "-"}\n` +
      `Magac: ${sanitizeCheckoutName(name) || "-"}\n` +
      `Device ID: ${shortDev}`
  );

  const ussdHref = buildSafeTelUssdUrl(evcMethod.number, selectedUssdAmount);

  const MsgView = ({ msg }: { msg: Msg | null }) =>
    !msg ? null : (
      <div
        role="alert"
        className={`mt-3 rounded-xl px-3.5 py-2.5 flex items-start gap-2.5 text-xs leading-relaxed border ${
          msg.ok
            ? "bg-emerald-500/14 border-emerald-400/40 text-emerald-100"
            : "bg-rose-500/14 border-rose-400/40 text-rose-100"
        }`}
      >
        {msg.ok ? (
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
        ) : (
          <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
        )}
        <span>{tr(msg.key)}</span>
      </div>
    );

  return (
    <div
      className="min-h-screen flex flex-col text-white relative overflow-x-clip"
      style={{
        background: "linear-gradient(170deg, #05132E 0%, #0A2558 50%, #103A7E 100%)",
      }}
    >
      {/* Modern Security Top Bar */}
      <header className="relative z-20 border-b border-white/12 bg-[#05132E]/75 backdrop-blur-xl">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-3.5 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5 min-w-0">
            <button
              type="button"
              onClick={onBack}
              aria-label="Back"
              className="min-h-[40px] min-w-[40px] flex items-center justify-center rounded-xl bg-white/8 hover:bg-white/15 border border-white/15 text-white cursor-pointer transition-colors shrink-0"
            >
              {rtl ? <ArrowRight className="w-5 h-5" /> : <ArrowLeft className="w-5 h-5" />}
            </button>
            <div className="flex items-center gap-2 min-w-0">
              <h1 className="font-head font-extrabold text-[17px] sm:text-[19px] truncate">
                HIRAAL Unlock
              </h1>
              <ProBadge small />
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <span className="hidden sm:inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-300">
              <LockKeyhole className="w-3.5 h-3.5" />
              <span>Amni Xaqiijisan</span>
            </span>

            <button
              type="button"
              onClick={handleCopyDevice}
              title="Device ID"
              className="inline-flex items-center gap-1.5 min-h-[38px] px-3 rounded-xl bg-white/8 hover:bg-white/14 border border-white/15 text-xs font-mono text-white/85 cursor-pointer transition-colors"
            >
              <Smartphone className="w-3.5 h-3.5 text-[#FFD86B]" />
              <span>{shortDev}</span>
              {copiedDev ? (
                <Check className="w-3.5 h-3.5 text-emerald-400" />
              ) : (
                <Copy className="w-3.5 h-3.5 opacity-65" />
              )}
            </button>
          </div>
        </div>
      </header>

      <main className="relative z-10 max-w-5xl w-full mx-auto px-4 sm:px-6 py-6 pb-16 space-y-6">
        {/* Clean 3-Step Checkout Progress Bar */}
        <div className="rounded-2xl p-3 sm:px-5 bg-white/[0.06] border border-white/12 flex items-center justify-between gap-2 overflow-x-auto hide-scrollbar">
          {[
            { n: 1, label: "1. Dooro Xirmo" },
            { n: 2, label: "2. Bixi EVC Plus" },
            { n: 3, label: "3. Xaqiijinta" },
          ].map((st, idx) => {
            const done = activeStep > st.n;
            const current = activeStep === st.n;
            return (
              <React.Fragment key={st.n}>
                <div className="flex items-center gap-2 whitespace-nowrap shrink-0">
                  <span
                    className={`w-6 h-6 rounded-full text-xs font-head font-black flex items-center justify-center transition-colors ${
                      done
                        ? "bg-emerald-500 text-white"
                        : current
                          ? "bg-[#FFC93C] text-[#05132E]"
                          : "bg-white/12 text-white/60"
                    }`}
                  >
                    {done ? <Check className="w-3.5 h-3.5" /> : st.n}
                  </span>
                  <span
                    className={`text-xs sm:text-[13px] font-bold ${
                      current ? "text-white" : done ? "text-emerald-300" : "text-white/55"
                    }`}
                  >
                    {st.label}
                  </span>
                </div>
                {idx < 2 && <div className="h-[1px] flex-1 min-w-[20px] bg-white/15" />}
              </React.Fragment>
            );
          })}
        </div>

        {/* Smooth 2-Tier Checkout Selector: Featured HIRAAL Total (20% Off) + Single Stage ($0.50) */}
        <section aria-label="Dooro Xirmada Unlock" className="space-y-3.5">
          {/* Tier 1: Featured Total Bundle (20% Discount) */}
          <button
            type="button"
            onClick={() => setPlan("total")}
            className={`w-full text-start rounded-3xl p-4 sm:p-5 border transition-all duration-150 cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
              plan === "total"
                ? "border-[#FFC93C] bg-gradient-to-r from-[#FFC93C]/20 via-indigo-500/20 to-cyan-500/18 shadow-[0_12px_32px_rgba(255,201,60,0.2)]"
                : "border-white/15 bg-white/[0.05] hover:bg-white/[0.09] hover:border-white/30"
            }`}
          >
            <div className="space-y-1.5 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="px-2.5 py-0.5 rounded-full bg-[#FFC93C] text-[#05132E] font-head font-black text-[11px] uppercase tracking-wider">
                  {TOTAL_BUNDLE_CONFIG.discountPct}% Qiimo Dhimis
                </span>
                <span className="text-xs font-bold text-emerald-300">
                  Hal lacag-bixin · Dhammaan Qeybaha
                </span>
              </div>
              <div className="font-head font-extrabold text-lg sm:text-xl text-white leading-snug">
                HIRAAL Total (School + JUS + University + Luqadaha)
              </div>
              <p className="text-xs text-white/80 leading-relaxed max-w-2xl">
                Hal mar bixi si ay kuugu furmaan dhammaan 3-da qaybood (Predict Exams, Sirta Top-10, Ranking, University Hub 6 Qaybood, Hagaha Waaxda) iyo Luqadaha English &amp; Carabi muddo 6 bilood ah.
              </p>
            </div>

            <div className="flex sm:flex-col items-baseline sm:items-end justify-between gap-1.5 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-white/12">
              <div className="flex items-baseline gap-2">
                <span className="text-sm font-bold text-white/50 line-through tabular-nums">
                  {TOTAL_BUNDLE_CONFIG.originalPrice}
                </span>
                <span className="font-head font-extrabold text-[28px] text-[#FFE484] tabular-nums leading-none">
                  {bundlePricing.formattedFinal}
                </span>
              </div>
              <span className="text-[11px] font-bold text-emerald-300 tabular-nums">
                Badbaadi {bundlePricing.formattedSaved} · 180 Maalmood
              </span>
            </div>
          </button>

          {/* Tier 2: Single Stage / Pack ($0.50 each) */}
          <div className="space-y-2">
            <div className="flex items-center justify-between gap-2 px-1">
              <span className="text-xs font-bold text-white/75">
                Ama dooro hal qeyb oo keliya ($0.50):
              </span>
              <span className="text-[11px] font-semibold text-[#FFE484] tabular-nums">
                6 Bilood
              </span>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
              {[
                {
                  id: "school_subject" as const,
                  title: "School Form 4",
                  sub: "12 Maado, Sirta & Ranking",
                  icon: BookOpen,
                  activeCls: "border-cyan-400 bg-cyan-500/18 shadow-[0_8px_24px_rgba(6,182,212,0.22)]",
                  iconColor: "text-cyan-300",
                },
                {
                  id: "bridge_exam" as const,
                  title: "Diyaarinta JUS",
                  sub: "5 Maado (4 Saynis + EN) & Ranking",
                  icon: Target,
                  activeCls: "border-emerald-400 bg-emerald-500/18 shadow-[0_8px_24px_rgba(16,185,129,0.22)]",
                  iconColor: "text-emerald-300",
                },
                {
                  id: "departments" as const,
                  title: "University & Hub",
                  sub: "Hagaha Waaxda + 6 Qaybood",
                  icon: GraduationCap,
                  activeCls: "border-indigo-400 bg-indigo-500/22 shadow-[0_8px_24px_rgba(99,102,241,0.26)]",
                  iconColor: "text-indigo-300",
                },
                {
                  id: "languages" as const,
                  title: "English & Carabi",
                  sub: "Luqadaha App-ka",
                  icon: Languages,
                  activeCls: "border-amber-400 bg-amber-500/18 shadow-[0_8px_24px_rgba(245,158,11,0.22)]",
                  iconColor: "text-amber-300",
                },
              ].map((pkg) => {
                const Icon = pkg.icon;
                const selected = plan === pkg.id;
                return (
                  <button
                    key={pkg.id}
                    type="button"
                    onClick={() => setPlan(pkg.id)}
                    className={`text-start rounded-2xl p-3.5 border transition-all duration-150 cursor-pointer flex flex-col justify-between gap-2 ${
                      selected
                        ? pkg.activeCls
                        : "border-white/12 bg-white/[0.04] hover:bg-white/[0.08] hover:border-white/25"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span
                        className={`w-8 h-8 rounded-xl flex items-center justify-center ${
                          selected ? "bg-white/15" : "bg-white/8"
                        }`}
                      >
                        <Icon className={`w-4 h-4 ${pkg.iconColor}`} />
                      </span>
                      <span className="font-head font-extrabold text-sm text-[#FFE484] tabular-nums">
                        $0.50
                      </span>
                    </div>
                    <div>
                      <div className="font-head font-extrabold text-sm text-white leading-snug">
                        {pkg.title}
                      </div>
                      <div className="text-[11px] text-white/70 mt-0.5">{pkg.sub}</div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </section>

        {/* Subject / Track Picker when inspecting Form 4 or JUS */}
        {plan === "school_subject" && (
          <section className="rounded-2xl p-4 border border-cyan-400/35 bg-cyan-500/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="text-xs font-extrabold text-cyan-200">
                Xirmada School Form 4 · June 2027 ($0.50)
              </div>
              <div className="text-xs text-white/75 mt-0.5">
                Waxay furaysaa dhammaan 12-ka maado (Predict), Sirta Top-10 &amp; Ranking.
              </div>
            </div>
            <select
              aria-label="Dooro Maadada Form 4"
              value={activeSchoolSubject.id}
              onChange={(e) => setSelectedSchoolId(e.target.value)}
              className="rounded-xl px-3.5 py-2.5 bg-[#061D42] border border-white/25 text-white font-bold text-sm outline-none focus:border-[#FFC93C]"
            >
              {form4Subjects.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name} ({s.code})
                </option>
              ))}
            </select>
          </section>
        )}

        {plan === "bridge_exam" && (
          <section className="rounded-2xl p-4 border border-emerald-400/35 bg-emerald-500/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="text-xs font-extrabold text-emerald-200">
                Imtixaanka Tartanka JUS · Oct 2027 ($0.50)
              </div>
              <div className="text-xs text-white/75 mt-0.5">
                Jaamacadda Ummadda Soomaaliyeed (5 Maado: 4 Saynis + English) &amp; Ranking JUS.
              </div>
            </div>
            <select
              aria-label="Dooro Imtixaanka Tartanka"
              value={activeBridgeTrack.id}
              onChange={(e) => setSelectedBridgeId(e.target.value)}
              className="rounded-xl px-3.5 py-2.5 bg-[#061D42] border border-white/25 text-white font-bold text-sm outline-none focus:border-[#FFC93C]"
            >
              {bridgeExamTracks.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.title}
                </option>
              ))}
            </select>
          </section>
        )}

        {/* Two-Column Modern Checkout Workspace */}
        <div className="grid lg:grid-cols-12 gap-6 items-start">
          {/* Left Column: Order Summary & Server-Verified Security Guarantee */}
          <div className="lg:col-span-5 space-y-4">
            <div className="rounded-3xl p-6 border border-white/18 bg-white/[0.06] backdrop-blur-md shadow-xl space-y-4">
              <div className="flex items-center justify-between">
                <ProBadge />
                <span className="text-xs font-bold text-emerald-300 inline-flex items-center gap-1">
                  <ShieldCheck className="w-4 h-4" />
                  <span>{info.days} Maalmood</span>
                </span>
              </div>

              <div>
                <h2 className="font-head font-extrabold text-[22px] leading-tight text-white">
                  {plan === "total"
                    ? "HIRAAL Total (Dhammaan Qeybaha)"
                    : plan === "school_subject"
                      ? "School Form 4 (12 Maado)"
                      : plan === "bridge_exam"
                        ? "Diyaarinta JUS (5 Maado)"
                        : plan === "languages"
                          ? tr("Unlock Luqadaha (English & Carabi)")
                          : "University & Hub Unlock"}
                </h2>
                <div className="mt-2 flex items-baseline gap-2.5 flex-wrap">
                  {plan === "total" && (
                    <span className="text-base font-bold text-white/45 line-through tabular-nums">
                      {TOTAL_BUNDLE_CONFIG.originalPrice}
                    </span>
                  )}
                  <span className="font-head font-extrabold text-[28px] text-[#FFE484] tabular-nums">
                    {plan === "total" ? TOTAL_BUNDLE_CONFIG.priceText : info.priceText}
                  </span>
                </div>
              </div>

              <div className="pt-4 border-t border-white/12 space-y-2.5">
                {(plan === "total"
                  ? [
                      "School: Predict Exam (12 Maado), Sirta Top-10 & Ranking (PDFs waa Bilaash)",
                      "Diyaarinta JUS: Predict (5 Maado) & Ranking JUS (90 Maalmood & Xalka waa Bilaash)",
                      "University: Hagaha Waaxda (70 Su'aalood), Qorshaha 30-ka Maalmood & Compare Pro (Natiijada RIASEC waa Bilaash)",
                      "University Hub (6 Qaybood) + English & Carabi oo wada jira (20% Qiimo Dhimis)",
                    ]
                  : plan === "school_subject"
                    ? [
                        "Predict Exam buuxa oo leh dhammaan 12-ka maado ee Form 4",
                        "Sirta Ardayda Top-10 & Sirta Xalaasha ah ee 12-ka Maado",
                        "Ranking-ka School-ka ee kaalmaha sare",
                        "PDF-yada & mowduucyadu waa bilaash markasta",
                      ]
                    : plan === "bridge_exam"
                      ? [
                          "Predict Exam buuxa ee JUS (4 Saynis + English)",
                          "Ranking-ka ardayda u diyaar-garoobaysa JUS",
                          "Falanqaynta jawaabaha saxda ah ee Af-Soomaali ah",
                          "90 Maalmood, Xalka Caqabadaha & PDF-yadu waa Bilaash",
                        ]
                      : plan === "languages"
                        ? [
                            tr("Luqadda Ingiriisiga (English) ee barnaamijka oo dhan"),
                            tr("Luqadda Carabiga (العربية) oo leh qaabka saxda ah (RTL)"),
                            tr("Af-Soomaaligu waa bilaash boqolkiiba boqol abid"),
                          ]
                        : [
                            "Hagaha Waaxda (70 Su'aalood oo gaar u ah kulliyad kasta)",
                            "Qorshaha Go'aanka & 30-ka Maalmood + Compare Matrix Pro",
                            "University Hub (6 Qaybood): Khariidadaha, Jaamacadaha, Shaqooyinka Casriga ah & Xirfadaha",
                            "Natiijada RIASEC (#1-#3) & Isbarbardhigga caadiga ah waa Bilaash",
                          ]
                ).map((label) => (
                  <div key={label} className="flex items-start gap-2.5 text-[13px] text-white/90">
                    <CheckCircle2 className="w-4 h-4 text-[#FFC93C] shrink-0 mt-0.5" />
                    <span>{label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Security & Device Binding Box */}
            <div className="rounded-2xl p-4 bg-emerald-500/[0.09] border border-emerald-400/25 space-y-2">
              <div className="flex items-center gap-2 text-emerald-300 font-head font-bold text-sm">
                <ShieldCheck className="w-4 h-4 shrink-0" />
                <span>{tr("Amniga Gelitaanka (1 Qalab = 1 Arday)")}</span>
              </div>
              <p className="text-xs text-white/75 leading-relaxed">
                Furitaanka waxaa si toos ah u xaqiijiya server-ka, waxaana lagu xiraa aqoonsiga qalabkan oo saxiixan si aan cid kale ula wadaagi karin.
              </p>
              <div className="pt-1 flex items-center justify-between text-xs font-mono text-white/75">
                <span>ID: {shortDev}</span>
                <button
                  type="button"
                  onClick={handleCopyDevice}
                  className="text-[#FFD86B] hover:underline font-sans font-semibold cursor-pointer"
                >
                  {copiedDev ? tr("La koobiyay") : tr("Koobi Aqoonsiga")}
                </button>
              </div>
            </div>

            <a
              href={whatsappSupportHref}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full h-12 rounded-2xl border border-emerald-400/40 bg-emerald-500/12 hover:bg-emerald-500/22 text-emerald-200 font-bold text-sm flex items-center justify-center gap-2 transition-colors"
            >
              <MessageCircle className="w-4 h-4 text-emerald-400" />
              <span>{tr("La xiriir WhatsApp")}</span>
            </a>
          </div>

          {/* Right Column: Modern Fintech Checkout Panel */}
          <div className="lg:col-span-7 space-y-4">
            <div className="rounded-3xl p-5 sm:p-6 border border-white/18 bg-[#071D46]/85 backdrop-blur-xl shadow-2xl space-y-5">
              {/* Checkout Method Segmented Control */}
              <div className="grid grid-cols-2 gap-1.5 p-1 rounded-2xl bg-white/[0.07] border border-white/10">
                <button
                  type="button"
                  onClick={() => setCheckoutTab("evc")}
                  className={`min-h-[42px] rounded-xl text-xs sm:text-sm font-head font-extrabold flex items-center justify-center gap-2 cursor-pointer transition-all ${
                    checkoutTab === "evc"
                      ? "bg-[#FFC93C] text-[#05132E] shadow-sm"
                      : "text-white/75 hover:text-white"
                  }`}
                >
                  <Phone className="w-4 h-4" />
                  <span>EVC Plus ({selectedPlanPrice})</span>
                </button>
                <button
                  type="button"
                  onClick={() => setCheckoutTab("code")}
                  className={`min-h-[42px] rounded-xl text-xs sm:text-sm font-head font-extrabold flex items-center justify-center gap-2 cursor-pointer transition-all ${
                    checkoutTab === "code"
                      ? "bg-[#FFC93C] text-[#05132E] shadow-sm"
                      : "text-white/75 hover:text-white"
                  }`}
                >
                  <KeyRound className="w-4 h-4" />
                  <span>Koodh Furitaan</span>
                </button>
              </div>

              {checkoutTab === "evc" ? (
                <div className="space-y-5">
                  {/* Sleek Mobile Money Merchant Card */}
                  <div
                    className="rounded-2xl p-4 sm:p-5 border border-[#FFC93C]/45 relative overflow-hidden"
                    style={{
                      background: "linear-gradient(135deg, #0D2F6E 0%, #081F4D 100%)",
                    }}
                  >
                    <div className="flex items-start justify-between gap-3 flex-wrap">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider text-[#FFE484]">
                          <Phone className="w-3.5 h-3.5" />
                          <span>{evcMethod.name}</span>
                          {loadingInfo && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                        </div>
                        <div className="font-head font-extrabold text-[28px] sm:text-[32px] tracking-wider text-white tabular-nums select-all">
                          {evcMethod.number}
                        </div>
                        <div className="text-xs sm:text-sm font-semibold text-white/85">
                          {tr("Magaca:")} <span className="text-[#FFE484]">{evcMethod.holder}</span>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={handleCopyNumber}
                        className="min-h-[42px] px-4 rounded-xl bg-[#FFC93C] hover:bg-[#FFD55A] text-[#05132E] font-head font-extrabold text-xs sm:text-sm inline-flex items-center gap-2 cursor-pointer transition-colors shrink-0"
                      >
                        {copiedNum ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                        <span>{copiedNum ? tr("La koobiyay") : tr("Koobi lambarka")}</span>
                      </button>
                    </div>

                    <div className="mt-4 pt-3 border-t border-white/12 flex items-center justify-between gap-2 flex-wrap text-xs">
                      <span className="text-white/75 tabular-nums">
                        {trf("Qiimaha: {p}", {
                          p: plan === "total" ? TOTAL_BUNDLE_CONFIG.priceText : info.priceText,
                        })}
                      </span>
                      <a
                        href={ussdHref}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/18 border border-white/20 font-mono text-[#FFE484] transition-colors"
                      >
                        <Phone className="w-3.5 h-3.5" />
                        <span>*712*{evcMethod.number}*{selectedUssdAmount}#</span>
                      </a>
                    </div>
                  </div>

                  {pending && !reqMsg && (
                    <div className="rounded-xl px-3.5 py-2.5 bg-amber-500/14 border border-amber-400/35 flex items-start gap-2.5 text-xs text-amber-100">
                      <Hourglass className="w-4 h-4 text-[#FFE484] shrink-0 mt-0.5" />
                      <span>{tr("Codsi hore ayaa socda; sug xaqiijinta ama riix “Hubi xaaladda”.")}</span>
                    </div>
                  )}

                  {/* Validated Form Inputs */}
                  <div className="space-y-3.5">
                    <div className="grid sm:grid-cols-2 gap-3">
                      <div>
                        <label htmlFor="evc-phone" className="block text-xs font-semibold text-white/80 mb-1.5">
                          {tr("Lambarka taleefankaaga (kii aad ka bixisay)")}
                        </label>
                        <input
                          id="evc-phone"
                          type="tel"
                          value={phone}
                          maxLength={20}
                          onChange={(e) => setPhone(e.target.value.replace(/[^0-9+ ]/g, ""))}
                          placeholder="061XXXXXXX"
                          className="w-full rounded-xl px-4 py-3 text-[15px] bg-[#041430] border border-white/20 outline-none focus:border-[#FFC93C] placeholder:text-white/35 tabular-nums"
                        />
                      </div>

                      <div>
                        <div className="flex items-center justify-between gap-2 mb-1.5">
                          <label htmlFor="evc-time" className="inline-flex items-center gap-1.5 text-xs font-semibold text-white/80">
                            <Clock className="w-3.5 h-3.5 text-[#FFD86B]" />
                            <span>Saacadda EVC</span>
                          </label>
                          <button
                            type="button"
                            onClick={() => setPayTime(currentHHMM())}
                            className="text-[11px] font-bold text-[#FFD86B] hover:underline cursor-pointer"
                          >
                            {tr("Waqtiga hadda")}
                          </button>
                        </div>
                        <input
                          id="evc-time"
                          type="time"
                          value={payTime}
                          onChange={(e) => setPayTime(e.target.value)}
                          className="w-full rounded-xl px-4 py-3 text-[15px] font-mono font-bold bg-[#041430] border border-white/20 outline-none focus:border-[#FFC93C] text-white"
                        />
                      </div>
                    </div>

                    <div>
                      <label htmlFor="evc-name" className="block text-xs font-semibold text-white/80 mb-1.5">
                        {tr("Magacaaga (ikhtiyaari)")}
                      </label>
                      <input
                        id="evc-name"
                        type="text"
                        value={name}
                        maxLength={40}
                        onChange={(e) => setName(e.target.value)}
                        placeholder={tr("Magacaaga (ikhtiyaari)")}
                        className="w-full rounded-xl px-4 py-3 text-[15px] bg-[#041430] border border-white/20 outline-none focus:border-[#FFC93C] placeholder:text-white/35"
                      />
                    </div>
                  </div>

                  {/* Gentle informational note when Predict questions are being uploaded soon (never blocks checkout) */}
                  {isSelectedExamEmpty && (
                    <div className="rounded-xl px-3.5 py-3 bg-cyan-500/14 border border-cyan-400/35 flex items-start gap-2.5 text-xs text-cyan-100 leading-relaxed">
                      <AlertCircle className="w-4 h-4 text-[#BAE6FD] shrink-0 mt-0.5" />
                      <span>
                        Xasuusin: Su&apos;aalaha Predict Exam-kan waxaa la soo gelinayaa ka hor imtixaanka 2027. Haddii aad hadda furato waxaa isla markiiba kuu furmaya Sirta Top-10, Ranking &amp; Hub-ka, Predict-kuna si toos ah ayuu kuugu furmi doonaa markii la soo geliyo.
                      </span>
                    </div>
                  )}

                  {/* Primary Submit + WhatsApp Fast Confirmation */}
                  <div className="space-y-2.5">
                    <button
                      type="button"
                      disabled={sending || payCooldownSec > 0}
                      onClick={handleSendRequest}
                      className="w-full h-[50px] rounded-2xl bg-[#FFC93C] hover:bg-[#FFD55A] text-[#05132E] font-head font-extrabold text-[15px] flex items-center justify-center gap-2 cursor-pointer disabled:opacity-55 disabled:cursor-not-allowed transition-colors shadow-lg"
                    >
                      {sending ? (
                        <Loader2 className="w-5 h-5 animate-spin" />
                      ) : payCooldownSec > 0 ? (
                        <span className="tabular-nums">Sug {payCooldownSec}s...</span>
                      ) : (
                        <span>{tr("Dir codsiga")}</span>
                      )}
                    </button>

                    <a
                      href={whatsappConfirmHref}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full h-11 rounded-2xl border border-emerald-400/40 bg-emerald-500/12 hover:bg-emerald-500/22 text-emerald-200 font-bold text-xs flex items-center justify-center gap-2 transition-colors"
                    >
                      <MessageCircle className="w-4 h-4 text-emerald-400" />
                      <span>{tr("U dir caddaynta WhatsApp (Degdeg)")}</span>
                    </a>
                  </div>

                  <MsgView msg={reqMsg} />

                  {/* Server Verification Check Bar */}
                  <div className="pt-4 border-t border-white/12 space-y-2.5">
                    <div className="flex items-center justify-between gap-2 text-xs text-white/75">
                      <span className="font-semibold">Ma dirtay lacagta?</span>
                      <span>Xaqiijinta tooska ah ee server-ka</span>
                    </div>
                    <button
                      type="button"
                      disabled={checking}
                      onClick={handleCheck}
                      className="w-full h-12 rounded-2xl border border-[#FFC93C]/65 bg-[#FFC93C]/10 hover:bg-[#FFC93C]/18 text-[#FFE484] font-head font-extrabold text-sm flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 transition-colors"
                    >
                      <RefreshCw className={`w-4 h-4 ${checking ? "animate-spin" : ""}`} />
                      <span>{tr("Hubi xaaladda")}</span>
                    </button>
                    <MsgView msg={statMsg} />
                  </div>
                </div>
              ) : (
                /* Redeem Code Tab */
                <div className="space-y-4 py-1">
                  <div className="space-y-1">
                    <h3 className="font-head font-extrabold text-base text-white">
                      {tr("Koodh ma haysaa?")}
                    </h3>
                    <p className="text-xs text-white/70 leading-relaxed">
                      Geli koodhka hal-mar-isticmaalka ah ee laguu soo diray si isla markiiba laguugu furo qeybta Unlock+.
                    </p>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-2.5">
                    <input
                      type="text"
                      value={code}
                      maxLength={20}
                      onChange={(e) => setCode(e.target.value.toUpperCase().replace(/[^A-Z0-9-]/g, ""))}
                      placeholder={tr("Geli koodhka")}
                      aria-label={tr("Geli koodhka")}
                      className="flex-1 rounded-xl px-4 py-3.5 text-[15px] font-mono font-bold tracking-widest bg-[#041430] border border-white/20 outline-none focus:border-[#FFC93C] placeholder:text-white/35 placeholder:font-sans placeholder:font-normal placeholder:tracking-normal"
                    />
                    <button
                      type="button"
                      disabled={redeeming || redeemLockSec > 0}
                      onClick={handleRedeem}
                      className="sm:w-44 h-12 rounded-xl bg-[#FFC93C] hover:bg-[#FFD55A] text-[#05132E] font-head font-extrabold text-sm flex items-center justify-center cursor-pointer disabled:opacity-50 transition-colors"
                    >
                      {redeeming ? (
                        <Loader2 className="w-5 h-5 animate-spin" />
                      ) : redeemLockSec > 0 ? (
                        <span className="tabular-nums">Sug {redeemLockSec}s</span>
                      ) : (
                        tr("Isticmaal koodhka")
                      )}
                    </button>
                  </div>

                  <MsgView msg={codeMsg} />
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
