import React, { useCallback, useEffect, useState } from "react";
import {
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Copy,
  Hourglass,
  Loader2,
  Lock,
  MessageCircle,
  RefreshCw,
} from "lucide-react";
import { useApp } from "../context/AppContext";
import {
  fetchProInfo,
  ProApiError,
  redeemProCode,
  submitProRequest,
  type ProInfo,
} from "../lib/api";
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

  const [info, setInfo] = useState<ProInfo | null>(null);
  const [loadingInfo, setLoadingInfo] = useState(true);
  const [infoErr, setInfoErr] = useState<string | null>(null);

  const [method, setMethod] = useState<string | null>(null);
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

  const loadInfo = useCallback(async () => {
    setLoadingInfo(true);
    setInfoErr(null);
    try {
      const i = await fetchProInfo();
      setInfo(i);
      if (i.methods.length === 1) setMethod(i.methods[0].name);
    } catch (e) {
      setInfoErr(e instanceof ProApiError ? e.code : "offline");
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
    if (!method) {
      setReqMsg({ key: "Dooro habka lacag-bixinta.", ok: false });
      return;
    }
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
        method,
        txn: txId,
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

  const handleCopy = async (num: string) => {
    try {
      await navigator.clipboard.writeText(num);
      showToast(tr("Lambarka waa la koobiyay"));
    } catch {
      // ignore
    }
  };

  const pending = pendingAt > 0 && Date.now() - pendingAt < 7 * 86400 * 1000;

  const MsgView = ({ msg }: { msg: Msg | null }) =>
    !msg ? null : (
      <div className="mt-2.5 flex items-start gap-2 text-xs leading-relaxed">
        {msg.ok ? (
          <CheckCircle2 className="w-4 h-4 text-[#7CF0A8] shrink-0 mt-0.5" />
        ) : (
          <AlertCircle className="w-4 h-4 text-[#FFB4AB] shrink-0 mt-0.5" />
        )}
        <span className={msg.ok ? "text-[#B8F7D0]" : "text-[#FFD0CB]"}>{tr(msg.key)}</span>
      </div>
    );

  return (
    <div
      className="min-h-screen flex flex-col text-white"
      style={{
        background: "linear-gradient(180deg, #050A1E 0%, #0B1647 50%, #1A1450 100%)",
      }}
    >
      <header className="px-4 py-3 flex items-center gap-2">
        <button
          type="button"
          onClick={onBack}
          className="p-2 rounded-xl hover:bg-white/10 text-white cursor-pointer"
        >
          {rtl ? <ArrowRight className="w-5 h-5" /> : <ArrowLeft className="w-5 h-5" />}
        </button>
        <div className="flex items-center gap-2">
          <h1 className="font-head font-extrabold text-[18px]">{tr("Hagaha Waaxda")}</h1>
          <ProBadge small />
        </div>
      </header>

      <main className="max-w-[640px] w-full mx-auto px-4 pt-1 pb-10 space-y-3.5">
        {/* Hero Card */}
        <div
          className="rounded-[26px] p-5 border border-[#FFC93C]/60"
          style={{
            background:
              "linear-gradient(135deg, rgba(255,255,255,0.12) 0%, rgba(255,255,255,0.05) 100%)",
            boxShadow: "0 12px 28px rgba(255,201,60,0.16)",
          }}
        >
          <div className="flex items-center justify-between">
            <ProBadge />
            <Lock className="w-5 h-5 text-[#FFD86B]" />
          </div>
          <h2 className="mt-3.5 font-head font-extrabold text-[26px] leading-tight">
            {tr("Hel Hagaha Waaxda Pro")}
          </h2>
          {info && (
            <p className="mt-2 text-[13px] text-white/80">
              {trf("Gelitaan {n} maalmood", { n: info.days })}
            </p>
          )}
          <div className="mt-3 space-y-2">
            {[
              "Kala saar waaxaha ku habboon",
              "Shaqooyinka waaxda kasta",
              "Xoojiso natiijada su’aalo yar",
              "Waaxaha 14-ka kulliyadood oo dhan",
            ].map((k) => (
              <div key={k} className="flex items-center gap-2.5 text-[13.5px] text-white/90">
                <CheckCircle2 className="w-4 h-4 text-[#FFC93C] shrink-0" />
                <span>{tr(k)}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Step 1 */}
        <div
          className="rounded-[20px] p-4 border border-white/20"
          style={{
            background:
              "linear-gradient(135deg, rgba(255,255,255,0.12) 0%, rgba(255,255,255,0.05) 100%)",
          }}
        >
          <h3 className="font-head font-extrabold text-[15.5px] mb-3">{tr("1. Bixi lacagta")}</h3>
          {loadingInfo ? (
            <div className="py-4 flex justify-center">
              <Loader2 className="w-6 h-6 animate-spin text-[#FFC93C]" />
            </div>
          ) : infoErr ? (
            <div className="space-y-3">
              <p className="text-[13px] text-white/85">{tr(errKey(infoErr))}</p>
              <button
                type="button"
                onClick={loadInfo}
                className="w-full h-12 rounded-[14px] border border-[#FFC93C]/70 text-[#FFD86B] font-bold text-sm flex items-center justify-center gap-2 cursor-pointer"
              >
                <RefreshCw className="w-4 h-4" />
                <span>{tr("Isku day mar kale")}</span>
              </button>
            </div>
          ) : !info || info.methods.length === 0 ? (
            <p className="text-[13px] text-white/85 leading-relaxed">
              {tr("Habka lacag-bixinta weli lama dejin. Fadlan mar dambe isku day ama la xiriir maamulaha.")}
            </p>
          ) : (
            <div className="space-y-2.5">
              {info.priceText && (
                <p className="text-sm font-extrabold text-[#FFD86B]">
                  {trf("Qiimaha: {p}", { p: info.priceText })}
                </p>
              )}
              {info.methods.map((m) => (
                <div
                  key={`${m.name}-${m.number}`}
                  className="rounded-[14px] px-3.5 py-2.5 border border-white/20 bg-white/5 flex items-center justify-between gap-2"
                >
                  <div>
                    <div className="text-[13px] font-bold text-[#FFD86B]">{m.name}</div>
                    <div className="font-head font-extrabold text-[17px] tracking-wider select-all">
                      {m.number}
                    </div>
                    {m.holder && <div className="text-xs text-white/70">{m.holder}</div>}
                  </div>
                  <button
                    type="button"
                    onClick={() => handleCopy(m.number)}
                    title={tr("Koobi lambarka")}
                    className="p-2 rounded-xl text-[#FFD86B] hover:bg-white/10 cursor-pointer"
                  >
                    <Copy className="w-5 h-5" />
                  </button>
                </div>
              ))}
              {info.note && <p className="text-xs text-white/75 leading-relaxed">{info.note}</p>}
            </div>
          )}
        </div>

        {/* Step 2 */}
        <div
          className="rounded-[20px] p-4 border border-white/20"
          style={{
            background:
              "linear-gradient(135deg, rgba(255,255,255,0.12) 0%, rgba(255,255,255,0.05) 100%)",
          }}
        >
          <h3 className="font-head font-extrabold text-[15.5px] mb-3">
            {tr("2. Dir xogta lacag-bixinta")}
          </h3>

          {pending && !reqMsg && (
            <div className="mb-3 flex items-start gap-2 text-xs text-white/85">
              <Hourglass className="w-4 h-4 text-[#FFD86B] shrink-0 mt-0.5" />
              <span>{tr("Codsi hore ayaa socda; sug xaqiijinta ama riix “Hubi xaaladda”.")}</span>
            </div>
          )}

          {info && info.methods.length > 0 && (
            <div className="mb-3">
              <p className="text-xs font-bold text-[#FFD86B] mb-2">{tr("Habka lacag-bixinta")}</p>
              <div className="flex flex-wrap gap-2">
                {info.methods.map((m) => {
                  const sel = method === m.name;
                  return (
                    <button
                      key={m.name}
                      type="button"
                      onClick={() => setMethod(m.name)}
                      className={`px-3.5 py-2 rounded-full text-[13px] font-bold border cursor-pointer transition-colors ${
                        sel
                          ? "bg-[#FFC93C] text-[#050A1E] border-[#FFC93C]"
                          : "bg-white/10 text-white border-white/25"
                      }`}
                    >
                      {m.name}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          <div className="space-y-2.5">
            <input
              type="tel"
              value={phone}
              maxLength={20}
              onChange={(e) => setPhone(e.target.value.replace(/[^0-9+ ]/g, ""))}
              placeholder={tr("Lambarka taleefankaaga (kii aad ka bixisay)")}
              className="w-full rounded-[14px] px-4 py-3.5 text-[15px] bg-white/8 border border-white/22 outline-none focus:border-[#FFC93C] placeholder:text-white/45"
            />
            <input
              type="text"
              value={txn}
              maxLength={40}
              onChange={(e) => setTxn(e.target.value.toUpperCase())}
              placeholder={tr("Lambarka xaqiijinta (Transaction ID)")}
              className="w-full rounded-[14px] px-4 py-3.5 text-[15px] bg-white/8 border border-white/22 outline-none focus:border-[#FFC93C] placeholder:text-white/45"
            />
            <input
              type="text"
              value={name}
              maxLength={40}
              onChange={(e) => setName(e.target.value)}
              placeholder={tr("Magacaaga (ikhtiyaari)")}
              className="w-full rounded-[14px] px-4 py-3.5 text-[15px] bg-white/8 border border-white/22 outline-none focus:border-[#FFC93C] placeholder:text-white/45"
            />
          </div>

          <button
            type="button"
            disabled={sending}
            onClick={handleSendRequest}
            className="mt-3.5 w-full h-[52px] rounded-[16px] bg-[#FFC93C] hover:bg-[#FFD35E] text-[#050A1E] font-extrabold text-[15px] flex items-center justify-center cursor-pointer disabled:opacity-50"
          >
            {sending ? <Loader2 className="w-5 h-5 animate-spin" /> : tr("Dir codsiga")}
          </button>
          <MsgView msg={reqMsg} />
        </div>

        {/* Step 3 */}
        <div
          className="rounded-[20px] p-4 border border-white/20"
          style={{
            background:
              "linear-gradient(135deg, rgba(255,255,255,0.12) 0%, rgba(255,255,255,0.05) 100%)",
          }}
        >
          <h3 className="font-head font-extrabold text-[15.5px] mb-3">{tr("3. Hubi xaaladda")}</h3>
          <button
            type="button"
            disabled={checking}
            onClick={handleCheck}
            className="w-full h-[50px] rounded-[14px] border border-[#FFC93C]/70 text-[#FFD86B] font-bold text-[14.5px] flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${checking ? "animate-spin" : ""}`} />
            <span>{tr("Hubi xaaladda")}</span>
          </button>
          <MsgView msg={statMsg} />
        </div>

        {/* Redeem Code */}
        <div className="pt-2 space-y-2.5">
          <AccentTitleLight label="Koodh ma haysaa?" />
          <input
            type="text"
            value={code}
            maxLength={14}
            onChange={(e) => setCode(e.target.value.toUpperCase())}
            placeholder={tr("Geli koodhka")}
            className="w-full rounded-[14px] px-4 py-3.5 text-[16px] font-extrabold tracking-widest bg-white/8 border border-white/22 outline-none focus:border-[#FFC93C] placeholder:text-white/45 placeholder:font-normal placeholder:tracking-normal"
          />
          <button
            type="button"
            disabled={redeeming}
            onClick={handleRedeem}
            className="w-full h-[52px] rounded-[16px] bg-[#FFC93C] hover:bg-[#FFD35E] text-[#050A1E] font-extrabold text-[15px] flex items-center justify-center cursor-pointer disabled:opacity-50"
          >
            {redeeming ? <Loader2 className="w-5 h-5 animate-spin" /> : tr("Isticmaal koodhka")}
          </button>
          <MsgView msg={codeMsg} />
        </div>

        {/* WhatsApp */}
        {info && info.whatsapp && (
          <a
            href={`https://wa.me/${info.whatsapp}?text=${encodeURIComponent(
              tr("Salaan, waxaan rabaa inaan furo Hagaha Waaxda Pro.")
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full h-[50px] rounded-[14px] border border-[#FFC93C]/70 text-[#FFD86B] font-bold text-[14.5px] flex items-center justify-center gap-2 hover:bg-white/5"
          >
            <MessageCircle className="w-5 h-5" />
            <span>{tr("La xiriir WhatsApp")}</span>
          </a>
        )}

        <p className="pt-2 text-center text-xs text-white/60 leading-relaxed">
          {tr(
            "Lacag-bixinta waxaa gacanta ku xaqiijiya maamulka (badanaa ilaa 24 saac). Gelitaanku wuxuu ku xidhan yahay qalabkan."
          )}
        </p>
      </main>
    </div>
  );
}
