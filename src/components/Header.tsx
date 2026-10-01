import React from 'react';
import { CITIES } from '../data/mockData';
import { GeoCity } from '../types';
import { Bot, MapPin, Sparkles, UserCheck, BookOpen, ShieldCheck, ChevronDown, PlusCircle } from 'lucide-react';

interface HeaderProps {
  currentCity: GeoCity;
  onSelectCity: (city: GeoCity) => void;
  onOpenDossier: () => void;
  onOpenArchitecture: () => void;
  onOpenAdmin: () => void;
  onTriggerAction: (prompt: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentCity,
  onSelectCity,
  onOpenDossier,
  onOpenArchitecture,
  onOpenAdmin,
  onTriggerAction,
}) => {
  const [showCityDropdown, setShowCityDropdown] = React.useState(false);

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Platform Name */}
          <div className="flex items-center gap-3">
            <div 
              onClick={() => onTriggerAction('')}
              className="flex items-center gap-2 cursor-pointer group"
            >
              <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-sm group-hover:scale-105 transition-transform">
                <Bot className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-extrabold text-lg text-slate-900 tracking-tight">欧洲华人 AI</span>
                  <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200">工程版 2.0</span>
                </div>
                <p className="text-[11px] text-slate-500 hidden sm:block">AI 生活 · 商业 · 社区操作系统</p>
              </div>
            </div>

            {/* City Selector */}
            <div className="relative ml-2 sm:ml-6">
              <button
                onClick={() => setShowCityDropdown(!showCityDropdown)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold transition-colors border border-slate-200"
              >
                <MapPin className="w-3.5 h-3.5 text-blue-600" />
                <span>{currentCity.countryName} · {currentCity.nameZh}</span>
                <span className="text-slate-400 text-[10px]">({currentCity.nameLocal})</span>
                <ChevronDown className="w-3 h-3 text-slate-500 ml-0.5" />
              </button>

              {showCityDropdown && (
                <div className="absolute left-0 mt-2 w-64 rounded-xl bg-white shadow-xl border border-slate-200 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                  <div className="px-3 py-1.5 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                    选择欧洲常驻城市
                  </div>
                  <div className="max-h-72 overflow-y-auto divide-y divide-slate-100">
                    {CITIES.map((city) => (
                      <button
                        key={city.id}
                        onClick={() => {
                          onSelectCity(city);
                          setShowCityDropdown(false);
                        }}
                        className={`w-full text-left px-3 py-2 flex items-center justify-between text-xs hover:bg-blue-50 transition-colors ${
                          currentCity.id === city.id ? 'bg-blue-50/80 font-bold text-blue-700' : 'text-slate-700'
                        }`}
                      >
                        <div>
                          <span className="mr-1">{city.countryCode === 'IT' ? '🇮🇹' : city.countryCode === 'FR' ? '🇫🇷' : city.countryCode === 'ES' ? '🇪🇸' : city.countryCode === 'DE' ? '🇩🇪' : '🇳🇱'}</span>
                          <span>{city.nameZh}</span>
                          <span className="text-slate-400 ml-1">({city.nameLocal})</span>
                        </div>
                        <span className="text-[10px] text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded">华人 {city.chinesePopulationEst}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Action Icons */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            {/* Master Admin Backoffice Button */}
            <button
              onClick={onOpenAdmin}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-all border border-slate-700 shadow-xs"
              title="进入数字化总后台与智脑控制台"
            >
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>总后台</span>
            </button>

            {/* System Architecture Document */}
            <button
              onClick={onOpenArchitecture}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-slate-700 hover:text-blue-700 hover:bg-slate-100 text-xs font-medium transition-colors border border-slate-200"
              title="系统架构总纲与开发指令"
            >
              <BookOpen className="w-3.5 h-3.5 text-blue-600" />
              <span className="hidden sm:inline">架构</span>
            </button>

            {/* User Dossier */}
            <button
              onClick={onOpenDossier}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-slate-700 hover:text-blue-700 hover:bg-slate-100 text-xs font-medium transition-colors border border-slate-200"
              title="我的欧洲生活档案与日历"
            >
              <UserCheck className="w-3.5 h-3.5 text-blue-600" />
              <span className="hidden sm:inline">生活档案</span>
            </button>

            {/* Quick Post Button */}
            <button
              onClick={() => onTriggerAction('发布房屋或招聘信息')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-xs transition-all"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>发布</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
