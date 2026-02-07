import { useEffect, useMemo, useState } from "react";
import styles from "./DateTimePickerModal.module.css";
import { buildHalfHourSlots } from "../../utils/availableTime.js";
import { monthLabel, ymd } from "../../utils/datetime.js";

function startOfMonth(d){ return new Date(d.getFullYear(), d.getMonth(), 1); }
function endOfMonth(d){ return new Date(d.getFullYear(), d.getMonth()+1, 0); }

export default function DateTimePickerModal({ open, initialYmd, initialTime, onClose, onConfirm }) {
  const [monthDate, setMonthDate] = useState(() => new Date());
  const [pickedYmd, setPickedYmd] = useState("");
  const [pickedTime, setPickedTime] = useState("09:00");

  // ✅ open될 때 초기값 반영은 effect로
  useEffect(() => {
    if (!open) return;

    if (initialYmd) {
      const [yy, mm] = String(initialYmd).split("-").map(Number);
      if (yy && mm) setMonthDate(new Date(yy, mm - 1, 1));
      setPickedYmd(initialYmd);
    } else {
      setPickedYmd("");
      setMonthDate(new Date()); // 필요 없으면 지워도 됨
    }

    if (initialTime) setPickedTime(initialTime);
    else setPickedTime("09:00");
  }, [open, initialYmd, initialTime]);

  const slots = useMemo(() => buildHalfHourSlots(), []);

  const weeks = useMemo(() => {
    const start = startOfMonth(monthDate);
    const end = endOfMonth(monthDate);
    const startDay = new Date(start);
    startDay.setDate(start.getDate() - start.getDay());
    const endDay = new Date(end);
    endDay.setDate(end.getDate() + (6 - end.getDay()));
    const days = [];
    for (let d = new Date(startDay); d <= endDay; d.setDate(d.getDate()+1)) days.push(new Date(d));
    const out = [];
    for (let i=0;i<days.length;i+=7) out.push(days.slice(i,i+7));
    return out;
  }, [monthDate]);

  if (!open) return null;

  return (
    <div className={styles.backdrop} onMouseDown={onClose}>
      <div className={styles.modal} onMouseDown={(e)=>e.stopPropagation()}>
        <div className={styles.top}>
          <div className={styles.title}>예약일시 선택</div>
          <button className={styles.x} onClick={onClose}>×</button>
        </div>

        <div className={styles.calTop}>
          <button className={styles.nav} onClick={()=>setMonthDate(d=>new Date(d.getFullYear(), d.getMonth()-1, 1))}>‹</button>
          <div className={styles.month}>{monthLabel(monthDate)}</div>
          <button className={styles.nav} onClick={()=>setMonthDate(d=>new Date(d.getFullYear(), d.getMonth()+1, 1))}>›</button>
        </div>

        <div className={styles.grid}>
          {["일","월","화","수","목","금","토"].map((d)=>(<div key={d} className={styles.dow}>{d}</div>))}
          {weeks.flat().map((d) => {
            const inMonth = d.getMonth() === monthDate.getMonth();
            const key = ymd(d);
            const selected = key === pickedYmd;
            return (
              <button
                key={key}
                type="button"
                className={`${styles.cell} ${inMonth ? "" : styles.dim} ${selected ? styles.selected : ""}`}
                onClick={()=>setPickedYmd(key)}
              >
                {d.getDate()}
              </button>
            );
          })}
        </div>

        <div className={styles.bottom}>
          <div className={styles.pickRow}>
            <div className={styles.pickLabel}>선택 날짜</div>
            <div className={styles.pickValue}>{pickedYmd || "-"}</div>
          </div>

          <div className={styles.pickRow}>
            <div className={styles.pickLabel}>시간(30분 단위)</div>
            <select className={styles.select} value={pickedTime} onChange={(e)=>setPickedTime(e.target.value)}>
              {slots.map((t)=>(<option key={t} value={t}>{t}</option>))}
            </select>
          </div>

          <div className={styles.actions}>
            <button className={styles.cancel} onClick={onClose}>취소</button>
            <button
              className={styles.ok}
              onClick={() => onConfirm(pickedYmd, pickedTime)} // ✅ 문자열 그대로
              disabled={!pickedYmd}
            >
              확인
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}