import { Brain, Menu, X, LogOut } from "lucide-react";
import type { SidebarProp } from "../types";
import { sidebar } from "../data";
import { useAuth } from "../store/auth/useAuth";
import { useContent } from "../store/content/useContent";
import { useNavigate } from "react-router";

const Sidebar: React.FC<SidebarProp> = ({ isOpen, onToggle }) => {
    const logout = useAuth((s) => s.logout);
    const navigate = useNavigate();
    const fetchAll = useContent((s) => s.fetchAll);
    const fetchByType = useContent((s) => s.fetchByType);

    const dataFetch = async (type: string) => {
        // Close sidebar ONLY on mobile
        if (window.innerWidth < 1024) {
            onToggle(false);
        }

        if (type === "profile") {
            navigate("profile");
            return;
        }
        if (type === "tag" || type === "all") {
            await fetchAll();
            navigate("/dashboard");
            return;
        }
        await fetchByType(type);
        navigate(`/dashboard/${type}`);
    };

    return (
        <>
            {/* MOBILE TOGGLE BUTTON */}
            <button
                onClick={() => onToggle(!isOpen)}
                className="fixed top-4 left-4 z-50 p-2 bg-slate-800 rounded-lg shadow-lg hover:bg-slate-700 transition-colors lg:hidden text-slate-400"
            >
                {isOpen ? <X size={20} /> : <Menu size={20} />}
            </button>

            {/* SIDEBAR CONTAINER */}
            <div
                className={`
                fixed lg:relative inset-y-0 left-0 z-40 
                bg-slate-800 border-r border-slate-700 
                flex flex-col py-6 
                transition-all duration-300

                ${
                    isOpen
                        ? "w-[70%] sm:w-64 translate-x-0"
                        : "-translate-x-full lg:translate-x-0 lg:w-16"
                }
                `}
            >
                <div className="flex flex-col gap-2 flex-1 w-full px-4">
                    <div className="p-3 w-12 bg-linear-to-br from-blue-500 to-purple-600 rounded-xl shadow-lg">
                        <Brain size={24} className="text-white" />
                    </div>

                    {sidebar.map((item) => (
                        <button
                            key={item.type}
                            onClick={() => dataFetch(item.type)}
                            className={`
                                p-3 mt-2 transition-all hover:bg-slate-700 
                                rounded-lg text-white flex items-center gap-3
                                ${!isOpen && "lg:justify-center"}
                            `}
                            title={item.title}
                        >
                            {item.icon}
                            {isOpen && <span>{item.title}</span>}
                        </button>
                    ))}
                </div>

                <button
                    onClick={logout}
                    className="mx-4 p-3 text-slate-400 hover:text-red-400 hover:bg-slate-700 rounded-xl transition-all hover:scale-105 active:scale-95"
                    title="Sign Out"
                >
                    <LogOut size={20} />
                </button>
            </div>
        </>
    );
};

export default Sidebar;