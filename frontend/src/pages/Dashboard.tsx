import { useEffect, useState, lazy, Suspense } from "react";
import { useContent } from "../store/content/useContent";
import SidebarSkeleton from "../components/skeleton/SidebarSkeleton";
import ErrorOverlay from "../components/ErrorCard/ErrorOverlay/ErrorOverlay";
import DashboardNavbar from "../components/DashboardNavbar/DashboardNavbar";
import { Outlet } from "react-router";

const Sidebar = lazy(() => import("../components/Sidebar"));

const Dashboard = () => {
    const fetchAll = useContent((s) => s.fetchAll);
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    useEffect(() => {
        fetchAll();
    }, [fetchAll]);

    useEffect(() => {
        const timer = setTimeout(() => {
            const s = document.createElement("script");
            s.src = "https://platform.twitter.com/widgets.js";
            s.async = true;
            document.body.appendChild(s);
        }, 2000);

        return () => clearTimeout(timer);
    }, []);

    return (
        <div className="flex h-screen bg-gray-900 w-full overflow-hidden">
            <ErrorOverlay />

            <Suspense fallback={<SidebarSkeleton />}>
                <Sidebar
                    isOpen={isSidebarOpen}
                    onToggle={(value: boolean) => setIsSidebarOpen(value)}
                />
            </Suspense>

            {/* MAIN CONTENT AREA */}
            <div
                className={`
                flex-1 text-white 
                px-4 sm:px-6 py-4 sm:py-5 
                overflow-y-auto relative 
                transition-all duration-300
                `}
            >
                <DashboardNavbar />
                <div className="mt-4">
                    <Outlet />
                </div>
            </div>
        </div>
    );
};

export default Dashboard;