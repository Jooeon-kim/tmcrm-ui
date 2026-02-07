import { useMemo } from "react";
import styles from "./Calendar.module.css";
import { monthLabel, ymd } from "../../utils/datetime.js";

function startOfMonth(d){ return new Date(d.getFullYear(), d.getMonth(), 1); }
function endOfMonth(d){ return new Date(d.getFullYear(), d.getMonth()+1, 0); }

export default function Calendar({ monthDate, items, onPrev, onNext, onPickDay }){
  const weeks = useMemo(() => {
    const start = startOfMonth(monthDate);
    const end = endOfMonth(monthDate);
    const startDay = new Date(start);
    startDay.setDate(start.getDate() - start.getDay());
    const endDay = new Date(end);
    endDay.setDate(end.getDate() + (6 - end.getDay()));
    const days = [];
    for (let d=new Date(startDay); d<=endDay; d.setDate(d.getDate()+1)) days.push(new Date(d));
    const out = [];
    for (let i=0;i<days.length;i+=7) out.push(days.slice(i,i+7));
    return out;
  }, [monthDate]);

  const byDate = useMemo(() => {
    const map = new Map();
    for (const it of items){
      const dt = (it.reservationOrVisitAt || "").slice(0,10);
      if (!dt) continue;
      if (!map.has(dt)) map.set(dt, []);
      map.get(dt).push(it);
    }
    return map;
  }, [items]);

  return (
    <div className={styles.wrap}>
      <div className={styles.top}>
        <button className={styles.nav} onClick={onPrev}>‹</button>
        <div className={styles.title}>{monthLabel(monthDate)}</div>
        <button className={styles.nav} onClick={onNext}>›</button>
      </div>

      <div className={styles.grid}>
        {["일","월","화","수","목","금","토"].map((d)=>(<div key={d} className={styles.dow}>{d}</div>))}

        {weeks.flat().map((d) => {
          const inMonth = d.getMonth() === monthDate.getMonth();
          const key = ymd(d);
          const list = byDate.get(key) || [];
          const count = list.length;

          return (
            <div
              key={key}
              className={`${styles.cell} ${inMonth ? "" : styles.dim} ${count > 0 ? styles.highlight : ""}`}
              onClick={() => onPickDay?.(key)}   // ✅ 날짜 클릭 → Day 모달
            >
              <div className={styles.day}>
                <span>{d.getDate()}</span>
                {count > 0 && <span className={styles.count}>{count}</span>}
              </div>

              {count > 0 ? (
                <button
                  type="button"
                  className={styles.bookBtn}
                  onClick={(e) => {
                    e.stopPropagation();     // ✅ 셀 클릭이랑 중복 방지
                    onPickDay?.(key);        // ✅ “예약 n명” 버튼 클릭도 Day 모달
                  }}
                >
                  예약 {count}명
                </button>
              ) : (
                <div className={styles.empty} />
              )}
            </div>
          );
        })}
      </div>

      <div className={styles.hint}>
        * 달력은 <b>reservationOrVisitAt</b>이 있는 건만 집계됩니다. (예약 n명 보기 클릭 → 시간순 리스트)
      </div>
    </div>
  );
}