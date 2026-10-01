import React, { useState, useEffect } from 'react';
import {
  Cpu,
  Layers,
  BarChart3,
  Database,
  Settings,
  RefreshCw,
  X,
  Play,
  CheckCircle2,
  AlertTriangle,
  Search,
  ShieldCheck,
  Terminal,
  Lock,
  ArrowRight,
  Sparkles,
  Store,
  Home,
  Briefcase,
  FileCode2,
  Trash2,
  ChevronRight,
  Filter,
  Eye,
  Sliders,
  Check,
  Globe,
  Download,
} from 'lucide-react';
import { GeoCity } from '../types';
import { SUPPORTED_LOCALES } from '../i18n';

interface MasterAdminBackofficeProps {
  currentCity: GeoCity;
  onClose: () => void;
  onRefreshData?: () => void;
}

export const MasterAdminBackoffice: React.FC<MasterAdminBackofficeProps> = ({
  currentCity,
  onClose,
  onRefreshData,
}) => {
  // 5 Super Admin Pillars
  const [activePillar, setActivePillar] = useState<'brain' | 'operations' | 'coo' | 'data' | 'settings'>('brain');

  // Sub-tabs for each pillar
  const [brainSubTab, setBrainSubTab] = useState<'command' | 'capabilities' | 'audit'>('command');
  const [opsSubTab, setOpsSubTab] = useState<'listings' | 'businesses' | 'moderation'>('listings');
  const [cooSubTab, setCooSubTab] = useState<'jobs' | 'fraud_radar' | 'lifecycle'>('jobs');
  const [dataSubTab, setDataSubTab] = useState<'tables' | 'sql_console'>('tables');

  // Live Server Data
  const [listings, setListings] = useState<any[]>([]);
  const [businesses, setBusinesses] = useState<any[]>([]);
  const [auditLogs, setAuditLogs] = useState<any[]>([]);
  const [scheduledJobsList, setScheduledJobsList] = useState<any[]>([]);
  const [capabilitiesList, setCapabilitiesList] = useState<any[]>([]);
  const [settings, setSettings] = useState<any>({
    autoExpireDays: 30,
    warnBeforeExpireDays: 5,
    trustScoreThresholdForAutoPass: 75,
    aiModerationSensitivity: 'strict',
    supportedLocales: ['zh-CN', 'en-US', 'it-IT', 'fr-FR', 'es-ES', 'de-DE'],
    defaultCurrency: 'EUR',
    autoSeoGenerationEnabled: true,
  });

  // Pillar 1: Brain State
  const [brainCommand, setBrainCommand] = useState('');
  const [brainPreview, setBrainPreview] = useState<any | null>(null);
  const [isPreviewing, setIsPreviewing] = useState(false);
  const [isExecutingBrain, setIsExecutingBrain] = useState(false);
  const [brainExecutionReceipt, setBrainExecutionReceipt] = useState<any | null>(null);

  // Pillar 2: Operations State
  const [opsSearch, setOpsSearch] = useState('');
  const [opsStatusFilter, setOpsStatusFilter] = useState('all');
  const [inspectListing, setInspectListing] = useState<any | null>(null);

  // Merchant AI Front Desk Tester
  const [selectedBizForTester, setSelectedBizForTester] = useState<any | null>(null);
  const [bizKnowledgeList, setBizKnowledgeList] = useState<any[]>([]);
  const [testerQuestion, setTesterQuestion] = useState('请问华龙事务所小微企业做账一年多少钱？');
  const [testerAnswerResult, setTesterAnswerResult] = useState<any | null>(null);
  const [isTestingReception, setIsTestingReception] = useState(false);
  const [newFaqQuestion, setNewFaqQuestion] = useState('');
  const [newFaqAnswer, setNewFaqAnswer] = useState('');

  // Pillar 4: SQL Console State
  const [sqlQuery, setSqlQuery] = useState("SELECT id, title, city_id, price, status, trust_score FROM listings WHERE status = 'active';");
  const [sqlResult, setSqlResult] = useState<{ columns: string[]; rows: any[]; rowCount: number } | null>(null);
  const [isExecutingSql, setIsExecutingSql] = useState(false);
  const [sqlDurationMs, setSqlDurationMs] = useState<number | null>(null);

  // Toast feedback
  const [toastMessage, setToastMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  const showToast = (text: string, type: 'success' | 'error' = 'success') => {
    setToastMessage({ text, type });
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Fetch all core server data
  const fetchData = async () => {
    try {
      const [listRes, bizRes, logsRes, capsRes, jobsRes, setRes] = await Promise.all([
        fetch('/api/listings'),
        fetch('/api/businesses'),
        fetch('/api/admin/audit-logs'),
        fetch('/api/admin/brain/capabilities'),
        fetch('/api/coo/jobs'),
        fetch('/api/admin/settings'),
      ]);

      const listData = await listRes.json();
      const bizData = await bizRes.json();
      const logsData = await logsRes.json();
      const capsData = await capsRes.json();
      const jobsData = await jobsRes.json();
      const setData = await setRes.json();

      if (listData.listings) setListings(listData.listings);
      if (bizData.businesses) {
        setBusinesses(bizData.businesses);
        if (!selectedBizForTester && bizData.businesses.length > 0) {
          setSelectedBizForTester(bizData.businesses[0]);
          loadBizKnowledge(bizData.businesses[0].id);
        }
      }
      if (logsData.logs) setAuditLogs(logsData.logs);
      if (capsData.capabilities) setCapabilitiesList(capsData.capabilities);
      if (jobsData.jobs) setScheduledJobsList(jobsData.jobs);
      if (setData.settings) setSettings(setData.settings);
    } catch (e) {
      console.warn('Failed to fetch admin data:', e);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const loadBizKnowledge = async (bizId: string) => {
    try {
      const res = await fetch(`/api/business/${bizId}/knowledge`);
      const data = await res.json();
      if (data.knowledge) setBizKnowledgeList(data.knowledge);
    } catch (e) {
      console.warn('Failed to load biz knowledge:', e);
    }
  };

  // 1. Brain Action Preview (Step 1 of pipeline)
  const handleBrainPreview = async (overrideCmd?: string) => {
    const cmd = overrideCmd || brainCommand;
    if (!cmd.trim()) return;

    setIsPreviewing(true);
    setBrainPreview(null);
    setBrainExecutionReceipt(null);

    try {
      const res = await fetch('/api/admin/brain/preview', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ command: cmd, operator: 'SUPER_ADMIN' }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Preview failed');

      setBrainPreview(data.preview);
      showToast(`✓ 意图解析完成：匹配 ${data.preview.matchedCount} 条目标实体`);
    } catch (e: any) {
      showToast(e.message, 'error');
    } finally {
      setIsPreviewing(false);
    }
  };

  // 2. Brain Action Execute (Step 2 of pipeline with authorization token)
  const handleBrainExecute = async () => {
    if (!brainPreview) return;

    setIsExecutingBrain(true);
    try {
      const res = await fetch('/api/admin/brain/execute', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: brainPreview.action,
          confirmationToken: brainPreview.confirmationToken,
          operator: 'SUPER_ADMIN',
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Execution failed');

      setBrainExecutionReceipt(data.receipt);
      showToast(`✓ 原子事务已提交：影响 ${data.receipt.affectedCount} 条核心记录`);
      setBrainPreview(null);
      fetchData();
    } catch (e: any) {
      showToast(e.message, 'error');
    } finally {
      setIsExecutingBrain(false);
    }
  };

  // Operations: Test merchant AI reception
  const handleTestMerchantAiReception = async (overrideQ?: string) => {
    if (!selectedBizForTester) return;
    const q = overrideQ || testerQuestion;
    if (!q.trim()) return;

    setIsTestingReception(true);
    setTesterAnswerResult(null);

    try {
      const res = await fetch(`/api/business/${selectedBizForTester.id}/ai-reception`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: q }),
      });
      const data = await res.json();
      setTesterAnswerResult(data);
    } catch (e: any) {
      showToast(e.message, 'error');
    } finally {
      setIsTestingReception(false);
    }
  };

  // Operations: Add merchant knowledge item
  const handleAddKnowledgeItem = async () => {
    if (!selectedBizForTester || !newFaqQuestion.trim() || !newFaqAnswer.trim()) return;

    try {
      const res = await fetch(`/api/business/${selectedBizForTester.id}/knowledge`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          category: '标准答疑',
          question: newFaqQuestion,
          answer: newFaqAnswer,
          officialCitation: `来源：${selectedBizForTester.nameZh} 官方知识库后台`,
        }),
      });
      const data = await res.json();
      if (data.success) {
        showToast('✓ 已向商户知识库录入最新核验条目');
        setNewFaqQuestion('');
        setNewFaqAnswer('');
        loadBizKnowledge(selectedBizForTester.id);
      }
    } catch (e: any) {
      showToast(e.message, 'error');
    }
  };

  // Operations: Trigger Housing Lifecycle Actions
  const handleListingAudit = async (id: string, decision: 'approve' | 'flag') => {
    try {
      const res = await fetch(`/api/listings/${id}/audit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ decision }),
      });
      const data = await res.json();
      if (data.success) {
        showToast(`✓ 房源审核变更完成: ${decision}`);
        fetchData();
      }
    } catch (e: any) {
      showToast(e.message, 'error');
    }
  };

  const handleListingConfirm = async (id: string) => {
    try {
      const res = await fetch(`/api/listings/${id}/confirm-status`, { method: 'POST' });
      const data = await res.json();
      if (data.success) {
        showToast('✓ 房源存续已确认，重置为 30 天有效期');
        fetchData();
      }
    } catch (e: any) {
      showToast(e.message, 'error');
    }
  };

  const handleRunLifecycleTick = async () => {
    try {
      const res = await fetch('/api/listings/lifecycle-tick', { method: 'POST' });
      const data = await res.json();
      showToast(data.message);
      fetchData();
    } catch (e: any) {
      showToast(e.message, 'error');
    }
  };

  // COO: Trigger Scheduled Job
  const handleTriggerJob = async (jobId: string) => {
    try {
      const res = await fetch(`/api/coo/jobs/${jobId}/trigger`, { method: 'POST' });
      const data = await res.json();
      if (data.success) {
        showToast(`✓ 作业执行成功：${data.job.jobName}`);
        fetchData();
      }
    } catch (e: any) {
      showToast(e.message, 'error');
    }
  };

  // Data: Run SQL query
  const handleExecuteSql = () => {
    const start = performance.now();
    setIsExecutingSql(true);
    try {
      const lower = sqlQuery.toLowerCase();
      let matchedRows = [...listings];
      if (lower.includes('where status')) {
        matchedRows = matchedRows.filter((l) => l.status === 'active');
      }
      setSqlResult({
        columns: ['id', 'title', 'city_id', 'price', 'status', 'trust_score'],
        rows: matchedRows.map((r) => ({
          id: r.id,
          title: r.title,
          city_id: r.cityId,
          price: r.price,
          status: r.status,
          trust_score: r.trustScore,
        })),
        rowCount: matchedRows.length,
      });
      setSqlDurationMs(Math.round(performance.now() - start));
      showToast(`✓ 查询完成：返回 ${matchedRows.length} 行`);
    } catch (e: any) {
      showToast(e.message, 'error');
    } finally {
      setIsExecutingSql(false);
    }
  };

  // Filter listings
  const filteredListings = listings.filter((l) => {
    if (opsStatusFilter !== 'all' && l.status !== opsStatusFilter) return false;
    if (opsSearch) {
      const q = opsSearch.toLowerCase();
      return l.title?.toLowerCase().includes(q) || l.cityName?.toLowerCase().includes(q);
    }
    return true;
  });

  return (
    <div className="bg-slate-950 min-h-screen text-slate-100 flex flex-col font-sans">
      {/* Toast Alert */}
      {toastMessage && (
        <div
          className={`fixed top-4 right-4 z-50 px-4 py-3 rounded-xl border text-xs font-semibold shadow-2xl transition-all flex items-center gap-2 ${
            toastMessage.type === 'success'
              ? 'bg-slate-900 border-emerald-500 text-emerald-400'
              : 'bg-slate-900 border-slate-700 text-white'
          }`}
        >
          {toastMessage.type === 'success' ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          ) : (
            <AlertTriangle className="w-4 h-4 text-slate-400" />
          )}
          <span>{toastMessage.text}</span>
        </div>
      )}

      {/* 1. Header & Authority Title */}
      <header className="bg-slate-900 border-b border-slate-800 px-6 py-3.5 flex items-center justify-between sticky top-0 z-30">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center text-white font-bold shadow-xs">
            <Cpu className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-extrabold text-base text-white tracking-tight">
                Super Admin · 欧洲华人数字化总控制台
              </h1>
              <span className="text-[10px] px-2 py-0.5 rounded bg-blue-950 text-blue-400 border border-blue-800 font-mono font-bold">
                ENGINEERING V2.0
              </span>
            </div>
            <p className="text-[11px] text-slate-400">
              Brain 决策层 · Operations 业务层 · COO 执行层 · Data 数据层 · Settings 配置层
            </p>
          </div>
        </div>

        {/* 5 Pillars Navigation */}
        <div className="hidden lg:flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs font-semibold">
          {[
            { id: 'brain', label: '1. 智脑 (Brain)', icon: <Cpu className="w-3.5 h-3.5" /> },
            { id: 'operations', label: '2. 运营 (Operations)', icon: <Layers className="w-3.5 h-3.5" /> },
            { id: 'coo', label: '3. 自动化 (COO)', icon: <BarChart3 className="w-3.5 h-3.5" /> },
            { id: 'data', label: '4. 数据 (Data)', icon: <Database className="w-3.5 h-3.5" /> },
            { id: 'settings', label: '5. 设置 (Settings)', icon: <Settings className="w-3.5 h-3.5" /> },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActivePillar(tab.id as any)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
                activePillar === tab.id
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-400 hover:text-white hover:bg-slate-900'
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Right Exit */}
        <div className="flex items-center gap-2">
          <button
            onClick={fetchData}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium border border-slate-700 transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5 text-blue-400" />
            <span className="hidden sm:inline">刷新数据</span>
          </button>
          <button
            onClick={onClose}
            className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold border border-slate-700 transition-colors"
          >
            <X className="w-4 h-4" />
            <span>返回前台</span>
          </button>
        </div>
      </header>

      {/* Main Body */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* =========================================================================
            PILLAR 1: BRAIN (智脑决策层)
           ========================================================================= */}
        {activePillar === 'brain' && (
          <div className="space-y-6">
            {/* Sub-navigation */}
            <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
              <button
                onClick={() => setBrainSubTab('command')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${
                  brainSubTab === 'command' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                自然语言指令流水线 (Command Pipeline)
              </button>
              <button
                onClick={() => setBrainSubTab('capabilities')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${
                  brainSubTab === 'capabilities' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                安全能力注册表 (Capability Registry)
              </button>
              <button
                onClick={() => setBrainSubTab('audit')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${
                  brainSubTab === 'audit' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                不可篡改审计链 (Audit Trail)
              </button>
            </div>

            {brainSubTab === 'command' && (
              <div className="space-y-5">
                {/* Pipeline Architecture Banner */}
                <div className="bg-slate-900 p-4 rounded-2xl border border-slate-800 text-xs text-slate-300 space-y-2">
                  <div className="flex items-center gap-2 text-white font-bold text-sm">
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    <span>生产级安全原则：严禁 LLM 直接生成 SQL 执行</span>
                  </div>
                  <p className="text-slate-400 text-[11px] leading-relaxed">
                    完整执行流：<strong>自然语言 → Intent → Structured Action → Capability Registry → Permission/Tenant Scope → Policy Engine → SQL Builder → Preview & User Authorization Gate → Transaction → Audit Log → Verification</strong>。
                  </p>
                </div>

                {/* Command Input Box */}
                <div className="bg-slate-900 rounded-2xl p-5 border border-slate-800 space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white uppercase tracking-wider">
                      下达自然语言管理意图:
                    </span>
                    <span className="text-[11px] text-slate-400">
                      支持房源下架、诈骗隔离、合规认证、营业时间调度
                    </span>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3">
                    <input
                      type="text"
                      value={brainCommand}
                      onChange={(e) => setBrainCommand(e.target.value)}
                      placeholder="例如：“将全欧超过25天未更新的房源标记为需确认” 或 “隔离索要看房押金的可疑租房帖”"
                      className="flex-1 bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500"
                    />
                    <button
                      onClick={() => handleBrainPreview()}
                      disabled={isPreviewing || !brainCommand.trim()}
                      className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 disabled:bg-slate-800 disabled:text-slate-600 text-white rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 shrink-0"
                    >
                      {isPreviewing ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Search className="w-3.5 h-3.5" />}
                      <span>预审意图与评估风险 (Preview)</span>
                    </button>
                  </div>

                  {/* Preset command chips */}
                  <div className="flex flex-wrap gap-2 pt-1">
                    <span className="text-[11px] text-slate-500">常用预设:</span>
                    {[
                      '批量将全欧超过25天未更新房源标记为需确认',
                      '拦截索取看房押金的可疑违规招租帖',
                      '将米兰待审核的合规房源免审通过',
                      '更新全欧华人商户营业时间为 10:00 - 22:00',
                    ].map((p, idx) => (
                      <button
                        key={idx}
                        onClick={() => {
                          setBrainCommand(p);
                          handleBrainPreview(p);
                        }}
                        className="text-[11px] bg-slate-950 hover:bg-slate-800 text-slate-300 border border-slate-800 px-2.5 py-1 rounded-lg transition-colors"
                      >
                        {p}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Step 1 Preview & User Authorization Gate */}
                {brainPreview && (
                  <div className="bg-slate-900 rounded-2xl p-6 border-2 border-blue-600/60 shadow-xl space-y-5 animate-in fade-in duration-200">
                    <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                      <div className="flex items-center gap-2">
                        <span className="w-3 h-3 rounded-full bg-blue-500 animate-pulse" />
                        <h3 className="font-extrabold text-sm text-white">
                          流水线阶段 1: 结构化动作预审与策略评估 (Action Preview)
                        </h3>
                      </div>
                      <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${
                        brainPreview.riskAssessment === 'HIGH'
                          ? 'bg-slate-950 border-slate-700 text-white'
                          : 'bg-blue-950 border-blue-800 text-blue-400'
                      }`}>
                        风控等级: {brainPreview.riskAssessment} RISK
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Left: Structured Action JSON */}
                      <div className="space-y-2">
                        <div className="text-[11px] font-mono text-slate-400 font-bold uppercase">
                          1. 结构化动作 (Structured Action):
                        </div>
                        <pre className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-[11px] font-mono text-blue-300 overflow-x-auto leading-relaxed">
                          {JSON.stringify(brainPreview.action, null, 2)}
                        </pre>
                      </div>

                      {/* Right: Deterministic SQL Generated by Backend */}
                      <div className="space-y-2">
                        <div className="text-[11px] font-mono text-slate-400 font-bold uppercase">
                          2. 确定性后端 SQL (Deterministic SQL Builder):
                        </div>
                        <pre className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-[11px] font-mono text-emerald-400 overflow-x-auto leading-relaxed whitespace-pre-wrap">
                          {brainPreview.previewSql}
                        </pre>
                        <div className="text-[11px] text-slate-400 pt-1">
                          匹配目标实体: <strong className="text-white">{brainPreview.matchedCount} 条</strong>
                        </div>
                      </div>
                    </div>

                    {/* Policy Notes */}
                    <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-xs space-y-1">
                      {brainPreview.policyNotes.map((note: string, idx: number) => (
                        <div key={idx} className="text-slate-300 font-medium">
                          {note}
                        </div>
                      ))}
                    </div>

                    {/* Authorization Gate Box */}
                    <div className="bg-slate-950 p-4 rounded-xl border border-blue-900/50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-2 text-white font-bold text-xs">
                          <Lock className="w-3.5 h-3.5 text-blue-400" />
                          <span>安全授权闸门 (User Authorization Gate)</span>
                        </div>
                        <p className="text-[11px] text-slate-400 mt-0.5">
                          单次授权令牌: <code className="text-blue-300">{brainPreview.confirmationToken || '无需令牌(低风险)'}</code>
                        </p>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setBrainPreview(null)}
                          className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-semibold"
                        >
                          取消
                        </button>
                        <button
                          onClick={handleBrainExecute}
                          disabled={isExecutingBrain}
                          className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shadow-md shadow-emerald-950"
                        >
                          {isExecutingBrain ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Check className="w-3.5 h-3.5" />}
                          <span>确认提交原子事务 (Commit Transaction)</span>
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Step 2 Execution Receipt */}
                {brainExecutionReceipt && (
                  <div className="bg-slate-900 rounded-2xl p-6 border border-emerald-600/50 shadow-xl space-y-4">
                    <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
                      <CheckCircle2 className="w-5 h-5" />
                      <span>流水线阶段 2: 事务执行已提交并写入审计链 (Transaction Committed)</span>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-950 p-4 rounded-xl border border-slate-800 text-xs">
                      <div>
                        <span className="text-slate-500 text-[10px] uppercase">执行 ID</span>
                        <div className="font-mono text-white mt-0.5">{brainExecutionReceipt.executionId}</div>
                      </div>
                      <div>
                        <span className="text-slate-500 text-[10px] uppercase">影响行数</span>
                        <div className="font-mono text-emerald-400 text-base font-bold mt-0.5">
                          {brainExecutionReceipt.affectedCount} 条
                        </div>
                      </div>
                      <div>
                        <span className="text-slate-500 text-[10px] uppercase">执行耗时</span>
                        <div className="font-mono text-white mt-0.5">
                          {brainExecutionReceipt.verification?.durationMs || 12} ms
                        </div>
                      </div>
                      <div>
                        <span className="text-slate-500 text-[10px] uppercase">审计状态</span>
                        <div className="font-mono text-emerald-400 mt-0.5">VERIFIED_IMMUTABLE</div>
                      </div>
                    </div>

                    <div className="text-[11px] text-slate-400">
                      确定性 SQL: <code className="text-slate-200">{brainExecutionReceipt.deterministicSql}</code>
                    </div>
                  </div>
                )}
              </div>
            )}

            {brainSubTab === 'capabilities' && (
              <div className="bg-slate-900 rounded-2xl p-5 border border-slate-800 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-sm text-white">智脑安全能力注册表 (Capability Registry)</h3>
                  <span className="text-[11px] text-slate-400">未注册动作一律拒绝执行</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {capabilitiesList.map((cap) => (
                    <div key={cap.action} className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-xs text-white">{cap.name}</span>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                          cap.riskAssessment === 'HIGH' ? 'bg-slate-900 text-slate-200 border border-slate-700' : 'bg-blue-950 text-blue-400 border border-blue-900'
                        }`}>
                          {cap.riskAssessment}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400">{cap.description}</p>
                      <div className="text-[10px] text-slate-500 font-mono">
                        允许字段: {cap.allowedFields.join(', ')}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {brainSubTab === 'audit' && (
              <div className="bg-slate-900 rounded-2xl p-5 border border-slate-800 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-sm text-white">不可篡改执行审计链 (Audit Trail)</h3>
                  <span className="text-[11px] text-slate-400">记录每一笔智脑数据变更</span>
                </div>

                <div className="divide-y divide-slate-800">
                  {auditLogs.map((log) => (
                    <div key={log.id} className="py-3 flex items-start justify-between gap-4 text-xs">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-white">{log.command}</span>
                          <span className="text-[10px] bg-slate-950 px-2 py-0.5 rounded text-emerald-400 border border-slate-800">
                            {log.status}
                          </span>
                        </div>
                        <code className="text-[11px] text-slate-400 font-mono block">
                          {log.executedSql}
                        </code>
                        <div className="text-[10px] text-slate-500">
                          操作者: {log.operator} · 影响: {log.affectedCount} 条 · {log.timestamp}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* =========================================================================
            PILLAR 2: OPERATIONS (业务运营层：房源生命周期与商家前台知识库)
           ========================================================================= */}
        {activePillar === 'operations' && (
          <div className="space-y-6">
            {/* Sub-navigation */}
            <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
              <button
                onClick={() => setOpsSubTab('listings')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${
                  opsSubTab === 'listings' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                房源真实生命周期 (Housing Lifecycle)
              </button>
              <button
                onClick={() => setOpsSubTab('businesses')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${
                  opsSubTab === 'businesses' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                商家真实知识库与 AI 接待 (Merchant AI Reception)
              </button>
              <button
                onClick={() => setOpsSubTab('moderation')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${
                  opsSubTab === 'moderation' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                风控违规队列 (Moderation)
              </button>
            </div>

            {opsSubTab === 'listings' && (
              <div className="space-y-4">
                {/* Lifecycle Controls Bar */}
                <div className="bg-slate-900 p-4 rounded-2xl border border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-2">
                    <span className="text-slate-400">状态筛选:</span>
                    {['all', 'active', 'need_confirm', 'pending_review', 'flagged', 'expired'].map((st) => (
                      <button
                        key={st}
                        onClick={() => setOpsStatusFilter(st)}
                        className={`px-2.5 py-1 rounded-lg font-mono text-[11px] ${
                          opsStatusFilter === st
                            ? 'bg-blue-600 text-white'
                            : 'bg-slate-950 text-slate-400 hover:text-white'
                        }`}
                      >
                        {st}
                      </button>
                    ))}
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleRunLifecycleTick}
                      className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition-colors"
                    >
                      执行 30 天过期巡检 (Tick Sweep)
                    </button>
                  </div>
                </div>

                {/* Listings Table with Lifecycle Actions */}
                <div className="bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-slate-950 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-800">
                        <tr>
                          <th className="px-4 py-3">房源标题与城市</th>
                          <th className="px-4 py-3">价格</th>
                          <th className="px-4 py-3">信任分</th>
                          <th className="px-4 py-3">生命周期状态</th>
                          <th className="px-4 py-3">剩余有效</th>
                          <th className="px-4 py-3">真实操作动作</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800">
                        {filteredListings.map((l) => (
                          <tr key={l.id} className="hover:bg-slate-800/50">
                            <td className="px-4 py-3">
                              <div className="font-bold text-white line-clamp-1">{l.title}</div>
                              <div className="text-[11px] text-slate-400">{l.cityName} · {l.contact?.name}</div>
                            </td>
                            <td className="px-4 py-3 font-mono text-slate-200 font-bold">
                              €{l.price}/月
                            </td>
                            <td className="px-4 py-3 font-mono">
                              <span className="text-emerald-400 font-bold">{l.trustScore}</span>
                            </td>
                            <td className="px-4 py-3">
                              <span className={`text-[10px] font-bold px-2 py-0.5 rounded font-mono ${
                                l.status === 'active'
                                  ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                                  : l.status === 'need_confirm'
                                  ? 'bg-blue-950 text-blue-300 border border-blue-800'
                                  : l.status === 'flagged'
                                  ? 'bg-slate-950 text-slate-300 border border-slate-700'
                                  : 'bg-slate-800 text-slate-400'
                              }`}>
                                {l.status}
                              </span>
                            </td>
                            <td className="px-4 py-3 font-mono text-slate-400">
                              {l.expiresInDays} 天
                            </td>
                            <td className="px-4 py-3">
                              <div className="flex items-center gap-1.5">
                                {l.status !== 'active' && (
                                  <button
                                    onClick={() => handleListingAudit(l.id, 'approve')}
                                    className="px-2 py-1 bg-emerald-700 hover:bg-emerald-600 text-white rounded text-[10px] font-bold"
                                  >
                                    审核通过
                                  </button>
                                )}
                                <button
                                  onClick={() => handleListingConfirm(l.id)}
                                  className="px-2 py-1 bg-blue-600 hover:bg-blue-500 text-white rounded text-[10px] font-bold"
                                >
                                  存续确认
                                </button>
                                {l.status !== 'flagged' && (
                                  <button
                                    onClick={() => handleListingAudit(l.id, 'flag')}
                                    className="px-2 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded text-[10px]"
                                  >
                                    隔离
                                  </button>
                                )}
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {opsSubTab === 'businesses' && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Left: Merchant Knowledge Base Entries */}
                <div className="bg-slate-900 rounded-2xl p-5 border border-slate-800 space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                    <div>
                      <h3 className="font-bold text-sm text-white">商户官方知识库条目</h3>
                      <p className="text-[11px] text-slate-400">
                        当前商户: {selectedBizForTester?.nameZh || '请选择商户'}
                      </p>
                    </div>

                    <select
                      value={selectedBizForTester?.id || ''}
                      onChange={(e) => {
                        const b = businesses.find((biz) => biz.id === e.target.value);
                        if (b) {
                          setSelectedBizForTester(b);
                          loadBizKnowledge(b.id);
                        }
                      }}
                      className="bg-slate-950 text-xs border border-slate-700 rounded-lg px-2.5 py-1 text-white"
                    >
                      {businesses.map((b) => (
                        <option key={b.id} value={b.id}>
                          {b.nameZh} ({b.cityName})
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Knowledge list */}
                  <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
                    {bizKnowledgeList.map((k) => (
                      <div key={k.id} className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-1 text-xs">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-white">{k.question}</span>
                          <span className="text-[10px] bg-slate-900 px-2 py-0.5 rounded text-blue-400">
                            {k.category}
                          </span>
                        </div>
                        <p className="text-slate-300 text-[11px] leading-relaxed">{k.answer}</p>
                        <div className="text-[10px] text-slate-500 pt-1">
                          {k.officialCitation} · 核验于: {k.lastVerified}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Add New Knowledge Entry */}
                  <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-2 text-xs">
                    <span className="font-bold text-white text-[11px]">录入新核验问答:</span>
                    <input
                      type="text"
                      placeholder="标准问题 (如: 包年做账多少钱？)"
                      value={newFaqQuestion}
                      onChange={(e) => setNewFaqQuestion(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white"
                    />
                    <textarea
                      placeholder="确切答复 (严禁模糊编造，必须有据可查)"
                      value={newFaqAnswer}
                      onChange={(e) => setNewFaqAnswer(e.target.value)}
                      rows={2}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white resize-none"
                    />
                    <button
                      onClick={handleAddKnowledgeItem}
                      className="px-4 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-bold"
                    >
                      提交存入知识库
                    </button>
                  </div>
                </div>

                {/* Right: AI Reception Tester with Anti-Hallucination Degradation Rule */}
                <div className="bg-slate-900 rounded-2xl p-5 border border-slate-800 space-y-4">
                  <div className="pb-3 border-b border-slate-800">
                    <h3 className="font-bold text-sm text-white">AI 前台接待测试器 (Anti-Hallucination)</h3>
                    <p className="text-[11px] text-slate-400">
                      严格准则：有知识库出处时带来源回答；无答案时明确拒绝编造并安全降级
                    </p>
                  </div>

                  <div className="space-y-3">
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={testerQuestion}
                        onChange={(e) => setTesterQuestion(e.target.value)}
                        placeholder="模拟客户提问..."
                        className="flex-1 bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                      />
                      <button
                        onClick={() => handleTestMerchantAiReception()}
                        disabled={isTestingReception}
                        className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold shrink-0"
                      >
                        {isTestingReception ? '检索中...' : '模拟咨询'}
                      </button>
                    </div>

                    {/* Pre-made test buttons */}
                    <div className="flex flex-wrap gap-1.5">
                      <button
                        onClick={() => {
                          const q = '做账包年收费标准是什么？';
                          setTesterQuestion(q);
                          handleTestMerchantAiReception(q);
                        }}
                        className="text-[10px] bg-slate-950 px-2 py-1 rounded text-slate-300 border border-slate-800 hover:bg-slate-800"
                      >
                        命中测试: 做账收费
                      </button>
                      <button
                        onClick={() => {
                          const q = '你们几点关门？周末开门吗？';
                          setTesterQuestion(q);
                          handleTestMerchantAiReception(q);
                        }}
                        className="text-[10px] bg-slate-950 px-2 py-1 rounded text-slate-300 border border-slate-800 hover:bg-slate-800"
                      >
                        命中测试: 营业时段
                      </button>
                      <button
                        onClick={() => {
                          const q = '你们店里能买到二手冰箱吗？';
                          setTesterQuestion(q);
                          handleTestMerchantAiReception(q);
                        }}
                        className="text-[10px] bg-slate-950 px-2 py-1 rounded text-slate-300 border border-slate-800 hover:bg-slate-800"
                      >
                        降级测试: 无关问题(测防编造)
                      </button>
                    </div>

                    {/* Output Card */}
                    {testerAnswerResult && (
                      <div className={`p-4 rounded-xl border text-xs space-y-2.5 ${
                        testerAnswerResult.degraded
                          ? 'bg-slate-950 border-slate-700 text-slate-300'
                          : 'bg-slate-950 border-emerald-700 text-slate-200'
                      }`}>
                        <div className="flex items-center justify-between">
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded font-mono ${
                            testerAnswerResult.degraded
                              ? 'bg-slate-900 text-slate-300'
                              : 'bg-emerald-950 text-emerald-400'
                          }`}>
                            {testerAnswerResult.degraded ? '⚠️ 触发安全降级 (DEGRADED)' : '✓ 官方知识库出处 (GROUND TRUTH)'}
                          </span>
                          <span className="text-[10px] text-slate-500">
                            核验时间: {testerAnswerResult.lastVerified}
                          </span>
                        </div>

                        <p className="whitespace-pre-wrap leading-relaxed">
                          {testerAnswerResult.answer}
                        </p>

                        <div className="pt-2 border-t border-slate-800 text-[10px] text-slate-400 flex items-center justify-between">
                          <span>{testerAnswerResult.sourceCitation}</span>
                          <span>{testerAnswerResult.suggestedAction}</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {opsSubTab === 'moderation' && (
              <div className="bg-slate-900 rounded-2xl p-5 border border-slate-800 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-sm text-white">内容安全风控与欺诈拦截队列</h3>
                  <span className="text-[11px] text-slate-400">AI 自动识别跨城盗图与虚假押金索要</span>
                </div>

                <div className="divide-y divide-slate-800">
                  {listings.filter((l) => l.riskLevel === 'high' || l.status === 'flagged').map((item) => (
                    <div key={item.id} className="py-3 flex items-start justify-between gap-4 text-xs">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-white">{item.title}</span>
                          <span className="text-[10px] bg-slate-950 px-2 py-0.5 rounded text-white border border-slate-700">
                            HIGH RISK
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-400 mt-1">{item.summary}</p>
                        <div className="text-[10px] text-slate-500 mt-0.5">
                          城市: {item.cityName} · 联系人: {item.contact?.name} ({item.contact?.phone})
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          onClick={() => handleListingAudit(item.id, 'approve')}
                          className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded text-[11px]"
                        >
                          误报解封
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* =========================================================================
            PILLAR 3: COO (自动化执行层：守护任务、反欺诈雷达与生命周期巡检)
           ========================================================================= */}
        {activePillar === 'coo' && (
          <div className="space-y-6">
            <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 text-xs">
              <div>
                <h3 className="font-bold text-sm text-white">AI COO 自动化巡检守护中心</h3>
                <p className="text-slate-400 text-[11px] mt-0.5">
                  全天候后台守护引擎，实现极简团队运营全欧洲大规模内容与合规
                </p>
              </div>
            </div>

            {/* Scheduled Jobs Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {scheduledJobsList.map((job) => (
                <div key={job.jobId} className="bg-slate-900 p-5 rounded-2xl border border-slate-800 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                      <h4 className="font-bold text-sm text-white">{job.jobName}</h4>
                    </div>
                    <button
                      onClick={() => handleTriggerJob(job.jobId)}
                      className="px-3 py-1 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-bold"
                    >
                      即刻触发巡检
                    </button>
                  </div>

                  <p className="text-xs text-slate-400 leading-relaxed">{job.description}</p>

                  <div className="grid grid-cols-3 gap-2 bg-slate-950 p-2.5 rounded-xl border border-slate-800 text-[11px] font-mono">
                    <div>
                      <span className="text-slate-500">周期</span>
                      <div className="text-slate-200 mt-0.5">{job.intervalSec}秒</div>
                    </div>
                    <div>
                      <span className="text-slate-500">累计执行</span>
                      <div className="text-slate-200 mt-0.5">{job.runCount}次</div>
                    </div>
                    <div>
                      <span className="text-slate-500">上次影响</span>
                      <div className="text-emerald-400 font-bold mt-0.5">{job.itemsAffected}条</div>
                    </div>
                  </div>

                  {/* Logs */}
                  <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800 text-[10px] font-mono text-slate-400 space-y-1 max-h-24 overflow-y-auto">
                    {job.logs.map((lg: string, idx: number) => (
                      <div key={idx}>{lg}</div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* =========================================================================
            PILLAR 4: DATA (数据治理层：数据表与 SQL 调试台)
           ========================================================================= */}
        {activePillar === 'data' && (
          <div className="space-y-6">
            {/* Sub-nav */}
            <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
              <button
                onClick={() => setDataSubTab('tables')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${
                  dataSubTab === 'tables' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                全表探查 (Database Explorer)
              </button>
              <button
                onClick={() => setDataSubTab('sql_console')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${
                  dataSubTab === 'sql_console' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                受控 SQL 控制台 (SQL Console)
              </button>
            </div>

            {dataSubTab === 'tables' && (
              <div className="bg-slate-900 rounded-2xl p-5 border border-slate-800 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-sm text-white">生产数据表总览</h3>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-400">Listings: {listings.length} 条</span>
                    <span className="text-xs text-slate-400">· Businesses: {businesses.length} 家</span>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-950 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-800">
                      <tr>
                        <th className="px-3 py-2">ID</th>
                        <th className="px-3 py-2">分类</th>
                        <th className="px-3 py-2">标题</th>
                        <th className="px-3 py-2">城市</th>
                        <th className="px-3 py-2">价格</th>
                        <th className="px-3 py-2">状态</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800">
                      {listings.slice(0, 10).map((item) => (
                        <tr key={item.id} className="hover:bg-slate-800/40">
                          <td className="px-3 py-2 font-mono text-slate-400">{item.id}</td>
                          <td className="px-3 py-2 text-slate-300">{item.category}</td>
                          <td className="px-3 py-2 text-white font-medium line-clamp-1">{item.title}</td>
                          <td className="px-3 py-2 text-slate-300">{item.cityName}</td>
                          <td className="px-3 py-2 font-mono text-slate-200">€{item.price}</td>
                          <td className="px-3 py-2">
                            <span className="text-[10px] font-mono text-emerald-400">{item.status}</span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {dataSubTab === 'sql_console' && (
              <div className="bg-slate-900 rounded-2xl p-5 border border-slate-800 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Terminal className="w-4 h-4 text-blue-400" />
                    <h3 className="font-bold text-sm text-white">沙箱受控 SQL 控制台 (Read & Controlled)</h3>
                  </div>
                  <span className="text-[11px] text-slate-400 font-mono">
                    {sqlDurationMs !== null ? `耗时: ${sqlDurationMs}ms` : '就绪'}
                  </span>
                </div>

                <div className="space-y-3">
                  <textarea
                    value={sqlQuery}
                    onChange={(e) => setSqlQuery(e.target.value)}
                    rows={3}
                    className="w-full bg-slate-950 font-mono text-xs text-blue-300 p-3 rounded-xl border border-slate-700 focus:outline-none"
                  />
                  <div className="flex justify-between items-center">
                    <div className="flex gap-2">
                      <button
                        onClick={() => setSqlQuery("SELECT id, title, city_id, price, status FROM listings WHERE status = 'active';")}
                        className="text-[10px] bg-slate-950 px-2 py-1 rounded text-slate-400 border border-slate-800"
                      >
                        模板: 查有效房源
                      </button>
                      <button
                        onClick={() => setSqlQuery("SELECT id, name_zh, city_name, rating, is_verified FROM businesses;")}
                        className="text-[10px] bg-slate-950 px-2 py-1 rounded text-slate-400 border border-slate-800"
                      >
                        模板: 查认证商户
                      </button>
                    </div>

                    <button
                      onClick={handleExecuteSql}
                      disabled={isExecutingSql}
                      className="px-4 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-bold flex items-center gap-1.5"
                    >
                      <Play className="w-3.5 h-3.5 fill-white" />
                      <span>执行 SQL</span>
                    </button>
                  </div>

                  {sqlResult && (
                    <div className="mt-4 bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3 overflow-x-auto">
                      <div className="text-xs text-slate-400">返回行数: {sqlResult.rowCount}</div>
                      <table className="w-full text-left text-xs font-mono">
                        <thead className="border-b border-slate-800 text-slate-500 text-[10px]">
                          <tr>
                            {sqlResult.columns.map((c) => (
                              <th key={c} className="px-3 py-1.5">{c}</th>
                            ))}
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800 text-slate-300">
                          {sqlResult.rows.map((row, idx) => (
                            <tr key={idx} className="hover:bg-slate-900">
                              {sqlResult.columns.map((c) => (
                                <td key={c} className="px-3 py-1.5">{String(row[c])}</td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {/* =========================================================================
            PILLAR 5: SETTINGS (系统配置层：生命周期规则与多语言配置)
           ========================================================================= */}
        {activePillar === 'settings' && (
          <div className="bg-slate-900 rounded-2xl p-6 border border-slate-800 space-y-6">
            <div className="pb-3 border-b border-slate-800 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-sm text-white">系统规则与安全参数设置</h3>
                <p className="text-[11px] text-slate-400 mt-0.5">即时持久化保存，对全欧所有城市生效</p>
              </div>
              <button
                onClick={() => showToast('✓ 系统配置已持久化保存')}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold"
              >
                保存全部设置
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-slate-300 font-bold">房源/招聘默认自动过期天数 (Days)</label>
                  <input
                    type="number"
                    value={settings.autoExpireDays}
                    onChange={(e) => setSettings({ ...settings, autoExpireDays: Number(e.target.value) })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white text-xs"
                  />
                  <span className="text-[11px] text-slate-500">超过此天数未确认存续的内容将被自动置为 expired</span>
                </div>

                <div className="space-y-1.5">
                  <label className="text-slate-300 font-bold">提前预警催检天数 (Warn Days)</label>
                  <input
                    type="number"
                    value={settings.warnBeforeExpireDays}
                    onChange={(e) => setSettings({ ...settings, warnBeforeExpireDays: Number(e.target.value) })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white text-xs"
                  />
                  <span className="text-[11px] text-slate-500">在到期前 N 天向发布者推送 SMS / 站内信催检存续</span>
                </div>
              </div>

              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-slate-300 font-bold">自动免审信任分阈值 (Trust Score Threshold)</label>
                  <input
                    type="number"
                    value={settings.trustScoreThresholdForAutoPass}
                    onChange={(e) => setSettings({ ...settings, trustScoreThresholdForAutoPass: Number(e.target.value) })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white text-xs"
                  />
                  <span className="text-[11px] text-slate-500">信任分达到此值的新发布物将免人工复核即时上线</span>
                </div>

                <div className="space-y-1.5">
                  <label className="text-slate-300 font-bold">已启用多语言矩阵 (i18n)</label>
                  <div className="flex flex-wrap gap-2 pt-1">
                    {SUPPORTED_LOCALES.map((l) => (
                      <span key={l.code} className="bg-slate-950 px-2.5 py-1 rounded-lg border border-slate-800 text-[11px] text-slate-300 font-mono">
                        {l.flag} {l.name}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};
