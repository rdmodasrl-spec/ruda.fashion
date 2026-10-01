import React from 'react';
import { CategoryKey } from '../types';
import {
  Home,
  Briefcase,
  Store,
  ArrowLeftRight,
  ShoppingBag,
  Landmark,
  FileSearch,
  Languages,
  MapPin,
  MessageSquare,
  BarChart3,
  FileCode2,
} from 'lucide-react';

interface CategoryNavProps {
  activeCategory: CategoryKey;
  onSelectCategory: (category: CategoryKey) => void;
}

export const CategoryNav: React.FC<CategoryNavProps> = ({
  activeCategory,
  onSelectCategory,
}) => {
  const categories: { key: CategoryKey; label: string; icon: React.ReactNode }[] = [
    { key: 'all', label: '首页', icon: <Home className="w-3.5 h-3.5" /> },
    { key: 'housing', label: '房屋', icon: <Home className="w-3.5 h-3.5" /> },
    { key: 'jobs', label: '招聘', icon: <Briefcase className="w-3.5 h-3.5" /> },
    { key: 'businesses', label: '商家', icon: <Store className="w-3.5 h-3.5" /> },
    { key: 'transfers', label: '转店', icon: <ArrowLeftRight className="w-3.5 h-3.5" /> },
    { key: 'marketplace', label: '二手', icon: <ShoppingBag className="w-3.5 h-3.5" /> },
    { key: 'government', label: '居留', icon: <Landmark className="w-3.5 h-3.5" /> },
    { key: 'document_ai', label: '读信', icon: <FileSearch className="w-3.5 h-3.5" /> },
    { key: 'translator', label: '翻译', icon: <Languages className="w-3.5 h-3.5" /> },
    { key: 'map', label: '地图', icon: <MapPin className="w-3.5 h-3.5" /> },
    { key: 'forum', label: '论坛', icon: <MessageSquare className="w-3.5 h-3.5" /> },
    { key: 'coo_admin', label: '总后台', icon: <BarChart3 className="w-3.5 h-3.5" /> },
    { key: 'architecture', label: '架构', icon: <FileCode2 className="w-3.5 h-3.5" /> },
  ];

  return (
    <nav className="bg-white border-b border-slate-200 sticky top-16 z-30 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center space-x-1 sm:space-x-1.5 overflow-x-auto py-2 no-scrollbar scroll-smooth">
          {categories.map((c) => {
            const isActive = activeCategory === c.key;
            return (
              <button
                key={c.key}
                onClick={() => onSelectCategory(c.key)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <span>{c.icon}</span>
                <span>{c.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
};
