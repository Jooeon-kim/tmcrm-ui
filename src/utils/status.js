export function normalizeStatus(s){ return (s||"").trim(); }

export function statusTone(status){
  const s = normalizeStatus(status);
  if (s === "부재중") return "red";
  if (s === "리콜대기") return "yellow";
  if (s === "예약완료" || s === "예약") return "green";
  if (s === "무효") return "gray";
  return "neutral";
}

export function statusMatch(mode, status){
  const s = normalizeStatus(status);
  if (mode === "all") return true;
  if (mode === "pending") return s === "";
  if (mode === "missed") return s === "부재중";
  if (mode === "recall") return s === "리콜대기";
  if (mode === "reserved") return s === "예약완료" || s === "예약";
  if (mode === "invalid") return s === "무효";
  return true;
}
