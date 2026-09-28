import { useEffect, type ReactNode } from "react";
import { useAuth } from "../store/auth/useAuth";
import FullScreenLoader from "../components/FullScreenLoader";

const AuthGate = ({ children }: { children: ReactNode }) => {
    const isBooting = useAuth((s) => s.isBooting);
    const initAuth = useAuth((s) => s.initAuth);

    useEffect(() => {
        initAuth();
    }, [initAuth]);

    if (isBooting) {
        return <FullScreenLoader />;
    }

    return children;
};


export default AuthGate;
