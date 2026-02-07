import { Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./pages/LoginPage/LoginPage.jsx";
import AppLayout from "./layout/AppLayout/AppLayout.jsx";
import CalendarPage from "./pages/CalendarPage/CalendarPage.jsx";
import ListPage from "./pages/ListPage/ListPage.jsx";

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/app" element={<AppLayout />}>
        <Route index element={<Navigate to="/app/calendar" replace />} />
        <Route path="calendar" element={<CalendarPage />} />
        <Route path="all" element={<ListPage mode="all" />} />
        <Route path="pending" element={<ListPage mode="pending" />} />
        <Route path="missed" element={<ListPage mode="missed" />} />
        <Route path="recall" element={<ListPage mode="recall" />} />
        <Route path="reserved" element={<ListPage mode="reserved" />} />
        <Route path="invalid" element={<ListPage mode="invalid" />} />
      </Route>
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}
