import React, { useState } from 'react';
import { ListingItem, GeoCity } from '../types';
import { Home, ShieldCheck, MapPin, Calculator, Phone, MessageSquare, Check, Sparkles, AlertCircle } from 'lucide-react';

interface HousingViewProps {
  listings: ListingItem[];
  currentCity: GeoCity;
  onSelectListing: (listing: ListingItem) => void;
  onAskAi: (prompt: string) => void;
}

export const HousingView: React.FC<HousingViewProps> = ({
  listings,
  currentCity,
  onSelectListing,
  onAskAi,
}) => {
  const [selectedListingForCalc, setSelectedListingForCalc] = useState<ListingItem | null>(listings[0] || null);
  const [filterResidenza, setFilterResidenza] = useState(false);

  const filteredListings = listings.filter((l) => {
    if (filterResidenza && !l.meta?.canRegisterResidenza) return false;
    return true;
  });

  // Calculate upfront cost
  const rent = selectedListingForCalc?.price || 1350;
  const deposit = rent * (selectedListingForCalc?.meta?.depositMonths || 3);
  const condoFees = selectedListingForCalc?.meta?.condoFeesPerMonth || 120;
  const utilities = selectedListingForCalc?.meta?.estimatedUtilities || 100;
  const totalUpfront = rent + deposit + condoFees + utilities;

  return (
    <div className="space-y-6">
      {/* Header and Smart AI Filter */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-slate-900">欧洲华人房产与租房平台</h2>
            <span className="text-xs bg-blue-100 text-blue-800 font-semibold px-2 py-0.5 rounded-full">
              当前地区: {currentCity.nameZh}
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            房东直租与金牌华人中介 · 支持 Residenza 户籍登记 · 真实性核查与首期资金测算
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setFilterResidenza(!filterResidenza)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
              filterResidenza
                ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
                : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
            }`}
          >
            {filterResidenza ? '✓ 仅看可登Residenza户籍' : '过滤：必须可登户籍'}
          </button>
          <button
            onClick={() => onAskAi(`我想在${currentCity.nameZh}找房，两室一厅，预算1200欧，要离地铁近，能登户籍`)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-xs transition-all"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI 一键寻房</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Listings List (Left 2 cols) */}
        <div className="lg:col-span-2 space-y-4">
          {filteredListings.map((item) => (
            <div
              key={item.id}
              onClick={() => setSelectedListingForCalc(item)}
              className={`bg-white rounded-2xl border transition-all overflow-hidden cursor-pointer hover:shadow-md ${
                selectedListingForCalc?.id === item.id
                  ? 'border-blue-500 ring-2 ring-blue-100 shadow-md'
                  : 'border-slate-200'
              }`}
            >
              <div className="flex flex-col sm:flex-row">
                {/* Thumbnail */}
                <div className="sm:w-56 h-48 sm:h-auto relative overflow-hidden bg-slate-100 shrink-0">
                  <img
                    src={item.images[0]}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-2 left-2">
                    <span className="text-[10px] font-bold bg-slate-900/80 backdrop-blur-xs text-white px-2 py-0.5 rounded-md">
                      {item.cityName}
                    </span>
                  </div>
                  {item.badge && (
                    <div className="absolute bottom-2 left-2">
                      <span className="text-[10px] font-semibold bg-emerald-600/90 text-white px-2 py-0.5 rounded-md">
                        {item.badge}
                      </span>
                    </div>
                  )}
                </div>

                {/* Details */}
                <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="font-bold text-slate-900 text-sm sm:text-base leading-snug hover:text-blue-600">
                        {item.title}
                      </h3>
                      <div className="text-right shrink-0">
                        <span className="text-lg font-black text-blue-600">€{item.price}</span>
                        <span className="text-xs text-slate-400">/{item.period === 'month' ? '月' : '次'}</span>
                      </div>
                    </div>

                    <p className="text-xs text-slate-600 mt-2 line-clamp-2">{item.summary}</p>

                    {/* Metadata tags */}
                    <div className="flex flex-wrap items-center gap-1.5 mt-3">
                      {item.tags.map((t, idx) => (
                        <span
                          key={idx}
                          className="text-[11px] font-medium bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md"
                        >
                          {t}
                        </span>
                      ))}
                      {item.meta?.areaSqM && (
                        <span className="text-[11px] font-medium bg-blue-50 text-blue-700 px-2 py-0.5 rounded-md">
                          📐 {item.meta.areaSqM} ㎡
                        </span>
                      )}
                      {item.meta?.canRegisterResidenza && (
                        <span className="text-[11px] font-medium bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-md">
                          ✓ 可登Residenza
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-1.5 text-slate-500">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" />
                      <span className="truncate max-w-[200px]">{item.address}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-slate-400 text-[11px]">信任分: {item.trustScore}</span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onAskAi(`帮我分析这套位于${item.cityName}的房源是否靠谱：${item.title}，租金€${item.price}，并帮我联系房东${item.contact.name}`);
                        }}
                        className="px-2.5 py-1 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 font-semibold text-xs transition-colors"
                      >
                        AI 智能跟进
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* AI Upfront Budget Breakdown Calculator (Right 1 col) */}
        <div className="space-y-4">
          <div className="bg-slate-900 text-white p-5 rounded-2xl shadow-lg border border-slate-800">
            <div className="flex items-center gap-2 text-blue-400 font-bold text-sm mb-1">
              <Calculator className="w-4 h-4" />
              <span>AI 房源首期资金预算分析</span>
            </div>
            <p className="text-xs text-slate-300">
              精准测算入住第一笔总资金，杜绝隐形开销与合同纠纷
            </p>

            {selectedListingForCalc ? (
              <div className="mt-4 space-y-3">
                <div className="bg-slate-950 rounded-xl p-3 text-xs text-slate-200 border border-slate-800">
                  <div className="font-bold text-white truncate">{selectedListingForCalc.title}</div>
                  <div className="text-[11px] text-slate-400 mt-0.5">基准月租金：€{selectedListingForCalc.price} / 月</div>
                </div>

                <div className="space-y-2 text-xs divide-y divide-slate-800 pt-1">
                  <div className="flex justify-between py-1 text-slate-300">
                    <span>首月租金 (First Month Rent):</span>
                    <span className="font-mono font-bold text-white">€{rent}</span>
                  </div>
                  <div className="flex justify-between py-1 text-slate-300">
                    <span>押金 ({selectedListingForCalc.meta?.depositMonths || 3} 个月 Deposito):</span>
                    <span className="font-mono font-bold text-white">€{deposit}</span>
                  </div>
                  <div className="flex justify-between py-1 text-slate-300">
                    <span>预估物业管理费 (Spese Condominiali):</span>
                    <span className="font-mono font-bold text-white">€{condoFees}</span>
                  </div>
                  <div className="flex justify-between py-1 text-slate-300">
                    <span>能耗预估 (水电气网 Bollette):</span>
                    <span className="font-mono font-bold text-white">€{utilities}</span>
                  </div>
                </div>

                {/* Total Upfront */}
                <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
                  <span className="font-bold text-sm text-slate-200">预计入住首笔总备用金:</span>
                  <span className="font-black text-xl text-emerald-400 font-mono">≈ €{totalUpfront}</span>
                </div>

                <div className="mt-3 bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-[11px] text-slate-300 flex items-start gap-1.5">
                  <AlertCircle className="w-4 h-4 shrink-0 text-blue-400 mt-0.5" />
                  <span>提示：退房时只要房屋无损毁，押金 €{deposit} 将全额原路退还并按意国法律计算法定利息。</span>
                </div>

                {/* Contact Landlord Button */}
                <div className="pt-2">
                  <button
                    onClick={() => onAskAi(`帮我给房东【${selectedListingForCalc.contact.name}】起草一份看房预约私信，房源是：${selectedListingForCalc.title}`)}
                    className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-md transition-all flex items-center justify-center gap-1.5"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>AI 自动起草看房预约信</span>
                  </button>
                </div>
              </div>
            ) : (
              <p className="text-xs text-slate-400 mt-4">请从左侧选择房源以查看首期测算</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
