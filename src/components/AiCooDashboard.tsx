import React, { useState, useEffect } from 'react';
import { BarChart3, ShieldAlert, Cpu, Sparkles, RefreshCw, FileText, CheckCircle2, AlertTriangle, ArrowUpRight, Globe, Layers } from 'lucide-react';

export const AiCooDashboard: React.FC = () => {
  const [metrics, setMetrics] = useState({
    dailyActiveUsers: 38420,
    newRegistrations: 1420,
    aiQueriesHandled: 34890,
    autoResolutionRate: 97.2,
    listingsActive: 18450,
    fraudBlockedCount: 14,
    expiredCleanedToday: 216,
    seoPagesGenerated: 380,
  });

  const [recentAudits, setRecentAudits] = useState([
    { id: '1', type: 'fraud_prevention', title: '拦截虚假预收看房押金违规招租', risk: 'high', action: '已自动冻结并通知安全员', time: '5分钟前' },
    { id: '2', type: 'auto_expiration', title: '巴黎13区餐馆企台招聘已超30天未确认', risk: 'low', action: '已自动下架并发送确认短信', time: '18分钟前' },
    { id: '3', type: 'gov_sync', title: '抓取意大利劳工大赦最新省政府公告', risk: 'info', action: '已自动翻译+结构化并入知识库', time: '42分钟前' },
    { id: '4', type: 'auto_seo', title: '生成米兰中文会计高价值落地页', risk: 'success', action: '结构化 JSON-LD 已注入并提交收录', time: '1小时前' },
  ]);

  const [isSimulatingClean, setIsSimulatingClean] = useState(false);

  const handleRunOpsClean = () => {
    setIsSimulatingClean(true);
    setTimeout(() => {
      setMetrics((prev) => ({
        ...prev,
        expiredCleanedToday: prev.expiredCleanedToday + 12,
        autoResolutionRate: 97.5,
      }));
      setIsSimulatingClean(false);
    }, 1000);
  };

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="bg-slate-900 text-white rounded-2xl p-6 shadow-xl border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-blue-400 font-bold text-xs uppercase tracking-wider mb-2">
            <Cpu className="w-4 h-4" />
            <span>欧洲华人 AI · 自动运营中台 (AI COO ENGINE)</span>
          </div>
          <h2 className="text-2xl font-black tracking-tight">
            5~10 人极简团队 · 驱动全欧洲超大规模华人数字生活
          </h2>
          <p className="text-xs text-slate-300 mt-1 max-w-2xl leading-relaxed">
            核心原则：人负责规则、审核与例外；AI 自动负责 95% 以上的内容采集、意图理解、反诈风控、30天过期清理与多语言 SEO 产出。
          </p>
        </div>

        <button
          onClick={handleRunOpsClean}
          disabled={isSimulatingClean}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-md transition-all shrink-0"
        >
          <RefreshCw className={`w-4 h-4 ${isSimulatingClean ? 'animate-spin' : ''}`} />
          <span>{isSimulatingClean ? '正在调度巡检...' : '执行全欧数据自动巡检'}</span>
        </button>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="text-[11px] font-bold text-slate-400 uppercase">全欧日活用户 (DAU)</div>
          <div className="text-2xl font-black text-slate-900 mt-1 font-mono">{metrics.dailyActiveUsers.toLocaleString()}</div>
          <div className="text-[10px] text-emerald-600 font-bold mt-1">↑ +8.4% 环比昨日</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="text-[11px] font-bold text-slate-400 uppercase">AI 客服自动解决率</div>
          <div className="text-2xl font-black text-blue-600 mt-1 font-mono">{metrics.autoResolutionRate}%</div>
          <div className="text-[10px] text-slate-500 mt-1">无需人工干预占比</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="text-[11px] font-bold text-slate-400 uppercase">今日自动阻断诈骗风险</div>
          <div className="text-2xl font-black text-slate-900 mt-1 font-mono">{metrics.fraudBlockedCount} 起</div>
          <div className="text-[10px] text-slate-500 font-bold mt-1">高风险自动拦截</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="text-[11px] font-bold text-slate-400 uppercase">自动过期/催检内容</div>
          <div className="text-2xl font-black text-emerald-600 mt-1 font-mono">{metrics.expiredCleanedToday} 条</div>
          <div className="text-[10px] text-slate-500 mt-1">杜绝过期无效垃圾贴</div>
        </div>
      </div>

      {/* Two Column Section: AI Operations Daily Report & Live Audit Stream */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: AI COO Daily Operations Report */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-blue-600" />
              <h3 className="font-bold text-sm text-slate-900">《欧洲华人 AI 每日运营简报》</h3>
            </div>
            <span className="text-[10px] font-mono text-slate-400">实时生成 · 自动汇报</span>
          </div>

          <div className="bg-slate-50 rounded-xl p-4 text-xs text-slate-700 space-y-2.5 font-mono leading-relaxed border border-slate-100">
            <div><strong>【用户态势】</strong> 新增用户 +{metrics.newRegistrations}人，意法西德四国华人流量分布健康，米兰与巴黎占比超 54%。</div>
            <div><strong>【内容流通】</strong> 今日新发布房源 421 套、招聘 186 岗位，AI 意图解析准确率达 99.1%，未发现同图跨城欺诈套现违规。</div>
            <div><strong>【智能降本】</strong> AI 助手累计交互 {metrics.aiQueriesHandled.toLocaleString()} 次，人工支持工单仅 24 起（主要为极端合同纠纷与特需商务认证），人力成本相较传统社区节省 92%。</div>
            <div><strong>【SEO 产出】</strong> 自动生成高质量语义页面 {metrics.seoPagesGenerated} 篇（覆盖意大利普拉托服装厂、巴黎13区中文律所），Google 抓取指数稳定。</div>
          </div>
        </div>

        {/* Right: Live Automated Audit & Trust Stream */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-slate-700" />
              <h3 className="font-bold text-sm text-slate-900">AI 自动化工作流实时动态</h3>
            </div>
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
          </div>

          <div className="space-y-3">
            {recentAudits.map((a) => (
              <div
                key={a.id}
                className="flex items-start justify-between p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs"
              >
                <div>
                  <div className="font-bold text-slate-800">{a.title}</div>
                  <div className="text-[11px] text-slate-500 mt-0.5">{a.action}</div>
                </div>
                <div className="text-right shrink-0">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                    a.risk === 'high' ? 'bg-slate-900 text-white' : 'bg-slate-200 text-slate-700'
                  }`}>
                    {a.time}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
