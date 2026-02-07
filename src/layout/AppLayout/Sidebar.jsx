import { NavLink } from "react-router-dom";
import styles from "./Sidebar.module.css";

const links = [
  { to: "/app/calendar", label: "예약현황(달력페이지)" },
  { to: "/app/all", label: "전체" },
  { to: "/app/pending", label: "대기중" },
  { to: "/app/missed", label: "부재중" },
  { to: "/app/recall", label: "리콜대기" },
  { to: "/app/reserved", label: "예약완료" },
  { to: "/app/invalid", label: "무효" },
];

export default function Sidebar() {
  return (
    <aside className={styles.aside}>
      <div className={styles.title}>DB 표시기준</div>
      <nav className={styles.nav}>
        {links.map((l) => (
          <NavLink key={l.to} to={l.to}
            className={({ isActive }) => (isActive ? `${styles.link} ${styles.active}` : styles.link)}>
            {l.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
