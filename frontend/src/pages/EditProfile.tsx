import { useAuth } from "../store/auth/useAuth";
import NoProfile from "../images/noProfile.png";
import { EditProfileTab } from "../data";
import { useState } from "react";
import { Link, Outlet, useNavigate } from "react-router";
import { ArrowLeft, LayoutDashboard } from "lucide-react";
import Button from "../components/Button";

const EditProfile = () => {
    const avatar = useAuth((s) => s.user?.avatar);
    const name = useAuth((s) => s.user?.name);
    const [activeTab, setActiveTab] = useState("Profile");
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-gray-900 flex flex-col">
            {/* TOP BAR */}
            <div className="max-w-6xl mx-auto w-full px-4 py-4 flex items-center justify-between">
                <Button
                    text="Back"
                    size="small"
                    color="secondary"
                    onClick={() => navigate(-1)}
                    disabled={false}
                >
                    <ArrowLeft size={18} />
                </Button>

                <Button
                    text="Dashboard"
                    size="small"
                    color="primary"
                    onClick={() => navigate("/dashboard")}
                    disabled={false}
                >
                    <LayoutDashboard size={18} />
                </Button>
            </div>

            {/* MAIN CARD */}
            <div className="flex-1 max-w-6xl mx-auto w-full px-4 pb-6">
                <div className="border border-slate-700/50 rounded-2xl bg-slate-800/20 backdrop-blur overflow-hidden">
                    {/* MOBILE PROFILE HEADER */}
                    <div className="md:hidden flex flex-col items-center gap-3 p-4 border-b border-slate-700/50">
                        <div className="rounded-full h-24 w-24 border-2 bg-slate-700 border-slate-600 p-1">
                            <img
                                src={avatar || NoProfile}
                                className="rounded-full h-full w-full object-cover"
                                alt="Profile"
                            />
                        </div>
                        <p className="text-xl font-semibold text-white">
                            {name}
                        </p>
                    </div>

                    {/* MOBILE TABS (HORIZONTAL SCROLL) */}
                    <div className="md:hidden flex gap-2 p-3 overflow-x-auto border-b border-slate-700/50">
                        {EditProfileTab.map((tab) => (
                            <button
                                key={tab.title}
                                onClick={() => setActiveTab(tab.title)}
                                className={`px-4 py-2 rounded-lg text-sm whitespace-nowrap ${
                                    activeTab === tab.title
                                        ? "bg-blue-500 text-white"
                                        : "bg-slate-700/50 text-slate-300"
                                }`}
                            >
                                <Link to={tab.onClick}>{tab.title}</Link>
                            </button>
                        ))}
                    </div>

                    {/* DESKTOP LAYOUT */}
                    <div className="hidden md:flex min-h-[70vh]">
                        {/* LEFT VERTICAL TABS */}
                        <div className="w-1/4 border-r border-slate-700/50 p-4 flex flex-col gap-4">
                            <div className="flex flex-col items-center mb-4">
                                <div className="rounded-full h-20 w-20 border-2 bg-slate-700 border-slate-600 p-1">
                                    <img
                                        src={avatar || NoProfile}
                                        className="rounded-full h-full w-full object-cover"
                                        alt="Profile"
                                    />
                                </div>
                                <p className="text-lg font-semibold text-white mt-2">
                                    {name}
                                </p>
                            </div>

                            <div className="flex-1 flex flex-col gap-3">
                                {EditProfileTab.map((tab) => (
                                    <Link
                                        key={tab.title}
                                        to={tab.onClick}
                                        onClick={() => setActiveTab(tab.title)}
                                        className={`
                                            flex-1 flex items-end p-4 rounded-xl transition-all
                                            ${
                                                activeTab === tab.title
                                                    ? "bg-blue-500 text-white"
                                                    : "bg-slate-700/60 text-slate-300 hover:bg-slate-700"
                                            }
                                        `}
                                    >
                                        <span className="text-sm font-medium">
                                            {tab.title}
                                        </span>
                                    </Link>
                                ))}
                            </div>
                        </div>

                        {/* RIGHT CONTENT */}
                        <div className="flex-1 p-6 overflow-y-auto">
                            <Outlet />
                        </div>
                    </div>

                    {/* MOBILE CONTENT */}
                    <div className="md:hidden p-4">
                        <Outlet />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EditProfile;
