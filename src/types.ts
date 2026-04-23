// Shared Types

export interface RetailerRisk {
  id: string;
  name: string;
  type: string;
  licenseStatus: string;
  riskScore: number;
  riskLevel: '高风险' | '中风险' | '低风险';
  tags: string[];
}

export interface AIWarning {
  id: string;
  time: string;
  type: '订单异常' | '包裹异常' | '涉烟舆情';
  description: string;
  level: '严重' | '警告' | '关注';
}
