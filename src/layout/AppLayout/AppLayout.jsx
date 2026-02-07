import { Outlet, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import Header from "./Header.jsx";
import Sidebar from "./Sidebar.jsx";
import styles from "./AppLayout.module.css";

export default function AppLayout() {
  const tm = useSelector((s) => s.auth.tm);
  if (!tm) return <Navigate to="/login" replace />;
  return (
    <div className={styles.wrap}>
      <Header />
      <div className={styles.body}>
        <Sidebar />
        <main className={styles.main}>
          <Outlet />
        </main>
      </div>
    </div>
  );
}
