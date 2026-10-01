import React from 'react';
import { X, UserCheck, Calendar, Clock, Bookmark, ShieldCheck, Download, Trash2, CheckCircle2 } from 'lucide-react';
import { GeoCity } from '../types';

interface UserDossierModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentCity: GeoCity;
  dossierItems: any[];
}

export const UserDossierModal: React.FC<UserDossierModalProps> = ({
  isOpen,
  onClose,
  currentCity,
  dossierItems,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-8">
        {/* Header */}
        <div className="bg-slate-900 text-white p-6 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-white">
              <UserCheck className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-lg">我的欧洲生活档案 (My Europe Dossier)</h3>
              <p className="text-xs text-slate-400">常驻城市：{currentCity.nameZh} · 本地数据端到端加密保护</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white p-1 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 max-h-[70vh] overflow-y-auto space-y-6">
          {/* Key Reminders Card */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Residency Expiry */}
            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 space-y-2">
              <div className="flex items-center justify-between text-xs text-slate-800 font-bold">
                <span className="flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-blue-600" />
                  <span>居留到期提醒</span>
                </span>
                <span className="bg-slate-200 text-slate-700 px-2 py-0.5 rounded text-[10px]">有效</span>
              </div>
              <div className="text-xl font-black text-slate-900 font-mono">2026-12-18</div>
              <p className="text-[11px] text-slate-600">
                剩余 <strong>78</strong> 天。AI 管家将在到期前 60 天（10月18日）提醒您领取邮局大信封并准备签工单。
              </p>
            </div>

            {/* Tax Filing Date */}
            <div className="bg-blue-50 rounded-2xl p-4 border border-blue-200 space-y-2">
              <div className="flex items-center justify-between text-xs text-blue-800 font-bold">
                <span className="flex items-center gap-1.5">
                  <Calendar className="w-4 h-4 text-blue-600" />
                  <span>年度税务申报日历</span>
                </span>
                <span className="bg-blue-200 px-2 py-0.5 rounded text-[10px]">待办</span>
              </div>
              <div className="text-xl font-black text-blue-900 font-mono">2026-11-30</div>
              <p className="text-[11px] text-blue-800/80">
                个人所得税 (Modello Redditi) 线上截止日。已为您对接华龙会计师事务所。
              </p>
            </div>
          </div>

          {/* Saved Agent Tasks */}
          <div className="space-y-3">
            <h4 className="font-bold text-sm text-slate-800 flex items-center gap-2">
              <Bookmark className="w-4 h-4 text-blue-600" />
              <span>由 AI 管家执行并归档的事务 ({dossierItems.length} 项)</span>
            </h4>

            {dossierItems.length === 0 ? (
              <div className="text-center py-8 text-xs text-slate-400 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                暂无归档事务。在首页向 AI 提问并点击“保存至欧洲生活档案”即可在这里统一管理。
              </div>
            ) : (
              <div className="space-y-2">
                {dossierItems.map((item, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 text-xs flex items-center justify-between"
                  >
                    <div>
                      <div className="font-bold text-slate-800">{item.title}</div>
                      <div className="text-[11px] text-slate-500 mt-0.5">
                        {item.city} · 记录时间: {item.date} · {item.notes}
                      </div>
                    </div>
                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">
                      跟进中
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Privacy & Data Ownership Statement */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs text-slate-500 space-y-1">
            <div className="font-bold text-slate-700 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>隐私最小化与数据删除保障</span>
            </div>
            <p className="text-[11px] leading-relaxed">
              您的证件信息、居留日期和咨询记录受欧盟 GDPR 严格保护，绝不对第三方公开。您可以随时一键导出数据或注销删除。
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-slate-50 border-t border-slate-200 p-4 flex items-center justify-between">
          <button
            onClick={() => alert('已将您的欧洲生活档案导出为 JSON 备份。')}
            className="flex items-center gap-1.5 text-xs text-slate-600 hover:text-blue-600 font-semibold transition-colors"
          >
            <Download className="w-4 h-4" />
            <span>导出生活档案</span>
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-xs transition-colors"
          >
            完成
          </button>
        </div>
      </div>
    </div>
  );
};
