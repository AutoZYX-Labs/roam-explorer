export type Severity = "S0" | "S1" | "S2" | "S3" | "S4";
export type Urgency = "U0" | "U1" | "U2" | "U3";

export interface Location {
  city: string;
  city_cn?: string;
  country?: string;
  country_cn?: string;
  road_type?: string;
  road_type_cn?: string;
  specific?: string;
  specific_cn?: string;
}

export interface Scenario {
  primary: string;
  secondary?: string[];
}

export interface Impact {
  vehicles_affected?: number;
  duration_minutes?: number | null;
  traffic_disruption?: string;
  traffic_disruption_cn?: string;
  injuries?: number;
  fatalities?: number;
}

export interface EmergencyResponse {
  sos_button?: string;
  sos_button_cn?: string;
  customer_service?: string;
  customer_service_cn?: string;
  remote_intervention?: string;
  remote_intervention_cn?: string;
  on_site_response?: string;
  on_site_response_cn?: string;
  resolution_method?: string;
  resolution_method_cn?: string;
}

export interface RootCause {
  category: string;
  category_cn?: string;
  description: string;
  description_cn?: string;
  confirmed: boolean;
}

export interface Source {
  url: string;
  title: string;
  title_cn?: string;
}

export type Tier = 1 | 2 | 3;

export type AutomationLevel = "L2" | "L3" | "L4" | "L5";

/** China GB/T draft 14 event type codes (Appendix B). */
export type GbEventType =
  | "0x01" // ADS 激活
  | "0x02" // ADS 退出
  | "0x03" // 发出介入请求
  | "0x04" // 启动最小风险策略
  | "0x05" // ADS 严重失效
  | "0x06" // 车辆严重失效
  | "0x07" // 非锁定碰撞（预碰撞）
  | "0x08" // 有碰撞风险
  | "0x09" // 用户操纵 ADS 退出
  | "0x0A" // 锁定碰撞（发生碰撞）
  | "0x0B" // 远程控制
  | "0x0C" // OTA 升级
  | "0x0D" // ADAS 事件
  | "0x0E"; // 网络和数据安全

export interface Incident {
  id: string;
  tier?: Tier;
  date: string;
  time?: string;
  operator: string;
  vehicle_model?: string;
  location: Location;
  scenario: Scenario;
  severity: Severity;
  urgency?: Urgency;
  description: string;
  description_cn?: string;
  impact?: Impact;
  emergency_response?: EmergencyResponse;
  root_cause?: RootCause;
  systemic_issues?: string[];
  systemic_issues_cn?: string[];
  regulatory_action?: string;
  regulatory_action_cn?: string;
  sources?: Source[];
  contributor?: string;
  last_updated?: string;

  // --- GB/T alignment fields (optional) ---
  /** China GB/T Appendix B event type code. */
  gb_event_type?: GbEventType;
  /** Whether ADS was engaged at incident time. */
  ads_activation_status?: boolean;
  /** SAE automation level per GB/T 44373. */
  driving_automation_level?: AutomationLevel;
  /** Actual response layer that handled the incident (1/2/3). */
  response_layer_actual?: 1 | 2 | 3;
  /** VIN with privacy masking (first 10 chars + asterisks). */
  vin_masked?: string;
}

export interface SubScenario {
  id: string;
  name_en: string;
  name_cn: string;
  description: string;
  primaryLayer: number;
  escalationLayer?: number;
}

export interface ScenarioCategory {
  code: string;
  name_en: string;
  name_cn: string;
  description: string;
  subScenarios: SubScenario[];
}

export interface KPI {
  number: number;
  name: string;
  unit: string;
  target: string;
  frequency: string;
  definition: string;
  targets: { label: string; target: string; stretch: string }[];
}

export interface DashboardStats {
  totalIncidents: number;
  totalOperators: number;
  totalScenarios: number;
  yearRange: string;
  bySeverity: Record<string, number>;
  byOperator: Record<string, number>;
  byYear: Record<string, number>;
  byCategory: Record<string, number>;
}
