import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchLeads, saveLead } from "../../store/leadsSlice.js";
import LeadCard from "../../components/LeadCard/LeadCard.jsx";
import LeadModal from "../../components/LeadModal/LeadModal.jsx";
import { statusMatch } from "../../utils/status.js";
import styles from "./ListPage.module.css";

const titles = { all:"전체", missed:"부재중", recall:"리콜대기", reserved:"예약완료", invalid:"무효" };

export default function ListPage({ mode }){
  const tm = useSelector((s)=>s.auth.tm);
  const { items, loading, error } = useSelector((s)=>s.leads);
  const dispatch = useDispatch();

  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(()=>{ dispatch(fetchLeads(tm)); }, [tm, dispatch]);

  const filtered = useMemo(()=> {
    let result = items.filter((it)=>statusMatch(mode, it.status));
    if(searchQuery.trim()){
      const query = searchQuery.toLowerCase();
      result = result.filter((it)=> 
        (it.name && it.name.toLowerCase().includes(query)) ||
        (it.phone && it.phone.includes(query))
      );
    }
    return result;
  }, [items, mode, searchQuery]);

  const onSave = async (payload)=>{
    await dispatch(saveLead(payload));
    await dispatch(fetchLeads(tm));
    setOpen(false);
  };

  return (
    <div className={styles.page}>
      <div className={styles.head}>
        <div>
          <div className={styles.h1}>{titles[mode] || "목록"}</div>
          <div className={styles.sub}>가로 긴 박스 · 상태 색상(부재중/리콜대기/예약완료/무효)</div>
        </div>
        <button className={styles.refresh} onClick={()=>dispatch(fetchLeads(tm))}>새로고침</button>
      </div>

      <div className={styles.searchBox}>
        <input
          type="text"
          placeholder="이름 또는 전화번호로 검색"
          value={searchQuery}
          onChange={(e)=>setSearchQuery(e.target.value)}
          className={styles.searchInput}
        />
        {searchQuery && <button className={styles.searchClear} onClick={()=>setSearchQuery("")}>✕</button>}
      </div>

      {error ? <div className={styles.error}>{error}</div> : null}
      {loading ? <div className={styles.loading}>불러오는 중...</div> : null}

      <div className={styles.list}>
        {filtered.map((it)=>(
          <LeadCard key={`${it.leadId}||${it.eventType}`} item={it} onClick={()=>{setSelected(it); setOpen(true);}} />
        ))}
        {!loading && filtered.length===0 ? <div className={styles.empty}>표시할 DB가 없습니다.</div> : null}
      </div>

      <LeadModal open={open} item={selected} onClose={()=>setOpen(false)} onSave={onSave} />
    </div>
  );
}
