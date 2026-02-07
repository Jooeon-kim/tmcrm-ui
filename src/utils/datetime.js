function pad(n){ return String(n).padStart(2,"0"); }

/**
 * ✅ KST 기준 현재 시각 문자열
 */
export function toKstNowYmdHm(){
  const now = new Date();
  const kstMs = now.getTime() + (9*60 + now.getTimezoneOffset())*60*1000;
  const d = new Date(kstMs);
  return `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

/**
 * ✅ 문자열 → Date (정렬/비교용)
 * - "YYYY-MM-DD HH:MM" → 그대로 KST
 * - ISO → UTC → KST 보정
 */
export function parseToKstDate(value){
  if (!value) return null;
  const s = String(value).trim();

  // 이미 KST 문자열
  if (/^\d{4}-\d{2}-\d{2}\s\d{2}:\d{2}$/.test(s)) {
    const [ymd, hm] = s.split(" ");
    const [y,m,d] = ymd.split("-").map(Number);
    const [hh,mm] = hm.split(":").map(Number);
    return new Date(y, m-1, d, hh, mm);
  }

  // ISO
  const d = new Date(s);
  if (isNaN(d.getTime())) return null;
  return new Date(d.getTime() + 9*60*60*1000);
}

/**
 * ✅ 화면 표시용 (절대 시간 변경 없음)
 */
export function displayKstYmdHm(value){
  if (!value) return "";
  const s = String(value).trim();

  // 이미 문자열이면 그대로
  if (/^\d{4}-\d{2}-\d{2}\s\d{2}:\d{2}$/.test(s)) return s;

  // ISO 형식 "2026-02-11T02:00:00.000Z" → KST "2026-02-11 11:00"
  const isoMatch = s.match(/(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})/);
  if (isoMatch) {
    const year = isoMatch[1];
    const month = isoMatch[2];
    const date = isoMatch[3];
    const utcH = parseInt(isoMatch[4], 10);
    const min = isoMatch[5];
    // UTC + 9시간 = KST
    const kstH = (utcH + 9) % 24;
    return `${year}-${month}-${date} ${pad(kstH)}:${min}`;
  }

  return "";
}

/**
 * ✅ HH:MM 만 필요할 때
 */
export function displayKstHm(value){
  if (!value) return "--:--";
  const s = String(value).trim();

  // 이미 "YYYY-MM-DD HH:MM" 형식이면 HH:MM만 추출
  if (/^\d{4}-\d{2}-\d{2}\s\d{2}:\d{2}$/.test(s)) {
    return s.split(" ")[1] || "--:--";
  }

  // ISO 형식 "2026-02-11T02:00:00.000Z" → UTC 시간을 추출
  const isoMatch = s.match(/T(\d{2}):(\d{2})/);
  if (isoMatch) {
    const utcH = parseInt(isoMatch[1], 10);
    const utcM = parseInt(isoMatch[2], 10);
    // UTC + 9시간 = KST
    const kstH = (utcH + 9) % 24;
    return `${pad(kstH)}:${pad(utcM)}`;
  }

  return "--:--";
}

export function ymd(d){
  return `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}`;
}

export function monthLabel(d){
  return `${d.getFullYear()}년 ${d.getMonth()+1}월`;
}