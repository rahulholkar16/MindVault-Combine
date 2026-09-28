import { Navigate, Outlet } from "react-router";
import { useAuth } from "../store/auth/useAuth";
import ErrorOverlay from "../components/ErrorCard/ErrorOverlay/ErrorOverlay";

const ProtectedRoute = () => {
    const isAuthenticated = useAuth((s) => s.isAuthenticated);

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    return (
        <div>
            <ErrorOverlay />
            <Outlet />
        </div>
    );
};

export default ProtectedRoute;
