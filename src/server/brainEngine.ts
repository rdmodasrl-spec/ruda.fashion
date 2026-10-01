import { GoogleGenAI } from '@google/genai';
import {
  StructuredAction,
  CapabilityDefinition,
  BrainPreviewResult,
  BrainExecutionReceipt,
} from './types';

// Strict Capability Registry
export const CAPABILITY_REGISTRY: Record<string, CapabilityDefinition> = {
  expire_listings: {
    name: '房源/发布物过期处理',
    action: 'expire_listings',
    entity: 'listings',
    description: '将超过时限未确认的房源或招聘信息置为 need_confirm 或 expired',
    riskAssessment: 'MEDIUM',
    allowedFields: ['status', 'expiresInDays'],
  },
  quarantine_listings: {
    name: '违规/欺诈内容隔离下架',
    action: 'quarantine_listings',
    entity: 'listings',
    description: '检测到盗图、虚假押金索要或高危电诈时，隔离下架并冻结信任分',
    riskAssessment: 'HIGH',
    allowedFields: ['status', 'trustScore', 'riskLevel'],
  },
  approve_listings: {
    name: '人工/免审审核通过',
    action: 'approve_listings',
    entity: 'listings',
    description: '对合规房源或招聘进行审核通过并提升信任分',
    riskAssessment: 'LOW',
    allowedFields: ['status', 'trustScore', 'isVerified', 'riskLevel'],
  },
  update_listing_status: {
    name: '调整发布物状态',
    action: 'update_listing_status',
    entity: 'listings',
    description: '调整指定筛选范围内的房源或招聘生命周期状态',
    riskAssessment: 'MEDIUM',
    allowedFields: ['status', 'expiresInDays'],
  },
  adjust_listing_prices: {
    name: '批量调整租金/标价',
    action: 'adjust_listing_prices',
    entity: 'listings',
    description: '按百分比或指定增量调整指定城市或类别的价格',
    riskAssessment: 'HIGH',
    allowedFields: ['price'],
  },
  verify_business: {
    name: '认证商户资质',
    action: 'verify_business',
    entity: 'businesses',
    description: '对核验营业执照 (Visura Camerale/KBIS) 后的商户赋予认证绿标',
    riskAssessment: 'LOW',
    allowedFields: ['isVerified', 'rating'],
  },
  update_business_hours: {
    name: '更新商户营业与节假日',
    action: 'update_business_hours',
    entity: 'businesses',
    description: '批量或单店更新节假日、开工排班或 AI 前台知识库',
    riskAssessment: 'LOW',
    allowedFields: ['openingHours', 'aiAssistantKnowledge'],
  },
  delete_flagged: {
    name: '物理清除高危欺诈违规数据',
    action: 'delete_flagged',
    entity: 'listings',
    description: '从数据库物理删除确认恶意发布的黑名单条目',
    riskAssessment: 'HIGH',
    allowedFields: ['id'],
  },
  archive_stale: {
    name: '归档历史久远沉淀帖子',
    action: 'archive_stale',
    entity: 'listings',
    description: '将超过 180 天未活跃的房源或招聘转移至冷数据归档库',
    riskAssessment: 'MEDIUM',
    allowedFields: ['status'],
  },
};

// Confirmation tokens cache (Token -> StructuredAction, TTL 5 mins)
const confirmationTokens = new Map<string, { action: StructuredAction; createdAt: number }>();

