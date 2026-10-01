/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { CITIES, MOCK_LISTINGS, MOCK_BUSINESSES, MOCK_FORUM_THREADS } from './data/mockData';
import { GeoCity, CategoryKey, ListingItem } from './types';
import { Header } from './components/Header';
import { HeroAiPortal } from './components/HeroAiPortal';
import { CategoryNav } from './components/CategoryNav';
import { HousingView } from './components/HousingView';
import { JobsView } from './components/JobsView';
import { BusinessYellowPages } from './components/BusinessYellowPages';
import { MarketplaceView } from './components/MarketplaceView';
import { StoreTransfersView } from './components/StoreTransfersView';
import { DocumentAiView } from './components/DocumentAiView';
import { ScenarioTranslator } from './components/ScenarioTranslator';
import { GovernmentNavView } from './components/GovernmentNavView';
import { EuropeChineseMap } from './components/EuropeChineseMap';
import { ForumKnowledgeView } from './components/ForumKnowledgeView';
import { AiCooDashboard } from './components/AiCooDashboard';
import { ArchitectureDocsView } from './components/ArchitectureDocsView';
import { AiAgentWorkflowModal } from './components/AiAgentWorkflowModal';
import { UserDossierModal } from './components/UserDossierModal';
import { MasterAdminBackoffice } from './components/MasterAdminBackoffice';
import { Sparkles, MapPin, ShieldCheck, ArrowRight, Bot, Landmark, MessageSquare } from 'lucide-react';

