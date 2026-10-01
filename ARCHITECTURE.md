# 《欧洲华人 AI 智能平台》核心系统架构总纲与开发指令集 V1.0
## Europe Chinese AI Super Platform (Huaren Europe AI)

---

## 目录
1. [系统总体架构与数据流图 (Architecture Diagram)](#1-系统总体架构与数据流图)
2. [完整 Sitemap 与 URL 路由架构](#2-完整-sitemap-与-url-路由架构)
3. [数据库完整物理与逻辑 Schema (PostgreSQL/Relational DDL)](#3-数据库完整-schema)
4. [AI Gateway 与 AI Agent 状态机架构](#4-ai-gateway-与-ai-agent-架构)
5. [自动运营中台与 AI COO 运作机制](#5-自动运营中台与-ai-coo-机制)
6. [风控防诈与可信度架构 (Trust & Safety)](#6-风控防诈与可信度架构)
7. [MVP 开发任务列表与工期路线图 (Roadmap)](#7-mvp-开发任务列表)

---

## 1. 系统总体架构与数据流图

```
                       ┌──────────────────────────────────────────────┐
                       │           客户端 (Client Applications)        │
                       │   Next/React Web ｜ Mobile Web ｜ PWA        │
                       │   语音交互 (WebSpeech) ｜ 图片拍摄 ｜ 文件上传 │
                       └──────────────────────┬───────────────────────┘
                                              │ HTTP / JSON / SSE Stream
                                              ▼
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                          API Gateway & BFF 服务层 (Express / TypeScript)                │
│  ├── 路由分发器 (Router)              ├── 统一鉴权 & RBAC 中间件                          │
│  ├── 速率控制 & IP 防刷 (RateLimit)    ├── 敏感词与预过滤管道 (Pre-Moderation)           │
│  └── 会话上下文追踪 (Session Tracer)   └── 审计日志记录器 (Audit Logger)                  │
└──────────────────────┬──────────────────────────────────────────────┬──────────────────┘
                       │                                              │
                       ▼                                              ▼
┌──────────────────────────────────────────────┐ ┌──────────────────────────────────────────────┐
│            核心业务服务集群 (Services)       │ │            AI 智脑中台 (AI Gateway)          │
│  ├── 房屋服务 (Housing Service)               │ │  ├── 意图识别引擎 (Intent Parser)            │
│  ├── 招聘服务 (Job Service)                   │ │  ├── 多步规划器 (Agent Planner)              │
│  ├── 商家服务 (Business Service)              │ │  ├── Gemini 3.8 Flash 核心推理模型           │
│  ├── 二手市场 (Marketplace Service)           │ │  ├── 视觉多模态 / OCR (Vision API)           │
│  ├── 生活服务 (Services Catalog)              │ │  ├── 语音识别与 TTS 模块                     │
│  ├── 论坛知识库 (Forum & KB Service)          │ │  ├── 场景化翻译官 (Contextual Translator)    │
│  ├── 欧洲华人地图 (Geo Spatial Service)       │ │  └── 官方源 vs 社区经验比对验证引擎           │
│  └── 个人档案服务 (User Dossier Service)      │ └──────────────────────┬───────────────────────┘
└──────────────────────┬───────────────────────┘                        │
                       │                                                │
                       ▼                                                ▼
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                        业务与知识存储层 (Data & Knowledge Layer)                        │
│  ├── 关系型数据库 (PostgreSQL): 用户、房源、招聘、商家、交易、审核记录                    │
│  ├── 向量知识库 (Vector Store): 华人街千万级历史讨论、官方政务法令、商家服务向量          │
│  ├── 欧洲华人知识图谱 (Knowledge Graph): 国家 > 城市 > 华人圈 > 行业 > 资质 > 评价    │
│  └── 对象存储 (Object Storage): 证件、合同扫描件、房源实拍图、商品照片                 │
└────────────────────────────────────────────────────────────────────────────────────────┘
                                              ▲
                                              │
┌─────────────────────────────────────────────┴──────────────────────────────────────────┐
│                           AI 自动运营总线 (Autonomous Ops / AI COO)                    │
│  ├── 每日运营报告生成器 (Daily COO Reporter) ├── 房源/招聘 30天自动过期与催检引擎       │
│  ├── 跨平台可疑诈骗与重复发布侦测 (Anti-Fraud) ├── 官方政府公报采集与自动翻译摘要 (Gov Monitor)│
│  └── 动态 SEO 落地页自动生成器 (SEO Engine)  └── 商家自主 AI 助手 (Business Bot)       │
└────────────────────────────────────────────────────────────────────────────────────────┘
```

---

## 2. 完整 Sitemap 与 URL 路由架构

平台支持全欧洲多国、多城市切换，采用结构化语义路由：

### 2.1 用户端核心路由
- `/` - **AI 统一门户首页**：核心交互入口“你想做什么？”、语音/拍照/文件快速入口、今日个性化推荐、华人地图看板
- `/search` - **AI 聚合搜索引擎**：混合搜索 (向量 + 关键词 + 结构化 + 距离)，支持一键直达服务
- `/agent` - **AI Agent 任务执行中心**：租房Agent、求职Agent、买卖Agent、报税向导、办事规划
- `/housing` - **欧洲华人房屋**
  - `/housing/rent` (整租/合租/单间)
  - `/housing/buy` (买房/投资)
  - `/housing/commercial` (商铺/仓库/写字楼)
  - `/housing/post` (AI 智能发房：拍照提取租金/面积/押金计算)
- `/jobs` - **欧洲华人招聘**
  - `/jobs/catering` (餐馆/酒吧/外卖)
  - `/jobs/enterprise` (华人企业/外贸/财务/客服)
  - `/jobs/factory` (工厂/工场/车衣/包装)
  - `/jobs/driver` (司机/物流/跑堂/看店)
  - `/jobs/resume-builder` (AI 智能中欧双语简历生成与求职信)
- `/marketplace` - **跳蚤二手市场** (拍照识图、成色评级、防诈估价、一键发布)
- `/transfers` - **商业与店铺转让** (餐馆转让、服装店、百货店、营业额认证)
- `/services` - **生活便民黄页**
  - `/services/accountants` (中文会计师、做账、VAT、税号申报)
  - `/services/lawyers` (华人律师、居留移民、合同纠纷)
  - `/services/logistics` (欧洲专线、回国快递、海外仓)
  - `/services/renovation` (水暖、电工、装修、施工)
  - `/services/medical` (华人诊所、中文牙医、医院就诊导诊)
- `/businesses` - **认证华人商家主页** (`/businesses/:slug`) 含 AI 智能客服
- `/map` - **欧洲华人全景地图** (实时根据当前城市与经纬度检索 5km 内中文商家、房源、岗位)
- `/document-ai` - **AI 欧洲文件助手** (居留信、税务罚单、房租合同、劳动合同 OCR + 风险预警 + 官方回复生成)
- `/translator` - **AI 欧洲场景翻译官** (中 ↔ 意、法、西、德、英，公文/就医/警局场景深度适配)
- `/government` - **欧洲政务办事导航** (续居留、转永居、申请家庭团聚、办医疗卡、税号申请，官方权威指引)
- `/forum` - **AI 社区论坛与知识库** (分类圈子、AI 回帖速览、官方辟谣与社区真实办证经历)
- `/dossier` - **我的欧洲生活档案** (加密保存个人居留到期日、税务日历、关注房源、申请进度跟踪)

### 2.2 运营与管理端路由
- `/admin` - **AI COO 数字化决策驾驶舱**
  - `/admin/analytics` (全欧流量、新注册、AI 会话完成率)
  - `/admin/moderation` (AI 自动审核流、黄色预警、疑似欺诈阻断)
  - `/admin/lifecycle` (自动过期队列、商户信息确认流)
  - `/admin/seo-generator` (批量高价值多语言 SEO 页面生成与状态监控)

---

## 3. 数据库完整 Schema (PostgreSQL DDL)

```sql
-- 1. 地理基础表 (多国、多城市支持)
CREATE TABLE geo_countries (
    code VARCHAR(2) PRIMARY KEY, -- 'IT', 'FR', 'ES', 'DE', 'NL'
    name_zh VARCHAR(64) NOT NULL,
    name_en VARCHAR(64) NOT NULL,
    currency VARCHAR(3) DEFAULT 'EUR',
    official_languages TEXT[] NOT NULL
);

CREATE TABLE geo_cities (
    id VARCHAR(32) PRIMARY KEY, -- 'milan', 'rome', 'paris', 'madrid', 'frankfurt'
    country_code VARCHAR(2) REFERENCES geo_countries(code),
    name_zh VARCHAR(64) NOT NULL,
    name_local VARCHAR(64) NOT NULL,
    lat NUMERIC(9,6) NOT NULL,
    lng NUMERIC(9,6) NOT NULL,
    is_hot BOOLEAN DEFAULT false
);

-- 2. 用户与认证体系 (支持多角色与认证信用分)
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    phone VARCHAR(32) UNIQUE,
    email VARCHAR(128) UNIQUE,
    nickname VARCHAR(64) NOT NULL,
    avatar_url TEXT,
    country_code VARCHAR(2) REFERENCES geo_countries(code),
    city_id VARCHAR(32) REFERENCES geo_cities(id),
    role VARCHAR(32) DEFAULT 'user', -- 'user', 'business_owner', 'moderator', 'admin'
    trust_score INT DEFAULT 70, -- 0~100 综合信用分
    is_identity_verified BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. 统一发布物与生命周期表 (涵盖房源、招聘、二手、转让)
CREATE TABLE listings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id),
    category VARCHAR(32) NOT NULL, -- 'housing', 'jobs', 'marketplace', 'transfers', 'services'
    sub_category VARCHAR(64) NOT NULL, -- 'rent_apartment', 'catering_chef', 'iphone', 'restaurant_sale'
    country_code VARCHAR(2) REFERENCES geo_countries(code),
    city_id VARCHAR(32) REFERENCES geo_cities(id),
    title VARCHAR(255) NOT NULL,
    summary TEXT,
    description TEXT NOT NULL,
    price_cents BIGINT,
    price_currency VARCHAR(3) DEFAULT 'EUR',
    price_period VARCHAR(16) DEFAULT 'month', -- 'month', 'once', 'year'
    images TEXT[] DEFAULT '{}',
    lat NUMERIC(9,6),
    lng NUMERIC(9,6),
    address VARCHAR(255),
    contact_phone VARCHAR(32),
    contact_wechat VARCHAR(64),
    contact_whatsapp VARCHAR(32),
    structured_meta JSONB DEFAULT '{}', -- 房屋面积、押金、工种、成色等结构化字段
    status VARCHAR(32) DEFAULT 'active', -- 'pending_review', 'active', 'need_confirm', 'expired', 'closed'
    risk_level VARCHAR(16) DEFAULT 'low', -- 'low', 'medium', 'high'
    views_count INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    expires_at TIMESTAMPTZ DEFAULT (NOW() + INTERVAL '30 days'),
    confirmed_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. 商家与 AI 商家代理表
CREATE TABLE businesses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    owner_id UUID REFERENCES users(id),
    name_zh VARCHAR(128) NOT NULL,
    name_local VARCHAR(128) NOT NULL,
    category VARCHAR(64) NOT NULL,
    country_code VARCHAR(2) REFERENCES geo_countries(code),
    city_id VARCHAR(32) REFERENCES geo_cities(id),
    address VARCHAR(255) NOT NULL,
    lat NUMERIC(9,6) NOT NULL,
    lng NUMERIC(9,6) NOT NULL,
    phone VARCHAR(32),
    whatsapp VARCHAR(32),
    wechat VARCHAR(64),
    languages TEXT[] DEFAULT '{"zh"}',
    opening_hours JSONB DEFAULT '{}',
    services_catalog JSONB DEFAULT '[]',
    ai_bot_enabled BOOLEAN DEFAULT true,
    ai_knowledge_notes TEXT,
    rating NUMERIC(2,1) DEFAULT 5.0,
    review_count INT DEFAULT 0,
    is_claimed BOOLEAN DEFAULT false,
    is_verified BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. 社区讨论与官方知识库表
CREATE TABLE forum_threads (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    author_id UUID REFERENCES users(id),
    city_id VARCHAR(32) REFERENCES geo_cities(id),
    category VARCHAR(32) NOT NULL, -- 'visa', 'tax', 'living', 'food', 'legal'
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    ai_summary TEXT, -- 自动生成的100楼核心经验提炼
    official_fact_check JSONB, -- 关联的官方政策法令条目与官方免责说明
    reply_count INT DEFAULT 0,
    like_count INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. AI Agent 任务会话与操作审计表
CREATE TABLE ai_agent_tasks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id),
    intent VARCHAR(64) NOT NULL, -- 'find_accountant', 'rent_apartment', 'analyze_letter', 'find_job'
    initial_prompt TEXT NOT NULL,
    workflow_step VARCHAR(32) NOT NULL, -- 'analyzing', 'matching', 'comparing', 'drafting', 'waiting_confirm', 'completed'
    execution_plan JSONB DEFAULT '[]',
    collected_params JSONB DEFAULT '{}',
    results_payload JSONB DEFAULT '{}',
    requires_user_approval BOOLEAN DEFAULT false,
    approved_by_user BOOLEAN,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    completed_at TIMESTAMPTZ
);
```

---

## 4. AI Gateway 与 AI Agent 架构

### 4.1 核心设计理念
平台杜绝单一纯聊天式机器人，AI 充当**欧洲华人操作系统的内核**。采用状态机 + Tool-Calling 架构：
1. **意图拆解与槽位提取 (NLU)**
   - 提取：国家、城市、预算区间、语言偏好、时间窗口、具体诉求。
2. **多源数据检索与知识图谱融合**
   - 融合官方政府法令、本地华人街历史精选案例、实时商家数据库与房源招聘索引。
3. **决策与比较矩阵 (Decision Matrix)**
   - 例如：寻找会计师自动生成多维度对比表格 (资质、距离、中文能力、收费标准、真实口碑)。
4. **行动提案与授权确认 (Approval Gate)**
   - 严禁 AI 擅自向房东发送付款承诺或给政府递交无效资料；必须向用户提供明确的预览确认卡片。
5. **归档至用户欧洲个人档案 (Dossier)**
   - 办税日志、居留到期提醒自动同步到日历。

---

## 5. 自动运营中台与 AI COO 机制

为实现**5~10人轻量化团队运营全欧洲百万级华人市场**，核心自动化流包含：
1. **自动爬取与官方公报监测**：监控意大利内政部、法国省政府、西班牙移民局网站的最新政策，自动翻译、去重并提炼。
2. **内容生命周期自动过期**：
   - 房源与招聘发布满 25 天，AI 发送短信/微信确认模板；
   - 若 30 天无互动且未确认，自动降权并转为已关闭状态，防止无效垃圾信息积压。
3. **AI 商家代管助手**：
   - 店主可直接发语音“下周一米兰店放假”，AI 解析后自动更新商家主页与搜索匹配规则。
4. **AI COO 每日运营报告**：
   - 汇总日活、新房源数、欺诈举报、自动解决客服比例（目标 >90%）、需人工兜底介入的高风险事件。

---

## 6. 风控防诈与可信度架构 (Trust & Safety)

严控欧洲华人社区高发的黑中介、假房源、办证骗局：
1. **信源隔离原则**：
   - 政策类回答严格标注：`【官方权威发布】` 与 `【社区华人经验分享】`，不得混淆。
2. **防诈骗规则引擎**：
   - 租房：要求看房前先汇押金的，自动触发红色横幅拦截警告；
   - 招聘：要求押证件或预付高额培训费的，自动冻结发布并转交人工审核；
   - 图片反向查重：检测同一套房屋图片在不同城市被重复盗用的恶意行为。

---

## 7. MVP 开发任务列表 (Checklist)

- [x] **架构与指令总纲交付**：Sitemap、DB Schema、AI Agent 规范、运营总线设计完毕。
- [x] **AI 首页门户与智能意图路由器**：极简高级的“你想做什么？”输入流，支持语音、拍照识别、多语言场景提示。
- [x] **全场景 AI 模拟与真实后端执行引擎**：支持找会计、找房子、查居留、文件OCR识别。
- [x] **欧洲华人地图与多城数据引擎**：米兰、巴黎、马德里、罗马、法兰克福多城多分类标记与动态过滤。
- [x] **完整保留传统内容版块**：房屋租赁/买卖、求职招聘、跳蚤二手、店铺转让、便民黄页、社区讨论。
- [x] **AI 智能工具箱**：AI欧洲场景翻译官、AI文件助手、居留办事导航。
- [x] **AI COO 运营中台看板**：实时健康度指标、自动审核流、风控日志呈现。
