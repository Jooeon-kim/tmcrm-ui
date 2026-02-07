import { useEffect, useState } from "react";
import styles from "./LeadModal.module.css";
import DateTimePickerModal from "../DateTimePickerModal/DateTimePickerModal.jsx";
import { displayKstYmdHm } from "../../utils/datetime.js";

const STATUS_OPTIONS = ["부재중","리콜대기","예약완료","무효"];

function splitReservation(value){
  if (!value) return { y:"", t:"09:00" };
  const [y, t] = value.split(" ");
  return { y: y || "", t: t || "09:00" };
}

export default function LeadModal({ open, item, onClose, onSave }){
  const [status, setStatus] = useState(item?.status || "");
  const [memo, setMemo] = useState(item?.memo || "");
  const [reservationOrVisitAt, setReservationOrVisitAt] = useState(item?.reservationOrVisitAt || "");
  const [pickerOpen, setPickerOpen] = useState(false);

 useEffect(() => {
  if (!item) return;
  setStatus(item.status || "");
  setMemo(item.memo || "");
  setReservationOrVisitAt(item.reservationOrVisitAt || "");
}, [item?.leadId, item?.eventType]);

  if (!open || !item) return null;

  const save = () => onSave({ leadId: item.leadId, eventType: item.eventType, status, memo, reservationOrVisitAt });

  const { y: initialYmd, t: initialTime } = splitReservation(reservationOrVisitAt);

  return (
    <div className={styles.backdrop} onMouseDown={onClose}>
      <div className={styles.modal} onMouseDown={(e)=>e.stopPropagation()}>
        <div className={styles.top}>
          <div>
            <div className={styles.name}>{item.name}</div>
            <div className={styles.phone}>{item.phone}</div>
          </div>
          <button className={styles.x} onClick={onClose}>×</button>
        </div>

        <div className={styles.meta}>
          <div className={styles.metaItem}><span>이벤트</span><b>{item.eventType}</b></div>
          <div className={styles.metaItem}><span>상담가능</span><b>{item.availableTime || "-"}</b></div>
          <div className={styles.metaItem}><span>인입</span><b>{item.createdAt || "-"}</b></div>
        </div>

        <div className={styles.form}>
          <div className={styles.field}>
            <label>상태</label>
            <select value={status} onChange={(e)=>setStatus(e.target.value)}>
              <option value="">선택</option>
              {STATUS_OPTIONS.map((s)=>(<option key={s} value={s}>{s}</option>))}
            </select>
          </div>

          <div className={styles.field}>
            <label>예약일시</label>
            <div className={styles.inline}>
              <input
  value={displayKstYmdHm(reservationOrVisitAt)}
  readOnly
  placeholder="달력에서 선택"
/>
              <button type="button" className={styles.pickBtn} onClick={()=>setPickerOpen(true)}>
                달력
              </button>
              {reservationOrVisitAt ? (
                <button type="button" className={styles.clearBtn} onClick={()=>setReservationOrVisitAt("")}>
                  지우기
                </button>
              ) : null}
            </div>
          </div>

          <div className={styles.field}>
            <label>메모</label>
            <textarea value={memo} onChange={(e)=>setMemo(e.target.value)} rows={6} placeholder="고객 말투/분위기/키워드 등" />
          </div>
        </div>

        <div className={styles.actions}>
          <button className={styles.cancel} onClick={onClose}>닫기</button>
          <button className={styles.save} onClick={save}>저장</button>
        </div>

        <div className={styles.note}>* 저장 시 콜 시간(callDateTime)은 자동으로 현재시각으로 기록됩니다.</div>
      </div>

      <DateTimePickerModal
        open={pickerOpen}
        initialYmd={initialYmd}
        initialTime={initialTime}
        onClose={()=>setPickerOpen(false)}
        onConfirm={(ymd, time) => {
          if (!ymd) return;
          setReservationOrVisitAt(`${ymd} ${time}`);
          setPickerOpen(false);
        }}
      />
    </div>
  );
}
