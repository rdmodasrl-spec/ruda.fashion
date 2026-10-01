import React from 'react';
import { ListingItem, GeoCity } from '../types';
import { Store, ShieldCheck, TrendingUp, Sparkles, Building, MapPin, CheckCircle } from 'lucide-react';

interface StoreTransfersViewProps {
  transfers: ListingItem[];
  currentCity: GeoCity;
  onAskAi: (prompt: string) => void;
}

export const StoreTransfersView: React.FC<StoreTransfersViewProps> = ({
  transfers,
  currentCity,
  onAskAi,
}) => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-slate-900">欧洲华人商业与店铺买卖平台</h2>
            <span className="text-xs bg-blue-50 text-blue-800 font-semibold px-2 py-0.5 rounded-full border border-blue-200">
              实地报表查验
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            中餐馆转让、酒吧烟草店 (Tabacchi)、百货超市、服装加工厂 · AI 商业估值与买卖双方精准撮合
          </p>
        </div>

        <button
          onClick={() => onAskAi(`我想在${currentCity.nameZh}或周边盘一家中小型中餐馆或酒吧，预算在 15 万至 25 万欧以内，请帮我分析地段与回报周期`)}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-xs transition-colors"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>AI 商业投资寻店匹配</span>
        </button>
      </div>

      {/* Transfers Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {transfers.map((item) => (
          <div
            key={item.id}
            className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
          >
            <div>
              <div className="h-48 w-full bg-slate-100 relative overflow-hidden">
                <img
                  src={item.images[0]}
                  alt={item.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-3 left-3 bg-slate-900/80 backdrop-blur-xs text-white text-xs font-bold px-2.5 py-1 rounded-lg">
                  {item.cityName}
                </div>
                {item.badge && (
                  <div className="absolute top-3 right-3 bg-blue-600 text-white text-xs font-bold px-2.5 py-1 rounded-lg shadow-sm">
                    {item.badge}
                  </div>
                )}
                <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white">
                  <span className="text-2xl font-black text-white font-mono drop-shadow-md">
                    €{item.price.toLocaleString()}
                  </span>
                  <span className="text-xs bg-slate-900/80 px-2 py-0.5 rounded backdrop-blur-xs">转让费一次性</span>
                </div>
              </div>

              <div className="p-5 space-y-3">
                <h3 className="font-bold text-slate-900 text-base leading-snug">
                  {item.title}
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {item.description}
                </p>

                {/* Key commercial stats */}
                <div className="grid grid-cols-2 gap-2 text-xs bg-slate-50 p-3 rounded-xl border border-slate-100">
                  {item.meta?.monthlyRent && (
                    <div>
                      <span className="text-slate-400 text-[10px] uppercase">月租金:</span>
                      <div className="font-bold text-slate-800">{item.meta.monthlyRent}</div>
                    </div>
                  )}
                  {item.meta?.license && (
                    <div>
                      <span className="text-slate-400 text-[10px] uppercase">牌照资质:</span>
                      <div className="font-bold text-slate-800">{item.meta.license}</div>
                    </div>
                  )}
                  {item.meta?.seats && (
                    <div>
                      <span className="text-slate-400 text-[10px] uppercase">座位容量:</span>
                      <div className="font-bold text-slate-800">{item.meta.seats}</div>
                    </div>
                  )}
                  {item.meta?.avgDailyRevenue && (
                    <div>
                      <span className="text-slate-400 text-[10px] uppercase">日均营业额:</span>
                      <div className="font-bold text-emerald-600">{item.meta.avgDailyRevenue}</div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
              <span className="text-xs text-slate-500">店主直转 · 无高额佣金</span>
              <button
                onClick={() => onAskAi(`我想详细了解店铺转让【${item.title}】（转让费€${item.price}），请帮我分析该地段日均流水是否合理，并指导我签买卖承诺书 (Compromesso) 注意事项`)}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-xs transition-colors"
              >
                AI 协助尽调核账 / 预约看店
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
