import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../store/authSlice.js";
import styles from "./Header.module.css";

export default function Header() {
  const tm = useSelector((s) => s.auth.tm);
  const dispatch = useDispatch();
  return (
    <header className={styles.header}>
      <div className={styles.logoBox}>
        <div className={styles.logoMark} />
        <div className={styles.logoText}>TM 업무</div>
      </div>

      <div className={styles.centerTitle}>샤인유의원 고객관리팀</div>

      <div className={styles.right}>
        <div className={styles.tm}>{tm}</div>
        <button className={styles.btn} onClick={() => dispatch(logout())}>로그아웃</button>
      </div>
    </header>
  );
}
