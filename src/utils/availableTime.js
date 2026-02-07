function pad(n){
  return String(n).padStart(2, "0");
}
export function buildHalfHourSlots(){
  const slots = [];
  for (let h = 0; h < 24; h++){
    for (const m of [0, 30]) {
      slots.push(`${pad(h)}:${pad(m)}`);
    }
  }
  return slots;
}
/**
 * "오전_10시", "오후_3시" → hour (0~23)
 */
function parseMeridiemHour(token){
  if (!token) return null;
  const clean = token.replaceAll("_", "");
  const m = clean.match(/(오전|오후)(\d{1,2})시/);
  if (!m) return null;

  const mer = m[1];
  let h = Number(m[2]);
  if (Number.isNaN(h)) return null;

  if (mer === "오전") {
    if (h === 12) h = 0;
  } else {
    if (h !== 12) h += 12;
  }
  return h;
}

/**
 * "오후_3시_~_오후_5시"
 * → { startMin, endMin }
 */
export function parseAvailableRange(availableTime){
  if (!availableTime) return null;

  const parts = String(availableTime).split("~");
  if (parts.length !== 2) return null;

  const startH = parseMeridiemHour(parts[0]);
  const endH = parseMeridiemHour(parts[1]);
  if (startH === null || endH === null) return null;

  return {
    startMin: startH * 60,
    endMin: endH * 60,
  };
}

/**
 * 지금 시간이 상담 가능 시간에 포함되는지
 * ⚠️ Date 보정 절대 없음
 */
export function isNowWithinAvailableTime(availableTime, now = new Date()){
  const r = parseAvailableRange(availableTime);
  if (!r) return false;

  const nowMin = now.getHours() * 60 + now.getMinutes();

  // 자정 넘어가는 경우 (예: 오후 10시 ~ 오전 1시)
  if (r.endMin < r.startMin) {
    return nowMin >= r.startMin || nowMin < r.endMin;
  }
  return nowMin >= r.startMin && nowMin < r.endMin;
}

/**
 * 30분 단위 슬롯
 */
