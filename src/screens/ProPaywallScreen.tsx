import React, { useCallback, useEffect, useState } from "react";
import {
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  Check,
  CheckCircle2,
  Copy,
  Hourglass,
  KeyRound,
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

export function ProPaywallScreen({
  onBack,
  onUnlocked,
}: {
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

  const [phone, setPhone] = useState("");
  const [txn, setTxn] = useState("");
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

  const handleSendRequest = async () => {
    const ph = phone.replace(/[^0-9+]/g, "");
    const txId = txn.trim();
    const nm = name.trim();
    if (ph.length < 6 || ph.length > 20) {
      setReqMsg({ key: "Lambarka taleefanka waa khalad.", ok: false });
      return;
    }
    if (!/^[A-Za-z0-9 .:_-]{4,40}$/.test(txId)) {
      setReqMsg({ key: "Lambarka xaqiijinta waa khalad (4-40 xaraf ama tiro).", ok: false });
      return;
    }
    setSending(true);
    setReqMsg(null);
    try {
      await submitProRequest({
        deviceId,
        phone: ph,
        method: EVC_PAYMENT_CONFIG.methodName,
        txn: txId,
        amount: info.priceText,
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

      <main className="max-w-5xl w-full mx-auto px-4 sm:px-6 py-6 pb-14 grid lg:grid-cols-12 gap-6 items-start">
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

            <h2 className="mt-4 font-head font-extrabold text-[28px] leading-tight">
              {tr("Hel Hagaha Waaxda Pro")}
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
              {[
                tr("Luqadaha Ingiriisiga iyo Carabiga oo dhan"),
                tr("Kala saar waaxaha ku habboon") + " (14)",
                tr("Khariidado waxbarasho oo la hubiyay (AI, Injineernimada Korontada, Caafimaadka iyo in ka badan)"),
                tr("Caqabadaha Ardayga Soomaaliya iyo Xalkooda (Dugsiga Sare ilaa Jaamacadda)"),
                tr("Liiska Diyaargarowga Jaamacadda ee 90-ka Maalmood"),
                tr("Shaqooyinka waaxda kasta") + " & " + tr("Xoojiso natiijada su’aalo yar"),
              ].map((label) => (
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
                <span className="font-mono text-[#FFD86B]">
                  *712*{evcMethod.number}*{EVC_PAYMENT_CONFIG.ussdAmount}#
                </span>
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
                <label htmlFor="evc-txn" className="block text-xs font-semibold text-white/75 mb-1.5">
                  {tr("Lambarka xaqiijinta (Transaction ID)")}
                </label>
                <input
                  id="evc-txn"
                  type="text"
                  value={txn}
                  maxLength={40}
                  onChange={(e) => setTxn(e.target.value.toUpperCase())}
                  placeholder="Tusaale: REF123456"
                  className="w-full rounded-xl px-4 py-3.5 text-[15px] font-mono bg-[#091233]/85 border border-white/20 outline-none focus:border-[#FFC93C] placeholder:text-white/35 placeholder:font-sans"
                />
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
      </main>
    </div>
  );
}