export default function App() {
  const [currentCity, setCurrentCity] = useState<GeoCity>(CITIES[0]); // Milan default
  const [activeCategory, setActiveCategory] = useState<CategoryKey>('all');
  const [isAdminMode, setIsAdminMode] = useState(false);
  
  // Agent Workflow Modal State
  const [isAgentModalOpen, setIsAgentModalOpen] = useState(false);
  const [currentAgentQuery, setCurrentAgentQuery] = useState('');
  const [agentResponseText, setAgentResponseText] = useState('');
  const [agentModelSource, setAgentModelSource] = useState('Gemini 3.8 Flash / AI Gateway');
  const [isAiLoading, setIsAiLoading] = useState(false);

  // User Dossier State
  const [isDossierOpen, setIsDossierOpen] = useState(false);
  const [dossierItems, setDossierItems] = useState<any[]>([
    {
      id: 'd-1',
      title: '居留延期大信封准备',
      city: '米兰',
      date: '2026-09-20',
      status: 'active',
      notes: '已领取 Kit Postale，待开具最新签工单',
    },
    {
      id: 'd-2',
      title: '米兰华龙会计师事务所咨询归档',
      city: '米兰',
      date: '2026-09-25',
      status: 'active',
      notes: '咨询 Partita IVA 餐饮包年做账套餐',
    },
  ]);

  // Handle master AI query submission
  const handleMasterAiQuery = async (query: string, mediaType?: 'voice' | 'image' | 'doc') => {
    setCurrentAgentQuery(query);
    setIsAiLoading(true);

    try {
      const res = await fetch('/api/ai/ask', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query,
          city: currentCity.id,
          country: currentCity.countryCode,
        }),
      });

      const data = await res.json();
      if (data && data.answer) {
        setAgentResponseText(data.answer);
        setAgentModelSource(data.source || 'gemini-3.8-flash');
      } else {
        throw new Error('No answer received');
      }
    } catch (err) {
      // Local intelligent response fallback
      setAgentModelSource('AI Gateway Heuristic Core');
      if (query.includes('会计') || query.includes('税')) {
        setAgentResponseText(`### 🎯 ${currentCity.nameZh}中文会计服务智能匹配
已为您在**${currentCity.nameZh}及周边**筛选出具备意大利/当地执业注册资质的中文事务所：
1. **米兰华龙联合会计师事务所** (华人街区，纯中文团队，擅长个人所得税、Partita IVA与居留收入税单)
2. **中意联合财税咨询中心** (擅长中大型企业账务合规、海关增值税退税)
建议携带：居留复印件、税号绿卡及往期税单。已为您自动起草安全首问信。`);
      } else if (query.includes('房') || query.includes('租')) {
        setAgentResponseText(`### 🏠 ${currentCity.nameZh}华人房源筛选与首期资金分析
为您匹配到符合条件的房源（已过滤虚假房源）：
1. **${currentCity.nameZh}华人生活圈精装两居室**：€1,350/月，可登 Residenza 户籍，无中介费。
预计入住首期资金：€1,350(首月) + €4,050(押金) + €200(物业能耗) ≈ **€5,600**。
⚠️ 防诈提示：严禁看房前任何形式的网上汇定金行为。`);
      } else {
        setAgentResponseText(`### 🤖 欧洲华人 AI 生活管家已为您调度完成
针对“${query}”，本平台已检索了${currentCity.nameZh}本地认证商户库与华人街历史档案。
我们建议您优先选择带有【🛡️ 认证资质】的官方服务商。您可以查阅下方推荐或由 AI 继续协助起草联系预约。`);
      }
    } finally {
      setIsAiLoading(false);
      setIsAgentModalOpen(true);
    }
  };

  const handleAddToDossier = (item: any) => {
    setDossierItems((prev) => [item, ...prev]);
  };

  // Filter listings based on city
  const cityHousingListings = MOCK_LISTINGS.filter(
    (l) => l.category === 'housing' && (l.cityId === currentCity.id || l.cityId === 'milan')
  );
  const cityJobListings = MOCK_LISTINGS.filter((l) => l.category === 'jobs');
  const cityMarketplaceListings = MOCK_LISTINGS.filter((l) => l.category === 'marketplace');
  const cityTransferListings = MOCK_LISTINGS.filter((l) => l.category === 'transfers');

  if (isAdminMode || activeCategory === 'coo_admin') {
    return (
      <MasterAdminBackoffice
        currentCity={currentCity}
        onClose={() => {
          setIsAdminMode(false);
          if (activeCategory === 'coo_admin') setActiveCategory('all');
        }}
        onRefreshData={() => {}}
      />
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans flex flex-col selection:bg-blue-100 selection:text-blue-900">
      {/* 1. Global Header */}
      <Header
        currentCity={currentCity}
        onSelectCity={(c) => setCurrentCity(c)}
        onOpenDossier={() => setIsDossierOpen(true)}
        onOpenArchitecture={() => setActiveCategory('architecture')}
        onOpenAdmin={() => setIsAdminMode(true)}
        onTriggerAction={(prompt) => {
          if (prompt) {
            handleMasterAiQuery(prompt);
          } else {
            setActiveCategory('all');
          }
        }}
      />

      {/* 2. Hero AI Portal (Master Search & Intent Prompt) */}
      <HeroAiPortal
        currentCity={currentCity}
        onSubmitQuery={handleMasterAiQuery}
        isLoading={isAiLoading}
      />

      {/* 3. Category & Navigation Bar */}
      <CategoryNav
        activeCategory={activeCategory}
        onSelectCategory={(cat) => setActiveCategory(cat)}
      />

      {/* 4. Main Body Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 w-full">
        {/* VIEW: All / Overview */}
        {activeCategory === 'all' && (
          <div className="space-y-8">
            {/* Quick Unified Directory Matrix */}
            <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs">
              <div className="flex items-center justify-between mb-3.5">
                <div className="flex items-center gap-2">
                  <span className="font-extrabold text-sm sm:text-base text-slate-900 tracking-tight">服务目录</span>
                  <span className="text-xs text-slate-400">· 统一分类 · 一键直达 · 智能匹配</span>
                </div>
                <span className="text-[11px] text-slate-400 font-mono hidden sm:inline">10 大核心专区</span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
                {[
                  { key: 'housing', name: '华人租房', desc: '真实房源·算押金', icon: '🏠' },
                  { key: 'jobs', name: '本地招聘', desc: '中文急招·保薪资', icon: '💼' },
                  { key: 'businesses', name: '认证商家', desc: '黄页会计·牙医诊', icon: '🏪' },
                  { key: 'transfers', name: '店铺转让', desc: '餐馆百货·稳交接', icon: '🔁' },
                  { key: 'marketplace', name: '二手闲置', desc: '同城面交·防欺诈', icon: '🛍️' },
                  { key: 'government', name: '居留政务', desc: '官方流程·拒踩坑', icon: '🧾' },
                  { key: 'document_ai', name: '信件解读', desc: '拍照看信·提截止', icon: '📄' },
                  { key: 'translator', name: '场景翻译', desc: '公函地道·多语种', icon: '🌐' },
                  { key: 'map', name: '华人地图', desc: '周边五里·即导航', icon: '🗺️' },
                  { key: 'forum', name: '华人论坛', desc: '经验互助·知识库', icon: '💬' },
                ].map((item) => (
                  <button
                    key={item.key}
                    onClick={() => setActiveCategory(item.key as CategoryKey)}
                    className="flex flex-col items-start p-3 rounded-xl bg-slate-50 hover:bg-white border border-slate-200 hover:border-blue-500 hover:shadow-xs transition-all text-left group"
                  >
                    <div className="text-lg mb-1 group-hover:scale-110 transition-transform">{item.icon}</div>
                    <span className="text-xs font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                      {item.name}
                    </span>
                    <span className="text-[10px] text-slate-400 mt-0.5 line-clamp-1">
                      {item.desc}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Overview Section: Today in your city */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    欧洲华人今日速览 · {currentCity.nameZh} ({currentCity.nameLocal})
                  </span>
                </div>
                <h2 className="text-xl sm:text-2xl font-black text-slate-900 mt-1">
                  今日为您汇聚：12套新房源 · 8个本地急招 · 15家认证中文机构
                </h2>
                <p className="text-xs text-slate-500 mt-1">
                  所有房源经真实性核查 · 居留大赦政策动态实时同步 · 24小时 AI 商家自主前台服务
                </p>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => setActiveCategory('map')}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold transition-colors"
                >
                  <MapPin className="w-4 h-4 text-blue-600" />
                  <span>打开全景地图</span>
                </button>
                <button
                  onClick={() => setActiveCategory('document_ai')}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-xs transition-colors"
                >
                  <span>AI 文件管家 (拍信件)</span>
                </button>
              </div>
            </div>

            {/* Quick Featured Rows: Housing Preview */}
            <section className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <h3 className="font-extrabold text-lg text-slate-900">🏠 优质华人房源速递</h3>
                  <span className="text-xs text-slate-400">可登 Residenza · 首期资金清晰透明</span>
                </div>
                <button
                  onClick={() => setActiveCategory('housing')}
                  className="text-xs font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1"
                >
                  <span>查看全部房源</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
              <HousingView
                listings={cityHousingListings.slice(0, 2)}
                currentCity={currentCity}
                onSelectListing={(l) => handleMasterAiQuery(`帮我分析这套房源：${l.title}`)}
                onAskAi={handleMasterAiQuery}
              />
            </section>

            {/* Quick Featured Rows: Business Yellow Pages Preview */}
            <section className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <h3 className="font-extrabold text-lg text-slate-900">🏪 认证中文商家与便民黄页</h3>
                  <span className="text-xs text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded font-semibold border border-emerald-200">
                    支持 24h AI 客服智能接待
                  </span>
                </div>
                <button
                  onClick={() => setActiveCategory('businesses')}
                  className="text-xs font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1"
                >
                  <span>查看全部商家</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
              <BusinessYellowPages
                businesses={MOCK_BUSINESSES.slice(0, 2)}
                currentCity={currentCity}
                onAskAi={handleMasterAiQuery}
              />
            </section>

            {/* Map Preview Banner */}
            <section className="bg-slate-900 rounded-3xl p-6 sm:p-8 text-white relative overflow-hidden shadow-xl border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="space-y-2 max-w-xl">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-950 text-blue-300 border border-blue-800 text-xs font-semibold">
                  <MapPin className="w-3.5 h-3.5 text-blue-400" />
                  <span>欧洲华人全景地图 · 5km 便民生活圈</span>
                </div>
                <h3 className="text-2xl font-black">
                  一键透视米兰、巴黎、马德里、法兰克福中文生态
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  中餐馆、会讲中文的牙医门诊、华人会计楼、汽修厂与物流集散地，全部坐标精准定位与即时导航。
                </p>
              </div>

              <button
                onClick={() => setActiveCategory('map')}
                className="px-6 py-3 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs sm:text-sm shadow-lg transition-transform hover:scale-105 shrink-0"
              >
                立即进入全景地图
              </button>
            </section>
          </div>
        )}

        {/* VIEW: Housing */}
        {activeCategory === 'housing' && (
          <HousingView
            listings={cityHousingListings}
            currentCity={currentCity}
            onSelectListing={(l) => handleMasterAiQuery(`帮我分析这套房源：${l.title}`)}
            onAskAi={handleMasterAiQuery}
          />
        )}

        {/* VIEW: Jobs */}
        {activeCategory === 'jobs' && (
          <JobsView
            jobs={cityJobListings}
            currentCity={currentCity}
            onAskAi={handleMasterAiQuery}
          />
        )}

        {/* VIEW: Businesses */}
        {activeCategory === 'businesses' && (
          <BusinessYellowPages
            businesses={MOCK_BUSINESSES}
            currentCity={currentCity}
            onAskAi={handleMasterAiQuery}
          />
        )}

        {/* VIEW: Transfers */}
        {activeCategory === 'transfers' && (
          <StoreTransfersView
            transfers={cityTransferListings}
            currentCity={currentCity}
            onAskAi={handleMasterAiQuery}
          />
        )}

        {/* VIEW: Marketplace */}
        {activeCategory === 'marketplace' && (
          <MarketplaceView
            items={cityMarketplaceListings}
            currentCity={currentCity}
            onAskAi={handleMasterAiQuery}
          />
        )}

        {/* VIEW: Document AI */}
        {activeCategory === 'document_ai' && (
          <DocumentAiView onAskAi={handleMasterAiQuery} />
        )}

        {/* VIEW: Scenario Translator */}
        {activeCategory === 'translator' && (
          <ScenarioTranslator />
        )}

        {/* VIEW: Government Navigator */}
        {activeCategory === 'government' && (
          <GovernmentNavView onAskAi={handleMasterAiQuery} />
        )}

        {/* VIEW: Map */}
        {activeCategory === 'map' && (
          <EuropeChineseMap
            currentCity={currentCity}
            onAskAi={handleMasterAiQuery}
          />
        )}

        {/* VIEW: Forum & Knowledge Base */}
        {activeCategory === 'forum' && (
          <ForumKnowledgeView onAskAi={handleMasterAiQuery} />
        )}

        {/* VIEW: Architecture Documentation */}
        {activeCategory === 'architecture' && (
          <ArchitectureDocsView />
        )}
      </main>

      {/* 5. Interactive AI Agent Workflow Modal */}
      <AiAgentWorkflowModal
        isOpen={isAgentModalOpen}
        onClose={() => setIsAgentModalOpen(false)}
        query={currentAgentQuery}
        currentCity={currentCity}
        aiResponseText={agentResponseText}
        sourceModel={agentModelSource}
        onAddToDossier={handleAddToDossier}
      />

      {/* 6. User Dossier Modal */}
      <UserDossierModal
        isOpen={isDossierOpen}
        onClose={() => setIsDossierOpen(false)}
        currentCity={currentCity}
        dossierItems={dossierItems}
      />

      {/* 7. Global Footer */}
      <footer className="bg-slate-900 text-slate-400 text-xs border-t border-slate-800 mt-16 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-white font-extrabold text-base">
                <Bot className="w-5 h-5 text-blue-500" />
                <span>欧洲华人 AI 智能平台</span>
              </div>
              <p className="text-slate-400 text-xs leading-relaxed">
                保留传统华人街成熟版块，以 AI 智脑重构欧洲华人生活、商业与社区。让用户只需要提出一句话需求，由智能体全流程协助落地。
              </p>
            </div>

            <div>
              <h4 className="font-bold text-white mb-3 uppercase tracking-wider text-xs">传统内容版块</h4>
              <ul className="space-y-2 text-slate-400">
                <li><button onClick={() => setActiveCategory('housing')} className="hover:text-white">房屋租赁与买卖</button></li>
                <li><button onClick={() => setActiveCategory('jobs')} className="hover:text-white">求职招聘与企业人才</button></li>
                <li><button onClick={() => setActiveCategory('businesses')} className="hover:text-white">中文会计与律师黄页</button></li>
                <li><button onClick={() => setActiveCategory('transfers')} className="hover:text-white">店铺转让与商业买卖</button></li>
                <li><button onClick={() => setActiveCategory('marketplace')} className="hover:text-white">跳蚤二手跳蚤市场</button></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-white mb-3 uppercase tracking-wider text-xs">AI 原生工具箱</h4>
              <ul className="space-y-2 text-slate-400">
                <li><button onClick={() => setActiveCategory('document_ai')} className="hover:text-white">AI 欧洲文件管家 (OCR)</button></li>
                <li><button onClick={() => setActiveCategory('translator')} className="hover:text-white">场景深度欧洲翻译官</button></li>
                <li><button onClick={() => setActiveCategory('government')} className="hover:text-white">居留与政务权威导航</button></li>
                <li><button onClick={() => setActiveCategory('map')} className="hover:text-white">欧洲华人全景地图</button></li>
                <li><button onClick={() => setActiveCategory('forum')} className="hover:text-white">社区知识库 (AI 百楼总结)</button></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-white mb-3 uppercase tracking-wider text-xs">架构总纲与运营中台</h4>
              <ul className="space-y-2 text-slate-400">
                <li><button onClick={() => setActiveCategory('architecture')} className="text-blue-400 hover:text-blue-300 font-semibold">项目立项开发指令总纲</button></li>
                <li><button onClick={() => setActiveCategory('coo_admin')} className="hover:text-white">数字化总后台与智脑中心</button></li>
                <li><button onClick={() => setIsDossierOpen(true)} className="hover:text-white">我的欧洲生活档案与日历</button></li>
                <li className="pt-2 text-[11px] text-slate-500">已部署多城市：意大利米兰/罗马/普拉托、法国巴黎、西班牙马德里、德国法兰克福</li>
              </ul>
            </div>
          </div>

          <div className="pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-500 gap-4">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
              <span>免责声明：本平台政策信息严格区分【官方权威法规】与【华人经验】，重大法律税务事项建议由持牌专业人士办理。</span>
            </div>
            <div>
              © 2026 Europe Chinese AI Platform · Huaren Europe Super App · All Rights Reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
