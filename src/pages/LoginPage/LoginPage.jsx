import { useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { login } from "../../store/authSlice.js";
import { useNavigate } from "react-router-dom";
import styles from "./LoginPage.module.css";

export default function LoginPage(){
  const allowed = useSelector((s)=>s.auth.allowed);
  const [tm, setTm] = useState("이선주");
  const dispatch = useDispatch();
  const nav = useNavigate();
  const options = useMemo(()=>allowed,[allowed]);

  const onSubmit = (e)=>{
    e.preventDefault();
    dispatch(login(tm));
    nav("/app/calendar");
  };

  return (
    <div className={styles.wrap}>
      <div className={styles.card}>
        <div className={styles.brand}>
          <div className={styles.mark} />
          <div>
            <div className={styles.title}>TM 업무 페이지</div>
            <div className={styles.sub}>드롭박스 선택 로그인(단순화)</div>
          </div>
        </div>

        <form onSubmit={onSubmit} className={styles.form}>
          <label className={styles.label}>TM 선택</label>
          <select className={styles.select} value={tm} onChange={(e)=>setTm(e.target.value)}>
            {options.map((n)=>(<option key={n} value={n}>{n}</option>))}
          </select>
          <button className={styles.btn} type="submit">로그인</button>
        </form>
      </div>
    </div>
  );
}
