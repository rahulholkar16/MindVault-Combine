import { profileBar } from "../data";
import Button from "./Button";
import { useContent } from "../store/content/useContent";
import { useAuth } from "../store/auth/useAuth";
import NoProfile from "../images/noProfile.png";
import ContentOverlay from "./ContentOverlay/ContentOverlay";
import { useCallback, useEffect } from "react";
import { useNavigate } from "react-router";

const Profile = () => {
    const active = useContent((s) => s.activeProfileTab);
    const setActive = useContent((s) => s.setActiveProfileTab);
    const fetchAll = useContent((s) => s.fetchMyContent);
    const fetchByType = useContent((s) => s.fetchMySpecificContent);
    const myContent = useContent((s) => s.myContent);
    const avatar = useAuth((s) => s.user?.avatar);
    const name = useAuth((s) => s.user?.name);
    const totalPost = useAuth((s) => s.user?.content);
    const follower = useAuth((s) => s.user?.follower);
    const following = useAuth((s) => s.user?.following);

    const navigate = useNavigate();

    const onHandel = useCallback(
        async (type: string) => {
            setActive(type);
            if (type === "All") await fetchAll();
            else await fetchByType(type);
        },
        [fetchAll, fetchByType, setActive],
    );

    useEffect(() => {
        setActive("All");
        fetchAll();
    }, [fetchAll, setActive]);

    return (
        <div className="flex-1 overflow-y-auto">
            <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
                {/* PROFILE HEADER */}
                <div className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-2xl p-6 mb-6">
                    <div className="flex flex-col md:flex-row items-center md:items-start gap-6 md:gap-10">
                        {/* Avatar */}
                        <div className="rounded-full h-28 w-28 border-2 bg-slate-700 border-slate-600 p-1">
                            <img
                                src={avatar || NoProfile}
                                className="rounded-full h-full w-full object-cover"
                                alt="Profile"
                            />
                        </div>

                        {/* Info Section */}
                        <div className="flex-1 w-full flex flex-col gap-4 text-center md:text-left">
                            {/* Name + Edit Button */}
                            <div className="flex flex-col sm:flex-row sm:items-center gap-4 justify-between">
                                <p className="text-2xl font-bold text-white">
                                    {name}
                                </p>

                                <Button
                                    text="Edit Profile"
                                    color="secondary"
                                    size="small"
                                    disabled={false}
                                    onClick={() => navigate("/edit-profile")}
                                />
                            </div>

                            {/* Stats */}
                            <div className="flex justify-center md:justify-start gap-6 sm:gap-10 text-white">
                                <div className="flex gap-1 items-center">
                                    <span className="text-lg font-semibold">
                                        {totalPost?.length || 0}
                                    </span>
                                    <p className="text-slate-400">posts</p>
                                </div>

                                <div className="flex gap-1 items-center">
                                    <span className="text-lg font-semibold">
                                        {follower || 0}
                                    </span>
                                    <p className="text-slate-400">followers</p>
                                </div>

                                <div className="flex gap-1 items-center">
                                    <span className="text-lg font-semibold">
                                        {following || 0}
                                    </span>
                                    <p className="text-slate-400">following</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* PROFILE TABS */}
                <div className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-2xl p-4 mb-6">
                    <div className="flex justify-between items-center gap-2 overflow-x-auto">
                        {profileBar.map((item) => (
                            <button
                                key={item.type}
                                onClick={() => onHandel(item.type)}
                                className={`
                                    flex items-center justify-center p-2 rounded-lg transition-all
                                    ${
                                        active === item.type
                                            ? "bg-blue-500 text-white"
                                            : "bg-slate-700/50 text-slate-300 hover:bg-slate-700"
                                    }
                                `}
                                title={item.type}
                            >
                                {item.icon}
                            </button>
                        ))}
                    </div>
                </div>

                {/* CONTENT LIST */}
                <ContentOverlay content={myContent} />
            </div>
        </div>
    );
};

export default Profile;