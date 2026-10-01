import React, { useState } from 'react';
import { Languages, ArrowRightLeft, Volume2, Copy, Check, Sparkles, MessageSquare, ShieldAlert } from 'lucide-react';

export const ScenarioTranslator: React.FC = () => {
  const [sourceLang, setSourceLang] = useState<'zh' | 'it' | 'fr' | 'es' | 'de'>('zh');
  const [targetLang, setTargetLang] = useState<'zh' | 'it' | 'fr' | 'es' | 'de'>('it');
  const [scenario, setScenario] = useState<string>('questura');
  const [inputText, setInputText] = useState('我需要向警察局解释：我的上一份工作合同已经合法结束，目前已签约新公司，这是新的签工单和Modello Unilav，请帮我正常办理工作居留续签。');
  const [translatedResult, setTranslatedResult] = useState<any>({
    primary: `Desidero comunicare all'Ufficio Immigrazione che il precedente rapporto di lavoro si è concluso regolarmente. Attualmente ho sottoscritto un nuovo contratto di assunzione con regolare Modello Unilav e trasmetto in allegato le relative buste paga a supporto della richiesta di rinnovo del permesso di soggiorno per motivi di lavoro subordinato.`,
    tone: '正式公文语体 (Linguaggio Amministrativo Formale) · 语法严密合规',
    subtleMeaning: '直接明确指出换工作为合法过渡，避免警察局质疑无收入来源而触发居留驳回机制。',
  });
  const [copied, setCopied] = useState(false);

  const scenarioPresets = [
    { id: 'questura', label: '🏛️ 警察局/居留办事', defaultZh: '我需要向警察局解释：我的上一份工作合同已经合法结束，目前已签约新公司，这是新的签工单和Modello Unilav，请帮我正常办理工作居留续签。' },
    { id: 'hospital', label: '🏥 医院就医/急诊', defaultZh: '我从昨天开始突发右下腹剧烈疼痛，伴随低烧，请问需要挂哪个急诊科室进行血液化验和超声波检查？' },
    { id: 'landlord', label: '🏠 房东交涉/维修', defaultZh: '您好，浴室的热水器从昨晚开始漏水且无法正常加热，请尽快安排专业水工师傅上门检修，相关费用按租约由房东承担。' },
    { id: 'job', label: '💼 工作面试/薪资', defaultZh: '您好，请问贵店所提供的职位是否包含法定带薪年假及全额正规签工单？我的居留完全合法无限制。' },
  ];

  const handleTranslate = () => {
    // Dynamic scenario translation response
    if (scenario === 'hospital') {
      setTranslatedResult({
        primary: `Da ieri ho iniziato ad avvertire un forte dolore acuto al basso ventre destro accompagnato da una leggera febbre. Vorrei richiedere una visita al pronto soccorso, comprensiva di esami ematochimici ed ecografia addominale d'urgenza.`,
        tone: '医学精准急诊表述 (Linguaggio Clinico di Emergenza)',
        subtleMeaning: '准确描述“右下腹疼痛”与“轻微发热”，利于急诊护士按绿码/黄码快速分诊（疑似阑尾炎）。',
      });
    } else if (scenario === 'landlord') {
      setTranslatedResult({
        primary: `Gentile proprietario, le segnalo che da ieri sera lo scaldabagno del bagno perde acqua e non scalda regolarmente. La prego di provvedere con urgenza all'invio di un idraulico specializzato per la riparazione, le cui spese di manutenzione straordinaria competono alla proprietà.`,
        tone: '礼貌且具有法律效力的租客公函 (Comunicazione Formale di Locazione)',
        subtleMeaning: '明确引用了“紧急非消耗性维修由房东负担”的当地民法典租赁守则。',
      });
    } else {
      setTranslatedResult({
        primary: `Desidero comunicare all'Ufficio Immigrazione che il precedente rapporto di lavoro si è concluso regolarmente. Attualmente ho sottoscritto un nuovo contratto di assunzione con regolare Modello Unilav e trasmetto in allegato le relative buste paga a supporto della richiesta di rinnovo del permesso di soggiorno per motivi di lavoro subordinato.`,
        tone: '正式公文语体 (Linguaggio Amministrativo Formale)',
        subtleMeaning: '直接明确指出换工作为合法过渡，避免警察局质疑无收入来源而触发居留驳回机制。',
      });
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(translatedResult.primary);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-slate-900">AI 欧洲场景深度翻译官</h2>
            <span className="text-xs bg-blue-100 text-blue-800 font-semibold px-2 py-0.5 rounded-full border border-blue-200">
              非机械直译 · 场景深度适配
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            专为欧洲华人设计的官方办事公文、医院就诊、警局交涉与房东沟通专用多语言模型
          </p>
        </div>

        {/* Language switcher */}
        <div className="flex items-center gap-2 text-xs font-semibold">
          <select
            value={sourceLang}
            onChange={(e) => setSourceLang(e.target.value as any)}
            className="p-2 border border-slate-200 rounded-xl bg-slate-50 text-slate-800 font-sans"
          >
            <option value="zh">中文 (Chinese)</option>
            <option value="it">意大利语 (Italiano)</option>
            <option value="fr">法语 (Français)</option>
            <option value="es">西班牙语 (Español)</option>
            <option value="de">德语 (Deutsch)</option>
          </select>

          <ArrowRightLeft className="w-4 h-4 text-slate-400" />

          <select
            value={targetLang}
            onChange={(e) => setTargetLang(e.target.value as any)}
            className="p-2 border border-slate-200 rounded-xl bg-slate-50 text-slate-800 font-sans"
          >
            <option value="it">意大利语 (Italiano)</option>
            <option value="fr">法语 (Français)</option>
            <option value="es">西班牙语 (Español)</option>
            <option value="de">德语 (Deutsch)</option>
            <option value="zh">中文 (Chinese)</option>
          </select>
        </div>
      </div>

      {/* Scenario Presets Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider mr-1">
          办事场景:
        </span>
        {scenarioPresets.map((p) => (
          <button
            key={p.id}
            onClick={() => {
              setScenario(p.id);
              setInputText(p.defaultZh);
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
              scenario === p.id
                ? 'bg-blue-600 text-white shadow-xs'
                : 'bg-white border border-slate-200 hover:bg-slate-50 text-slate-700'
            }`}
          >
            {p.label}
          </button>
        ))}
      </div>

      {/* Translation Dual Box */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Source Box */}
        <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs flex flex-col justify-between h-72">
          <textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="请输入您想对政府官员、医生或房东表达的中文内容..."
            className="w-full flex-1 border-0 resize-none text-slate-900 text-sm focus:outline-none"
          />
          <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
            <span className="text-[11px] text-slate-400">{inputText.length} 字符</span>
            <button
              onClick={handleTranslate}
              className="px-4 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-xs transition-colors flex items-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>AI 深度翻译</span>
            </button>
          </div>
        </div>

        {/* Target Box with Nuance & Tone Analysis */}
        <div className="bg-slate-900 text-white rounded-2xl p-4 shadow-xs flex flex-col justify-between h-72 border border-slate-800">
          <div className="space-y-3 overflow-y-auto">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded border border-emerald-800">
                {translatedResult.tone}
              </span>
              <button
                onClick={handleCopy}
                className="flex items-center gap-1 text-[11px] text-slate-400 hover:text-white transition-colors"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? '已复制' : '复制译文'}</span>
              </button>
            </div>

            <div className="text-sm font-medium leading-relaxed font-sans text-slate-100">
              {translatedResult.primary}
            </div>

            {/* Subtle Meaning Note */}
            <div className="text-xs bg-slate-950 rounded-xl p-3 text-slate-300 border border-slate-800">
              <span className="font-bold text-blue-400">💡 当地文化与法律语境解读: </span>
              {translatedResult.subtleMeaning}
            </div>
          </div>

          <div className="pt-2 border-t border-slate-800 text-[11px] text-slate-400 flex items-center justify-between">
            <span>支持复制直接发送 WhatsApp 或 Email</span>
          </div>
        </div>
      </div>
    </div>
  );
};
