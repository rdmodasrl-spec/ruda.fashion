import React, { useState } from 'react';
import { MOCK_FORUM_THREADS } from '../data/mockData';
import { ForumThreadItem } from '../types';
import { MessageSquare, Sparkles, AlertCircle, Eye, ThumbsUp, Clock, Bot, CheckCircle } from 'lucide-react';

interface ForumKnowledgeViewProps {
  onAskAi: (prompt: string) => void;
}

export const ForumKnowledgeView: React.FC<ForumKnowledgeViewProps> = ({ onAskAi }) => {
  const [threads] = useState<ForumThreadItem[]>(MOCK_FORUM_THREADS);
  const [selectedThread, setSelectedThread] = useState<ForumThreadItem>(MOCK_FORUM_THREADS[0]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-slate-900">欧洲华人社区论坛与 AI 知识库</h2>
            <span className="text-xs bg-blue-100 text-blue-800 font-semibold px-2 py-0.5 rounded-full border border-blue-200">
              千万级历史讨论活化
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            不再需要逐页爬几百楼 · AI 自动提炼办卡实战要点 · 严格区分官方政策 vs 网友经验
          </p>
        </div>

        <button
          onClick={() => onAskAi('我想在华人知识库中搜索关于：意大利按手印催卡、转长期居留最新要求，请帮我综合官方和社区经验汇总回答')}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-xs transition-colors"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>AI 搜索全网华人经验库</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Thread List (1 col) */}
        <div className="space-y-3">
          <div className="text-xs font-bold text-slate-400 uppercase tracking-wider px-1">
            热门历史经验专题:
          </div>
          {threads.map((t) => (
            <div
              key={t.id}
              onClick={() => setSelectedThread(t)}
              className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                selectedThread.id === t.id
                  ? 'bg-blue-50/70 border-blue-300 ring-2 ring-blue-100 shadow-xs'
                  : 'bg-white border-slate-200 hover:bg-slate-50'
              }`}
            >
              <div className="flex items-center justify-between text-[11px] text-slate-400 mb-1">
                <span>{t.cityName} · {t.author}</span>
                <span>{t.createdAt}</span>
              </div>
              <h4 className="font-bold text-xs sm:text-sm text-slate-900 line-clamp-2 leading-snug">
                {t.title}
              </h4>
              <div className="flex items-center gap-3 mt-3 text-[11px] text-slate-500">
                <span className="flex items-center gap-1">
                  <MessageSquare className="w-3 h-3 text-blue-600" />
                  <span>{t.replyCount} 回复</span>
                </span>
                <span className="flex items-center gap-1">
                  <Eye className="w-3 h-3" />
                  <span>{t.viewCount} 浏览</span>
                </span>
                <span className="text-[10px] text-blue-700 bg-blue-100 px-1.5 py-0.2 rounded font-semibold ml-auto border border-blue-200">
                  AI 已总结
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Selected Thread Detail with AI 100-Reply Summary (2 cols) */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-5">
            {/* Thread Header */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-[10px] font-bold uppercase bg-blue-100 text-blue-800 px-2 py-0.5 rounded">
                  {selectedThread.cityName}
                </span>
                <span className="text-xs text-slate-500">作者：{selectedThread.author} ({selectedThread.authorBadge})</span>
              </div>
              <h3 className="font-bold text-lg text-slate-900 leading-snug">
                {selectedThread.title}
              </h3>
              <p className="text-xs text-slate-600 mt-2 bg-slate-50 p-3 rounded-xl border border-slate-100">
                {selectedThread.content}
              </p>
            </div>

            {/* AI 100-Reply Executive Summary Card */}
            <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200 shadow-xs space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
                  <Bot className="w-4 h-4 text-blue-600" />
                  <span>AI 自动总结 · {selectedThread.replyCount} 楼回帖核心要点</span>
                </div>
                <span className="text-[10px] text-blue-800 bg-blue-100 font-semibold px-2 py-0.5 rounded-full border border-blue-200">
                  无需爬楼 · 3秒速览
                </span>
              </div>

              <p className="text-xs text-slate-800 font-medium leading-relaxed">
                {selectedThread.aiSummary.overview}
              </p>

              {/* 3 Main Points */}
              <div className="space-y-2">
                <div className="text-[11px] font-bold text-slate-700 uppercase tracking-wider">
                  论坛高赞回复经验提炼:
                </div>
                <div className="space-y-1.5">
                  {selectedThread.aiSummary.mainPoints.map((pt, idx) => (
                    <div key={idx} className="flex items-start gap-2 bg-white p-2.5 rounded-xl border border-slate-200 text-xs text-slate-800">
                      <span className="w-4 h-4 rounded-full bg-blue-100 text-blue-800 text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5 border border-blue-200">
                        {idx + 1}
                      </span>
                      <span>{pt}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Strict Official Policy Separation */}
              <div className="bg-white rounded-xl p-3.5 border border-blue-200 space-y-1">
                <div className="flex items-center gap-1.5 text-blue-900 font-bold text-xs">
                  <CheckCircle className="w-3.5 h-3.5 text-blue-600" />
                  <span>【官方权威法规要求】:</span>
                </div>
                <p className="text-xs text-slate-700 leading-relaxed pl-5">
                  {selectedThread.aiSummary.officialPolicyNotice}
                </p>
              </div>

              {/* Community Consensus */}
              <div className="bg-white rounded-xl p-3.5 border border-slate-200 space-y-1">
                <div className="flex items-center gap-1.5 text-slate-900 font-bold text-xs">
                  <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                  <span>【华人社区共识建议】:</span>
                </div>
                <p className="text-xs text-slate-700 leading-relaxed pl-5">
                  {selectedThread.aiSummary.communityConsensus}
                </p>
              </div>
            </div>

            {/* Bottom Interaction */}
            <div className="pt-2 flex items-center justify-between">
              <span className="text-xs text-slate-400">已自动过滤违规小广告与无效灌水 98.4%</span>
              <button
                onClick={() => onAskAi(`针对论坛话题【${selectedThread.title}】，我想结合我自身的个人情况做进一步咨询，请帮我分析`)}
                className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-xs transition-colors"
              >
                针对该话题向 AI 追问
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
