import {Zap, Shield, Share2, Bird, Youtube, BookText, Link, Hash, GalleryHorizontalEnd, User2 } from 'lucide-react'
import DP1 from "../images/dp1.png";
import DP2 from "../images/dp2.png";
import DP3 from "../images/dp3.png";
import DP4 from "../images/dp4.png";
import DP5 from "../images/dp5.png";
import DP6 from "../images/dp6.png";
import DP7 from "../images/dp7.png";
import DP8 from "../images/dp8.png";

export const features = [
    {
        title: "Quick Capture",
        description: "Jot down ideas instantly. No friction, just pure thought capture.",
        icon: <Zap size={ 32} className = "text-blue-400 mb-4" />
    },
    {
        title: "Always Private",
        description: "Your thoughts are yours alone. End-to-end encrypted and secure.",
        icon: <Shield size={ 32 } className = "text-purple-400 mb-4" />
    },
    {
        title: "Stay Connected",
        description: "Sync across all your devices, anytime, anywhere.",
        icon: <Share2 size={ 32 } className = "text-cyan-400 mb-4" />
    }
];

export const sidebar = [
    {
        title: "All Post",
        icon: <GalleryHorizontalEnd />,
        type: "all",
    },
    {
        title: "Tweets",
        icon: <Bird size={20} />,
        type: "tweet",
    },
    {
        title: "Videos",
        icon: <Youtube size={20} />,
        type: "video",
    },
    {
        title: "Documents",
        icon: <BookText size={20} />,
        type: "document",
    },
    {
        title: "Links",
        icon: <Link size={20} />,
        type: "url",
    },
    {
        title: "Tags",
        icon: <Hash size={20} />,
        type: "tag",
    },
    {
        title: "Profile",
        icon: <User2 size={20} />,
        type: "profile",
    },
];

export const profileBar = [
    {
        type: "All",
        icon: <GalleryHorizontalEnd />
    },
    {
        type: "tweet",
        icon: <Bird />
    },
    {
        type: "video",
        icon: <Youtube />
    },
    {
        type: "document",
        icon: <BookText />
    }
];

export const profilePicture = [
    { dp: DP1, id: "3y8g6i0" },
    { dp: DP2, id: "3y8fj86" },
    { dp: DP3, id: "3y8f86" },
    { dp: DP4, id: "4y8fj86" },
    { dp: DP5, id: "3y9fj86" },
    { dp: DP6, id: "6y8fj86" },
    { dp: DP7, id: "8y7fj86" },
    { dp: DP8, id: "8y3fj96" },
];

export const EditProfileTab = [
    {title: "View public profile", onClick: "/dashboard/profile"},
    {title: "Profile", onClick: "/edit-profile"},
    {title: "Photo", onClick: "edit-photo"},
    {title: "Privacy & Security", onClick: "edit-privacy-security"},
]