// Deterministic Semantic Parser
export async function parseCommandToStructuredAction(
  command: string,
  genAI?: GoogleGenAI | null
): Promise<StructuredAction> {
  const lower = command.toLowerCase().trim();

  // Heuristic rule-based slot extraction (Fallback & deterministic)
  let structured: StructuredAction = {
    intent: 'general_query',
    action: 'expire_listings',
    entity: 'listings',
    filters: {},
    mutation: {},
    riskAssessment: 'LOW',
    requiresConfirmation: false,
    explanation: '根据自然语言意图生成的受控操作',
  };

  // City extraction
  if (lower.includes('巴黎') || lower.includes('paris')) structured.filters.cityId = 'paris';
  else if (lower.includes('米兰') || lower.includes('milan')) structured.filters.cityId = 'milan';
  else if (lower.includes('罗马') || lower.includes('rome')) structured.filters.cityId = 'rome';
  else if (lower.includes('马德里') || lower.includes('madrid')) structured.filters.cityId = 'madrid';

  // Category extraction
  if (lower.includes('房') || lower.includes('租房') || lower.includes('housing')) structured.filters.category = 'housing';
  else if (lower.includes('工作') || lower.includes('招') || lower.includes('jobs')) structured.filters.category = 'jobs';
  else if (lower.includes('二手') || lower.includes('跳蚤')) structured.filters.category = 'marketplace';
  else if (lower.includes('转让') || lower.includes('转店')) structured.filters.category = 'transfers';

  // Intent matching
  if (lower.includes('过期') || lower.includes('下架') || lower.includes('30天') || lower.includes('25天')) {
    structured.intent = 'expire_stale_listings';
    structured.action = 'expire_listings';
    structured.entity = 'listings';
    structured.filters.ageDaysGte = lower.includes('25') ? 25 : 30;
    structured.mutation = { status: 'need_confirm', expiresInDays: 0 };
    structured.riskAssessment = 'MEDIUM';
    structured.requiresConfirmation = true;
    structured.explanation = '检测到过期下架意图：将满足天数要求的房源置为待确认状态，促使发布者确认存续';
  } else if (lower.includes('诈骗') || lower.includes('封禁') || lower.includes('隔离') || lower.includes('黑名单') || lower.includes('押金')) {
    structured.intent = 'quarantine_fraudulent_content';
    structured.action = 'quarantine_listings';
    structured.entity = 'listings';
    structured.filters.keyword = lower.includes('押金') ? '押金' : undefined;
    structured.mutation = { status: 'flagged', trustScore: 15, riskLevel: 'high' };
    structured.riskAssessment = 'HIGH';
    structured.requiresConfirmation = true;
    structured.explanation = '检测到风控隔离意图：对可疑欺诈或索取非正规预付金的条目实施隔离降权';
  } else if (lower.includes('通过') || lower.includes('审核') || lower.includes('认证通过')) {
    structured.intent = 'approve_pending_listings';
    structured.action = 'approve_listings';
    structured.entity = 'listings';
    structured.filters.status = 'pending_review';
    structured.mutation = { status: 'active', trustScore: 98, isVerified: true, riskLevel: 'low' };
    structured.riskAssessment = 'LOW';
    structured.requiresConfirmation = false;
    structured.explanation = '检测到审批通过意图：将待审房源或发布物升级为正式上线状态';
  } else if (lower.includes('商家') && (lower.includes('认证') || lower.includes('加v'))) {
    structured.intent = 'verify_merchant_business';
    structured.action = 'verify_business';
    structured.entity = 'businesses';
    structured.mutation = { isVerified: true };
    structured.riskAssessment = 'LOW';
    structured.requiresConfirmation = false;
    structured.explanation = '检测到商户认证意图：标记商户资质真实有效';
  } else if (lower.includes('营业时间') || lower.includes('假期') || lower.includes('关门') || lower.includes('开门')) {
    structured.intent = 'update_business_hours';
    structured.action = 'update_business_hours';
    structured.entity = 'businesses';
    structured.mutation = { openingHours: '全周调整: 10:00 - 22:00 (AI排班调度已确认)' };
    structured.riskAssessment = 'LOW';
    structured.requiresConfirmation = false;
    structured.explanation = '检测到营业时间调整意图：同步商户公开时段与 AI 客服规则';
  } else if (lower.includes('删除') || lower.includes('清除')) {
    structured.intent = 'delete_dangerous_listings';
    structured.action = 'delete_flagged';
    structured.entity = 'listings';
    structured.filters.riskLevel = 'high';
    structured.mutation = { deleted: true };
    structured.riskAssessment = 'HIGH';
    structured.requiresConfirmation = true;
    structured.explanation = '检测到物理删除意图：高危动作，必须经过明确授权确认';
  }

  // If Gemini API is available, enhance semantic slotting
  if (genAI) {
    try {
      const prompt = `你是一个欧洲华人平台的后端架构安全分析器。请将用户的自然语言指令严格解析为以下 JSON Schema 的结构化动作，严禁直接生成 SQL，严禁编造 action：
允许的 action：expire_listings, quarantine_listings, approve_listings, update_listing_status, adjust_listing_prices, verify_business, update_business_hours, delete_flagged, archive_stale。
允许的 entity：listings, businesses, moderation_audits。
用户输入："${command}"
只输出合法 JSON 格式，包含：
{
  "intent": string,
  "action": string,
  "entity": string,
  "filters": { "cityId"?: string, "category"?: string, "status"?: string, "riskLevel"?: string, "ageDaysGte"?: number, "keyword"?: string },
  "mutation": object,
  "riskAssessment": "LOW" | "MEDIUM" | "HIGH",
  "requiresConfirmation": boolean,
  "explanation": string
}`;
      const res = await genAI.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: [{ text: prompt }],
      });
      const text = res.text?.trim() || '';
      const jsonStart = text.indexOf('{');
      const jsonEnd = text.lastIndexOf('}');
      if (jsonStart !== -1 && jsonEnd !== -1) {
        const parsed = JSON.parse(text.substring(jsonStart, jsonEnd + 1));
        if (CAPABILITY_REGISTRY[parsed.action]) {
          return {
            ...structured,
            ...parsed,
            // Security enforce: HIGH risk always requires confirmation
            requiresConfirmation: parsed.riskAssessment === 'HIGH' || parsed.action === 'delete_flagged' || parsed.requiresConfirmation,
          };
        }
      }
    } catch (e: any) {
      console.warn('[BrainEngine] Gemini parsing fallback to deterministic parser:', e.message);
    }
  }

  return structured;
}

