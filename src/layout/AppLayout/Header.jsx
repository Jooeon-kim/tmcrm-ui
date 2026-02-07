import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../store/authSlice.js";
import styles from "./Header.module.css";

export default function Header() {
  const tm = useSelector((s) => s.auth.tm);
  const dispatch = useDispatch();
  return (
    <header className={styles.header}>


      <div className={styles.right}>
        <div className={styles.tm}>{tm}</div>
        <button className={styles.btn} onClick={() => dispatch(logout())}>로그아웃</button>
      </div>
    </header>
  );
}
