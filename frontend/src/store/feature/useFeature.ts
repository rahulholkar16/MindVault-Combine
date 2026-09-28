import { create } from "zustand";
import type { FeatureState } from "../../types";
import { api } from "../../lib/api";
import { useAuth } from "../auth/useAuth";

export const useFeature = create<FeatureState>((set) => ({
    status: "idle",
    brainContent: null,
    brainUser: null,
    error: null,
    onShare: async () => {
        set({ status: "loading", error: null });
        try {
            const res = await api.get("/auth/share-link");
            set({ status: "success" });
            return res.data?.data.shareLink;
        } catch (error: any) {
            set({
                error: error.response?.data?.message,
                status: "error"
            });
            return false;
        }
    },

    getShare: async (token) => {
        set({ status: "loading", error: null });
        try {
            const res = await api.get(`/auth/share-brain/${token}`);
            set({
                status: "success",
                brainContent: res.data.data.content,
                brainUser: res.data.data.user,
            })
        } catch (error: any) {
            set({
                error: error.response?.data?.message,
                status: "error"
            });
        }
    },

    changeName: async (name) => {
        set({ status: "loading" });
        try {
            const res = await api.post("/auth/change-name", { name });
            useAuth.setState({
                user: res.data.data
            });
            console.log(res.data.data);
            
            set({ status: "success" });
        } catch (error: any) {
            set({
                error: error.response?.data?.message,
                status: "error"
            });
        }
    },

    changeEmail: async (email) => {
        set({ status: "loading" });
        try {
            const res = await api.post("/auth/change-email", { email });
            useAuth.setState({
                user: res.data.data
            });
            set({ status: "success" });
        } catch (error: any) {
            set({
                error: error.response?.data?.message,
                status: "error"
            });
        }
    },

    changeAvatar: async (avatar) => {
        set({ status: "loading", error: null });
        try {
            const res = await api.post("/auth/change-avatar", avatar, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });
            useAuth.setState({
                user: res.data.data
            });
            set({ status: "success" });
        } catch (error: any) {
            set({
                error: error.response?.data?.message,
                status: "error"
            });
        }
    },

    toggleProfileVisibilty: async () => {
        set({ status: "loading", error: null });
        try {
            const res = await api.get("/auth/toggle-public");
            useAuth.setState({
                user: res.data.data
            });
            set({
                status: "success"
            })
        } catch (error: any) {
            set({
                error: error.response?.data?.message,
                status: "error"
            });
        }
    },

    resendEmailVerification: async () => {
        set({ status: "loading", error: null});
        try {
            await api.get("/auth/resend-email-verification");
            set({
                status: "success"
            });
        } catch (error: any) {
            set({
                error: error.response?.data?.message,
                status: "error"
            });
        }
    },

    verifyEmail: async (verificationToken) => {
        set({ status: "loading", error: null });
        try {
            await api.get(`/auth/verify-email/${verificationToken}`);
            set({
                status: "success"
            })
        } catch (error: any) {
            set({
                error: error.response?.data?.message,
                status: "error"
            });
        }
    },

    changePassword: async (oldPassword, password) => {
        set({ status: "loading", error: null });
        try {
            await api.post("/auth/changed-password", {
                oldPassword, password
            });
            set({ status: "success" });
        } catch (error: any) {
            set({
                error: error.response?.data?.message || error.response?.data || error.response?.data.errors,
                status: "error"
            });
        }
    },

    forgotPasswordEmail: async (email) => {
        set({ status: "loading" });
        try {
            await api.post("/auth/forgot-password", { email });
            set({ status: "success" });
        } catch (error: any) {
            set({
                error: error.response?.data?.message,
                status: "error"
            });
        }
    },

    forgotPassword: async (resetToken, password) => {
        set({ status: "loading", error: null });
        try {
            await api.post(`/auth/reset-password/${resetToken}`, { password });
            set({ status: "success" });
        } catch (error: any) {
            set({
                error: error.response?.data?.message || error.response?.data || error.response?.data.errors,
                status: "error"
            });
        }
    },

    followUser: async (targetUserId) => {
        set({ status: "loading", error: null });
        try {
            const res = await api.post(`/auth/follow/${targetUserId}`);
            useAuth.setState({
                user: res.data?.data
            });
            set({
                status: "success"
            })
        } catch (error: any) {
            set({
                error: error.response?.data?.message,
                status: "error"
            });
        }
    },

    unfollowUser: async (targetUserId) => {
        set({ status: "loading", error: null });
        try {
            const res = await api.post(`/auth/unfollow/${targetUserId}`);
            useAuth.setState({
                user: res.data?.data
            });
            set({
                status: "success"
            })
        } catch (error: any) {
            set({
                error: error.response?.data?.message,
                status: "error"
            });
        }
    },
}));