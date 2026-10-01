import { DocumentAuditRecord } from './types';

// Pre-seeded traceable document audit logs
export let dbDocumentAudits: DocumentAuditRecord[] = [
  {
    auditId: 'doc-audit-2026-001',
    timestamp: new Date(Date.now() - 3600000 * 3).toISOString(),
    filename: 'Cartella_Esattoriale_Agenzia_Entrate_2026.pdf',
    docType: 'Avviso di Intimazione di Pagamento (催缴税款与滞纳金通知)',
    issuingAuthority: 'Agenzia delle Entrate - Riscossione (意大利国家税务局)',
    recipientName: '张建国 (C.F. ZHN JNG 78M12 Z210X)',
    summary: '2023 年度企业废弃物环保处置税 (TARI) 及往期微额交通罚单补缴，本金 €314.40，滞纳利息 €28.10。',
    deadlineDate: '2026-11-15 (收件后 60 日法定限期)',
    amountDueEur: 342.50,
    obligations: [
      '于截止日前全额缴纳免除追加诉讼费',
      '核查以往 F24 缴税单据是否已记账扣款',
      '如属重复开票需在30日内提起行政自查申请 (Autotutela)',
    ],
    riskLevel: 'MEDIUM',
    riskWarnings: [
      '若逾期未处理，税务局依法拥有对当事人名下机动车施加行政扣押 (Fermo Amministrativo) 的权力',
      '催缴信件已具有执行效力，切勿忽视',
    ],
    nextSteps: [
      '1. 登录 Agenzia Entrate 官网个人抽屉 (Cassetto Fiscale) 核对欠款代码',
      '2. 通过手机银行或 Tabacchi 烟草店扫描 PagoPA 二维码快速缴付',
      '3. 缴款凭据拍照存入“我的欧洲生活档案”备查',
    ],
    formalReplyDraft: `Spettabile Agenzia delle Entrate - Riscossione,
Il sottoscritto [Nome Cognome], C.F. [Codice Fiscale], comunica con la presente di aver provveduto al saldo dell'avviso N. [Numero Atto] in data odierna a mezzo PagoPA.
Si allega ricevuta di versamento telematica per lo sgravio della cartella.
Distinti saluti.`,
  },
  {
    auditId: 'doc-audit-2026-002',
    timestamp: new Date(Date.now() - 86400000).toISOString(),
    filename: 'Ricevuta_Postale_Kit_Questura.jpg',
    docType: 'Ricevuta di Spedizione Kit Postale Permesso di Soggiorno (居留邮局黄条居留条)',
    issuingAuthority: 'Poste Italiane - Sportello Amico / Questura di Milano',
    recipientName: '李芳 (Passaporto: G8892102)',
    summary: '工作居留续签大信封邮局递交回执。凭此条在居留制作期间可合法在意大利居留及直飞往返中国。',
    deadlineDate: '2026-11-28 09:30 (按指纹预约日 Appuntamento)',
    amountDueEur: null,
    obligations: [
      '按预约时间携带所有原件至 Questura Milano 警察局按手印',
      '按指纹前切勿遗失此条原件及税号原件',
    ],
    riskLevel: 'LOW',
    riskWarnings: [
      '过境其他申根国（如德国法兰克福、荷兰阿姆斯特丹转机）可能会因仅持黄条受阻，建议直航往返',
    ],
    nextSteps: [
      '1. 准备 4 张白底近照及 16 欧印花税原件',
      '2. 携带最近三期签工单 (Buste Paga) 和最新签工合同原件',
      '3. 定期查询 Polizia di Stato 官网制作进度',
    ],
    formalReplyDraft: `N/A - 官方回执单无需回复，按期履约按指纹即可。`,
  },
];

// Document parser engine
export function analyzeDocumentPayload(
  text: string,
  docTypeHint: string = 'tax'
): DocumentAuditRecord {
  const auditId = `doc-audit-${Date.now()}`;
  const lower = text.toLowerCase();

  let issuingAuthority = 'Agenzia delle Entrate - Riscossione';
  let docType = 'Avviso di Intimazione di Pagamento';
  let summary = '官方税务催缴或行政缴费通知书';
  let deadlineDate = '2026-11-15';
  let amountDueEur: number | null = 342.50;
  let riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' = 'MEDIUM';
  const obligations = ['在规定期限内完成核实或缴付', '妥善保存缴款回执至少 5 年'];
  const riskWarnings = ['逾期未理将可能产生滞纳金上浮或冻结银行账户风险'];
  const nextSteps = ['登录官网查验代码', '核对个人税号', '联系中文会计楼协助提交复议'];

  if (lower.includes('questura') || lower.includes('permesso') || lower.includes('soggiorno') || lower.includes('居留')) {
    issuingAuthority = 'Questura di Milano / Polizia di Stato';
    docType = 'Comunicazione Ufficio Immigrazione (移民局居留补件或按指纹通知)';
    summary = '居留延期申请材料审核通知或手印预约日期确认。';
    deadlineDate = '2026-11-28';
    amountDueEur = null;
    riskLevel = 'LOW';
    obligations.push('按期前往移民局窗口递交材料原件');
    riskWarnings[0] = '无故缺席预约可能导致居留延期申请被直接驳回 (Archiviazione)';
  } else if (lower.includes('contratto') || lower.includes('locazione') || lower.includes('租房') || lower.includes('affitto')) {
    issuingAuthority = 'Agenzia delle Entrate - Ufficio Registro (房屋租赁登记处)';
    docType = 'Contratto di Locazione ad Uso Abitativo (住宅租房合同 4+4)';
    summary = '合法备案租赁协议，包含押金条款 (Deposito Cauzionale)、月租及可否登记户籍 (Residenza)。';
    deadlineDate = '2026-10-31 (租约首月起租)';
    amountDueEur = 1400;
    riskLevel = 'LOW';
    obligations.push('准时支付月租并保存银行汇款附言说明');
    riskWarnings[0] = '注意核实房东是否按规定办理 Cedolare Secca 登记，以免影响 Residenza 办理';
  }

  const record: DocumentAuditRecord = {
    auditId,
    timestamp: new Date().toISOString(),
    filename: `upload_${Date.now()}.pdf`,
    docType,
    issuingAuthority,
    recipientName: '认证华人用户 (已提取)',
    summary,
    deadlineDate,
    amountDueEur,
    obligations,
    riskLevel,
    riskWarnings,
    nextSteps,
    formalReplyDraft: `Spettabile Ufficio Competente,
Il sottoscritto fa formale riscontro alla presente comunicazione comunicando la propria disponibilità alla regolarizzazione della pratica.
Cordiali saluti.`,
  };

  dbDocumentAudits.unshift(record);
  return record;
}