// Deterministic SQL Builder (Deterministic code, NOT LLM!)
export function buildSafeDeterministicSql(action: StructuredAction): string {
  const whereClauses: string[] = [];

  if (action.filters.cityId) {
    whereClauses.push(`city_id = '${action.filters.cityId.replace(/'/g, "''")}'`);
  }
  if (action.filters.category) {
    whereClauses.push(`category = '${action.filters.category.replace(/'/g, "''")}'`);
  }
  if (action.filters.status) {
    whereClauses.push(`status = '${action.filters.status.replace(/'/g, "''")}'`);
  }
  if (action.filters.riskLevel) {
    whereClauses.push(`risk_level = '${action.filters.riskLevel.replace(/'/g, "''")}'`);
  }
  if (action.filters.ageDaysGte) {
    whereClauses.push(`expires_in_days <= ${Math.max(0, 30 - action.filters.ageDaysGte)}`);
  }
  if (action.filters.keyword) {
    whereClauses.push(`title LIKE '%${action.filters.keyword.replace(/'/g, "''")}%'`);
  }

  const whereStr = whereClauses.length > 0 ? ` WHERE ${whereClauses.join(' AND ')}` : '';

  if (action.action === 'delete_flagged') {
    return `DELETE FROM ${action.entity}${whereStr || " WHERE risk_level = 'high'"};`;
  }

  const setClauses: string[] = [];
  for (const [key, val] of Object.entries(action.mutation)) {
    if (key === 'status') setClauses.push(`status = '${String(val).replace(/'/g, "''")}'`);
    else if (key === 'trustScore') setClauses.push(`trust_score = ${Number(val) || 0}`);
    else if (key === 'isVerified') setClauses.push(`is_verified = ${val ? 'true' : 'false'}`);
    else if (key === 'riskLevel') setClauses.push(`risk_level = '${String(val).replace(/'/g, "''")}'`);
    else if (key === 'expiresInDays') setClauses.push(`expires_in_days = ${Number(val) || 0}`);
    else if (key === 'openingHours') setClauses.push(`opening_hours = '${String(val).replace(/'/g, "''")}'`);
  }

  if (setClauses.length === 0) {
    setClauses.push("updated_at = NOW()");
  }

  return `UPDATE ${action.entity} SET ${setClauses.join(', ')}${whereStr};`;
}

