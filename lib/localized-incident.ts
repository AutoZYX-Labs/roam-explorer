import type { EmergencyResponse, Incident, Impact, Location, Source } from "./types";

const CITY_ZH: Record<string, string> = {
  "Austin, USA": "奥斯汀，美国",
  "Beijing, China": "北京，中国",
  "Brisbane, USA": "布里斯班，美国",
  "Bulringame, USA": "伯灵格姆，美国",
  "California, USA": "美国加利福尼亚州",
  "Castro Valley, USA": "卡斯特罗谷，美国",
  "Chaozhou, China": "潮州，中国",
  "Commerce, USA": "科默斯，美国",
  "Culver City, USA": "卡尔弗城，美国",
  "Daly City, USA": "戴利城，美国",
  "Emeryville, USA": "埃默里维尔，美国",
  "Foster City, USA": "福斯特城，美国",
  "Fremont, USA": "弗里蒙特，美国",
  "GARDENA, USA": "加迪纳，美国",
  "Inglewood, USA": "英格尔伍德，美国",
  "Irvine, USA": "欧文，美国",
  "LONG BEACH, USA": "长滩，美国",
  "Los Altos, USA": "洛斯阿尔托斯，美国",
  "Los Angeles, USA": "洛杉矶，美国",
  "Marina Del Rey, USA": "玛丽安德尔湾，美国",
  "Marina del Rey, USA": "玛丽安德尔湾，美国",
  "Martinez, USA": "马丁内斯，美国",
  "Menlo Park, USA": "门洛帕克，美国",
  "Milpitas, USA": "米尔皮塔斯，美国",
  "Mountain View, USA": "山景城，美国",
  "Multiple US cities": "美国多城市",
  "Multiple locations, USA": "美国多地",
  "Palo Alto, USA": "帕洛阿尔托，美国",
  "Phoenix, USA": "菲尼克斯，美国",
  "Portola Valley, USA": "波托拉谷，美国",
  "Putian, China": "莆田，中国",
  "Redwood City, USA": "红木城，美国",
  "Riverside, USA": "河滨，美国",
  "SAN FRANCISCO, USA": "旧金山，美国",
  "SANTA CLARA, USA": "圣克拉拉，美国",
  "SANTA FE SPRINGS, USA": "圣菲斯普林斯，美国",
  "San Bruno, USA": "圣布鲁诺，美国",
  "San Francisco, USA": "旧金山，美国",
  "San Francsico, USA": "旧金山，美国",
  "San Jose, USA": "圣何塞，美国",
  "San Mateo, USA": "圣马特奥，美国",
  "Santa Clara, USA": "圣克拉拉，美国",
  "Santa Monica, USA": "圣莫尼卡，美国",
  "South San Francisco, USA": "南旧金山，美国",
  "Ssan Francisco, USA": "旧金山，美国",
  "Ssn Francisco, USA": "旧金山，美国",
  "Sunnyvale, USA": "森尼韦尔，美国",
  "Venice, USA": "威尼斯，美国",
  "Wuhan, China": "武汉，中国",
  "Yueyang, China": "岳阳，中国",
};

const OPERATOR_ZH: Record<string, string> = {
  "Apollo (Baidu)": "百度 Apollo",
  "Baidu Apollo (萝卜快跑)": "百度 Apollo（萝卜快跑）",
  "Cruise (GM)": "Cruise（通用）",
  "Mercedes-Benz": "梅赛德斯-奔驰",
  NIO: "蔚来 NIO",
  "Pony.ai (小马智行)": "小马智行（Pony.ai）",
  Tesla: "特斯拉 Tesla",
  Unknown: "未知运营商",
  XPeng: "小鹏 XPeng",
};

const ROAD_TYPE_ZH: Record<string, string> = {
  "elevated highway / bridge": "高架快速路 / 桥梁",
  expressway: "快速路",
  intersection: "交叉口",
  other: "其他道路场景",
  "urban alley": "城市窄巷",
  "urban arterial": "城市主干路",
  "urban arterial / major intersection": "城市主干路 / 大型交叉口",
  "urban bus lanes and intersections": "城市公交车道与交叉口",
  "urban intersection": "城市交叉口",
  "urban network": "城市道路网络",
  "urban residential / school zone": "城市居住区 / 学校区域",
  "urban road": "城市道路",
  "urban roads": "城市道路",
  urban_street: "城市街道",
  various: "多种道路场景",
};

const TRAFFIC_DISRUPTION_ZH: Record<string, string> = {
  critical: "严重瘫痪",
  minimal: "影响很小",
  minor: "轻微影响",
  moderate: "中等影响",
  "moderate (recurring)": "中等影响（反复发生）",
  "moderate to severe per incident": "单次事件中等至严重影响",
  severe: "严重影响",
};

