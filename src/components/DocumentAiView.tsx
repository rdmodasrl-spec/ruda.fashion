import React, { useState, useEffect } from 'react';
import { FileSearch, Sparkles, AlertTriangle, Calendar, FileText, CheckCircle2, Copy, Check, UploadCloud, ShieldAlert, ArrowRight, ShieldCheck } from 'lucide-react';

interface DocumentAiViewProps {
  onAskAi: (prompt: string) => void;
}

export const DocumentAiView: React.FC<DocumentAiViewProps> = ({ onAskAi }) => {
  const [selectedPreset, setSelectedPreset] = useState<string>('tax');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [copiedDraft, setCopiedDraft] = useState(false);
  const [currentAuditId, setCurrentAuditId] = useState<string>('doc-audit-2026-001');

  // Preset document samples representing real European bureaucratic notices
  const presets: Record<string, any> = {
    tax: {
      title: '🇮🇹 意大利国家税务局 (Agenzia delle Entrate) 催缴公函',
      sender: 'Agenzia delle Entrate - Riscossione (意大利国家税务局征收处)',
      docType: 'Avviso di Intimazione di Pagamento (催缴税款及市政垃圾税通知书)',
      language: 'Italiano (意大利语)',
      amountDue: '€342.50 (含滞纳金与罚息)',
      deadline: '2026-11-15 (请在信件送达 60 日内处理)',
      riskLevel: '中风险 (Medium Risk) - 逾期将产生行政扣押 (Fermo Amministrativo)',
      summary: '本文件由米兰税务征收处下发，通知缴纳2023年度米兰大区 TARI 垃圾税差额及未如期申报产生的微额滞纳金。',
      obligations: '纳税人必须在截止日期前缴纳，或由执业会计师递交行政复议免罚申请 (Autotutela)。',
      nextSteps: [
        '1. 登录 Agenzia Entrate 官网用 SPID / CIE 核对税单明细。',
        '2. 核实该年度税款是否已由往期银行 F24 缴付过（若已缴无需二次付款）。',
        '3. 若未缴，直接使用随信附带的 PagoPA 二维码在烟草店 (Tabacchi) 或手机银行扫码支付。',
        '4. 若属于税务局重复错发，请立即发给会计师起草行政撤销申请。',
      ],
      replyDraft: `Spettabile Agenzia delle Entrate - Riscossione,
Io sottoscritto [Nome Cognome], C.F. [Codice Fiscale], residente a [Indirizzo, Città],
in riferimento alla cartella di pagamento N. [Numero Cartella] notificata in data [Data Notifica],
comunico formalmente che il tributo richiesto risulta regolarmente versato tramite modello F24 in data [Data Pagamento] (quietanza in allegato).
Chiedo pertanto l'annullamento dell'atto in via di autotutela.
Distinti saluti.`,
    },
    residence: {
      title: '🇮🇹 米兰警察总局 (Questura di Milano) 居留补件通知',
      sender: 'Questura di Milano - Ufficio Immigrazione (米兰警察局移民处)',
      docType: 'Comunicazione Motivi Ostativi / Richiesta Integrazione (补充材料通知书)',
      language: 'Italiano (意大利语)',
      amountDue: '€0 (无行政规费)',
      deadline: '2026-10-28 (收到通知后 20 日内补齐)',
      riskLevel: '高风险 (High Risk) - 逾期未补充将下发居留驳回令 (Decreto di Rigetto)',
      summary: '警察局在审核工作居留续签档案时，发现缺少最近连续3个月的工伤险 (INAIL) 记录及最新雇佣合同申报 (Modello Unilav)。',
      obligations: '申请人必须在20日法定宽限期内，通过正式 PEC 挂号电子邮箱或挂号信补交合格签工证明。',
      nextSteps: [
        '1. 第一时间联系雇主或会计师，调取补开最近3个月的 Buste Paga (签工单) 及 Unilav 申报表。',
        '2. 由会计师或工会 (Patronato) 使用官方 PEC 邮箱发送给警察局移民处专用审理邮箱。',
        '3. 保留 PEC 投递成功回执 (Ricevuta di Consegna) 作为证据。',
      ],
      replyDraft: `Alla Questura di Milano - Ufficio Immigrazione
Pratica N. [Numero Fascicolo] - Richiedente: [Nome Cognome]
In riscontro alla richiesta di integrazione documentale prot. [Numero Protocollo],
si trasmette in allegato alla presente la documentazione integrativa richiesta:
1. Modello Unilav aggiornato
2. Ultime 3 buste paga (mesi di competenza)
Si richiede la regolare prosecuzione del procedimento di rilascio del permesso di soggiorno.
Distinti saluti.`,
    },
    lease: {
      title: '🇫🇷 法国巴黎租房合同解约与退租提前通知 (Préavis de départ)',
      sender: 'Cabinet Gestion Immobilière Paris (巴黎房产管理处/房东)',
      docType: 'Contrat de Bail d’Habitation - Clause de Résiliation (租约法律条款)',
      language: 'Français (法语)',
      amountDue: '退还押金预估 €2,900',
      deadline: '退房提前1个月书面挂号信通知 (LRAR)',
      riskLevel: '低风险 (Low Risk) - 正常合法退租手续',
      summary: '巴黎带家具住宅租约 (Location Meublée) 合规退租条款，房客有权在提前1个月发送退租挂号信后解除租约，房东须在交还钥匙后最长1个月内无息退还全部押金。',
      obligations: '必须保持房屋卫生及墙面无严重损坏，退房当天共同签署退房验收单 (État des lieux de sortie)。',
      nextSteps: [
        '1. 通过法国邮政 (La Poste) 线上发送带回执的挂号信 (Lettre Recommandée avec Accusé de Réception)。',
        '2. 预约退房验房日期与水电气抄表。',
        '3. 确认押金退款法国银行账户 (RIB)。',
      ],
      replyDraft: `Madame, Monsieur,
Par la présente, je vous informe de mon intention de résilier le contrat de bail pour le logement situé au [Adresse], conformément aux dispositions légales (préavis d'un mois pour un logement meublé).
Mon départ effectif aura lieu le [Date de départ].
Je reste à votre disposition pour convenir d'une date pour l'état des lieux de sortie et la remise des clés.
Veuillez agréer, Madame, Monsieur, mes salutations distinguées.`,
    },
  };

  const currentDoc = presets[selectedPreset] || presets.tax;

  const handleSelectPreset = async (key: string) => {
    setSelectedPreset(key);
    setIsAnalyzing(true);
    try {
      const res = await fetch('/api/document-ai/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ docTypeHint: key, text: presets[key]?.summary || '' }),
      });
      const data = await res.json();
      if (data.record?.auditId) {
        setCurrentAuditId(data.record.auditId);
      }
    } catch (e) {
      console.warn('Document analyze failed:', e);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleSimulateUpload = async () => {
    setIsAnalyzing(true);
    try {
      const res = await fetch('/api/document-ai/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ docTypeHint: selectedPreset, text: '用户最新上传的意大利/法国公函文件' }),
      });
      const data = await res.json();
      if (data.record?.auditId) {
        setCurrentAuditId(data.record.auditId);
      }
    } catch (e) {
      console.warn('Upload analyze failed:', e);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleCopyDraft = () => {
    navigator.clipboard.writeText(currentDoc.replyDraft);
    setCopiedDraft(true);
    setTimeout(() => setCopiedDraft(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Title & Banner */}
      <div className="bg-slate-900 rounded-2xl p-6 text-white border border-slate-800 shadow-lg flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-950 text-blue-300 border border-blue-800 text-xs font-semibold mb-2">
            <Sparkles className="w-3.5 h-3.5 text-blue-400" />
            <span>AI OCR 视觉识别与公文解读引擎</span>
          </div>
          <h2 className="text-2xl font-bold tracking-tight">AI 欧洲文件管家 · 帮我看这封信</h2>
          <p className="text-xs text-slate-300 mt-1 max-w-xl">
            拍一张意大利语/法语/西语/德语政府信、税务账单、居留补件函或租约。AI 自动识别机构、提取截止日期与金额，并为您起草合规官方回信。
          </p>
        </div>

        <div>
          <label className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-md transition-all cursor-pointer">
            <UploadCloud className="w-4 h-4 text-white" />
            <span>拍照或上传我的文件</span>
            <input type="file" className="hidden" onChange={handleSimulateUpload} />
          </label>
        </div>
      </div>

      {/* Preset Document Switcher */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-bold text-slate-400 mr-2 uppercase tracking-wider">
            常见欧洲公函实操演示:
          </span>
          {Object.keys(presets).map((key) => (
            <button
              key={key}
              onClick={() => handleSelectPreset(key)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                selectedPreset === key
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
              }`}
            >
              {presets[key].title}
            </button>
          ))}
        </div>

        {/* Traceable Audit ID Badge */}
        <div className="flex items-center gap-1.5 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200 text-[11px] font-mono text-slate-500">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
          <span>审计追踪号:</span>
          <strong className="text-slate-900">{currentAuditId}</strong>
        </div>
      </div>

      {/* Document Analysis Result Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Structured Extracted Facts */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-5">
            {/* Header info */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-2">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">发件机构 (SENDER)</span>
                <h3 className="font-bold text-base text-slate-900 mt-0.5">{currentDoc.sender}</h3>
              </div>
              <div className="text-right">
                <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                  currentDoc.riskLevel.includes('高风险')
                    ? 'bg-slate-900 text-white border border-slate-800'
                    : currentDoc.riskLevel.includes('中风险')
                    ? 'bg-slate-100 text-slate-800 border border-slate-300'
                    : 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                }`}>
                  {currentDoc.riskLevel}
                </span>
              </div>
            </div>

            {/* Key Fact Badges */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                <div className="text-[10px] font-bold text-slate-400 uppercase">文件类型</div>
                <div className="text-xs font-semibold text-slate-800 mt-1 line-clamp-1">{currentDoc.docType}</div>
              </div>
              <div className="bg-slate-100 p-3 rounded-xl border border-slate-200">
                <div className="text-[10px] font-bold text-slate-700 uppercase flex items-center gap-1">
                  <Calendar className="w-3 h-3 text-blue-600" />
                  <span>处理截止日期</span>
                </div>
                <div className="text-xs font-black text-slate-900 mt-1">{currentDoc.deadline}</div>
              </div>
              <div className="bg-blue-50/70 p-3 rounded-xl border border-blue-100">
                <div className="text-[10px] font-bold text-blue-600 uppercase">涉及金额</div>
                <div className="text-xs font-black text-blue-800 mt-1">{currentDoc.amountDue}</div>
              </div>
            </div>

            {/* Chinese Summary */}
            <div className="space-y-1.5">
              <h4 className="font-bold text-xs text-slate-800">📄 AI 智能中文解析总结:</h4>
              <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-3.5 rounded-xl border border-slate-100">
                {currentDoc.summary}
              </p>
            </div>

            {/* Obligations and Risks */}
            <div className="space-y-1.5">
              <h4 className="font-bold text-xs text-slate-800">⚠️ 法律责任与逾期风险:</h4>
              <div className="text-xs text-slate-800 bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                {currentDoc.obligations}
              </div>
            </div>

            {/* Next Steps List */}
            <div className="space-y-2">
              <h4 className="font-bold text-xs text-slate-800">🎯 AI 建议下一步行动指南:</h4>
              <div className="space-y-1.5">
                {currentDoc.nextSteps.map((step: string, idx: number) => (
                  <div key={idx} className="flex items-start gap-2 text-xs text-slate-700 bg-white p-2 rounded-lg border border-slate-100">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                    <span>{step}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right 1 Col: Official Formal Response Draft */}
        <div className="space-y-4">
          <div className="bg-slate-900 text-white rounded-2xl p-5 shadow-lg border border-slate-800 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div className="flex items-center gap-1.5 text-blue-400 font-bold text-xs">
                  <FileText className="w-4 h-4" />
                  <span>AI 自动生成官方回复草案</span>
                </div>
                <span className="text-[10px] text-slate-400 font-mono">Formal Draft</span>
              </div>

              <p className="text-xs text-slate-300 mt-3 mb-3">
                符合当地政府法律礼仪格式，可直接打印签字或由会计师通过 PEC 发送：
              </p>

              {/* Code Draft box */}
              <div className="relative bg-slate-950 rounded-xl p-3.5 text-[11px] font-mono text-slate-300 leading-relaxed border border-slate-800">
                <pre className="whitespace-pre-wrap font-sans">{currentDoc.replyDraft}</pre>
                <button
                  onClick={handleCopyDraft}
                  className="absolute top-2 right-2 flex items-center gap-1 px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-[11px] text-slate-200 font-sans transition-colors border border-slate-700"
                >
                  {copiedDraft ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span>已复制</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>复制回函</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            <div className="pt-4 mt-4 border-t border-slate-800 space-y-2">
              <button
                onClick={() => onAskAi(`这封信是发给【${currentDoc.sender}】的，截止日期是【${currentDoc.deadline}】，金额是【${currentDoc.amountDue}】，请帮我详细跟进并指导我如何填写表格。`)}
                className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-md transition-all flex items-center justify-center gap-1.5"
              >
                <span>让 AI 管家协助全套跟进</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
