import { displayKstHm, displayKstYmdHm, parseToKstDate } from "../../utils/datetime";
import styles from "./DayLeadsModal.module.css";

export default function DayLeadsModal({ open, ymd, items, onClose, onPick }) {
  if (!open) return null;
const sorted = [...(items || [])].sort((a, b) => {
  const da = parseToKstDate(a.reservationOrVisitAt);
  const db = parseToKstDate(b.reservationOrVisitAt);

  if (!da && !db) return 0;
  if (!da) return 1;
  if (!db) return -1;

  return da.getTime() - db.getTime(); // 빠른 시간 → 위
});

  return (
    <div className={styles.backdrop} onMouseDown={onClose}>
      <div className={styles.modal} onMouseDown={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <div className={styles.title}>{ymd} 예약자</div>
          <button className={styles.x} onClick={onClose}>×</button>
        </div>

        {sorted.length === 0 ? (
          <div className={styles.empty}>이 날짜에 예약된 고객이 없습니다.</div>
        ) : (
          <div className={styles.list}>
            {sorted.map((it) => {
              return (
                <button
                  key={`${it.leadId}||${it.eventType}`}
                  className={styles.card}
                  onClick={() => onPick(it)}
                >
                  <div className={styles.left}>
<div className={styles.time}>
  {displayKstHm(it.reservationOrVisitAt)}
</div>                    <div className={styles.name}>{it.name}</div>
                    <div className={styles.phone}>{it.phone}</div>
                  </div>

                  <div className={styles.right}>
                    <div className={styles.event}>{it.eventType}</div>
                    <div className={styles.status}>{it.status || "미기입"}</div>
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}