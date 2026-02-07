import styles from "./LeadCard.module.css";
import { statusTone } from "../../utils/status.js";
import { isNowWithinAvailableTime } from "../../utils/availableTime.js";

export default function LeadCard({ item, onClick }){
  const tone = statusTone(item.status);
  const canNow = isNowWithinAvailableTime(item.availableTime);
  return (
    <button className={`${styles.card} ${styles[tone]}`} onClick={onClick} type="button">
      <div className={styles.row}>
        <div className={styles.leftFlag}>
          {canNow ? <span className={styles.available}>상담가능</span> : null}
        </div>
        <div className={styles.badge}>{item.eventType}</div>
        <div className={styles.name}>{item.name}</div>
        <div className={styles.phone}>{item.phone}</div>
        <div className={styles.state}>상태: <b>{item.status || "-"}</b></div>
        {item.memo && <div className={styles.memo}>메모: {item.memo}</div>}
        <div className={styles.updated}>최종업데이트: {item.updatedAt ? new Date(item.updatedAt).toLocaleString() : "-"}</div>
      </div>
    </button>
  );
}
