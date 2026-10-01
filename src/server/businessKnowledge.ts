import { BusinessKnowledgeItem } from './types';

// Pre-seeded verified merchant knowledge items
export let dbBusinessKnowledge: BusinessKnowledgeItem[] = [
  {
    id: 'k-1',
    businessId: 'biz-1',
    category: '做账收费',
    keywords: ['做账', '费用', '包年', '收费', '价格', 'partita iva', '报税', '年费'],
    question: '华龙事务所做账收费标准是什么？',
    answer: '华龙事务所提供餐饮与零售小微商户包年做账套餐：针对 Forfettario (单一税率小微个体户) 包年做账 €480 起；普通公司 (Srl) 全包财税与做账 €1,800/年起。支持免费初审往期税务报表与债务核查。',
    officialCitation: '来源：米兰华龙会计师事务所 2026 年度公开执业收费公示',
    lastVerified: '2026-09-28',
  },
  {
    id: 'k-2',
    businessId: 'biz-1',
    category: '营业时段',
    keywords: ['营业时间', '几点关门', '开门', '周末', '上班', '周六', '周日'],
    question: '华龙事务所几点上班关门？',
    answer: '事务所办公时间为周一至周五 09:00 - 18:30，午间照常接待。全天配备中文专业税务顾问与意籍注册会计师。周六及周日仅接受重大企业并购与税务稽查紧急预约。',
    officialCitation: '来源：华龙事务所米兰前台公示牌与 Google Business 官方主页',
    lastVerified: '2026-09-25',
  },
  {
    id: 'k-3',
    businessId: 'biz-1',
    category: '居留签工',
    keywords: ['签工', '居留', '签工单', '大信封', '转长期', '家庭团聚'],
    question: '华龙事务所可以帮开签工单和做家庭团聚收入证明吗？',
    answer: '可以。我们提供合法合规的员工 Busta Paga (签工单) 核算、UNILAV 入职申报以及家庭团聚 / 转欧盟长期居留所需的年度 CUD (CU) 和 Redditi 收入证明核算服务。',
    officialCitation: '来源：华龙事务所劳工与移民事务专席',
    lastVerified: '2026-09-20',
  },
  {
    id: 'k-4',
    businessId: 'biz-2',
    category: '法律咨询',
    keywords: ['律师', '打官司', '催卡', '按手印', '遣返', '拒签', '上诉'],
    question: '巴黎欧华咨询中心可以代理居留拒签上诉吗？',
    answer: '欧华中心常年合作巴黎大区注册大律师，专精处理法国警察局 (Préfecture) 拒绝续发居留或 OQTF (离境令) 行政复议与法庭上诉。提供首次材料法务评估。',
    officialCitation: '来源：巴黎欧华法律中心执业律师团队备案公示',
    lastVerified: '2026-09-26',
  },
];

// Query merchant reception AI with zero-hallucination policy
export function queryMerchantAiReception(
  businessId: string,
  userQuestion: string,
  businessInfo?: any
): {
  answer: string;
  isGrounded: boolean;
  sourceCitation: string;
  lastVerified: string;
  degraded: boolean;
  suggestedAction?: string;
} {
  const q = userQuestion.toLowerCase().trim();
  const businessEntries = dbBusinessKnowledge.filter((k) => k.businessId === businessId);

  // Search in business-specific knowledge entries
  let bestMatch: BusinessKnowledgeItem | null = null;
  let highestScore = 0;

  for (const item of businessEntries) {
    let score = 0;
    for (const kw of item.keywords) {
      if (q.includes(kw.toLowerCase())) {
        score += 2;
      }
    }
    if (q.includes(item.category.toLowerCase())) score += 3;
    if (score > highestScore) {
      highestScore = score;
      bestMatch = item;
    }
  }

  // If match found with confidence score >= 2: Return Ground Truth Answer
  if (bestMatch && highestScore >= 2) {
    return {
      answer: bestMatch.answer,
      isGrounded: true,
      sourceCitation: bestMatch.officialCitation,
      lastVerified: bestMatch.lastVerified,
      degraded: false,
      suggestedAction: '如需办理此项服务，可直接预约或拨打电话。',
    };
  }

  // Graceful degradation when no answer in verified knowledge base (Strict anti-hallucination)
  const contactName = businessInfo?.contact?.name || businessInfo?.nameZh || '商户前台';
  const phone = businessInfo?.phone || businessInfo?.whatsapp || '商户留存电话';

  return {
    answer: `抱歉，经检索【${businessInfo?.nameZh || '当前商户'}】的官方知识库，暂未录入关于您所咨询问题的经过核验的标准答复。\n\n为确保信息真实合规、杜绝 AI 编造可能导致的误导，建议您通过以下方式直接联系：\n• 官方联系人：${contactName}\n• 电话/WhatsApp：${phone}\n• 服务地址：${businessInfo?.address || '见商户主页'}`,
    isGrounded: false,
    sourceCitation: '系统提示：知识库未命中，已触发安全降级保护',
    lastVerified: new Date().toISOString().split('T')[0],
    degraded: true,
    suggestedAction: '已转接人工咨询入口，避免错误引导。',
  };
}