const EMERGENCY_RESPONSE_ZH: Record<string, string> = {
  "activated by passenger": "乘客触发",
  "activated by passengers in both colliding vehicles": "两辆碰撞车辆内的乘客均触发",
  "attempted, often unsuccessful": "已尝试，但多次未成功",
  "attempted, unable to resolve": "已尝试，但未能解决",
  "Baidu support team dispatched": "百度现场支持团队出动",
  "completely overloaded, unreachable": "完全过载，无法接通",
  "connected but unable to intervene in real time": "已接通，但无法实时介入",
  contacted: "已联系",
  "contacted per incident": "每起事件均有联系记录",
  delayed: "响应延迟",
  "emergency services": "应急服务到场",
  "failed / unavailable": "失败 / 不可用",
  "failed to prevent dragging": "未能阻止拖行",
  "fire department": "消防部门到场",
  "first responders forced to intervene directly with vehicles": "一线救援人员被迫直接干预车辆",
  functional: "功能正常",
  "latency too high for emergency contexts": "延迟过高，不适用于应急场景",
  none: "无",
  "none required, vehicle eventually moved": "无需现场处置，车辆最终驶离",
  normal: "正常",
  "non-functional": "失效",
  "non-functional for some vehicles": "部分车辆失效",
  "not applicable": "不适用",
  "not applicable (no passengers)": "不适用（无乘客）",
  "not contacted during emergency": "应急期间未联系",
  "not needed": "未需要",
  "not relevant (no passengers)": "不相关（无乘客）",
  not_applicable: "不适用",
  "not typically activated": "通常未触发",
  "overwhelmed, 2h36m cumulative hold time for emergency services": "系统过载，应急服务累计等待 2 小时 36 分钟",
  "paramedics, school administration, police": "急救人员、学校管理方和警方到场",
  "partially effective": "部分有效",
  "police physically intervened": "警方现场干预",
  "police rescue, vehicle-by-vehicle extraction": "警方救援，逐辆车解救",
  "police, ambulance": "警方和救护车到场",
  "police, ambulance, Baidu on-site team": "警方、救护车和百度现场团队到场",
  "police, ambulance, fire department": "警方、救护车和消防部门到场",
  "police, ambulance, NIO representatives": "警方、救护车和蔚来代表到场",
  "post-incident": "事后介入",
  "pressed by panicked passengers": "受惊乘客按下",
  responsive: "响应正常",
  "responsive (post-incident)": "事后响应正常",
  "responsive but slow to dispatch": "可响应，但派遣较慢",
  "severely degraded due to connectivity loss": "因连接中断严重降级",
  "SFFD, SFPD, Waymo field teams": "旧金山消防、警方和 Waymo 现场团队到场",
  "slow response relative to emergency timelines": "相对应急时限响应偏慢",
  "standard collision response": "标准碰撞处置流程",
  strained: "响应承压",
  "too slow for emergency context": "对应急场景而言过慢",
  "too slow for the acute danger window": "未能覆盖急性危险窗口",
  "unable to clear third vehicle": "未能清除第三辆车",
  "unable to prevent fire": "未能阻止起火",
  unknown: "未知",
  varied: "情况不一",
  "Waymo field team or SFMTA": "Waymo 现场团队或旧金山交通局到场",
  "Waymo field team, SFPD traffic control": "Waymo 现场团队和旧金山警方交通管制到场",
  "Waymo field teams": "Waymo 现场团队到场",
  "Waymo roadside assistance": "Waymo 道路救援到场",
};

function cleanEnglishValue(value: string) {
  return value.replace(/_/g, " ");
}

function fallbackChineseLocation(value: string) {
  return value
    .replace(/, USA$/i, "，美国")
    .replace(/, China$/i, "，中国");
}

function stripCjkParenthetical(value: string) {
  return value.replace(/([\u3400-\u9fff])\s*\([^)]*\)/g, "$1");
}

function localizeControlledValue(
  value: string | undefined,
  zh: boolean,
  dictionary: Record<string, string>,
) {
  if (!value) return undefined;
  if (!zh) return cleanEnglishValue(value);
  return dictionary[value] ?? "待人工中文校核";
}

export function localizeOperator(operator: string, zh: boolean) {
  return zh ? OPERATOR_ZH[operator] ?? operator : operator;
}

export function localizeCity(city: string, zh: boolean) {
  if (!zh) return city;
  return CITY_ZH[city] ?? fallbackChineseLocation(city);
}

