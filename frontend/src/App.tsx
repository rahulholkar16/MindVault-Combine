import { Suspense } from "react";
import AuthGate from "./gate/AuthGate";
import AppRoutes from "./routes/AppRoutes";
import AppLoader from "./components/skeleton/AppLoader";

const App = () => {
    return (
        <AuthGate>
            <Suspense fallback={<AppLoader />}>
                <AppRoutes />
            </Suspense>
        </AuthGate>
    );
};

export default App;