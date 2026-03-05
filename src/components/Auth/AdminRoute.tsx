import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import type { RootState } from "../../store/store";
import type { ReactNode } from "react";

interface Props {
  children: ReactNode;
  allowedRoles?: string[];
}

export default function AdminRoute({
  children,
  allowedRoles = ["admin"],
}: Props) {
  const { user, isLoggedIn } = useSelector(
    (state: RootState) => state.auth
  );

  /* ================= NOT LOGGED IN ================= */
  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  /* ================= NO USER ================= */
  if (!user) {
    return <Navigate to="/dashboard" replace />;
  }

  /* ================= ROLE CHECK ================= */
  const hasAccess = allowedRoles.includes(user.role);

  if (!hasAccess) {
    return <Navigate to="/dashboard" replace />;
  }

  /* ================= ALLOW ================= */
  return <>{children}</>;
}