export function localizeRoadType(roadType: string | undefined, zh: boolean) {
  return localizeControlledValue(roadType, zh, ROAD_TYPE_ZH);
}

export function localizeLocationSpecific(specific: string | undefined, zh: boolean) {
  if (!specific) return undefined;
  return zh ? stripCjkParenthetical(specific) : specific;
}

export function localizeTrafficDisruption(value: string | undefined, zh: boolean) {
  return localizeControlledValue(value, zh, TRAFFIC_DISRUPTION_ZH);
}

export function localizeEmergencyValue(value: string | undefined, zh: boolean) {
  return localizeControlledValue(value, zh, EMERGENCY_RESPONSE_ZH);
}

export function getIncidentTitle(incident: Incident, zh: boolean) {
  return `${localizeOperator(incident.operator, zh)} — ${localizeCity(incident.location.city, zh)}`;
}

export function getPendingChineseDescription(incident: Incident) {
  if (incident.tier === 2) {
    return "该记录来自加州 DMV OL 316 自动导入条目，尚未完成人工中文摘要。为避免误译，中文页面暂不自动翻译原始英文叙述；可在信息来源中查看原始报告，或切换到 EN 查看英文原文。";
  }

  return "该事件尚未完成人工中文摘要。为避免误译，中文页面暂不自动翻译原始英文叙述；可切换到 EN 查看英文原文。";
}

export function getIncidentDescription(incident: Incident, zh: boolean) {
  if (zh && incident.description_cn?.trim()) return incident.description_cn.trim();
  if (zh) return getPendingChineseDescription(incident);
  return incident.description.trim();
}

export function getLocationParts(location: Location, zh: boolean) {
  return {
    city: zh && location.city_cn ? location.city_cn : localizeCity(location.city, zh),
    roadType:
      zh && location.road_type_cn
        ? location.road_type_cn
        : localizeRoadType(location.road_type, zh),
    specific:
      zh && location.specific_cn
        ? location.specific_cn
        : localizeLocationSpecific(location.specific, zh),
  };
}

export function getImpactDisplay(impact: Impact | undefined, zh: boolean) {
  return {
    trafficDisruption:
      zh && impact?.traffic_disruption_cn
        ? impact.traffic_disruption_cn
        : localizeTrafficDisruption(impact?.traffic_disruption, zh),
  };
}

export function getEmergencyResponseDisplay(
  emergencyResponse: EmergencyResponse | undefined,
  zh: boolean,
) {
  return {
    sosButton:
      zh && emergencyResponse?.sos_button_cn
        ? emergencyResponse.sos_button_cn
        : localizeEmergencyValue(emergencyResponse?.sos_button, zh),
    customerService:
      zh && emergencyResponse?.customer_service_cn
        ? emergencyResponse.customer_service_cn
        : localizeEmergencyValue(emergencyResponse?.customer_service, zh),
    remoteIntervention:
      zh && emergencyResponse?.remote_intervention_cn
        ? emergencyResponse.remote_intervention_cn
        : localizeEmergencyValue(emergencyResponse?.remote_intervention, zh),
    onSiteResponse:
      zh && emergencyResponse?.on_site_response_cn
        ? emergencyResponse.on_site_response_cn
        : localizeEmergencyValue(emergencyResponse?.on_site_response, zh),
    resolutionMethod:
      zh && emergencyResponse?.resolution_method_cn
        ? emergencyResponse.resolution_method_cn
        : zh && emergencyResponse?.resolution_method
          ? "解决方式尚未完成人工中文校核；可切换到 EN 查看英文原文。"
        : emergencyResponse?.resolution_method,
  };
}

export function getSourceTitle(source: Source, zh: boolean) {
  if (zh && source.title_cn) return source.title_cn;
  if (zh) {
    const dmvTitle = source.title.match(/^(.+?) collision report (\d{4}-\d{2}-\d{2}) \(CA DMV OL 316\)$/);
    if (dmvTitle) {
      return `${localizeOperator(dmvTitle[1], true)} 碰撞报告 ${dmvTitle[2]}（加州 DMV OL 316）`;
    }
  }

  return source.title;
}

export function getContributorDisplay(contributor: string, zh: boolean) {
  if (!zh) return contributor;
  if (contributor === "ROAM Core Team") return "ROAM 核心团队";
  if (contributor === "CA DMV OL 316 (auto-imported)") return "加州 DMV OL 316（自动导入）";
  if (contributor.endsWith(" (auto-imported)")) {
    return contributor.replace(" (auto-imported)", "（自动导入）");
  }

  return contributor;
}
