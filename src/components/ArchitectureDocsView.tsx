import React, { useState } from 'react';
import { BookOpen, Copy, Check, FileCode2, Database, Network, Bot, ListChecks, Layers } from 'lucide-react';

export const ArchitectureDocsView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'sitemap' | 'db' | 'system' | 'agent' | 'roadmap'>('system');
  const [copied, setCopied] = useState(false);

  const fullArchitectureDoc = `# 《欧洲华人 AI 智能平台》核心系统架构总纲与开发指令集 V1.0
## Europe Chinese AI Super Platform (Huaren Europe AI)

### 一、最高原则
1. 内容版块保持完整：保留房屋、招聘、店铺转让、二手、生活服务、商家、餐馆、论坛、汽车、交友、活动等传统分类。
2. 底层全部重构为 AI 原生操作系统：搜索、筛选、对比、核查、翻译、推荐、预约、归档全流程由 AI 协助。
3. 极简团队自动化运营：人工只负责规则、审核与例外，AI 负责 95% 以上内容采集、去重、翻译、过期清理与客服。

### 二、数据库 Schema (PostgreSQL)
- geo_countries (国家表: IT, FR, ES, DE, NL...)
- geo_cities (城市表: milan, rome, paris, madrid, frankfurt...)
- users (用户与多角色RBAC体系，含 trust_score 信任分)
- listings (统一内容发布物表: 房屋/招聘/二手/转让，含结构化 meta 与自动过期时间)
- businesses (认证商家与 AI 智能接待知识库表)
- forum_threads (论坛知识库与 AI 100楼总结表)
- ai_agent_tasks (AI 任务会话与用户授权操作审计日志)

### 三、AI 核心工作流
意图理解 -> 槽位提取 -> 多源检索 -> 决策比对矩阵 -> 行动提案草案 -> 用户安全授权闸门 -> 个人欧洲生活档案归档。`;

  const handleCopyDoc = () => {
    navigator.clipboard.writeText(fullArchitectureDoc);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="bg-slate-900 text-white rounded-2xl p-6 shadow-xl border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-blue-400 font-bold text-xs uppercase tracking-wider mb-2">
            <BookOpen className="w-4 h-4" />
            <span>项目技术交付物总纲 · 立项架构规格说明书</span>
          </div>
          <h2 className="text-2xl font-black tracking-tight">
            《欧洲华人 AI 智能平台》系统架构全景
          </h2>
          <p className="text-xs text-slate-300 mt-1 max-w-2xl leading-relaxed">
            专为开发团队与技术 Agent 打造的标准化设计指南，确保从单国（意大利）扩展至全欧洲多国多城架构稳健可扩展。
          </p>
        </div>

        <button
          onClick={handleCopyDoc}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-md transition-all shrink-0"
        >
          {copied ? <Check className="w-4 h-4 text-white" /> : <Copy className="w-4 h-4" />}
          <span>{copied ? '已复制架构文档' : '一键复制完整架构总纲'}</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2 overflow-x-auto">
        {[
          { id: 'system', label: '1. 系统总体架构', icon: <Network className="w-4 h-4" /> },
          { id: 'sitemap', label: '2. 完整 Sitemap 路由', icon: <Layers className="w-4 h-4" /> },
          { id: 'db', label: '3. 数据库 Schema (DDL)', icon: <Database className="w-4 h-4" /> },
          { id: 'agent', label: '4. AI Agent 工作流状态机', icon: <Bot className="w-4 h-4" /> },
          { id: 'roadmap', label: '5. MVP 任务清单与路线图', icon: <ListChecks className="w-4 h-4" /> },
        ].map((t) => (
          <button
            key={t.id}
            onClick={() => setActiveTab(t.id as any)}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
              activeTab === t.id
                ? 'bg-blue-600 text-white shadow-xs'
                : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            {t.icon}
            <span>{t.label}</span>
          </button>
        ))}
      </div>

      {/* Tab Panels */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
        {activeTab === 'system' && (
          <div className="space-y-4 text-xs sm:text-sm text-slate-700">
            <h3 className="font-bold text-base text-slate-900">系统总体分层架构 (Multi-Tier Architecture)</h3>
            <p className="leading-relaxed text-slate-600">
              平台采用 API First + AI Native + Event-Driven 设计。核心业务（房屋、招聘、黄页、二手）与 AI 智能体中台彻底解耦，AI 不直接无约束修改数据库底层，统一通过严格的权限层与用户确认闸门 (User Authorization Gate) 调度业务 API。
            </p>

            <div className="bg-slate-900 text-slate-200 rounded-xl p-4 font-mono text-xs overflow-x-auto">
              <pre>{`┌────────────────────────────────────────────────────────┐
│                   客户端交互层 (Client)                 │
│      React 19 / Web / Mobile / PWA / 语音 / OCR 视觉    │
└───────────────────────────┬────────────────────────────┘
                            │ HTTP / JSON / SSE
                            ▼
┌────────────────────────────────────────────────────────┐
│             API Gateway & BFF 服务层 (Express)          │
│   路由分发器 ｜ 统一鉴权 ｜ 审计日志 ｜ 敏感词前置过滤   │
└─────────────┬────────────────────────────┬─────────────┘
              ▼                            ▼
┌───────────────────────────┐ ┌──────────────────────────┐
│    核心业务微服务集群     │ │     AI 智脑中台 (Gateway) │
│  房屋/招聘/商家/论坛/地图  │ │  意图解析/规划器/多语言翻译│
└─────────────┬─────────────┘ └────────────┬─────────────┘
              ▼                            ▼
┌────────────────────────────────────────────────────────┐
│                  存储与知识图谱服务层                  │
│       PostgreSQL ｜ 向量知识库 ｜ 欧洲华人知识图谱      │
└────────────────────────────────────────────────────────┘`}</pre>
            </div>
          </div>
        )}

        {activeTab === 'sitemap' && (
          <div className="space-y-4 text-xs sm:text-sm text-slate-700">
            <h3 className="font-bold text-base text-slate-900">完整 Sitemap 与语义化 URL 路由树</h3>
            <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 font-mono text-xs space-y-2">
              <div><strong>用户端核心路由：</strong></div>
              <ul className="list-disc pl-5 space-y-1 text-slate-600">
                <li><code>/</code> - AI 统一门户（“你想做什么？”超级入口、个性化动态推荐、地图看板）</li>
                <li><code>/europe/:country/:city/housing</code> - 房屋租赁与买卖（支持房源首期预算分析）</li>
                <li><code>/europe/:country/:city/jobs</code> - 求职招聘与 AI 双语简历匹配</li>
                <li><code>/europe/:country/:city/businesses</code> - 认证华人商家黄页与 24h AI 商家接待</li>
                <li><code>/europe/:country/:city/transfers</code> - 店铺买卖与商业尽调</li>
                <li><code>/europe/:country/:city/marketplace</code> - 跳蚤二手与 AI 拍图识物</li>
                <li><code>/europe/:country/:city/services</code> - 便民服务（会计师、律师、水暖工、国际快递）</li>
                <li><code>/europe/map</code> - 全欧洲华人全景地图点位搜索</li>
                <li><code>/document-ai</code> - 欧洲官方文件解读、截止日期与回复函生成</li>
                <li><code>/translator</code> - 场景化欧洲语言深度翻译官（公文、就医、警局、租约）</li>
                <li><code>/government</code> - 欧洲居留、税号、医疗卡政务合规办事导航</li>
                <li><code>/forum</code> - 社区知识库（AI 100楼总结与官方辟谣对比）</li>
                <li><code>/dossier</code> - 我的欧洲生活（档案日历、居留倒计时、税务提醒）</li>
              </ul>
            </div>
          </div>
        )}

        {activeTab === 'db' && (
          <div className="space-y-5 text-xs sm:text-sm text-slate-700">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-200 gap-2">
              <div>
                <h3 className="font-bold text-base text-slate-900">生产级完整数据库 Schema 架构 (PostgreSQL DDL)</h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  已完成欧洲多国（国家/大区/城市/华人聚集区）、多语言 (i18n)、RBAC 角色权限、统一发布物、OCR 公函库、AI 审计日志全模块设计。
                </p>
              </div>
              <button
                onClick={handleCopyDoc}
                className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-mono text-xs flex items-center gap-1.5 shrink-0"
              >
                <Database className="w-3.5 h-3.5 text-blue-400" />
                <span>复制完整 DATABASE_SCHEMA.sql</span>
              </button>
            </div>

            {/* Core Domain Schema Summary Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-[10px] font-bold text-blue-600 uppercase bg-blue-100 px-2 py-0.5 rounded">地理与多语言</span>
                <div className="font-bold text-slate-900 mt-2">4 张物理表</div>
                <div className="text-[11px] text-slate-500 mt-0.5 font-mono">geo_countries, geo_regions, geo_cities, geo_districts, i18n_locales</div>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-[10px] font-bold text-emerald-600 uppercase bg-emerald-100 px-2 py-0.5 rounded">用户与档案</span>
                <div className="font-bold text-slate-900 mt-2">5 张物理表</div>
                <div className="text-[11px] text-slate-500 mt-0.5 font-mono">users, roles, permissions, user_roles, user_dossiers</div>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-[10px] font-bold text-slate-700 uppercase bg-slate-200 px-2 py-0.5 rounded">统一发布与生命周期</span>
                <div className="font-bold text-slate-900 mt-2">6 张物理表</div>
                <div className="text-[11px] text-slate-500 mt-0.5 font-mono">listings, housing_meta, job_meta, transfer_meta, marketplace_meta</div>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-[10px] font-bold text-blue-700 uppercase bg-blue-100 px-2 py-0.5 rounded">AI 智脑与审计</span>
                <div className="font-bold text-slate-900 mt-2">5 张物理表</div>
                <div className="text-[11px] text-slate-500 mt-0.5 font-mono">ai_agent_sessions, ai_agent_action_logs, moderation_audits, daily_coo_metrics</div>
              </div>
            </div>

            {/* DDL Code Box */}
            <div className="bg-slate-950 text-slate-200 rounded-xl p-4 font-mono text-xs overflow-x-auto max-h-[420px] border border-slate-800 leading-relaxed">
              <pre>{`-- ============================================================================
-- 1. 地理与多国多城架构 (Geo Hierarchy: Country > Region > City > District)
-- ============================================================================
CREATE TABLE geo_countries (
    code VARCHAR(2) PRIMARY KEY, -- 'IT', 'FR', 'ES', 'DE', 'NL'
    name_zh VARCHAR(64) NOT NULL,
    currency VARCHAR(3) DEFAULT 'EUR',
    phone_dial_code VARCHAR(8) NOT NULL, -- '+39', '+33', '+34', '+49'
    official_languages TEXT[] NOT NULL
);

CREATE TABLE geo_cities (
    id VARCHAR(32) PRIMARY KEY, -- 'milan', 'rome', 'paris', 'madrid', 'frankfurt'
    country_code VARCHAR(2) NOT NULL REFERENCES geo_countries(code),
    name_zh VARCHAR(64) NOT NULL,
    name_local VARCHAR(64) NOT NULL,
    lat NUMERIC(9,6) NOT NULL,
    lng NUMERIC(9,6) NOT NULL,
    chinese_population_est INT DEFAULT 0
);

CREATE TABLE geo_districts (
    id VARCHAR(64) PRIMARY KEY, -- 'milan-paolo-sarpi', 'paris-13eme', 'madrid-usera'
    city_id VARCHAR(32) NOT NULL REFERENCES geo_cities(id),
    name_zh VARCHAR(64) NOT NULL,
    name_local VARCHAR(64) NOT NULL,
    is_chinese_enclave BOOLEAN DEFAULT false
);

-- ============================================================================
-- 2. 用户体系、RBAC 角色与个人欧洲生活档案 (Users, Roles & Dossier)
-- ============================================================================
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    phone_dial_code VARCHAR(8),
    phone_number VARCHAR(32),
    email VARCHAR(128) UNIQUE,
    nickname VARCHAR(64) NOT NULL,
    trust_score INT DEFAULT 70 CHECK (trust_score BETWEEN 0 AND 100),
    is_identity_verified BOOLEAN DEFAULT false,
    status VARCHAR(16) DEFAULT 'active',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE user_dossiers (
    user_id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    tax_code VARCHAR(64), -- 意大利 Codice Fiscale, 西班牙 NIE, 法国 Numéro Fiscal
    residence_permit_type VARCHAR(64),
    residence_permit_expires_at DATE,
    residence_permit_reminder_days INT DEFAULT 60,
    health_card_expires_at DATE,
    custom_notes TEXT
);

-- ============================================================================
-- 3. 统一发布物与 30 天自动过期表 (Unified Listings Engine)
-- ============================================================================
CREATE TABLE listings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    category_id VARCHAR(32) NOT NULL, -- 'housing', 'jobs', 'marketplace', 'transfers'
    city_id VARCHAR(32) NOT NULL REFERENCES geo_cities(id),
    district_id VARCHAR(64) REFERENCES geo_districts(id),
    title VARCHAR(255) NOT NULL,
    price_cents BIGINT, -- 以分存储杜绝浮点误差 (如 €1,350 = 135000)
    price_currency VARCHAR(3) DEFAULT 'EUR',
    price_period VARCHAR(16) DEFAULT 'month',
    contact_phone VARCHAR(32),
    contact_whatsapp VARCHAR(32),
    status VARCHAR(32) DEFAULT 'active', -- 'active', 'need_confirm', 'expired', 'closed'
    trust_score INT DEFAULT 80,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    confirmed_at TIMESTAMPTZ DEFAULT NOW(),
    expires_at TIMESTAMPTZ DEFAULT (NOW() + INTERVAL '30 days') -- 30天自动过期
);

-- 房屋专用元数据
CREATE TABLE listing_housing_meta (
    listing_id UUID PRIMARY KEY REFERENCES listings(id) ON DELETE CASCADE,
    property_type VARCHAR(32) NOT NULL,
    area_sqm NUMERIC(6,2),
    deposit_months INT DEFAULT 3,
    condo_fees_cents BIGINT DEFAULT 0,
    estimated_utilities_cents BIGINT DEFAULT 0,
    can_register_residenza BOOLEAN DEFAULT false, -- 是否可登记户籍
    distance_to_metro_meters INT
);

-- 招聘专用元数据
CREATE TABLE listing_job_meta (
    listing_id UUID PRIMARY KEY REFERENCES listings(id) ON DELETE CASCADE,
    industry VARCHAR(64) NOT NULL,
    salary_min_cents BIGINT,
    salary_max_cents BIGINT,
    provides_accommodation BOOLEAN DEFAULT false,
    contract_type VARCHAR(64), -- 'Indeterminato (永久白领/全工)'
    language_requirements VARCHAR(64)
);

-- ============================================================================
-- 4. 认证商家与 AI 智能接待知识库 (Businesses & AI Bot)
-- ============================================================================
CREATE TABLE businesses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name_zh VARCHAR(128) NOT NULL,
    name_local VARCHAR(128) NOT NULL,
    category VARCHAR(64) NOT NULL,
    city_id VARCHAR(32) NOT NULL REFERENCES geo_cities(id),
    phone VARCHAR(32) NOT NULL,
    whatsapp VARCHAR(32),
    vat_number VARCHAR(64), -- Partita IVA / SIRET / CIF
    rating NUMERIC(2,1) DEFAULT 5.0,
    opening_hours_json JSONB DEFAULT '{}',
    is_verified BOOLEAN DEFAULT false
);

CREATE TABLE business_ai_profiles (
    business_id UUID PRIMARY KEY REFERENCES businesses(id) ON DELETE CASCADE,
    bot_display_name VARCHAR(64) DEFAULT '智能前台接待',
    is_enabled BOOLEAN DEFAULT true,
    custom_faq_notes TEXT, -- 店家随时录入的春节放假、收费与人均标准
    auto_appointment_enabled BOOLEAN DEFAULT true
);

-- ============================================================================
-- 5. AI Agent 会话与操作审计日志 (Audit & Ops)
-- ============================================================================
CREATE TABLE ai_agent_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id),
    intent VARCHAR(64) NOT NULL,
    city_id VARCHAR(32) REFERENCES geo_cities(id),
    initial_user_prompt TEXT NOT NULL,
    workflow_state VARCHAR(32) DEFAULT 'completed',
    approval_required BOOLEAN DEFAULT false,
    is_approved_by_user BOOLEAN,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE ai_agent_action_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id UUID NOT NULL REFERENCES ai_agent_sessions(id) ON DELETE CASCADE,
    step_number INT NOT NULL,
    tool_invoked VARCHAR(64) NOT NULL,
    tool_arguments JSONB DEFAULT '{}',
    model_name VARCHAR(64) DEFAULT 'gemini-3.8-flash',
    duration_ms INT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);`}</pre>
            </div>
          </div>
        )}

        {activeTab === 'agent' && (
          <div className="space-y-4 text-xs sm:text-sm text-slate-700">
            <h3 className="font-bold text-base text-slate-900">AI Agent 状态机与安全授权闭环</h3>
            <p className="text-slate-600">
              杜绝纯聊天式回复。AI 接收用户任务后，经历 6 步严密流转，并设置严格的用户确认闸门 (User Authorization Gate)：
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {[
                { step: 'Step 1', title: '意图拆解与槽位提取', desc: '提取用户目标城市、预算上限、语言要求及行业诉求。' },
                { step: 'Step 2', title: '多源数据智能检索', desc: '检索官方政策条文、认证华人商家库及历史讨论经验。' },
                { step: 'Step 3', title: '多方案决策对比矩阵', desc: '自动生成包含距离、资质、中文能力、收费的比较表格。' },
                { step: 'Step 4', title: '行动方案与草案拟定', desc: '自动起草发给房东、老板或会计师的中欧双语预约信。' },
                { step: 'Step 5', title: '用户安全授权确认', desc: '必须由用户确认后方可对外发送预约或提交表单。' },
                { step: 'Step 6', title: '生活档案与日历归档', desc: '将办理节点同步至“我的欧洲生活”日程并在到期前提醒。' },
              ].map((s) => (
                <div key={s.step} className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                  <span className="text-[10px] font-bold text-blue-600 uppercase bg-blue-100 px-2 py-0.5 rounded">{s.step}</span>
                  <div className="font-bold text-slate-900 mt-2">{s.title}</div>
                  <div className="text-xs text-slate-500 mt-1">{s.desc}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'roadmap' && (
          <div className="space-y-4 text-xs sm:text-sm text-slate-700">
            <h3 className="font-bold text-base text-slate-900">MVP 开发实施路线图 (Roadmap)</h3>
            <div className="space-y-3">
              <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-200">
                <div className="font-bold text-emerald-900">✅ 第一阶段 (MVP 核心交付 - 已实现上线)</div>
                <div className="text-xs text-emerald-800 mt-1">
                  AI 门户统一入口、意图解析执行器、欧洲华人地图、房源首期预算分析、AI 简历生成、认证商家 AI 智能客服、文件 OCR 深度解读、场景多语言翻译、AI COO 运营看板。
                </div>
              </div>

              <div className="p-4 bg-blue-50 rounded-xl border border-blue-200">
                <div className="font-bold text-blue-900">🚀 第二阶段 (欧洲多国扩展与生态深化)</div>
                <div className="text-xs text-blue-800 mt-1">
                  扩展覆盖德国柏林、荷兰鹿特丹、西班牙瓦伦西亚等次级华人生活圈；接入欧洲银行 PagoPA / Stripe 在线规费缴纳；深化房源与招聘短信/微信 30天全自动催检闭环。
                </div>
              </div>

              <div className="p-4 bg-slate-100 rounded-xl border border-slate-300">
                <div className="font-bold text-slate-900">🌟 第三阶段 (完全自主运营的欧洲华人超级生活平台)</div>
                <div className="text-xs text-slate-700 mt-1">
                  支持多商家自主 AI Agent 托管、跨国搬家 AI Agent、全自动欧盟税务合规审计、跨境供应链海外仓一键调货。
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
