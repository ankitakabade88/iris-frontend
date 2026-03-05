import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import type { RootState } from "../../store/store";
import type { ReactNode } from "react";

interface Props {
children?: ReactNode;
}

export default function ProtectedRoute({
children,
}: Props) {

const location = useLocation();

const { isLoggedIn, user } = useSelector(
(state: RootState) => state.auth
);

/* ================= NOT LOGGED IN ================= */
if (!isLoggedIn) {
return <Navigate to="/login" replace />;
}

/* ================= USER NOT READY ================= */
if (!user) {
return <div style={{ padding: 40 }}>Loading...</div>;
}

/* ================= FORCE PASSWORD CHANGE ================= */
if (
user.mustChangePassword &&
location.pathname !== "/change-password"
) {
return <Navigate to="/change-password" replace />;
}

/* ================= ALLOW ================= */
return children ? <>{children}</> : <Outlet />;
}
