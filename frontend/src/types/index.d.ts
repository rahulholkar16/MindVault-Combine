import type { ReactNode } from "react";

interface ButtonProp {
    text: string;
    color: "primary" | "secondary" | "danger" | "success";
    size: "small" | "large";
    onClick?: () => void;
    disabled: boolean;
    children?: ReactNode;
}

interface Featurs {
    title: string;
    description: string;
    children: ReactNode;
}

interface User {
    _id: string;
    name: string;
    email: string;
    avatar: string;
    isPublic: boolean;
    isVerified: boolean;
    follower: number;
    following: number;
    followers: Array<string>;
    followingUsers: Array<string>;
    content: Array<string>;
}


interface AuthState {
    user: User | null;
    // status: "idle" | "loading" | "success" | "error";
    isBooting: boolean,
    isLoading: boolean,
    isAuthenticated: boolean;
    isRefreshing: boolean;
    error: string | null | {
        errors: {
            fieldErrors: {
                name?: Array<string>;
                password?: Array<string>;
                email?: Array<string>;
            }
        }
    };

    initAuth: () => Promise<boolean>;
    login: (email: string, password: string) => Promise<boolean>;
    logout: () => Promise<void>;
    refresh: () => Promise<boolean>;
    register: (data: FormData) => Promise<boolean>;
    
}

interface FeatureState {
    error: string | null;
    brainContent: Content[] | null,
    brainUser: User | null,
    status: "idle" | "loading" | "success" | "error";
    onShare: () => Promise<boolean | string>;
    getShare: (token: string) => Promise<void>;
    changeName: (name: string) => Promise<void>;
    changeEmail: (email: string) => Promise<void>;
    changeAvatar: (avatar: FormData) => Promise<void>;
    toggleProfileVisibilty: () => Promise<void>;
    resendEmailVerification: () => Promise<void>;
    verifyEmail: (verificationToken: string) => Promise<void>;
    changePassword: (oldPassword: string, password: string) => Promise<void>;
    forgotPasswordEmail: (email: string) => Promise<void>;
    forgotPassword: (resetToken: string, password: string) => Promise<void>;
    followUser: (targetUserId: string) => Promise<void>;
    unfollowUser: (targetUserId: string) => Promise<void>;
}

interface SignupData {
    name: string;
    email: string;
    password: string;
    avatar: File | null;
    isPublic: boolean;
}

interface SignupDataStore extends SignupData {
    setData: (data: Partial<SignupData>) => void;
    resetData: () => void;
}

interface SidebarProp {
    isOpen: boolean;
    onToggle: (value: boolean) => void
}

interface NotesListProp {
    isOpen: boolean;
}

interface CardProp {
    id: string;
    type: NoteType | undefined;
    title: string;
    url?: string;
    description: string;
    date: string;
}

interface Content {
    "_id": string,
    "title": string,
    "url"?: string,
    "tags"?: [],
    "type"?: NoteType | undefined,
    "description": string,
    "isPublic"?: boolean,
    "createdAt": string
}

interface ContentState {
    content: Content[] | null;
    status: idle | loading | success | error;
    error: string | null;
    myContent: Content[] | null;
    activeProfileTab: string;
    setActiveProfileTab: (tab: string) => void;
    fetchMyContent: () => Promise<boolean>;
    fetchMySpecificContent: (type: string) => Promise<boolean>;
    fetchAll: () => Proise<boolean>;
    fetchByType: (type: string) => Promise<void>;
    create: (title: string, url?: string, description?: string, type: NoteType, isPublic: boolean) => Promise<boolean>;
    delete: (contentId: string) => Promise<void>;
    getContentById: (contentId: string) => Promise<void>;
}

interface ContentOverlayProp { 
    profileOpen?: boolean; 
    content: Content[] | null;
    onDelete?: (contentId: string) => Promise<void>;
}

export type NoteType = 'document' | 'tweet' | 'video' | 'url';
