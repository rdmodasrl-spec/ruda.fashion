import React, { useState, useEffect } from 'react';
import {
  Cpu,
  Database,
  Terminal,
  Play,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  Search,
  Sliders,
  Settings,
  ShieldCheck,
  Layers,
  ArrowRight,
  TrendingUp,
  Globe,
  Trash2,
  Check,
} from 'lucide-react';
import { GeoCity } from '../types';

interface MasterBrainCenterProps {
  currentCity: GeoCity;
  onClose: () => void;
  onRefreshData?: () => void;
}

export const MasterBrainCenter: React.FC<MasterBrainCenterProps> = ({
  currentCity,
  onClose,
  onRefreshData,
}) => {
  const [activeTab, setActiveTab] = useState<'brain_ai' | 'batch_ops' | 'listings_mgr' | 'settings_hub' | 'sql_workbench'>('brain_ai');

  // AI Direct DB Mutation State
  const [aiCommand, setAiCommand] = useState('');
  const [isExecutingAiDb, setIsExecutingAiDb] = useState(false);
  const [aiDbExecutionResult, setAiDbExecutionResult] = useState<any | null>(null);

  // Live Listings & Businesses
  const [listings, setListings] = useState<any[]>([]);
  const [selectedListingIds, setSelectedListingIds] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  // Settings state
  const [settings, setSettings] = useState<any>({
    autoExpireDays: 30,
    warnBeforeExpireDays: 5,
    trustScoreThresholdForAutoPass: 75,
    aiModerationSensitivity: 'strict',
    supportedLocales: ['zh-CN', 'en-US', 'it-IT', 'fr-FR', 'es-ES', 'de-DE'],
    defaultCurrency: 'EUR',
    autoSeoGenerationEnabled: true,
  });

  // SQL Workbench State
  const [sqlQuery, setSqlQuery] = useState('SELECT * FROM listings WHERE status = \'active\';');
  const [sqlResult, setSqlResult] = useState<{ columns: string[]; rows: any[]; rowCount: number } | null>(null);
  const [isExecutingSql, setIsExecutingSql] = useState(false);

  // Status message
  const [statusNotice, setStatusNotice] = useState<string | null>(null);

  const showNotice = (msg: string) => {
    setStatusNotice(msg);
    setTimeout(() => setStatusNotice(null), 4000);
  };

  const fetchLiveListings = async () => {
    try {
      const res = await fetch('/api/listings');
      const data = await res.json();
      if (data.listings) {
        setListings(data.listings);
      }
    } catch (e) {
      console.warn('Failed to fetch listings:', e);
    }
  };

  const fetchSettings = async () => {
    try {
      const res = await fetch('/api/admin/settings');
      const data = await res.json();
      if (data.settings) {
        setSettings(data.settings);
      }
    } catch (e) {
      console.warn('Failed to fetch settings:', e);
    }
  };

  useEffect(() => {
    fetchLiveListings();
    fetchSettings();
  }, []);

  // AI Direct Database Command
  const handleExecuteAiDbCommand = async (customCmd?: string) => {
    const cmd = customCmd || aiCommand;
    if (!cmd.trim()) return;

    setIsExecutingAiDb(true);
    try {
      const res = await fetch('/api/admin/ai-db-execute', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ command: cmd }),
      });
      const data = await res.json();
      if (data.success) {
        setAiDbExecutionResult(data);
        showNotice(`✓ ${data.message}`);
        fetchLiveListings();
        if (onRefreshData) onRefreshData();
      } else {
        showNotice(`✕ 执行失败: ${data.error}`);
      }
    } catch (e: any) {
      showNotice(`✕ 异常: ${e.message}`);
    } finally {
      setIsExecutingAiDb(false);
    }
  };

  // Batch Status Update
  const handleBatchStatus = async (status: string) => {
    if (selectedListingIds.length === 0) {
      showNotice('请先勾选需要批量操作的记录');
      return;
    }

    try {
      await Promise.all(
        selectedListingIds.map((id) =>
          fetch(`/api/listings/${id}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ status }),
          })
        )
      );
      showNotice(`已批量将 ${selectedListingIds.length} 条记录更新为: ${status}`);
      setSelectedListingIds([]);
      fetchLiveListings();
    } catch (e: any) {
      showNotice(`批量处理异常: ${e.message}`);
    }
  };

  // Run SQL Query
  const handleRunSql = async (override?: string) => {
    const q = override || sqlQuery;
    setIsExecutingSql(true);
    try {
      const res = await fetch('/api/admin/sql-query', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: q }),
      });
      const data = await res.json();
      if (data.success) {
        setSqlResult(data);
      }
    } catch (e: any) {
      showNotice(`SQL 执行失败: ${e.message}`);
    } finally {
      setIsExecutingSql(false);
    }
  };

  // Save Settings
  const handleSaveSettings = async () => {
    try {
      const res = await fetch('/api/admin/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      });
      const data = await res.json();
      if (data.success) {
        showNotice('✓ 全局系统大枢设置已写入生产配置');
      }
    } catch (e: any) {
      showNotice(`保存失败: ${e.message}`);
    }
  };

  const filteredListings = listings.filter((l) => {
    if (!searchQuery) return true;
    return (
      l.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      l.cityName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      l.category.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  return (
    <div className="bg-slate-950 min-h-screen text-slate-100 flex flex-col font-sans">
      {/* 1. Header (Black, Slate, White, Blue, Green) */}
      <div className="bg-slate-900 border-b border-slate-800 px-4 sm:px-8 py-4 flex items-center justify-between sticky top-0 z-40">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center text-white font-bold shadow-sm">
            <Cpu className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-base tracking-tight text-white">欧洲华人 AI · 大脑控制中心</span>
              <span className="text-[10px] font-mono bg-emerald-950 text-emerald-400 border border-emerald-800 px-2 py-0.5 rounded font-bold">
                ENGINEERING V1.0 · AI DIRECT DB ACTIVE
              </span>
            </div>
            <p className="text-[11px] text-slate-400">PostgreSQL 核心集群 ｜ 自然语言直接改库 ｜ 批量调度与全局设置</p>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => fetchLiveListings()}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>同步数据库</span>
          </button>
          <button
            onClick={onClose}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-sm transition-all"
          >
            <span>返回前台门户</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Notice Bar */}
      {statusNotice && (
        <div className="bg-blue-600 text-white px-6 py-2 text-xs font-bold text-center flex items-center justify-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-white" />
          <span>{statusNotice}</span>
        </div>
      )}

      {/* 2. Navigation Tabs */}
      <div className="bg-slate-900/60 border-b border-slate-800 px-4 sm:px-8">
        <div className="flex items-center gap-1.5 overflow-x-auto py-2.5 no-scrollbar">
          {[
            { id: 'brain_ai', label: 'AI 自然语言改数据库 (AI Brain)', icon: <Cpu className="w-4 h-4" /> },
            { id: 'batch_ops', label: '批量自动化运维 (Batch Ops)', icon: <Sliders className="w-4 h-4" /> },
            { id: 'listings_mgr', label: '内容总控与审核 (Listings)', icon: <Layers className="w-4 h-4" /> },
            { id: 'settings_hub', label: '大枢设置中心 (Settings)', icon: <Settings className="w-4 h-4" /> },
            { id: 'sql_workbench', label: '数据库 SQL 控制台 (Workbench)', icon: <Terminal className="w-4 h-4" /> },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                activeTab === tab.id
                  ? 'bg-blue-600 text-white shadow-sm font-bold'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* 3. Main Center Canvas */}
      <div className="p-4 sm:p-8 flex-1 max-w-7xl mx-auto w-full space-y-6">
        {/* TAB 1: AI Natural Language Direct Database Mutation */}
        {activeTab === 'brain_ai' && (
          <div className="space-y-6">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <Cpu className="w-5 h-5 text-blue-500" />
                  <h3 className="font-bold text-base text-white">AI 智能数据库直接指令舱 (AI Direct Database Controller)</h3>
                </div>
                <span className="text-xs text-slate-400 font-mono">模式：全自主生产级操作</span>
              </div>

              <p className="text-xs text-slate-400 leading-relaxed">
                无需手动编写复杂 SQL。直接用自然语言告诉 AI 大脑您想对数据库进行什么批量调整，AI 自动完成语义理解、生成更新语句并直接写入实时数据库。
              </p>

              {/* Natural language command textarea */}
              <div className="space-y-2">
                <textarea
                  value={aiCommand}
                  onChange={(e) => setAiCommand(e.target.value)}
                  rows={3}
                  placeholder="例如：“将所有米兰发布超过25天的房源状态改为需要确认”、“将涉嫌要求预付看房押金的发布项全部标记为隔离预警并将信用分调低”、“批量调整所有商家的假期营业时间”..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3.5 text-xs sm:text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-blue-500 font-mono"
                />

                <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="text-[11px] text-slate-500 font-mono">快捷指令示例:</span>
                    <button
                      onClick={() => {
                        const cmd = '批量将所有米兰和巴黎超过25天的房源标记为需要确认';
                        setAiCommand(cmd);
                        handleExecuteAiDbCommand(cmd);
                      }}
                      className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs border border-slate-700"
                    >
                      30天到期催检
                    </button>
                    <button
                      onClick={() => {
                        const cmd = '扫描涉嫌虚假预付押金的内容并立即封禁隔离';
                        setAiCommand(cmd);
                        handleExecuteAiDbCommand(cmd);
                      }}
                      className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs border border-slate-700"
                    >
                      欺诈内容批量隔离
                    </button>
                    <button
                      onClick={() => {
                        const cmd = '将所有已认证商户的营业时间更新为全欧统一排班';
                        setAiCommand(cmd);
                        handleExecuteAiDbCommand(cmd);
                      }}
                      className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs border border-slate-700"
                    >
                      商户营业规则统一
                    </button>
                  </div>

                  <button
                    onClick={() => handleExecuteAiDbCommand()}
                    disabled={isExecutingAiDb || !aiCommand.trim()}
                    className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                      isExecutingAiDb || !aiCommand.trim()
                        ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                        : 'bg-blue-600 hover:bg-blue-500 text-white shadow-sm'
                    }`}
                  >
                    <Play className="w-3.5 h-3.5 fill-current" />
                    <span>{isExecutingAiDb ? 'AI 正在执行底层改库...' : 'AI 立即执行改库'}</span>
                  </button>
                </div>
              </div>

              {/* Execution Feedback Details */}
              {aiDbExecutionResult && (
                <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-3 font-mono text-xs">
                  <div className="flex items-center justify-between text-emerald-400 font-bold">
                    <span className="flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      <span>{aiDbExecutionResult.message}</span>
                    </span>
                    <span className="text-slate-500 text-[11px]">{aiDbExecutionResult.timestamp}</span>
                  </div>

                  <div className="p-3 bg-slate-900 rounded-lg text-slate-300 border border-slate-800">
                    <div className="text-[10px] text-slate-500 uppercase font-bold">底层生成的执行 SQL:</div>
                    <code className="text-blue-400">{aiDbExecutionResult.executedSql}</code>
                  </div>

                  {aiDbExecutionResult.updatedRecords && aiDbExecutionResult.updatedRecords.length > 0 && (
                    <div className="space-y-1 pt-1">
                      <div className="text-[10px] text-slate-500 uppercase font-bold">部分受影响记录抽样预览:</div>
                      {aiDbExecutionResult.updatedRecords.map((r: any, idx: number) => (
                        <div key={idx} className="flex items-center justify-between p-2 bg-slate-900/60 rounded border border-slate-800/80 text-slate-300">
                          <span className="truncate max-w-sm">{r.title || r.nameZh}</span>
                          <span className="text-emerald-400 text-[10px]">状态: {r.status || '已更新'}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 2: Batch Operations Center */}
        {activeTab === 'batch_ops' && (
          <div className="space-y-6">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div>
                  <h3 className="font-bold text-base text-white">批量自动化运维任务控制台</h3>
                  <p className="text-xs text-slate-400">一键调度全欧多城高耗时自动化运维动作</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="bg-slate-950 border border-slate-800 p-5 rounded-xl space-y-3">
                  <div className="font-bold text-sm text-white flex items-center gap-2">
                    <RefreshCw className="w-4 h-4 text-blue-500" />
                    <span>30 天全欧内容生命周期自动巡检</span>
                  </div>
                  <p className="text-xs text-slate-400">
                    全量检索发布超过 25 天信息，自动触发短信/微信确认模板；30天无应答自动归档。
                  </p>
                  <button
                    onClick={() => handleExecuteAiDbCommand('批量扫描全网超过25天的房源和招聘并标记需要确认')}
                    className="w-full py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-xs font-semibold"
                  >
                    立即运行过期巡检
                  </button>
                </div>

                <div className="bg-slate-950 border border-slate-800 p-5 rounded-xl space-y-3">
                  <div className="font-bold text-sm text-white flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-500" />
                    <span>全网高频欺诈关键词反向排查</span>
                  </div>
                  <p className="text-xs text-slate-400">
                    自动比对图片指纹与敏感汇款账号，锁定跨城同图套现与虚假看房定金诈骗。
                  </p>
                  <button
                    onClick={() => handleExecuteAiDbCommand('扫描涉嫌虚假押金的发布项并将风险分提高至95实施隔离')}
                    className="w-full py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-xs font-semibold"
                  >
                    立即执行反诈雷达
                  </button>
                </div>

                <div className="bg-slate-950 border border-slate-800 p-5 rounded-xl space-y-3">
                  <div className="font-bold text-sm text-white flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-blue-400" />
                    <span>全欧多语言 SEO 矩阵批量生成</span>
                  </div>
                  <p className="text-xs text-slate-400">
                    按城市与行业矩阵构建静态高权重页面，自动注入 Schema.org 结构化数据。
                  </p>
                  <button
                    onClick={() => handleExecuteAiDbCommand('批量生成全欧SEO落地页并注入结构化数据')}
                    className="w-full py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-xs font-semibold"
                  >
                    立即生成 SEO 矩阵
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: Content Listings Management & Batch Mutate */}
        {activeTab === 'listings_mgr' && (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
              <div>
                <h3 className="font-bold text-base text-white">内容数据总控中心 ({listings.length} 条记录)</h3>
                <p className="text-xs text-slate-400">支持多选后批量审核、批量降权或批量恢复在架</p>
              </div>

              {/* Batch action buttons */}
              <div className="flex items-center gap-2 flex-wrap">
                <button
                  onClick={() => handleBatchStatus('active')}
                  className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold"
                >
                  批量审核通过
                </button>
                <button
                  onClick={() => handleBatchStatus('flagged')}
                  className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold"
                >
                  批量标记预警
                </button>
                <button
                  onClick={() => handleBatchStatus('closed')}
                  className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-red-400 text-xs font-semibold"
                >
                  批量关闭下架
                </button>
              </div>
            </div>

            {/* Filter Search */}
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-500" />
              <input
                type="text"
                placeholder="快速筛选标题 / 城市..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-blue-500"
              />
            </div>

            {/* Table */}
            <div className="overflow-x-auto rounded-xl border border-slate-800">
              <table className="w-full text-left text-xs text-slate-300 divide-y divide-slate-800 font-mono">
                <thead className="bg-slate-950 text-slate-400 uppercase text-[10px]">
                  <tr>
                    <th className="p-3 w-8">
                      <input
                        type="checkbox"
                        checked={selectedListingIds.length === listings.length && listings.length > 0}
                        onChange={(e) => {
                          if (e.target.checked) setSelectedListingIds(listings.map((l) => l.id));
                          else setSelectedListingIds([]);
                        }}
                      />
                    </th>
                    <th className="p-3">城市 / 分类</th>
                    <th className="p-3">标题</th>
                    <th className="p-3">标价</th>
                    <th className="p-3">信任分</th>
                    <th className="p-3">当前状态</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/80 bg-slate-900/40 font-sans">
                  {filteredListings.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-800/50">
                      <td className="p-3">
                        <input
                          type="checkbox"
                          checked={selectedListingIds.includes(item.id)}
                          onChange={(e) => {
                            if (e.target.checked) setSelectedListingIds([...selectedListingIds, item.id]);
                            else setSelectedListingIds(selectedListingIds.filter((id) => id !== item.id));
                          }}
                        />
                      </td>
                      <td className="p-3 whitespace-nowrap">
                        <div className="font-bold text-white">{item.cityName}</div>
                        <div className="text-[10px] text-slate-500 font-mono">{item.category}</div>
                      </td>
                      <td className="p-3 max-w-sm truncate text-slate-200">
                        {item.title}
                      </td>
                      <td className="p-3 whitespace-nowrap font-mono font-bold text-emerald-400">
                        €{item.price}
                      </td>
                      <td className="p-3 whitespace-nowrap font-mono">
                        <span className={item.trustScore < 50 ? 'text-red-400 font-bold' : 'text-emerald-400'}>
                          {item.trustScore}
                        </span>
                      </td>
                      <td className="p-3 whitespace-nowrap">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          item.status === 'active'
                            ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                            : item.status === 'flagged'
                            ? 'bg-red-950 text-red-400 border border-red-800'
                            : 'bg-slate-800 text-slate-400'
                        }`}>
                          {item.status === 'active' ? '正常' : item.status === 'flagged' ? '预警' : '待确认'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 4: Master Settings Center */}
        {activeTab === 'settings_hub' && (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div>
                <h3 className="font-bold text-base text-white">大枢配置中心 (Master System Settings)</h3>
                <p className="text-xs text-slate-400">控制全欧自动过期周期、信任分门槛与多语言引擎</p>
              </div>
              <button
                onClick={handleSaveSettings}
                className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-sm"
              >
                保存全局设置
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
              <div className="space-y-4">
                <div>
                  <label className="font-bold text-slate-200">房源与招聘自动过期周期 (天)</label>
                  <input
                    type="number"
                    value={settings.autoExpireDays}
                    onChange={(e) => setSettings({ ...settings, autoExpireDays: parseInt(e.target.value) || 30 })}
                    className="w-full mt-1.5 p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white font-mono"
                  />
                  <p className="text-[11px] text-slate-500 mt-1">超过该天数未更新信息将自动隐藏并移出搜索结果</p>
                </div>

                <div>
                  <label className="font-bold text-slate-200">提前多少天触发短信/微信催验 (天)</label>
                  <input
                    type="number"
                    value={settings.warnBeforeExpireDays}
                    onChange={(e) => setSettings({ ...settings, warnBeforeExpireDays: parseInt(e.target.value) || 5 })}
                    className="w-full mt-1.5 p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white font-mono"
                  />
                  <p className="text-[11px] text-slate-500 mt-1">临近到期时，系统向发布者自动推送“是否已租出/招满”一键确认单</p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="font-bold text-slate-200">免人工初审直接上架信任分阈值 (0-100)</label>
                  <input
                    type="number"
                    value={settings.trustScoreThresholdForAutoPass}
                    onChange={(e) => setSettings({ ...settings, trustScoreThresholdForAutoPass: parseInt(e.target.value) || 75 })}
                    className="w-full mt-1.5 p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white font-mono"
                  />
                  <p className="text-[11px] text-slate-500 mt-1">低于该分数的发布项必须经由 AI 或人工二次核验</p>
                </div>

                <div>
                  <label className="font-bold text-slate-200">全欧支持语言编码矩阵 (不写死双语)</label>
                  <div className="flex flex-wrap gap-2 mt-1.5">
                    {settings.supportedLocales?.map((loc: string) => (
                      <span key={loc} className="px-2.5 py-1 bg-slate-950 border border-slate-800 rounded-lg text-blue-400 font-mono">
                        {loc}
                      </span>
                    ))}
                  </div>
                  <p className="text-[11px] text-slate-500 mt-1">底层采用 i18n 规范字典存储，已为中文、意、法、西、德、英准备多语言结构</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 5: SQL Workbench */}
        {activeTab === 'sql_workbench' && (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Terminal className="w-5 h-5 text-blue-500" />
                <h3 className="font-bold text-base text-white">PostgreSQL 交互式查询控制台</h3>
              </div>
              <span className="text-[11px] text-slate-400 font-mono">Live In-Memory Store Active</span>
            </div>

            <div className="flex items-center gap-2 overflow-x-auto text-xs">
              <span className="text-slate-500 font-mono">快捷查询:</span>
              {['SELECT * FROM listings;', 'SELECT * FROM businesses;', 'SELECT * FROM moderation_audits;'].map((q) => (
                <button
                  key={q}
                  onClick={() => {
                    setSqlQuery(q);
                    handleRunSql(q);
                  }}
                  className="px-2.5 py-1 rounded bg-slate-950 hover:bg-slate-800 text-blue-400 font-mono border border-slate-800"
                >
                  {q}
                </button>
              ))}
            </div>

            <textarea
              value={sqlQuery}
              onChange={(e) => setSqlQuery(e.target.value)}
              rows={3}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 font-mono text-xs text-slate-100 focus:outline-none focus:border-blue-500"
            />

            <div className="flex justify-end">
              <button
                onClick={() => handleRunSql()}
                disabled={isExecutingSql}
                className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-sm transition-all flex items-center gap-1.5"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>{isExecutingSql ? '执行中...' : '运行 SQL'}</span>
              </button>
            </div>

            {sqlResult && (
              <div className="overflow-x-auto rounded-xl border border-slate-800 mt-2">
                <table className="w-full text-left text-xs text-slate-200 divide-y divide-slate-800 font-mono">
                  <thead className="bg-slate-950 text-slate-400 text-[10px] uppercase">
                    <tr>
                      {sqlResult.columns.map((c, i) => (
                        <th key={i} className="p-2.5">{c}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/80 bg-slate-900/40">
                    {sqlResult.rows.map((row, rIdx) => (
                      <tr key={rIdx} className="hover:bg-slate-800/50">
                        {sqlResult.columns.map((c, cIdx) => (
                          <td key={cIdx} className="p-2.5 whitespace-nowrap">
                            {String(row[c] !== undefined ? row[c] : '-')}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