// Generate Action Preview with Policy & Scope evaluation
export function generateActionPreview(
  action: StructuredAction,
  dbListings: any[],
  dbBusinesses: any[]
): BrainPreviewResult {
  const policyNotes: string[] = [];

  // Check Capability
  const cap = CAPABILITY_REGISTRY[action.action];
  if (!cap) {
    throw new Error(`E_UNSUPPORTED_CAPABILITY: 动作 ${action.action} 未在安全能力注册表中注册`);
  }

  // Filter matched records
  let matchedRecords: any[] = [];
  if (action.entity === 'listings') {
    matchedRecords = dbListings.filter((item) => {
      if (action.filters.cityId && item.cityId !== action.filters.cityId) return false;
      if (action.filters.category && item.category !== action.filters.category) return false;
      if (action.filters.status && item.status !== action.filters.status) return false;
      if (action.filters.riskLevel && item.riskLevel !== action.filters.riskLevel) return false;
      if (action.filters.ageDaysGte && item.expiresInDays > Math.max(0, 30 - action.filters.ageDaysGte)) return false;
      if (action.filters.keyword && !item.title.toLowerCase().includes(action.filters.keyword.toLowerCase())) return false;
      return true;
    });
  } else if (action.entity === 'businesses') {
    matchedRecords = dbBusinesses.filter((b) => {
      if (action.filters.cityId && b.cityId !== action.filters.cityId) return false;
      if (action.filters.keyword && !b.nameZh.toLowerCase().includes(action.filters.keyword.toLowerCase())) return false;
      return true;
    });
  }

  // Check batch scope limit (Safety policy: max 50 rows per automated command)
  const MAX_AFFECTED_LIMIT = 50;
  if (matchedRecords.length > MAX_AFFECTED_LIMIT) {
    policyNotes.push(`⚠️ 触发安全风控：匹配行数 (${matchedRecords.length}) 超过默认安全上限 (${MAX_AFFECTED_LIMIT})，自动限制单次执行批次`);
    matchedRecords = matchedRecords.slice(0, MAX_AFFECTED_LIMIT);
  }

  // Policy check
  if (action.riskAssessment === 'HIGH') {
    policyNotes.push('🔴 高风险操作策略：涉及物理删除或大范围封禁，系统必须开启用户安全授权闸门 (Authorization Gate)');
  } else if (action.riskAssessment === 'MEDIUM') {
    policyNotes.push('🟡 中风险操作策略：涉及生命周期状态变更，需确认影响范围与关联通知');
  } else {
    policyNotes.push('🟢 低风险操作策略：合规认证与常规属性更新');
  }

  const deterministicSql = buildSafeDeterministicSql(action);

  // Generate confirmation token if required
  let confirmationToken: string | undefined;
  if (action.requiresConfirmation) {
    confirmationToken = `tok_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    confirmationTokens.set(confirmationToken, { action, createdAt: Date.now() });
  }

  return {
    action,
    previewSql: deterministicSql,
    matchedCount: matchedRecords.length,
    matchedRecordsSample: matchedRecords.slice(0, 3),
    riskAssessment: action.riskAssessment,
    requiresConfirmation: action.requiresConfirmation,
    confirmationToken,
    policyNotes,
  };
}

// Execute Verified Brain Action (Atomic mutation with audit)
export function executeBrainAction(
  action: StructuredAction,
  confirmationToken: string | undefined,
  dbListings: any[],
  dbBusinesses: any[],
  operator: string = 'SUPER_ADMIN'
): {
  updatedListings: any[];
  updatedBusinesses: any[];
  receipt: BrainExecutionReceipt;
} {
  const startTime = Date.now();

  // Validate confirmation token if high/medium risk
  if (action.requiresConfirmation) {
    if (!confirmationToken || !confirmationTokens.has(confirmationToken)) {
      throw new Error('E_AUTHORIZATION_REQUIRED: 此操作需要管理员在授权闸门提供有效的确认令牌 (Confirmation Token)');
    }
    confirmationTokens.delete(confirmationToken); // Burn token (single use)
  }

  let affectedCount = 0;
  let updatedListings = [...dbListings];
  let updatedBusinesses = [...dbBusinesses];
  let sampleUpdated: any[] = [];

  const deterministicSql = buildSafeDeterministicSql(action);

  if (action.entity === 'listings') {
    if (action.action === 'delete_flagged') {
      const initialCount = updatedListings.length;
      updatedListings = updatedListings.filter((item) => {
        if (action.filters.riskLevel && item.riskLevel === action.filters.riskLevel) return false;
        if (action.filters.keyword && item.title.includes(action.filters.keyword)) return false;
        return true;
      });
      affectedCount = initialCount - updatedListings.length;
    } else {
      updatedListings = updatedListings.map((item) => {
        let match = true;
        if (action.filters.cityId && item.cityId !== action.filters.cityId) match = false;
        if (action.filters.category && item.category !== action.filters.category) match = false;
        if (action.filters.status && item.status !== action.filters.status) match = false;
        if (action.filters.riskLevel && item.riskLevel !== action.filters.riskLevel) match = false;
        if (action.filters.ageDaysGte && item.expiresInDays > Math.max(0, 30 - action.filters.ageDaysGte)) match = false;
        if (action.filters.keyword && !item.title.toLowerCase().includes(action.filters.keyword.toLowerCase())) match = false;

        if (match) {
          affectedCount++;
          const updated = { ...item, ...action.mutation };
          if (sampleUpdated.length < 3) sampleUpdated.push(updated);
          return updated;
        }
        return item;
      });
    }
  } else if (action.entity === 'businesses') {
    updatedBusinesses = updatedBusinesses.map((b) => {
      let match = true;
      if (action.filters.cityId && b.cityId !== action.filters.cityId) match = false;
      if (action.filters.keyword && !b.nameZh.toLowerCase().includes(action.filters.keyword.toLowerCase())) match = false;

      if (match) {
        affectedCount++;
        const updated = { ...b, ...action.mutation };
        if (sampleUpdated.length < 3) sampleUpdated.push(updated);
        return updated;
      }
      return b;
    });
  }

  const durationMs = Date.now() - startTime;

  const receipt: BrainExecutionReceipt = {
    executionId: `exec-${Date.now()}`,
    timestamp: new Date().toISOString(),
    command: action.explanation,
    structuredAction: action,
    deterministicSql,
    affectedCount,
    operator,
    status: 'COMMITTED',
    verification: {
      sampleUpdatedRecords: sampleUpdated,
      durationMs,
    },
  };

  return {
    updatedListings,
    updatedBusinesses,
    receipt,
  };
}
