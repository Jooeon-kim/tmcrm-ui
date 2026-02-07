import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchLeads, saveLead } from "../../store/leadsSlice.js";
import Calendar from "../../components/Calendar/Calendar.jsx";
import LeadModal from "../../components/LeadModal/LeadModal.jsx";
import DayLeadsModal from "../../components/DayLeadsModal/DayLeadsModal.jsx";
import styles from "./CalendarPage.module.css";

export default function CalendarPage() {
  const tm = useSelector((s) => s.auth.tm);
  const { items, loading, error } = useSelector((s) => s.leads);
  const dispatch = useDispatch();

  const [monthDate, setMonthDate] = useState(() => new Date());

  /** 날짜별 예약 리스트 모달 */
  const [dayModalOpen, setDayModalOpen] = useState(false);
  const [selectedYmd, setSelectedYmd] = useState("");

  /** CRUD 모달 */
  const [crudOpen, setCrudOpen] = useState(false);
  const [selectedLeadKey, setSelectedLeadKey] = useState(null);

  /** ✅ Calendar.jsx와 100% 동일한 기준으로 날짜별 묶음 */
  const byDate = useMemo(() => {
    const map = new Map();
    for (const it of items || []) {
      const dt = (it.reservationOrVisitAt || "").slice(0, 10); // YYYY-MM-DD
      if (!dt) continue;
      if (!map.has(dt)) map.set(dt, []);
      map.get(dt).push(it);
    }
    return map;
  }, [items]);

  /** 선택된 날짜의 예약자들 */
  const dayItems = useMemo(() => {
    if (!selectedYmd) return [];
    return byDate.get(selectedYmd) || [];
  }, [byDate, selectedYmd]);

  /** CRUD용: 항상 최신 Redux 데이터에서 다시 찾기 */
  const selectedLead = useMemo(() => {
    if (!selectedLeadKey) return null;
    const [leadId, eventType] = selectedLeadKey.split("||");
    return (
      (items || []).find(
        (x) => x.leadId === leadId && x.eventType === eventType
      ) || null
    );
  }, [items, selectedLeadKey]);

  useEffect(() => {
    dispatch(fetchLeads(tm));
  }, [tm, dispatch]);

  const onPrev = () =>
    setMonthDate((d) => new Date(d.getFullYear(), d.getMonth() - 1, 1));
  const onNext = () =>
    setMonthDate((d) => new Date(d.getFullYear(), d.getMonth() + 1, 1));

  /** 날짜 클릭 → DayLeadsModal */
  const onPickDay = (ymd) => {
    setSelectedYmd(ymd);
    setDayModalOpen(true);
  };

  /** DayLeadsModal에서 카드 클릭 → CRUD */
  const onPickLeadFromDay = (it) => {
    setDayModalOpen(false);
    setSelectedLeadKey(`${it.leadId}||${it.eventType}`);
    setCrudOpen(true);
  };

  const onSave = async (payload) => {
    await dispatch(saveLead(payload));
    await dispatch(fetchLeads(tm));
    setCrudOpen(false);
  };

  return (
    <div className={styles.page}>
      <div className={styles.head}>
        <div>
          <div className={styles.h1}>예약현황(달력페이지)</div>
          <div className={styles.sub}>
            날짜 클릭 → 그날 예약자 전체 · 카드 클릭 → 상담 기록
          </div>
        </div>
        <button
          className={styles.refresh}
          onClick={() => dispatch(fetchLeads(tm))}
        >
          새로고침
        </button>
      </div>

      {error && <div className={styles.error}>{error}</div>}
      {loading && <div className={styles.loading}>불러오는 중...</div>}

      <Calendar
        monthDate={monthDate}
        items={items}
        onPrev={onPrev}
        onNext={onNext}
        onPickDay={onPickDay}   // ✅ 날짜 클릭만 사용
      />

      {/* 날짜별 예약 리스트 */}
      <DayLeadsModal
        open={dayModalOpen}
        ymd={selectedYmd}
        items={dayItems}
        onClose={() => setDayModalOpen(false)}
        onPick={onPickLeadFromDay}
      />

      {/* CRUD 모달 */}
      <LeadModal
        open={crudOpen}
        item={selectedLead}
        onClose={() => setCrudOpen(false)}
        onSave={onSave}
      />
    </div>
  );
}
