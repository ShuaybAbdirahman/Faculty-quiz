import React, { useCallback, useEffect, useState } from "react";
import {
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  Check,
  CheckCircle2,
  Clock,
  Copy,
  GraduationCap,
  Hourglass,
  KeyRound,
  Languages,
  Loader2,
  Lock,
  MessageCircle,
  Phone,
  RefreshCw,
  ShieldCheck,
  Smartphone,
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
  EVC_PAYMENT_CONFIG,
  formatShortDeviceId,
  normalizeProInfo,
  saveRequestedProScope,
} from "../lib/proSecurity";
import { AccentTitleLight, ProBadge } from "../components/ModernUI";

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

export type ProPlanType = "departments" | "languages";

function currentHHMM(): string {
  const now = new Date();
  return `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;
}

export function ProPaywallScreen({
  initialPlan = "departments",
  onBack,
  onUnlocked,
}: {
  initialPlan?: ProPlanType;
  onBack: () => void;
  onUnlocked: () => void;
}) {
  const { tr, trf, rtl, userName, deviceId, pendingAt, setPendingAt, setProUntil, refreshPro, showToast } =
    useApp();

  // Initialize immediately with normalized EVC Plus config so 610999089 / Shuceyb Abdirahman is always ready
  const [info, setInfo] = useState<ProInfo>(() => normalizeProInfo());
  const [loadingInfo, setLoadingInfo] = useState(true);
  const [copiedNum, setCopiedNum] = useState(false);
  const [copiedDev, setCopiedDev] = useState(false);
  const [plan, setPlan] = useState<ProPlanType>(initialPlan);

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

  const shortDev = formatShortDeviceId(deviceId);

  const loadInfo = useCallback(async () => {
    setLoadingInfo(true);
    try {
      const i = await fetchProInfo();
      setInfo(i);
    } catch {
      // Keep normalized EVC Plus defaults if offline
      setInfo(normalizeProInfo());
    } finally {
      setLoadingInfo(false);
    }
  }, []);

  useEffect(() => {
    loadInfo();
  }, [loadInfo]);

  const handleUnlocked = () => {
    showToast(tr("Pro waa la furay!"));
    onUnlocked();
  };

  const buildEvcTimeRef = (phDigits: string, hhmm: string, selectedPlan: ProPlanType): string => {
    const cleanTime = hhmm.replace(/[^0-9:]/g, "").replace(":", "") || currentHHMM().replace(":", "");
    const tail = phDigits.replace(/\D/g, "").slice(-4) || "0000";
    const tag = selectedPlan === "languages" ? "LANG" : "DEPT";
    return `EVC-${tag}-${cleanTime}-${tail}`;
  };

  const handleSendRequest = async () => {
    const ph = phone.replace(/[^0-9+]/g, "");
    const tm = payTime.trim();
    const nm = name.trim();
    if (ph.length < 6 || ph.length > 20) {
      setReqMsg({ key: "Lambarka taleefanka waa khalad.", ok: false });
      return;
    }
    if (!tm || tm.length < 3) {
      setReqMsg({ key: "Fadlan geli saacadda aad lacagta dirtay.", ok: false });
      return;
    }
    const generatedRef = buildEvcTimeRef(ph, tm, plan);
    const planLabel = plan === "languages" ? "EVC Plus (Lang)" : "EVC Plus (Dept)";

    setSending(true);
    setReqMsg(null);
    try {
      saveRequestedProScope(localStorage, deviceId, plan);
      await submitProRequest({
        deviceId,
        phone: ph,
        method: planLabel,
        txn: generatedRef,
        amount: "$0.10",
        name: nm || undefined,
      });
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
    const c = code.trim();
    if (c.replace(/[^A-Za-z0-9]/g, "").length < 8) {
      setCodeMsg({ key: "Koodhku waa khalad.", ok: false });
      return;
    }
    setRedeeming(true);
    setCodeMsg(null);
    try {
      const res = await redeemProCode(deviceId, c);
      if (res.ok) {
        setProUntil(res.expiresMs ?? Date.now() + 180 * 86400 * 1000);
        handleUnlocked();
      } else {
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

  const MsgView = ({ msg }: { msg: Msg | null }) =>
    !msg ? null : (
      <div
        role="alert"
        className={`mt-3 rounded-xl px-3.5 py-2.5 flex items-start gap-2.5 text-xs leading-relaxed border ${
          msg.ok
            ? "bg-emerald-500/12 border-emerald-400/35 text-emerald-200"
            : "bg-rose-500/12 border-rose-400/35 text-rose-200"
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
      className="min-h-screen flex flex-col text-white"
      style={{
        background: "linear-gradient(180deg, #050A1C 0%, #0A153E 52%, #131342 100%)",
      }}
    >
      {/* Top Bar */}
      <header className="border-b border-white/10">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-3.5 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={onBack}
              aria-label="Back"
              className="p-2 rounded-xl hover:bg-white/10 text-white cursor-pointer transition-colors"
            >
              {rtl ? <ArrowRight className="w-5 h-5" /> : <ArrowLeft className="w-5 h-5" />}
            </button>
            <div className="flex items-center gap-2">
              <h1 className="font-head font-extrabold text-[18px]">{tr("Hagaha Waaxda")}</h1>
              <ProBadge small />
            </div>
          </div>

          <button
            type="button"
            onClick={handleCopyDevice}
            title="Device ID"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/8 hover:bg-white/14 border border-white/15 text-xs font-mono text-white/80 cursor-pointer transition-colors"
          >
            <Smartphone className="w-3.5 h-3.5 text-[#FFD86B]" />
            <span>ID: {shortDev}</span>
            {copiedDev ? (
              <Check className="w-3.5 h-3.5 text-emerald-400" />
            ) : (
              <Copy className="w-3.5 h-3.5 opacity-65" />
            )}
          </button>
        </div>
      </header>

      <main className="max-w-5xl w-full mx-auto px-4 sm:px-6 py-6 pb-14 space-y-5">
        {/* Two-Package Pro Selector */}
        <section className="grid sm:grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => setPlan("departments")}
            className={`text-start rounded-2xl p-4 border transition-all cursor-pointer ${
              plan === "departments"
                ? "border-[#FFC93C] bg-[#FFC93C]/12 shadow-lg"
                : "border-white/15 bg-white/[0.04] hover:bg-white/[0.08]"
            }`}
          >
            <div className="flex items-center justify-between gap-2">
              <span className="inline-flex items-center gap-2 font-head font-extrabold text-sm text-white">
                <GraduationCap className="w-4 h-4 text-[#FFD86B]" />
                {tr("Xirmada 1: Waaxaha & Xarunta Pro")}
              </span>
              <span className="text-xs font-extrabold text-[#FFD86B] tabular-nums">$0.10</span>
            </div>
            <p className="mt-1.5 text-xs text-white/75 leading-relaxed">
              {tr("Hagaha Waaxaha (14 kulliyadood + 70 su'aalood), Khariidadaha, Dadka Caanka ah, Wararka AI, Xirfadaha Dakhliga & Horumarinta Ardayga.")}
            </p>
          </button>

          <button
            type="button"
            onClick={() => setPlan("languages")}
            className={`text-start rounded-2xl p-4 border transition-all cursor-pointer ${
              plan === "languages"
                ? "border-[#FFC93C] bg-[#FFC93C]/12 shadow-lg"
                : "border-white/15 bg-white/[0.04] hover:bg-white/[0.08]"
            }`}
          >
            <div className="flex items-center justify-between gap-2">
              <span className="inline-flex items-center gap-2 font-head font-extrabold text-sm text-white">
                <Languages className="w-4 h-4 text-[#FFD86B]" />
                {tr("Xirmada 2: Luqadaha (English & Carabi)")}
              </span>
              <span className="text-xs font-extrabold text-[#FFD86B] tabular-nums">$0.10</span>
            </div>
            <p className="mt-1.5 text-xs text-white/75 leading-relaxed">
              {tr("Fur luqadaha Ingiriisiga iyo Carabiga ee barnaamijka oo dhan (Af-Soomaaligu waa bilaash abid).")}
            </p>
          </button>
        </section>

        <div className="grid lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Value Proposition + Device Lock Guarantee */}
        <div className="lg:col-span-5 space-y-4 lg:sticky lg:top-6">
          <div
            className="rounded-3xl p-6 border border-[#FFC93C]/45"
            style={{
              background:
                "linear-gradient(145deg, rgba(255,255,255,0.10) 0%, rgba(255,255,255,0.03) 100%)",
              boxShadow: "0 18px 40px rgba(0,0,0,0.35)",
            }}
          >
            <div className="flex items-center justify-between">
              <ProBadge />
              <Lock className="w-5 h-5 text-[#FFD86B]" />
            </div>

            <h2 className="mt-4 font-head font-extrabold text-[26px] leading-tight">
              {plan === "languages"
                ? tr("Pro Luqadaha (English & Carabi)")
                : tr("Pro Waaxaha & Xarunta Ardayga")}
            </h2>

            <div className="mt-3 flex items-baseline gap-2 flex-wrap">
              <span className="font-head font-extrabold text-[24px] text-[#FFD86B] tabular-nums">
                {info.priceText}
              </span>
              <span className="text-xs font-semibold text-emerald-300">
                · {tr("Hal mar bixi, abid ha kuu furnaado")}
              </span>
            </div>

            <p className="mt-2 text-xs text-white/70 leading-relaxed">
              {tr(
                "Uma baahnid inaad mar walba lacag bixiso. $0.10 hal mar ah ayaad ku helaysaa dhammaan adeegyada Pro iyo kuwa cusub ee soo socda."
              )}
            </p>

            <div className="mt-5 pt-5 border-t border-white/12 space-y-2.5">
              {(plan === "languages"
                ? [
                    tr("Luqadda Ingiriisiga (English) ee barnaamijka oo dhan"),
                    tr("Luqadda Carabiga (العربية) oo leh qaabka saxda ah (RTL)"),
                    tr("Af-Soomaaligu waa bilaash boqolkiiba boqol abid"),
                    tr("Hal mar bixi, abid ha kuu furnaado"),
                  ]
                : [
                    tr("Kala saar waaxaha ku habboon") + " (14 + 70 Pro)",
                    tr("Khariidado waxbarasho oo la hubiyay (AI, Injineernimada Korontada, Caafimaadka iyo in ka badan)"),
                    tr("Dadka Caanka ah ee Adduunka (Ilaha La Hubiyay)"),
                    tr("Wararka Shaqooyinka Cusub (WEF 2025 - 2030)"),
                    tr("Xirfadaha Dakhliga Sare (Baro Adigoo Arday ah)"),
                    tr("Horumarinta Ardayga Soomaaliya (Qorshe La Hubiyay)"),
                  ]
              ).map((label) => (
                <div key={label} className="flex items-start gap-2.5 text-[13.5px] text-white/90">
                  <CheckCircle2 className="w-4 h-4 text-[#FFC93C] shrink-0 mt-0.5" />
                  <span>{label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Per-Device Security Guarantee */}
          <div className="rounded-2xl p-4 bg-emerald-500/[0.08] border border-emerald-400/25 space-y-2">
            <div className="flex items-center gap-2 text-emerald-300 font-head font-bold text-sm">
              <ShieldCheck className="w-4 h-4 shrink-0" />
              <span>{tr("Amniga Gelitaanka (1 Qalab = 1 Arday)")}</span>
            </div>
            <p className="text-xs text-white/75 leading-relaxed">
              {tr(
                "Lacag-bixinta waxaa gacanta ku xaqiijiya maamulka (badanaa ilaa 24 saac). Gelitaanku wuxuu ku xidhan yahay qalabkan."
              )}
            </p>
            <div className="pt-1 flex items-center justify-between text-[11.5px] font-mono text-white/70">
              <span>Device ID: {shortDev}</span>
              <button
                type="button"
                onClick={handleCopyDevice}
                className="text-[#FFD86B] hover:underline font-sans font-semibold cursor-pointer"
              >
                {copiedDev ? tr("La koobiyay") : tr("Koobi Aqoonsiga")}
              </button>
            </div>
          </div>

          {/* Direct WhatsApp Support */}
          <a
            href={`https://wa.me/${info.whatsapp}?text=${encodeURIComponent(
              `${tr("Salaan, waxaan rabaa inaan furo Hagaha Waaxda Pro.")} ($0.10 · Device ID: ${shortDev})`
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full h-12 rounded-2xl border border-emerald-400/40 bg-emerald-500/12 hover:bg-emerald-500/20 text-emerald-200 font-bold text-sm flex items-center justify-center gap-2 transition-colors"
          >
            <MessageCircle className="w-5 h-5 text-emerald-400" />
            <span>{tr("La xiriir WhatsApp")}</span>
          </a>
        </div>

        {/* Right Column: 3-Step EVC Plus Checkout + Redeem Code */}
        <div className="lg:col-span-7 space-y-4">
          {/* Step 1: EVC Plus Payment Details */}
          <section className="rounded-3xl p-5 border border-white/15 bg-white/[0.05]">
            <div className="flex items-center justify-between gap-2 mb-4">
              <div className="flex items-center gap-2.5">
                <span className="w-7 h-7 rounded-full bg-[#FFC93C] text-[#050A1C] font-head font-black text-sm flex items-center justify-center">
                  1
                </span>
                <h3 className="font-head font-extrabold text-[16.5px]">{tr("1. Bixi lacagta")}</h3>
              </div>
              {loadingInfo && <Loader2 className="w-4 h-4 animate-spin text-[#FFD86B]" />}
            </div>

            <div className="rounded-2xl p-4 border border-[#FFC93C]/45 bg-[#091233]/90">
              <div className="flex items-center justify-between gap-3 flex-wrap">
                <div className="space-y-1">
                  <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#FFD86B]">
                    <Phone className="w-3.5 h-3.5" />
                    <span>{evcMethod.name}</span>
                  </div>
                  <div className="font-head font-extrabold text-[26px] tracking-wider text-white tabular-nums select-all">
                    {evcMethod.number}
                  </div>
                  <div className="text-sm font-semibold text-white/90">
                    {tr("Magaca:")} <span className="text-[#FFD86B]">{evcMethod.holder}</span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleCopyNumber}
                  className="px-4 py-2.5 rounded-xl bg-[#FFC93C] hover:bg-[#FFD55A] text-[#050A1C] font-head font-extrabold text-sm inline-flex items-center gap-2 cursor-pointer transition-colors"
                >
                  {copiedNum ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  <span>{copiedNum ? tr("La koobiyay") : tr("Koobi lambarka")}</span>
                </button>
              </div>

              <div className="mt-3 pt-3 border-t border-white/10 flex items-center justify-between gap-2 flex-wrap text-xs text-white/75">
                <span>
                  {trf("Qiimaha: {p}", { p: info.priceText })}
                </span>
                <a
                  href={`tel:*712*${evcMethod.number}*${EVC_PAYMENT_CONFIG.ussdAmount}%23`}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#FFC93C]/15 hover:bg-[#FFC93C]/25 border border-[#FFC93C]/35 font-mono text-[#FFD86B] transition-colors"
                >
                  <Phone className="w-3 h-3" />
                  <span>*712*{evcMethod.number}*{EVC_PAYMENT_CONFIG.ussdAmount}#</span>
                </a>
              </div>
            </div>

            {info.note && <p className="mt-3 text-xs text-white/75 leading-relaxed">{info.note}</p>}
          </section>

          {/* Step 2: Submit Transaction Info */}
          <section className="rounded-3xl p-5 border border-white/15 bg-white/[0.05]">
            <div className="flex items-center gap-2.5 mb-4">
              <span className="w-7 h-7 rounded-full bg-[#FFC93C] text-[#050A1C] font-head font-black text-sm flex items-center justify-center">
                2
              </span>
              <h3 className="font-head font-extrabold text-[16.5px]">
                {tr("2. Dir xogta lacag-bixinta")}
              </h3>
            </div>

            {pending && !reqMsg && (
              <div className="mb-4 rounded-xl px-3.5 py-2.5 bg-[#FFC93C]/12 border border-[#FFC93C]/35 flex items-start gap-2.5 text-xs text-[#FFE599]">
                <Hourglass className="w-4 h-4 text-[#FFD86B] shrink-0 mt-0.5" />
                <span>{tr("Codsi hore ayaa socda; sug xaqiijinta ama riix “Hubi xaaladda”.")}</span>
              </div>
            )}

            <div className="space-y-3">
              <div>
                <label htmlFor="evc-phone" className="block text-xs font-semibold text-white/75 mb-1.5">
                  {tr("Lambarka taleefankaaga (kii aad ka bixisay)")}
                </label>
                <input
                  id="evc-phone"
                  type="tel"
                  value={phone}
                  maxLength={20}
                  onChange={(e) => setPhone(e.target.value.replace(/[^0-9+ ]/g, ""))}
                  placeholder="61XXXXXXX"
                  className="w-full rounded-xl px-4 py-3.5 text-[15px] bg-[#091233]/85 border border-white/20 outline-none focus:border-[#FFC93C] placeholder:text-white/35 tabular-nums"
                />
              </div>

              <div>
                <div className="flex items-center justify-between gap-2 mb-1.5 flex-wrap">
                  <label htmlFor="evc-time" className="inline-flex items-center gap-1.5 text-xs font-semibold text-white/75">
                    <Clock className="w-3.5 h-3.5 text-[#FFD86B]" />
                    <span>{tr("Saacadda aad lacagta dirtay (Waqtiga EVC Plus)")}</span>
                  </label>
                  <button
                    type="button"
                    onClick={() => setPayTime(currentHHMM())}
                    className="text-[11.5px] font-semibold text-[#FFD86B] hover:underline cursor-pointer"
                  >
                    {tr("Waqtiga hadda")}
                  </button>
                </div>
                <input
                  id="evc-time"
                  type="time"
                  value={payTime}
                  onChange={(e) => setPayTime(e.target.value)}
                  className="w-full rounded-xl px-4 py-3.5 text-[16px] font-mono font-bold bg-[#091233]/85 border border-white/20 outline-none focus:border-[#FFC93C] text-white"
                />
                <p className="mt-1.5 text-[11.5px] text-white/60 leading-relaxed">
                  {tr(
                    "EVC Plus kuma soo diro Ref code; kaliya geli lambarkaaga iyo saacadda fariinta lacag-dirista (tusaale: 14:35) si degdeg ah loogu xaqiijiyo."
                  )}
                </p>
              </div>

              <div>
                <label htmlFor="evc-name" className="block text-xs font-semibold text-white/75 mb-1.5">
                  {tr("Magacaaga (ikhtiyaari)")}
                </label>
                <input
                  id="evc-name"
                  type="text"
                  value={name}
                  maxLength={40}
                  onChange={(e) => setName(e.target.value)}
                  placeholder={tr("Magacaaga (ikhtiyaari)")}
                  className="w-full rounded-xl px-4 py-3.5 text-[15px] bg-[#091233]/85 border border-white/20 outline-none focus:border-[#FFC93C] placeholder:text-white/35"
                />
              </div>
            </div>

            <button
              type="button"
              disabled={sending}
              onClick={handleSendRequest}
              className="mt-4 w-full h-[52px] rounded-2xl bg-[#FFC93C] hover:bg-[#FFD55A] text-[#050A1C] font-head font-extrabold text-[15.5px] flex items-center justify-center cursor-pointer disabled:opacity-50 transition-colors"
            >
              {sending ? <Loader2 className="w-5 h-5 animate-spin" /> : tr("Dir codsiga")}
            </button>

            <a
              href={`https://wa.me/${info.whatsapp}?text=${encodeURIComponent(
                `${tr("Salaan, waxaan bixiyay lacagta Pro ($0.10).")}\n` +
                  `Xirmo: ${plan === "languages" ? "Pro Luqadaha (English & Carabi)" : "Pro Waaxaha & Xarunta"}\n` +
                  `Tel: ${phone || "-"}\n` +
                  `Saacadda EVC: ${payTime || "-"}\n` +
                  `Magac: ${name || "-"}\n` +
                  `Device ID: ${shortDev}`
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2.5 w-full h-11 rounded-2xl border border-emerald-400/40 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-200 font-bold text-xs flex items-center justify-center gap-2 transition-colors"
            >
              <MessageCircle className="w-4 h-4 text-emerald-400" />
              <span>{tr("U dir caddaynta WhatsApp (Degdeg)")}</span>
            </a>

            <MsgView msg={reqMsg} />
          </section>

          {/* Step 3: Check Approval Status */}
          <section className="rounded-3xl p-5 border border-white/15 bg-white/[0.05]">
            <div className="flex items-center gap-2.5 mb-3.5">
              <span className="w-7 h-7 rounded-full bg-[#FFC93C] text-[#050A1C] font-head font-black text-sm flex items-center justify-center">
                3
              </span>
              <h3 className="font-head font-extrabold text-[16.5px]">{tr("3. Hubi xaaladda")}</h3>
            </div>
            <button
              type="button"
              disabled={checking}
              onClick={handleCheck}
              className="w-full h-12 rounded-2xl border border-[#FFC93C]/65 hover:bg-[#FFC93C]/10 text-[#FFD86B] font-bold text-[14.5px] flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 transition-colors"
            >
              <RefreshCw className={`w-4 h-4 ${checking ? "animate-spin" : ""}`} />
              <span>{tr("Hubi xaaladda")}</span>
            </button>
            <MsgView msg={statMsg} />
          </section>

          {/* Redeem One-Time Code */}
          <section className="rounded-3xl p-5 border border-white/15 bg-white/[0.04] space-y-3">
            <div className="flex items-center gap-2">
              <KeyRound className="w-4 h-4 text-[#FFD86B]" />
              <AccentTitleLight label="Koodh ma haysaa?" />
            </div>
            <div className="flex flex-col sm:flex-row gap-2.5">
              <input
                type="text"
                value={code}
                maxLength={14}
                onChange={(e) => setCode(e.target.value.toUpperCase())}
                placeholder={tr("Geli koodhka")}
                aria-label={tr("Geli koodhka")}
                className="flex-1 rounded-xl px-4 py-3 text-[15px] font-mono font-bold tracking-widest bg-[#091233]/85 border border-white/20 outline-none focus:border-[#FFC93C] placeholder:text-white/35 placeholder:font-sans placeholder:font-normal placeholder:tracking-normal"
              />
              <button
                type="button"
                disabled={redeeming}
                onClick={handleRedeem}
                className="sm:w-44 h-12 rounded-xl bg-white text-[#050A1C] hover:bg-slate-100 font-head font-extrabold text-sm flex items-center justify-center cursor-pointer disabled:opacity-50 transition-colors"
              >
                {redeeming ? <Loader2 className="w-5 h-5 animate-spin" /> : tr("Isticmaal koodhka")}
              </button>
            </div>
            <MsgView msg={codeMsg} />
          </section>
        </div>
        </div>
      </main>
    </div>
  );
}
