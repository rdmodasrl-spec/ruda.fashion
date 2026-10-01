import React, { useState } from 'react';
import { MOCK_GOV_PROCEDURES } from '../data/mockData';
import { Landmark, ShieldCheck, CheckCircle2, AlertTriangle, ExternalLink, Sparkles, BookOpen } from 'lucide-react';

interface GovernmentNavViewProps {
  onAskAi: (prompt: string) => void;
}

export const GovernmentNavView: React.FC<GovernmentNavViewProps> = ({ onAskAi }) => {
  const [selectedProcedure, setSelectedProcedure] = useState(MOCK_GOV_PROCEDURES[0]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-slate-900">欧洲华人政务办事与居留导航</h2>
            <span className="text-xs bg-emerald-100 text-emerald-800 font-semibold px-2 py-0.5 rounded-full">
              官方数据源对接
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            拒绝论坛谣言误导 · 严格标明官方内政部法规与递件标准 · 护航居留换发、税号与就医
          </p>
        </div>

        <button
          onClick={() => onAskAi('我的居留即将到期，请根据我的情况（国家/城市/居留类型）生成个性化的办事材料清单与时间表')}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-xs transition-colors"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>AI 个性化定制办事流程</span>
        </button>
      </div>

      {/* Procedure Selector */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {MOCK_GOV_PROCEDURES.map((p) => (
          <button
            key={p.id}
            onClick={() => setSelectedProcedure(p)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
              selectedProcedure.id === p.id
                ? 'bg-blue-600 text-white shadow-xs'
                : 'bg-white border border-slate-200 hover:bg-slate-50 text-slate-700'
            }`}
          >
            {p.title}
          </button>
        ))}
      </div>

      {/* Procedure Content Detail */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Steps List (2 cols) */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-5">
            <div className="border-b border-slate-100 pb-4">
              <span className="text-[10px] font-bold text-blue-600 uppercase tracking-wider bg-blue-50 px-2 py-0.5 rounded">
                适用对象: {selectedProcedure.targetGroup}
              </span>
              <h3 className="font-bold text-lg text-slate-900 mt-2">
                {selectedProcedure.title}
              </h3>
              <div className="flex items-center gap-2 text-xs text-slate-500 mt-1">
                <span>官方信源:</span>
                <span className="font-medium text-slate-700">{selectedProcedure.officialSource}</span>
                <a
                  href={selectedProcedure.officialSourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 flex items-center gap-0.5 hover:underline"
                >
                  <ExternalLink className="w-3 h-3" />
                  <span>官网直达</span>
                </a>
              </div>
            </div>

            {/* Stepper */}
            <div className="space-y-4">
              {selectedProcedure.steps.map((s) => (
                <div key={s.step} className="flex gap-4 group">
                  <div className="flex flex-col items-center">
                    <div className="w-8 h-8 rounded-full bg-blue-600 text-white font-bold text-xs flex items-center justify-center shadow-xs">
                      {s.step}
                    </div>
                    {s.step !== selectedProcedure.steps.length && (
                      <div className="w-0.5 flex-1 bg-slate-200 my-1" />
                    )}
                  </div>

                  <div className="flex-1 bg-slate-50 rounded-xl p-4 border border-slate-100 mb-2">
                    <div className="flex items-center justify-between">
                      <h4 className="font-bold text-xs sm:text-sm text-slate-900">
                        {s.title}
                      </h4>
                      {s.fees && (
                        <span className="text-[11px] font-mono font-bold text-slate-800 bg-slate-200 px-2 py-0.5 rounded">
                          {s.fees}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-600 mt-1">{s.description}</p>

                    {/* Required docs checklist */}
                    <div className="mt-3 pt-2 border-t border-slate-200/60">
                      <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                        必须准备的材料原件及复印件:
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {s.requiredDocs.map((doc, idx) => (
                          <span
                            key={idx}
                            className="text-[11px] bg-white text-slate-700 px-2.5 py-1 rounded-md border border-slate-200 font-medium"
                          >
                            ✓ {doc}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Tips & Strict Risks (1 col) */}
        <div className="space-y-4">
          {/* Critical Risk Warning Box */}
          <div className="bg-slate-900 text-white border border-slate-800 rounded-2xl p-5 shadow-xs space-y-3">
            <div className="flex items-center gap-2 text-white font-bold text-xs">
              <AlertTriangle className="w-4 h-4 text-slate-400 shrink-0" />
              <span>官方严正提醒与高频踩坑点 (Critical Risks)</span>
            </div>
            <div className="space-y-2 text-xs text-slate-300 leading-relaxed">
              {selectedProcedure.risks.map((risk, idx) => (
                <div key={idx} className="bg-slate-950 p-2.5 rounded-lg border border-slate-800">
                  {risk}
                </div>
              ))}
            </div>
          </div>

          {/* Practical Tips */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-3">
            <div className="flex items-center gap-2 text-slate-800 font-bold text-xs">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>合法权益保障建议</span>
            </div>
            <div className="space-y-2 text-xs text-slate-600 leading-relaxed">
              {selectedProcedure.tips.map((tip, idx) => (
                <div key={idx} className="flex items-start gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                  <span>{tip}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Trigger AI Follow up */}
          <button
            onClick={() => onAskAi(`我想办理【${selectedProcedure.title}】，请帮我审查我的材料是否齐全，并指导我每一步如何填写`)}
            className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-md transition-all flex items-center justify-center gap-2"
          >
            <Sparkles className="w-4 h-4 text-white" />
            <span>AI 管家一对一材料预审</span>
          </button>
        </div>
      </div>
    </div>
  );
};
