import React, { useState } from 'react';
import { ListingItem, GeoCity } from '../types';
import { Briefcase, FileCheck, Sparkles, Building2, MapPin, CheckCircle, Send, FileText } from 'lucide-react';

interface JobsViewProps {
  jobs: ListingItem[];
  currentCity: GeoCity;
  onAskAi: (prompt: string) => void;
}

export const JobsView: React.FC<JobsViewProps> = ({
  jobs,
  currentCity,
  onAskAi,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [showResumeModal, setShowResumeModal] = useState(false);
  const [resumeData, setResumeData] = useState({
    name: '李伟',
    age: '28',
    skills: '中餐炒锅, 凉菜, 基本意大利语点餐',
    experienceYears: '4年',
    cityTarget: currentCity.nameZh,
  });

  const categories = [
    { id: 'all', label: '全部岗位' },
    { id: 'catering_kitchen', label: '餐饮厨师/跑堂' },
    { id: 'enterprise_trade', label: '外贸/文职/财务' },
    { id: 'logistics_driver', label: '物流司机/海外仓' },
  ];

  const filteredJobs = jobs.filter((j) => {
    if (selectedCategory !== 'all' && j.subCategory !== selectedCategory) return false;
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header and Banner */}
      <div className="bg-slate-900 rounded-2xl p-6 text-white border border-slate-800 shadow-lg flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-950 text-blue-300 border border-blue-800 text-xs font-semibold mb-2">
            <Sparkles className="w-3.5 h-3.5 text-blue-400" />
            <span>智能匹配 · 真实欧洲华人企业与餐馆直聘</span>
          </div>
          <h2 className="text-2xl font-bold tracking-tight">欧洲华人招聘与求职中心</h2>
          <p className="text-xs text-slate-300 mt-1 max-w-xl">
            涵盖全额签工单 (Buste Paga) 岗位、包吃住大厨企台、双语外贸文员及跨境物流司机。AI 自动润色简历并生成针对老板的应聘私信。
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowResumeModal(true)}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-md transition-all"
          >
            <FileText className="w-4 h-4" />
            <span>AI 生成标准求职信</span>
          </button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {categories.map((c) => (
          <button
            key={c.id}
            onClick={() => setSelectedCategory(c.id)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all whitespace-nowrap ${
              selectedCategory === c.id
                ? 'bg-blue-600 text-white shadow-xs'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            {c.label}
          </button>
        ))}
      </div>

      {/* Job Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredJobs.map((job) => (
          <div
            key={job.id}
            className="bg-white rounded-2xl border border-slate-200 p-5 hover:shadow-md transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between gap-2">
                <span className="text-[10px] font-bold uppercase tracking-wider bg-slate-100 text-slate-600 px-2 py-0.5 rounded">
                  {job.cityName}
                </span>
                <span className="text-base font-black text-emerald-600">
                  €{job.price} <span className="text-xs text-slate-400 font-normal">/月</span>
                </span>
              </div>

              <h3 className="font-bold text-slate-900 text-sm mt-2 leading-snug line-clamp-2">
                {job.title}
              </h3>

              <p className="text-xs text-slate-600 mt-2 line-clamp-3">
                {job.summary}
              </p>

              {/* Tags */}
              <div className="flex flex-wrap gap-1.5 mt-3">
                {job.tags.map((t, idx) => (
                  <span
                    key={idx}
                    className="text-[10px] font-medium bg-blue-50 text-blue-700 px-2 py-0.5 rounded"
                  >
                    {t}
                  </span>
                ))}
              </div>

              {/* Language and Perks */}
              {job.meta?.languageReq && (
                <div className="mt-3 text-[11px] text-slate-500 bg-slate-50 rounded-lg p-2 border border-slate-100">
                  <div className="font-semibold text-slate-700">语言要求: {job.meta.languageReq}</div>
                  {job.meta?.contractType && <div className="text-[10px] text-slate-400 mt-0.5">合同: {job.meta.contractType}</div>}
                </div>
              )}
            </div>

            <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
              <span className="text-slate-400 text-[11px]">联系人: {job.contact.name}</span>
              <button
                onClick={() => onAskAi(`我想应聘【${job.title}】（薪资€${job.price}/月），请根据我的情况帮我写一封地道诚恳的求职私信并准备面试常见问答`)}
                className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs shadow-xs transition-colors"
              >
                <Send className="w-3 h-3" />
                <span>AI 帮我投递</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* AI Resume Modal */}
      {showResumeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-base text-slate-900 flex items-center gap-2">
                <FileText className="w-5 h-5 text-blue-600" />
                <span>AI 中欧双语简历与求职信生成器</span>
              </h3>
              <button onClick={() => setShowResumeModal(false)} className="text-slate-400 hover:text-slate-600">✕</button>
            </div>

            <p className="text-xs text-slate-500">
              输入您的基本技能与经验，AI 自动翻译成意大利语/法语标准简历并生成 WhatsApp 打招呼话术。
            </p>

            <div className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700">您的姓名与年龄</label>
                <input
                  type="text"
                  value={`${resumeData.name}, ${resumeData.age}岁`}
                  onChange={(e) => setResumeData({ ...resumeData, name: e.target.value })}
                  className="w-full mt-1 p-2 border border-slate-200 rounded-lg"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700">意向工种与主要技能</label>
                <textarea
                  rows={2}
                  value={resumeData.skills}
                  onChange={(e) => setResumeData({ ...resumeData, skills: e.target.value })}
                  className="w-full mt-1 p-2 border border-slate-200 rounded-lg"
                />
              </div>
            </div>

            <div className="pt-2 flex justify-end gap-2">
              <button
                onClick={() => setShowResumeModal(false)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
              >
                取消
              </button>
              <button
                onClick={() => {
                  setShowResumeModal(false);
                  onAskAi(`请帮我把求职简历生成欧洲标准格式（中意双语）：姓名${resumeData.name}，年龄${resumeData.age}，专长${resumeData.skills}，目标城市${resumeData.cityTarget}，并附上发给老板的打招呼话术。`);
                }}
                className="px-4 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-sm"
              >
                一键生成并排版
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
