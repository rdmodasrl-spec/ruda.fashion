import React, { useState } from 'react';
import { GeoCity } from '../types';
import { MapPin, Navigation, Phone, Sparkles, Filter, Store, Home, Briefcase, Stethoscope, Scale, Truck } from 'lucide-react';

interface EuropeChineseMapProps {
  currentCity: GeoCity;
  onAskAi: (prompt: string) => void;
}

export const EuropeChineseMap: React.FC<EuropeChineseMapProps> = ({
  currentCity,
  onAskAi,
}) => {
  const [selectedFilter, setSelectedFilter] = useState<string>('all');
  const [activePin, setActivePin] = useState<any | null>(null);

  // Map markers for European cities
  const mapPins: Record<string, any[]> = {
    milan: [
      { id: 'm-1', name: '米兰华龙联合会计师事务所', cat: 'accountant', icon: '🔵', x: 42, y: 38, address: 'Via Paolo Sarpi 42 (华人街)', phone: '+39 02 3493 8810', tag: '税务做账' },
      { id: 'm-2', name: '米兰健民全科诊所与牙科', cat: 'clinic', icon: '🔴', x: 46, y: 44, address: 'Via Bramante 18', phone: '+39 02 3122 4500', tag: '中文看诊' },
      { id: 'm-3', name: '米兰华人街精品两居室 (招租)', cat: 'housing', icon: '🏠', x: 40, y: 34, address: 'Via Paolo Sarpi 12', price: '€1,350/月', tag: '可登居留' },
      { id: 'm-4', name: 'Duomo中餐融合餐厅 (招炒锅大厨)', cat: 'job', icon: '💼', x: 55, y: 62, address: 'San Babila 商圈', salary: '€2,500/月', tag: '包吃住' },
      { id: 'm-5', name: '米兰捷达汽车修理厂 (华人师傅)', cat: 'repair', icon: '🔧', x: 30, y: 68, address: 'Via Lorenteggio 120', phone: '+39 339 123 4567', tag: '年检车修' },
      { id: 'm-6', name: '中意特快专线海外仓', cat: 'logistics', icon: '📦', x: 68, y: 25, address: 'Sesto San Giovanni', phone: '+39 02 8900 1200', tag: '回国快递' },
    ],
    paris: [
      { id: 'p-1', name: '巴黎欧华法律税务咨询', cat: 'lawyer', icon: '🟣', x: 58, y: 68, address: 'Avenue de Choisy (13区)', phone: '+33 1 45 88 90 20', tag: '居留上诉' },
      { id: 'p-2', name: '巴黎13区阳光公寓 (招租)', cat: 'housing', icon: '🏠', x: 62, y: 72, address: 'Avenue d Ivry', price: '€1,450/月', tag: '可申CAF' },
      { id: 'p-3', name: '小巴黎带酒牌中餐馆 (诚意出让)', cat: 'transfer', icon: '🏬', x: 50, y: 45, address: 'Rue de la Roquette', price: '€180,000', tag: 'IV级酒牌' },
      { id: 'p-4', name: '欧洲申根中医药堂', cat: 'clinic', icon: '🔴', x: 54, y: 60, address: 'Boulevard Masséna', phone: '+33 1 42 12 34 56', tag: '针灸推拿' },
    ],
    prato: [
      { id: 'pr-1', name: '普拉托Macrolotto华人外贸产业园', cat: 'job', icon: '💼', x: 45, y: 50, address: 'Via dei Fossi', salary: '€1,950/月', tag: '外贸单证' },
      { id: 'pr-2', name: '普拉托金牌会计税务咨询', cat: 'accountant', icon: '🔵', x: 50, y: 42, address: 'Via Pistoiese 88', phone: '+39 0574 612800', tag: '商户做账' },
    ],
  };

  const currentPins = (mapPins[currentCity.id] || mapPins.milan).filter((p) => {
    if (selectedFilter !== 'all' && p.cat !== selectedFilter) return false;
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-slate-900">欧洲华人全景生活地图</h2>
            <span className="text-xs bg-blue-100 text-blue-800 font-semibold px-2 py-0.5 rounded-full">
              {currentCity.countryName} · {currentCity.nameZh} ({currentCity.nameLocal})
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            一键检索周边 5km 中文服务、中餐馆、中资律所、房源及招聘点位
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 flex-wrap">
          {[
            { id: 'all', label: '全部标记' },
            { id: 'accountant', label: '🔵 会计' },
            { id: 'clinic', label: '🔴 诊所' },
            { id: 'housing', label: '🏠 房源' },
            { id: 'job', label: '💼 招聘' },
            { id: 'repair', label: '🔧 汽修' },
          ].map((f) => (
            <button
              key={f.id}
              onClick={() => setSelectedFilter(f.id)}
              className={`px-2.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                selectedFilter === f.id
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Map Canvas and Info Drawer */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Interactive Map Visual Simulation (3 cols) */}
        <div className="lg:col-span-3 bg-slate-900 rounded-3xl overflow-hidden border border-slate-800 shadow-xl relative min-h-[460px] flex items-center justify-center p-4">
          {/* Subtle Stylized Map Vector Background */}
          <div className="absolute inset-0 opacity-20 pointer-events-none bg-[radial-gradient(#3b82f6_1px,transparent_1px)] [background-size:16px_16px]" />
          
          {/* Street / District Guidelines */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-30">
            <div className="w-[500px] h-[350px] border border-dashed border-blue-400 rounded-full" />
            <div className="w-[300px] h-[200px] border border-blue-500/40 rounded-3xl absolute" />
          </div>

          {/* Current City Label on Map */}
          <div className="absolute top-4 left-4 bg-slate-800/80 backdrop-blur-md px-3 py-1.5 rounded-xl border border-slate-700 text-white text-xs font-mono flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>GPS: {currentCity.nameLocal} (Lat {currentCity.lat}, Lng {currentCity.lng})</span>
          </div>

          {/* Pins on Canvas */}
          <div className="relative w-full h-full min-h-[420px]">
            {currentPins.map((pin) => (
              <div
                key={pin.id}
                onClick={() => setActivePin(pin)}
                style={{ top: `${pin.y}%`, left: `${pin.x}%` }}
                className={`absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer group transition-transform ${
                  activePin?.id === pin.id ? 'scale-125 z-30' : 'hover:scale-115 z-10'
                }`}
              >
                {/* Pin Tooltip Marker */}
                <div className="flex flex-col items-center">
                  <div className={`px-2 py-0.5 rounded-md text-[10px] font-bold text-white shadow-lg whitespace-nowrap mb-1 transition-all ${
                    activePin?.id === pin.id
                      ? 'bg-blue-600 ring-2 ring-white scale-105'
                      : 'bg-slate-800/90 group-hover:bg-blue-600'
                  }`}>
                    {pin.name.slice(0, 10)}...
                  </div>
                  <div className="w-8 h-8 rounded-full bg-white shadow-xl flex items-center justify-center text-sm border-2 border-slate-900 group-hover:border-blue-500 transition-colors">
                    {pin.icon}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* AI Quick Radius Voice Filter Button */}
          <div className="absolute bottom-4 left-4 right-4 sm:right-auto sm:left-4">
            <button
              onClick={() => onAskAi(`帮我搜索${currentCity.nameZh}附近 5 公里内会讲中文的汽车修理厂和牙医诊所，并提供联系方式`)}
              className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 border border-blue-400/30"
            >
              <Sparkles className="w-4 h-4 text-white" />
              <span>AI 智能筛选附近 5km 中文服务</span>
            </button>
          </div>
        </div>

        {/* Selected Marker Detail Card (1 col) */}
        <div className="space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between h-full">
            {activePin ? (
              <div className="space-y-4">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-wider bg-blue-100 text-blue-800 px-2 py-0.5 rounded">
                      {activePin.tag}
                    </span>
                    <span className="text-xl">{activePin.icon}</span>
                  </div>
                  <h3 className="font-bold text-base text-slate-900 mt-2 leading-snug">
                    {activePin.name}
                  </h3>
                </div>

                <div className="text-xs text-slate-600 space-y-2 pt-2 border-t border-slate-100">
                  <div className="flex items-start gap-1.5">
                    <MapPin className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                    <span>{activePin.address}</span>
                  </div>
                  {activePin.phone && (
                    <div className="flex items-center gap-1.5">
                      <Phone className="w-4 h-4 text-slate-400 shrink-0" />
                      <a href={`tel:${activePin.phone}`} className="text-blue-600 font-mono hover:underline">
                        {activePin.phone}
                      </a>
                    </div>
                  )}
                  {activePin.price && (
                    <div className="text-slate-900 font-bold font-mono">
                      标价：{activePin.price}
                    </div>
                  )}
                  {activePin.salary && (
                    <div className="text-emerald-600 font-bold font-mono">
                      薪资待遇：{activePin.salary}
                    </div>
                  )}
                </div>

                <div className="pt-4 border-t border-slate-100 space-y-2">
                  <button
                    onClick={() => onAskAi(`我想了解【${activePin.name}】（地址：${activePin.address}），请帮我查它的口碑并帮我起草联系话术`)}
                    className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold shadow-xs transition-colors"
                  >
                    AI 帮我联系该点位
                  </button>
                  <button
                    onClick={() => setActivePin(null)}
                    className="w-full py-1.5 text-xs text-slate-500 hover:bg-slate-100 rounded-lg transition-colors"
                  >
                    取消选中
                  </button>
                </div>
              </div>
            ) : (
              <div className="text-center py-10 space-y-3 my-auto">
                <div className="w-12 h-12 rounded-full bg-slate-100 mx-auto flex items-center justify-center text-slate-400">
                  <Navigation className="w-6 h-6" />
                </div>
                <h4 className="font-bold text-sm text-slate-800">点击地图点位查看详情</h4>
                <p className="text-xs text-slate-400 max-w-xs mx-auto">
                  点击左侧地图中任意标记，查看详细中文地址、电话及 AI 一键预约助手。
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
