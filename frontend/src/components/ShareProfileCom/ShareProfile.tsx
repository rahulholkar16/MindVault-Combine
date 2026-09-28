import { useEffect } from "react";
import NoProfile from "../../images/noProfile.png";
import { useFeature } from "../../store/feature/useFeature";
import Button from "../Button";
import ContentOverlay from "../ContentOverlay/ContentOverlay";
import { useNavigate, useParams } from "react-router";
import { useAuth } from "../../store/auth/useAuth";

const ShareProfileCom = () => {
    const { token } = useParams<{ token: string }>();
    const getShare = useFeature((s) => s.getShare);
    const content = useFeature((s) => s.brainContent);
    const user = useFeature((s) => s.brainUser);
    const followUser = useFeature((s) => s.followUser);
    const unfollowUser = useFeature((s) => s.unfollowUser);
    const navigate = useNavigate();

    const currentUser = useAuth((s) => s.user);

    useEffect(() => {
        if (token) getShare(token);
    }, [getShare, token]);

    if (user?._id === currentUser?._id) {
        navigate("/dashboard/profile");
        return null;
    }

    const isAlreadyFollowing = currentUser?.followingUsers?.some(
        (id) => id.toString() === user?._id,
    );

    const onFollow = () => {
        if (!user) return;

        if (isAlreadyFollowing) {
            unfollowUser?.(user._id);
        } else {
            followUser(user._id);
        }
    };

    return (
        <div className="flex-1 overflow-y-auto">
            <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
                {/* PROFILE HEADER CARD */}
                <div className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-2xl p-6 mb-6">
                    <div className="flex flex-col md:flex-row items-center md:items-start gap-6 md:gap-10">
                        {/* Avatar */}
                        <div className="rounded-full h-28 w-28 border-2 bg-slate-700 border-slate-600 p-1">
                            <img
                                src={user?.avatar || NoProfile}
                                className="rounded-full h-full w-full object-cover"
                                alt="Profile"
                            />
                        </div>

                        {/* Info Section */}
                        <div className="flex-1 w-full flex flex-col gap-4 text-center md:text-left">
                            {/* Name + Follow Button */}
                            <div className="flex flex-col sm:flex-row sm:items-center gap-4 justify-between">
                                <p className="text-2xl font-bold text-white">
                                    {user?.name}
                                </p>

                                <Button
                                    text={
                                        isAlreadyFollowing
                                            ? "Unfollow"
                                            : "Follow"
                                    }
                                    color={
                                        isAlreadyFollowing
                                            ? "secondary"
                                            : "primary"
                                    }
                                    size="small"
                                    disabled={false}
                                    onClick={onFollow}
                                />
                            </div>

                            {/* Stats */}
                            <div className="flex justify-center md:justify-start gap-6 sm:gap-10 text-white">
                                <div className="flex gap-1 items-center">
                                    <span className="text-lg font-semibold">
                                        {content?.length || 0}
                                    </span>
                                    <p className="text-slate-400">posts</p>
                                </div>

                                <div className="flex gap-1 items-center">
                                    <span className="text-lg font-semibold">
                                        {user?.follower || 0}
                                    </span>
                                    <p className="text-slate-400">followers</p>
                                </div>

                                <div className="flex gap-1 items-center">
                                    <span className="text-lg font-semibold">
                                        {user?.following || 0}
                                    </span>
                                    <p className="text-slate-400">following</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* CONTENT SECTION */}
                <ContentOverlay content={content} />
            </div>
        </div>
    );
};

export default ShareProfileCom;