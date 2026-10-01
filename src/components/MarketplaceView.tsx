import React, { useState } from 'react';
import { ListingItem, GeoCity } from '../types';
import { ShoppingBag, Camera, ShieldCheck, AlertTriangle, Sparkles, Tag, CheckCircle2 } from 'lucide-react';

interface MarketplaceViewProps {
  items: ListingItem[];
  currentCity: GeoCity;
  onAskAi: (prompt: string) => void;
}

export const MarketplaceView: React.FC<MarketplaceViewProps> = ({
  items,
  currentCity,
  onAskAi,
}) => {
  const [showAiPublishModal, setShowAiPublishModal] = useState(false);
  const [photoRecognized, setPhotoRecognized] = useState(false);

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="bg-gradient-to-r from-emerald-600 via-teal-700 to-slate-900 rounded-2xl p-6 text-white shadow-lg flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/10 text-emerald-200 text-xs font-semibold mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI 视觉估价 · 杜绝假货与钓鱼诈骗</span>
          </div>
          <h2 className="text-2xl font-bold tracking-tight">欧洲华人跳蚤二手智能市场</h2>
          <p className="text-xs text-emerald-100 mt-1 max-w-xl">
            拍照 1 秒识别数码、家具、家电与汽车 · AI 自动起草中意双语标题、推荐公道价格并生成防骗提示。
          </p>
        </div>

        <button
          onClick={() => setShowAiPublishModal(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white text-slate-900 font-bold text-xs shadow-md hover:bg-slate-100 transition-all"
        >
          <Camera className="w-4 h-4 text-emerald-600" />
          <span>拍一张，AI 帮我自动发布</span>
        </button>
      </div>

      {/* Grid of items */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {items.map((item) => (
          <div
            key={item.id}
            className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
          >
            <div>
              <div className="h-48 w-full bg-slate-100 relative overflow-hidden">
                <img
                  src={item.images[0]}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-2 left-2 bg-slate-900/80 backdrop-blur-xs text-white text-[10px] font-bold px-2 py-0.5 rounded">
                  {item.cityName}
                </div>
                <div className="absolute bottom-2 right-2 bg-emerald-600 text-white text-xs font-black px-2.5 py-1 rounded-lg shadow-sm">
                  €{item.price}
                </div>
              </div>

              <div className="p-4 space-y-2">
                <h3 className="font-bold text-slate-900 text-sm line-clamp-2 leading-snug">
                  {item.title}
                </h3>
                <p className="text-xs text-slate-600 line-clamp-2">
                  {item.summary}
                </p>

                <div className="flex flex-wrap gap-1.5 pt-1">
                  {item.tags.map((t, idx) => (
                    <span
                      key={idx}
                      className="text-[10px] font-medium bg-slate-100 text-slate-700 px-2 py-0.5 rounded"
                    >
                      {t}
                    </span>
                  ))}
                  {item.meta?.condition && (
                    <span className="text-[10px] font-medium bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded">
                      {item.meta.condition}
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div className="p-4 pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
              <span className="text-slate-400 text-[11px]">信任分: {item.trustScore} (已实名)</span>
              <button
                onClick={() => onAskAi(`我想买这个二手商品【${item.title}】（价格€${item.price}），请帮我核验成色并生成沟通打折话术`)}
                className="px-3 py-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-semibold text-xs transition-colors"
              >
                AI 帮我砍价/联系
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* AI Auto-Publish Modal Simulation */}
      {showAiPublishModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-base text-slate-900 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-emerald-600" />
                <span>AI 拍图识物 · 自动生成商品页面</span>
              </h3>
              <button onClick={() => setShowAiPublishModal(false)} className="text-slate-400 hover:text-slate-600">✕</button>
            </div>

            <div className="border-2 border-dashed border-slate-300 rounded-xl p-6 text-center bg-slate-50">
              <Camera className="w-10 h-10 text-emerald-600 mx-auto mb-2" />
              <div className="text-xs font-bold text-slate-700">上传或拍摄二手商品图片</div>
              <p className="text-[11px] text-slate-400 mt-1">AI 将自动识别品牌型号、成色并推算当前二手市场公道售价</p>
              <button
                onClick={() => setPhotoRecognized(true)}
                className="mt-3 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold"
              >
                演示识别 iPhone 15 Pro
              </button>
            </div>

            {photoRecognized && (
              <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 text-xs space-y-2">
                <div className="font-bold text-emerald-900 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>AI 识别成功！已生成发布草稿:</span>
                </div>
                <div className="text-slate-700"><strong>拟定标题:</strong> Apple iPhone 15 Pro Max 256GB 原色钛金属 99新</div>
                <div className="text-slate-700"><strong>建议售价区间:</strong> €750 - €820 (米兰均价 €780)</div>
                <div className="text-slate-700"><strong>防诈提示:</strong> 严禁提前要求买家网银汇款，建议相约华人街或地铁站当面验机。</div>
              </div>
            )}

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setShowAiPublishModal(false)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
              >
                取消
              </button>
              <button
                onClick={() => {
                  setShowAiPublishModal(false);
                  onAskAi(`请帮我发布这个二手物品：iPhone 15 Pro 256GB，99新，米兰自取，标价€780，并生成中意双语买家问答模版。`);
                }}
                className="px-4 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-sm"
              >
                确认并发布至平台
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
