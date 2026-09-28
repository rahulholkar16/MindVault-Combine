import { create } from "zustand";
import { api } from "../../lib/api";
import type { ContentState } from "../../types";

export const useContent = create<ContentState>((set, get) => ({
    content: [],
    status: false,
    error: null,
    myContent: [],
    activeProfileTab: "All",

    setActiveProfileTab: (tab) => set({ activeProfileTab: tab }),

    fetchAll: async () => {
        if (get().status === "loading") return;
        set({ status: "loading", error: null });
        try {
            const res = await api.get("/auth/content");
            set({ content: res.data.data, status: "success" });
        } catch (err: any) {
            set({
                error: err.response?.data?.message || "Failed to load",
                status: "error",
            });
        }
    },

    fetchByType: async (type) => {
        set({ status: "loading", error: null });
        try {
            const res = await api.get(`/auth/content/type/${type}`);
            set({ content: res.data.data, status: "success" });
        } catch (err: any) {
            set({
                error: err.response?.data?.message,
                status: "error",
            });
        }
    },

    fetchMyContent: async () => {
        if (get().status === "loading") return false;
        set({ status: "loading", error: null });
        try {
            const res = await api.get("/auth/me/content");
            set({ myContent: res.data.data, status: "success" });            
            return true;
        } catch (err: any) {
            set({
                error: err.response?.data?.message || "Failed to load",
                status: "error",
            });
            return false;
        }
    },

    fetchMySpecificContent: async (type) => {
        if (get().status === "loading") return false;
        set({ status: "loading", error: null });
        try {
            const res = await api.get(`/auth/me/content/${type}`);
            set({ myContent: res.data.data, status: "success" });
            return true;
        } catch (err: any) {
            set({
                error: err.response?.data?.message || "Failed to load",
                status: "error",
            });
            return false;
        }
    },

    getContentById: async (contentId) => {
        set({ status: "loading", error: null });
        try {
            const res = await api.get(`/auth/content/${contentId}`);
            set({
                status: "success",
                content: res.data.data
            });
        } catch (error: any) {
            set({
                error: error.response?.data?.message || "Failed to load",
                status: "error",
            });
        }
    },

    create: async (title, url, description, type, isPublic) => {
        set({
            status: "loading"
        })
        try {
            await api.post("/auth/content", {title, url, description, type, isPublic});
            set({
                status: "success",
                error: null
            })
            return true;
        } catch (err: any) {
            set({
                error: err.response?.data?.message,
                status: "error"
            });
            return false;
        }
    },

    delete: async (contentId) => {
        try {
            await api.delete(`/auth/content/${contentId}`);
            set({ status: "success", activeProfileTab: "All" })
        } catch (error: any) {
            set({
                error: error.response?.data?.message,
                status: "error"
            })
        }
    }
}));