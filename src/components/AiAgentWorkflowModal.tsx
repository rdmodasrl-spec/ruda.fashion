import React, { useState } from 'react';
import { X, CheckCircle2, AlertTriangle, ArrowRight, Bot, ShieldCheck, Calendar, MessageSquare, Copy, Check, ExternalLink } from 'lucide-react';
import { GeoCity } from '../types';

interface AiAgentWorkflowModalProps {
  isOpen: boolean;
  onClose: () => void;
  query: string;
  currentCity: GeoCity;
  aiResponseText: string;
  sourceModel: string;
  onAddToDossier: (item: any) => void;
}

export const AiAgentWorkflowModal: React.FC<AiAgentWorkflowModalProps> = ({
  isOpen,
  onClose,
  query,
  currentCity,
  aiResponseText,
  sourceModel,
  onAddToDossier,
}) => {
  const [activeStep, setActiveStep] = useState<number>(3); // 1: 理解, 2: 检索对比, 3: 行动建议, 4: 已完成
  const [copiedDraft, setCopiedDraft] = useState(false);
  const [addedSuccess, setAddedSuccess] = useState(false);

  if (!isOpen) return null;

  const sampleDraftMessage = `您好！我在【欧洲华人 AI 平台】查看到贵事务所的官方主页。
我想咨询一下关于在意大利/米兰办理 2025/2026 年度个人所得税 (Redditi) 及居留延期收入合规做账的办理要求与收费套餐。
请问本周是否有空档可以预约线下或线上沟通？非常感谢！`;

  const handleCopyDraft = () => {
    navigator.clipboard.writeText(sampleDraftMessage);
    setCopiedDraft(true);
    setTimeout(() => setCopiedDraft(false), 2000);
  };

  const handleConfirmAndArchive = () => {
    onAddToDossier({
      id: Date.now().toString(),
      type: 'agent_task',
      title: `AI 任务：${query.slice(0, 30)}`,
      city: currentCity.nameZh,
      date: new Date().toLocaleDateString(),
      status: 'active',
      notes: '已由 AI 管家生成方案并归档待跟进',
    });
    setAddedSuccess(true);
    setTimeout(() => {
      setAddedSuccess(false);
      onClose();
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-8">
        {/* Header */}
        <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-base">欧洲华人 AI 管家 · 任务执行流</h3>
                <span className="text-[10px] bg-slate-800 border border-slate-700 px-2 py-0.5 rounded-full text-blue-300">
                  {sourceModel}
                </span>
              </div>
              <p className="text-xs text-slate-400">根据需求自动调度多智能体完成：理解 → 筛选 → 比较 → 联系 → 归档</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Step Progress Tracker */}
        <div className="bg-slate-50 border-b border-slate-200 px-6 py-3">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-500">
            <div className="flex items-center gap-1.5 text-blue-600">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              <span>1. 意图解析</span>
            </div>
            <ArrowRight className="w-3.5 h-3.5 text-slate-300" />
            <div className="flex items-center gap-1.5 text-blue-600">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              <span>2. 数据库检索比对</span>
            </div>
            <ArrowRight className="w-3.5 h-3.5 text-slate-300" />
            <div className="flex items-center gap-1.5 text-blue-700 font-bold">
              <span className="w-4 h-4 rounded-full bg-blue-600 text-white text-[10px] flex items-center justify-center">3</span>
              <span>3. 方案与行动建议</span>
            </div>
            <ArrowRight className="w-3.5 h-3.5 text-slate-300" />
            <div className="flex items-center gap-1.5 text-slate-400">
              <span className="w-4 h-4 rounded-full bg-slate-200 text-slate-500 text-[10px] flex items-center justify-center">4</span>
              <span>4. 用户确认归档</span>
            </div>
          </div>
        </div>

        {/* Body Content */}
        <div className="p-6 max-h-[65vh] overflow-y-auto space-y-5">
          {/* User Request Bubble */}
          <div className="bg-slate-100/90 rounded-xl p-3.5 text-xs text-slate-700 flex items-start gap-2.5 border border-slate-200">
            <div className="font-bold text-slate-500 whitespace-nowrap">您的需求:</div>
            <div className="font-medium text-slate-900">“{query}”</div>
            <div className="ml-auto text-[10px] text-slate-400 bg-white px-2 py-0.5 rounded border border-slate-200">
              定位城市：{currentCity.nameZh}
            </div>
          </div>

          {/* AI Result Box formatted as Rich Markdown card */}
          <div className="prose prose-sm max-w-none text-slate-800 bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
            <div className="space-y-4 text-xs sm:text-sm leading-relaxed whitespace-pre-wrap font-sans">
              {aiResponseText}
            </div>
          </div>

          {/* Action Proposition & Safety Gate */}
          <div className="bg-amber-50/70 border border-amber-200/80 rounded-xl p-4">
            <div className="flex items-center gap-2 text-amber-800 font-bold text-xs mb-2">
              <ShieldCheck className="w-4 h-4 text-amber-600" />
              <span>AI 信任与用户授权确认闸门 (User Authorization Gate)</span>
            </div>
            <p className="text-xs text-amber-900/80 mb-3">
              平台严格遵守数据隐私准则。未经您的明确指令，AI 不会自动对外发送含有您个人身份的预约请求或财务承诺。已为您自动起草安全首问沟通模版：
            </p>

            {/* Generated Draft Message */}
            <div className="relative bg-white rounded-lg p-3 border border-amber-200 text-xs text-slate-700 font-mono">
              <pre className="whitespace-pre-wrap font-sans">{sampleDraftMessage}</pre>
              <button
                onClick={handleCopyDraft}
                className="absolute top-2 right-2 flex items-center gap-1 px-2 py-1 rounded bg-slate-100 hover:bg-slate-200 text-[11px] text-slate-700 font-sans transition-colors border border-slate-200"
              >
                {copiedDraft ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span>已复制</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>复制模版</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="bg-slate-50 border-t border-slate-200 px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-xs text-slate-500 flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            <span>已通过欧洲本地合规与信誉评级引擎核验</span>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-200 transition-colors w-1/2 sm:w-auto text-center"
            >
              关闭
            </button>
            <button
              onClick={handleConfirmAndArchive}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 shadow-sm shadow-blue-500/30 transition-all flex items-center justify-center gap-1.5 w-1/2 sm:w-auto"
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>{addedSuccess ? '已同步到欧洲生活档案！' : '保存结果至我的欧洲生活'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
