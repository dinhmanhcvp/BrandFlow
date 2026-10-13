import { DebateTurn, IndustryScenario, AgentRoleKey, StanceType, TargetFieldKey } from './debateTypes';
import { SHOWCASE_SCENARIOS } from './showcaseScenarios';

/**
 * Maps raw backend agent name (e.g. "CMO", "CFO", "COO", "PERSONA", "CEO", "SYSTEM")
 * to the standardized Vietnamese display titles and role keys.
 */
export function mapAgentRole(rawAgent: string): {
  key: AgentRoleKey;
  name: string;
  title: string;
} {
  const norm = (rawAgent || '').trim().toUpperCase();
  if (norm.includes('CMO') || norm.includes('MARKETING') || norm.includes('CHIẾN LƯỢC')) {
    return {
      key: 'strategy',
      name: 'Trợ lý chiến lược',
      title: 'Phân tích & Tăng trưởng thị trường'
    };
  }
  if (norm.includes('CFO') || norm.includes('FINANCE') || norm.includes('TÀI CHÍNH')) {
    return {
      key: 'finance',
      name: 'Trợ lý tài chính',
      title: 'Kiểm soát dòng tiền & Biên lợi nhuận'
    };
  }
  if (norm.includes('COO') || norm.includes('OPERATIONS') || norm.includes('VẬN HÀNH')) {
    return {
      key: 'operations',
      name: 'Trợ lý vận hành',
      title: 'Năng lực cung ứng & Hiệu suất bếp'
    };
  }
  if (norm.includes('PERSONA') || norm.includes('CUSTOMER') || norm.includes('KHÁCH HÀNG')) {
    return {
      key: 'customer',
      name: 'Trợ lý góc nhìn khách hàng',
      title: 'Chân dung khách hàng & Trải nghiệm thực tế'
    };
  }
  if (norm.includes('CEO') || norm.includes('LEADER') || norm.includes('QUYẾT ĐỊNH')) {
    return {
      key: 'decider',
      name: 'Người quyết định',
      title: 'Hội đồng quản trị & Chủ doanh nghiệp'
    };
  }
  return {
    key: 'calculator',
    name: 'Công cụ tính toán tài chính',
    title: 'Thẩm định số liệu & Kiểm soát rủi ro'
  };
}

/**
 * Converts real logs from backend into structured Boardroom Debate Turns
 */
export function convertRealLogsToDebateTurns(
  logs: Array<{ agent: string; message: string; role?: string }>,
  budgetLimit: number = 35000000
): DebateTurn[] {
  if (!logs || logs.length === 0) {
    return SHOWCASE_SCENARIOS.bep_nha_moc.turns;
  }

  const total = logs.length;
  return logs.map((log, index) => {
    const roleInfo = mapAgentRole(log.agent || log.role || '');
    const isBudgetCut = /cắt|giảm|ép giá|quá đắt|lãng phí|vượt/i.test(log.message || '');
    const isAgree = /đồng ý|thông qua|chấp nhận|nhất trí|quyết định cuối cùng/i.test(log.message || '');
    
    let stance: StanceType = 'proposal';
    if (isBudgetCut) stance = 'disagree';
    else if (isAgree) stance = 'agree';

    // Target field detection
    let targetField: TargetFieldKey = 'budget';
    let targetFieldLabel = 'Tổng ngân sách Marketing';
    if (/kênh|meta|facebook|tiktok|zalo/i.test(log.message || '')) {
      targetField = 'channels';
      targetFieldLabel = 'Kênh truyền thông & Tiếp cận';
    } else if (/bếp|vận hành|tải|nhân sự|giờ cao điểm/i.test(log.message || '')) {
      targetField = 'operations';
      targetFieldLabel = 'Mô hình phục vụ & Giờ cao điểm';
    } else if (/giá|voucher|thẻ|chiết khấu/i.test(log.message || '')) {
      targetField = 'pricing';
      targetFieldLabel = 'Chính sách ưu đãi & Giữ chân';
    }

    const consensus = Math.min(100, Math.round(25 + ((index + 1) / total) * 75));
    const roundNumber = Math.min(3, Math.floor((index / total) * 3) + 1);

    const isLastTurn = index === total - 1;
    const isOver = isBudgetCut && !isLastTurn;

    return {
      id: `turn-real-${index + 1}`,
      round: roundNumber,
      totalRounds: 3,
      speaker: roleInfo.key,
      speakerName: roleInfo.name,
      speakerTitle: roleInfo.title,
      stance,
      message: (log.message || '').replace(/^(\[\w+\]|\>|\#\#\#)\s*/g, '').slice(0, 220),
      targetField,
      targetFieldLabel,
      consensusLevel: consensus,
      financialCheck: {
        revenue: 140000000,
        expense: isOver ? 155000000 : 135000000,
        budgetLimit,
        balance: isOver ? -15000000 : 5000000,
        status: isLastTurn ? 'matched' : isOver ? 'exceeded' : 'checking',
        diffAmount: isOver ? 15000000 : 0,
        verificationMessage: isLastTurn 
          ? 'Đã khớp: Các chỉ số chi phí và dòng tiền đã được công cụ kiểm chứng an toàn' 
          : isOver 
          ? 'Chưa khớp: Đề xuất có nguy cơ vượt định mức dòng tiền dự phòng' 
          : 'Đang kiểm tra: Rà soát tác động dòng tiền trên từng đầu mục',
        isAudited: isLastTurn
      },
      decisionSaved: {
        id: `dec-real-${index + 1}`,
        title: isLastTurn ? 'Phê duyệt kế hoạch hành động' : `Thống nhất phương án mục ${targetFieldLabel}`,
        detail: 'Đã lưu vào hồ sơ doanh nghiệp. Trí tuệ AI đa tác nhân đạt đồng thuận.',
        turnIndex: index + 1,
        agentRole: roleInfo.name,
        timestamp: `Vòng ${roundNumber} · 00:${String((index + 1) * 6).padStart(2, '0')}`
      },
      durationSeconds: 5
    };
  });
}

/**
 * Retrieves the scenario by key or returns Bếp Nhà Mộc as default
 */
export function getScenario(scenarioKey: string = 'bep_nha_moc'): IndustryScenario {
  return SHOWCASE_SCENARIOS[scenarioKey] || SHOWCASE_SCENARIOS.bep_nha_moc;
}
