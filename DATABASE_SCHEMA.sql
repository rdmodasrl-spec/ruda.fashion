-- ============================================================================
-- 欧洲华人 AI 智能超级平台 - 生产级数据库完整架构 Schema (V1.0)
-- Europe Chinese AI Super Platform (Huaren Europe AI)
-- Architecture: PostgreSQL 16+ / Multi-Country / Multi-Language / AI Native
-- ============================================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS "postgis"; -- 可选：用于高精度地理空间多边形与半径计算

-- ============================================================================
-- 1. 地理与多国多城基础体系 (Geo Hierarchy: Country > Region > City > District)
-- ============================================================================

CREATE TABLE geo_countries (
    code VARCHAR(2) PRIMARY KEY, -- ISO 3166-1 alpha-2: 'IT', 'FR', 'ES', 'DE', 'NL'
    name_zh VARCHAR(64) NOT NULL,
    name_en VARCHAR(64) NOT NULL,
    name_native VARCHAR(64) NOT NULL,
    currency VARCHAR(3) DEFAULT 'EUR',
    currency_symbol VARCHAR(8) DEFAULT '€',
    phone_dial_code VARCHAR(8) NOT NULL, -- '+39', '+33', '+34', '+49'
    timezone VARCHAR(64) DEFAULT 'Europe/Rome',
    official_languages TEXT[] NOT NULL, -- ARRAY['it'], ARRAY['fr'], ARRAY['es'], etc.
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE geo_regions (
    id VARCHAR(32) PRIMARY KEY, -- 'it-lombardia', 'fr-ile-de-france', 'es-madrid'
    country_code VARCHAR(2) NOT NULL REFERENCES geo_countries(code) ON DELETE RESTRICT,
    name_zh VARCHAR(64) NOT NULL,
    name_local VARCHAR(64) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE geo_cities (
    id VARCHAR(32) PRIMARY KEY, -- 'milan', 'rome', 'prato', 'florence', 'paris', 'madrid', 'frankfurt'
    region_id VARCHAR(32) REFERENCES geo_regions(id),
    country_code VARCHAR(2) NOT NULL REFERENCES geo_countries(code) ON DELETE RESTRICT,
    name_zh VARCHAR(64) NOT NULL,
    name_en VARCHAR(64) NOT NULL,
    name_local VARCHAR(64) NOT NULL,
    lat NUMERIC(9,6) NOT NULL,
    lng NUMERIC(9,6) NOT NULL,
    postal_code_prefix VARCHAR(16),
    chinese_population_est INT DEFAULT 0,
    is_hot BOOLEAN DEFAULT false,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE geo_districts (
    id VARCHAR(64) PRIMARY KEY, -- 'milan-paolo-sarpi', 'paris-13eme', 'madrid-usera'
    city_id VARCHAR(32) NOT NULL REFERENCES geo_cities(id) ON DELETE CASCADE,
    name_zh VARCHAR(64) NOT NULL,
    name_local VARCHAR(64) NOT NULL,
    is_chinese_enclave BOOLEAN DEFAULT false, -- 是否为重点华人聚集街区
    center_lat NUMERIC(9,6),
    center_lng NUMERIC(9,6),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- 2. 多语言本地化系统 (i18n Localization Engine)
-- ============================================================================

CREATE TABLE i18n_locales (
    locale_code VARCHAR(16) PRIMARY KEY, -- 'zh-CN', 'it-IT', 'fr-FR', 'es-ES', 'de-DE', 'en-US'
    locale_name VARCHAR(64) NOT NULL,
    is_default BOOLEAN DEFAULT false,
    is_active BOOLEAN DEFAULT true
);

CREATE TABLE i18n_translations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    namespace VARCHAR(64) NOT NULL, -- 'common', 'housing', 'jobs', 'legal', 'tax'
    translation_key VARCHAR(128) NOT NULL,
    locale_code VARCHAR(16) NOT NULL REFERENCES i18n_locales(locale_code) ON DELETE CASCADE,
    translation_value TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(namespace, translation_key, locale_code)
);

-- ============================================================================
-- 3. 用户体系、RBAC 角色与个人欧洲生活档案 (Auth, RBAC & User Dossier)
-- ============================================================================

CREATE TABLE roles (
    name VARCHAR(32) PRIMARY KEY, -- 'super_admin', 'city_moderator', 'business_owner', 'verified_landlord', 'verified_user', 'regular_user', 'ai_agent_operator'
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE permissions (
    code VARCHAR(64) PRIMARY KEY, -- 'listing:create', 'listing:publish_direct', 'listing:delete_any', 'business:verify', 'ai:override'
    description TEXT
);

CREATE TABLE role_permissions (
    role_name VARCHAR(32) REFERENCES roles(name) ON DELETE CASCADE,
    permission_code VARCHAR(64) REFERENCES permissions(code) ON DELETE CASCADE,
    PRIMARY KEY (role_name, permission_code)
);

CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    phone_dial_code VARCHAR(8),
    phone_number VARCHAR(32),
    email VARCHAR(128) UNIQUE,
    password_hash VARCHAR(255),
    nickname VARCHAR(64) NOT NULL,
    avatar_url TEXT,
    primary_country VARCHAR(2) REFERENCES geo_countries(code),
    primary_city VARCHAR(32) REFERENCES geo_cities(id),
    preferred_locale VARCHAR(16) DEFAULT 'zh-CN' REFERENCES i18n_locales(locale_code),
    trust_score INT DEFAULT 70 CHECK (trust_score BETWEEN 0 AND 100),
    is_identity_verified BOOLEAN DEFAULT false,
    identity_verified_at TIMESTAMPTZ,
    status VARCHAR(16) DEFAULT 'active' CHECK (status IN ('active', 'suspended', 'pending_kyc', 'banned')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    last_login_at TIMESTAMPTZ,
    UNIQUE(phone_dial_code, phone_number)
);

CREATE TABLE user_roles (
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    role_name VARCHAR(32) REFERENCES roles(name) ON DELETE CASCADE,
    scope_country VARCHAR(2) REFERENCES geo_countries(code), -- 角色生效地域 (可按国/城细分)
    scope_city VARCHAR(32) REFERENCES geo_cities(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    PRIMARY KEY (user_id, role_name)
);

-- 个人欧洲生活档案 (My Europe Dossier)
CREATE TABLE user_dossiers (
    user_id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    tax_code VARCHAR(64), -- 意大利 Codice Fiscale, 西班牙 NIE, 法国 Numéro Fiscal
    residence_permit_type VARCHAR(64), -- '工作居留', '家庭居留', '长期欧盟永居', '学生居留'
    residence_permit_expires_at DATE,
    residence_permit_reminder_days INT DEFAULT 60, -- 到期前多少天触发 AI 催件提醒
    health_card_expires_at DATE,
    has_car BOOLEAN DEFAULT false,
    car_insurance_expires_at DATE,
    car_itv_inspection_expires_at DATE,
    custom_notes TEXT,
    gdpr_consent_accepted_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- 4. 统一发布物与生命周期表 (Unified Listings: Housing, Jobs, Marketplace, Transfers)
-- ============================================================================

CREATE TABLE listing_categories (
    id VARCHAR(32) PRIMARY KEY, -- 'housing', 'jobs', 'marketplace', 'transfers', 'services'
    name_zh VARCHAR(64) NOT NULL,
    parent_id VARCHAR(32) REFERENCES listing_categories(id),
    icon VARCHAR(64),
    sort_order INT DEFAULT 0
);

CREATE TABLE listings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    category_id VARCHAR(32) NOT NULL REFERENCES listing_categories(id),
    sub_category VARCHAR(64) NOT NULL,
    country_code VARCHAR(2) NOT NULL REFERENCES geo_countries(code),
    city_id VARCHAR(32) NOT NULL REFERENCES geo_cities(id),
    district_id VARCHAR(64) REFERENCES geo_districts(id),
    title VARCHAR(255) NOT NULL,
    title_local VARCHAR(255),
    summary TEXT,
    description TEXT NOT NULL,
    price_cents BIGINT, -- 以分存储杜绝浮点误差 (如 €1,350 = 135000)
    price_currency VARCHAR(3) DEFAULT 'EUR',
    price_period VARCHAR(16) DEFAULT 'month' CHECK (price_period IN ('once', 'month', 'year', 'day', 'hour')),
    address VARCHAR(255) NOT NULL,
    lat NUMERIC(9,6),
    lng NUMERIC(9,6),
    contact_name VARCHAR(64) NOT NULL,
    contact_phone VARCHAR(32),
    contact_whatsapp VARCHAR(32),
    contact_wechat VARCHAR(64),
    speaks_chinese BOOLEAN DEFAULT true,
    tags TEXT[] DEFAULT '{}',
    images TEXT[] DEFAULT '{}',
    trust_score INT DEFAULT 80 CHECK (trust_score BETWEEN 0 AND 100),
    status VARCHAR(32) DEFAULT 'active' CHECK (status IN ('draft', 'pending_review', 'active', 'need_confirm', 'expired', 'closed', 'flagged')),
    risk_level VARCHAR(16) DEFAULT 'low' CHECK (risk_level IN ('low', 'medium', 'high')),
    views_count INT DEFAULT 0,
    favorites_count INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    confirmed_at TIMESTAMPTZ DEFAULT NOW(), -- 上次确认有效时间
    expires_at TIMESTAMPTZ DEFAULT (NOW() + INTERVAL '30 days') -- 30天自动过期机制
);

-- 房屋专用细化元数据 (Housing Metadata)
CREATE TABLE listing_housing_meta (
    listing_id UUID PRIMARY KEY REFERENCES listings(id) ON DELETE CASCADE,
    property_type VARCHAR(32) NOT NULL, -- 'apartment', 'room', 'villa', 'commercial'
    rooms_count INT DEFAULT 1,
    bathrooms_count INT DEFAULT 1,
    area_sqm NUMERIC(6,2),
    floor_number VARCHAR(16),
    has_elevator BOOLEAN DEFAULT false,
    deposit_months INT DEFAULT 3,
    condo_fees_cents BIGINT DEFAULT 0,
    estimated_utilities_cents BIGINT DEFAULT 0,
    can_register_residenza BOOLEAN DEFAULT false, -- 是否可登记户籍（租房核心痛点）
    is_chinese_landlord BOOLEAN DEFAULT false,
    pet_friendly BOOLEAN DEFAULT false,
    distance_to_metro_meters INT,
    nearest_metro_station VARCHAR(64)
);

-- 招聘专用细化元数据 (Job Metadata)
CREATE TABLE listing_job_meta (
    listing_id UUID PRIMARY KEY REFERENCES listings(id) ON DELETE CASCADE,
    industry VARCHAR(64) NOT NULL, -- 'catering', 'trade_import_export', 'warehouse', 'driver', 'factory'
    job_type VARCHAR(32) DEFAULT 'full_time', -- 'full_time', 'part_time', 'seasonal'
    salary_min_cents BIGINT,
    salary_max_cents BIGINT,
    provides_meals BOOLEAN DEFAULT false,
    provides_accommodation BOOLEAN DEFAULT false,
    contract_type VARCHAR(64), -- 'Contratto Indeterminato (永久白领/全工)', 'Determinato (有期)', 'Stage'
    sign_contract_status VARCHAR(32) DEFAULT 'full_legal', -- 'full_legal (全签)', 'part_legal'
    language_requirements VARCHAR(64) DEFAULT '中文即可'
);

-- 店铺转让专用细化元数据 (Store Transfer Metadata)
CREATE TABLE listing_transfer_meta (
    listing_id UUID PRIMARY KEY REFERENCES listings(id) ON DELETE CASCADE,
    business_type VARCHAR(64) NOT NULL, -- 'restaurant', 'bar_tabacchi', 'clothing_store', 'supermarket'
    monthly_rent_cents BIGINT NOT NULL,
    indoor_seats INT DEFAULT 0,
    outdoor_terrace_seats INT DEFAULT 0,
    license_type VARCHAR(64), -- 'Licence IV', 'Somministrazione', 'Tabacchi'
    daily_revenue_avg_cents BIGINT,
    has_verified_balance_sheet BOOLEAN DEFAULT false, -- 是否通过官方年度财务报表查验
    transfer_reason TEXT
);

-- 二手跳蚤专用细化元数据 (Marketplace Metadata)
CREATE TABLE listing_marketplace_meta (
    listing_id UUID PRIMARY KEY REFERENCES listings(id) ON DELETE CASCADE,
    brand VARCHAR(64),
    model VARCHAR(64),
    condition_rating VARCHAR(32) DEFAULT '99_new', -- 'brand_new', '99_new', '90_new', 'fair'
    has_original_receipt BOOLEAN DEFAULT false,
    support_in_person_inspection BOOLEAN DEFAULT true,
    support_eu_shipping BOOLEAN DEFAULT false
);

-- ============================================================================
-- 5. 认证华人商家与 AI 智能前台接待 (Businesses & Yellow Pages)
-- ============================================================================

CREATE TABLE businesses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    owner_id UUID REFERENCES users(id) ON DELETE SET NULL,
    category VARCHAR(64) NOT NULL, -- 'accountant', 'lawyer', 'clinic', 'logistics', 'restaurant', 'renovation'
    country_code VARCHAR(2) NOT NULL REFERENCES geo_countries(code),
    city_id VARCHAR(32) NOT NULL REFERENCES geo_cities(id),
    district_id VARCHAR(64) REFERENCES geo_districts(id),
    name_zh VARCHAR(128) NOT NULL,
    name_local VARCHAR(128) NOT NULL,
    slug VARCHAR(128) UNIQUE NOT NULL,
    address VARCHAR(255) NOT NULL,
    lat NUMERIC(9,6) NOT NULL,
    lng NUMERIC(9,6) NOT NULL,
    phone VARCHAR(32) NOT NULL,
    whatsapp VARCHAR(32),
    wechat VARCHAR(64),
    email VARCHAR(128),
    website_url VARCHAR(255),
    vat_number VARCHAR(64), -- Partita IVA / SIRET / CIF (税号凭证)
    languages_supported TEXT[] DEFAULT '{"zh"}',
    rating NUMERIC(2,1) DEFAULT 5.0,
    review_count INT DEFAULT 0,
    opening_hours_json JSONB DEFAULT '{}',
    services_catalog_json JSONB DEFAULT '[]',
    is_verified BOOLEAN DEFAULT false,
    is_claimed BOOLEAN DEFAULT false,
    featured_badge VARCHAR(64),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 商家 AI 客服自主托管配置 (AI Business Agent)
CREATE TABLE business_ai_profiles (
    business_id UUID PRIMARY KEY REFERENCES businesses(id) ON DELETE CASCADE,
    bot_display_name VARCHAR(64) DEFAULT '智能前台接待',
    is_enabled BOOLEAN DEFAULT true,
    system_instruction TEXT,
    custom_faq_notes TEXT, -- 商家随手语音输入的“春节放假安排”、“人均餐标”等规则
    auto_appointment_enabled BOOLEAN DEFAULT true,
    forward_leads_to_whatsapp BOOLEAN DEFAULT true,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE business_reviews (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    business_id UUID NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    rating INT CHECK (rating BETWEEN 1 AND 5),
    content TEXT NOT NULL,
    images TEXT[] DEFAULT '{}',
    reply_from_owner TEXT,
    is_verified_customer BOOLEAN DEFAULT false,
    status VARCHAR(16) DEFAULT 'published' CHECK (status IN ('published', 'hidden', 'flagged')),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- 6. AI 欧洲文件管家与公函 OCR 解析库 (Documents & OCR Extraction)
-- ============================================================================

CREATE TABLE user_documents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    doc_type VARCHAR(64) NOT NULL, -- 'tax_demand', 'questura_summons', 'rental_lease', 'employment_contract'
    original_file_url TEXT NOT NULL,
    file_mime VARCHAR(64),
    ocr_raw_text TEXT,
    detected_language VARCHAR(16) DEFAULT 'it',
    sender_organization VARCHAR(128), -- e.g. 'Agenzia delle Entrate - Riscossione'
    document_title VARCHAR(255),
    summary_zh TEXT,
    action_deadline DATE,
    amount_due_cents BIGINT DEFAULT 0,
    risk_level VARCHAR(16) DEFAULT 'medium' CHECK (risk_level IN ('low', 'medium', 'high')),
    legal_obligations TEXT,
    recommended_next_steps JSONB DEFAULT '[]',
    generated_reply_draft TEXT,
    is_archived BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- 7. 社区论坛与活化知识图谱 (Community Forum & Knowledge Base)
-- ============================================================================

CREATE TABLE forum_boards (
    id VARCHAR(32) PRIMARY KEY, -- 'visa_residence', 'tax_accounting', 'daily_living', 'food_dining'
    name_zh VARCHAR(64) NOT NULL,
    description TEXT,
    threads_count INT DEFAULT 0
);

CREATE TABLE forum_threads (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    board_id VARCHAR(32) NOT NULL REFERENCES forum_boards(id) ON DELETE RESTRICT,
    author_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    country_code VARCHAR(2) REFERENCES geo_countries(code),
    city_id VARCHAR(32) REFERENCES geo_cities(id),
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    views_count INT DEFAULT 0,
    replies_count INT DEFAULT 0,
    is_pinned BOOLEAN DEFAULT false,
    is_locked BOOLEAN DEFAULT false,
    ai_summary_json JSONB DEFAULT '{}', -- 自动提炼的 100 楼共识
    official_policy_reference_json JSONB DEFAULT '{}', -- 关联的内政部权威法令
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE forum_replies (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    thread_id UUID NOT NULL REFERENCES forum_threads(id) ON DELETE CASCADE,
    author_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    likes_count INT DEFAULT 0,
    is_official_expert BOOLEAN DEFAULT false, -- 注册律师/会计师专业回复认证
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- 8. AI Agent 会话、调度决策与操作审计日志 (AI Orchestrator & Audit)
-- ============================================================================

CREATE TABLE ai_agent_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    session_token VARCHAR(64) NOT NULL,
    intent VARCHAR(64) NOT NULL, -- 'find_accountant', 'rent_housing', 'apply_job', 'analyze_letter'
    country_code VARCHAR(2) REFERENCES geo_countries(code),
    city_id VARCHAR(32) REFERENCES geo_cities(id),
    initial_user_prompt TEXT NOT NULL,
    workflow_state VARCHAR(32) DEFAULT 'completed' CHECK (workflow_state IN ('parsing', 'matching', 'comparing', 'awaiting_approval', 'executed', 'completed', 'failed')),
    approval_required BOOLEAN DEFAULT false,
    is_approved_by_user BOOLEAN,
    approved_at TIMESTAMPTZ,
    final_output_summary TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    completed_at TIMESTAMPTZ
);

CREATE TABLE ai_agent_action_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id UUID NOT NULL REFERENCES ai_agent_sessions(id) ON DELETE CASCADE,
    step_number INT NOT NULL,
    tool_invoked VARCHAR(64) NOT NULL, -- 'query_accountants_db', 'generate_draft_message', 'calculate_upfront_rent'
    tool_arguments JSONB DEFAULT '{}',
    tool_result_payload JSONB DEFAULT '{}',
    llm_reasoning_thought TEXT,
    model_name VARCHAR(64) DEFAULT 'gemini-3.8-flash',
    duration_ms INT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 风控合规与自动化审核表 (Trust & Safety Audit)
CREATE TABLE moderation_audits (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    entity_type VARCHAR(32) NOT NULL, -- 'listing', 'review', 'forum_thread', 'user_account'
    entity_id UUID NOT NULL,
    ai_risk_score INT CHECK (ai_risk_score BETWEEN 0 AND 100),
    ai_flagged_reasons TEXT[] DEFAULT '{}', -- ARRAY['duplicate_image_across_cities', 'prepayment_deposit_scam']
    auto_decision VARCHAR(32) DEFAULT 'pass' CHECK (auto_decision IN ('pass', 'soft_quarantine', 'block_and_alert_admin')),
    human_reviewer_id UUID REFERENCES users(id),
    human_decision VARCHAR(32),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- AI COO 每日全欧自动化运营报表表
CREATE TABLE daily_coo_metrics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    report_date DATE NOT NULL,
    country_code VARCHAR(2) REFERENCES geo_countries(code),
    city_id VARCHAR(32) REFERENCES geo_cities(id),
    dau_count INT DEFAULT 0,
    new_users_count INT DEFAULT 0,
    new_listings_count INT DEFAULT 0,
    ai_conversations_count INT DEFAULT 0,
    auto_resolution_rate NUMERIC(4,1) DEFAULT 95.0,
    fraud_blocked_count INT DEFAULT 0,
    expired_cleaned_count INT DEFAULT 0,
    seo_pages_generated INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(report_date, country_code, city_id)
);

-- ============================================================================
-- 9. 核心高性能索引与多语言全文检索优化 (Indexes & Scaling)
-- ============================================================================

-- 城市与发布物复合检索索引 (支撑快速秒级分类检索)
CREATE INDEX idx_listings_city_category ON listings (city_id, category_id, status);
CREATE INDEX idx_listings_country_status ON listings (country_code, status, expires_at);
CREATE INDEX idx_listings_created ON listings (created_at DESC);
CREATE INDEX idx_listings_lat_lng ON listings (lat, lng) WHERE lat IS NOT NULL AND lng IS NOT NULL;

-- 商家基于地理位置与类别索引
CREATE INDEX idx_businesses_city_cat ON businesses (city_id, category);
CREATE INDEX idx_businesses_slug ON businesses (slug);

-- 论坛基于城市与主题索引
CREATE INDEX idx_forum_city ON forum_threads (city_id, board_id);

-- 全文搜索 (支持中文和当地欧洲语言)
CREATE INDEX idx_listings_title_summary ON listings USING gin(to_tsvector('simple', title || ' ' || COALESCE(summary, '')));
CREATE INDEX idx_forum_title_content ON forum_threads USING gin(to_tsvector('simple', title || ' ' || content));
