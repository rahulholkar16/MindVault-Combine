import { create } from "zustand";
import { persist } from "zustand/middleware";
import { api } from "../../lib/api.js";
import type { AuthState } from "../../types";

export const useAuth = create<AuthState>()(
    persist(
        (set, get) => ({
            user: null,
            isAuthenticated: false,
            isBooting: true,  
            isLoading: false,
            error: null,
            isRefreshing: false,

            initAuth: async () => {
                set({ isBooting: true });

                try {
                    const res = await api.get("/auth/me");
                    set({
                        user: res.data.data,
                        isAuthenticated: true,
                        isBooting: false,
                    });
                    return true;
                } catch {
                    set({
                        user: null,
                        isAuthenticated: false,
                        isBooting: false,
                    });
                    return false;
                }
            },

            login: async (email, password) => {
                set({ isLoading: true, error: null });

                try {
                    const res = await api.post("/auth/login", { email, password });

                    set({
                        user: res.data.data.user,
                        isAuthenticated: true,
                        isLoading: false,
                    });

                    // smart prefetch
                    import("../../pages/Dashboard");
                    import("../content/useContent"); // pre-warm content store

                    return true;
                } catch (err: any) {
                    set({
                        error: err.response?.data?.message || "Login failed",
                        isLoading: false,
                        isAuthenticated: false,
                    });
                    return false;
                }
            },


            logout: async () => {
                set({ isLoading: true, error: null });

                try {
                    await api.delete("/auth/logout");

                    set({
                        user: null,
                        isAuthenticated: false,
                        isLoading: false,
                        error: null,
                    });
                } catch (err: any) {
                    const apiError = err.response?.data;

                    set({
                        isLoading: false,
                        error:
                            typeof apiError === "string"
                                ? apiError
                                : apiError?.message || "Logout failed",
                    });
                }
            },


            register: async (data) => {
                set({ isLoading: true, error: null });

                try {
                    await api.post("/auth/register", data, {
                        headers: {
                            "Content-Type": "multipart/form-data",
                        },
                    });

                    set({
                        isLoading: false,
                        error: null,
                    });

                    return true;
                } catch (error: any) {
                    set({
                        isLoading: false,
                        error: error.response?.data?.message || error.response?.data || error.response?.data.errors || "Register failed",
                    });

                    return false;
                }
            },

            refresh: async () => {
                if (get().isRefreshing) return false;

                set({ isRefreshing: true });

                try {
                    await api.get("/auth/refresh-token");

                    // directly call /me here (single round-trip overall)
                    const me = await api.get("/auth/me");

                    set({
                        user: me.data.data,
                        isAuthenticated: true,
                        isRefreshing: false,
                        isBooting: false,
                    });

                    return true;
                } catch {
                    set({
                        isRefreshing: false,
                        user: null,
                        isAuthenticated: false,
                        isBooting: false,
                    });
                    return false;
                }
            },

        }),
        {
            name: "auth-storage",
        }
    )
);
