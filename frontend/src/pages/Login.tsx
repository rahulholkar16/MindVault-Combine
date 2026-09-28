import { Brain, ArrowLeft, Mail, Lock, Eye, EyeOff } from "lucide-react";
import { useState, useCallback } from "react";
import { useAuth } from "../store/auth/useAuth";
import { useNavigate } from "react-router";
import ErrorOverlay from "../components/ErrorCard/ErrorOverlay/ErrorOverlay";
import { useFeature } from "../store/feature/useFeature";

const Login = () => {
    const login = useAuth((s) => s.login);
    const userEmail = useAuth((s) => s.user?.email);
    const isLoading = useAuth((s) => s.isLoading);
    const [showPopup, setShowPopup] = useState(false);
    const forgatPasswordEmail = useFeature((s) => s.forgotPasswordEmail);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();
    const [showResetModal, setShowResetModal] = useState(false);
    const [resetEmail, setResetEmail] = useState(userEmail || "");
    const [showPassword, setShowPassword] = useState(false);


    const handelSubmit = useCallback(
        async (e: React.FormEvent<HTMLFormElement>) => {
            e.preventDefault();
            useAuth.setState({ error: null });

            if (!email || !password) {
                useAuth.setState({ error: "All fields are required!" });
                return;
            }

            const success = await login(email, password);

            if (success) {
                setEmail("");
                setPassword("");
                navigate("/dashboard");
            }
        },
        [email, password, login, navigate],
    );

    return (
        <div className="relative min-h-screen bg-gray-900 text-white flex items-center justify-center p-4">
            <ErrorOverlay />

            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20" />
            </div>

            <div className="z-10 w-full max-w-md">
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors mb-8"
                >
                    <ArrowLeft size={20} />
                    Back
                </button>

                <div className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-2xl p-8">
                    <div className="flex items-center justify-center gap-3 mb-8">
                        <div className="p-2 bg-linear-to-br from-blue-500 to-purple-600 rounded-lg">
                            <Brain size={24} />
                        </div>
                        <h1 className="text-2xl font-bold">Second Brain</h1>
                    </div>

                    <h2 className="text-2xl font-bold mb-2 text-center">
                        Welcome back
                    </h2>
                    <p className="text-slate-400 text-center mb-8">
                        Sign in to your account to continue
                    </p>

                    <form onSubmit={handelSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-2">
                                Email
                            </label>
                            <div className="relative">
                                <Mail
                                    size={18}
                                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-500"
                                />
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="you@example.com"
                                    className="w-full pl-10 pr-4 py-2.5 bg-slate-700/50 border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-white placeholder-slate-500"
                                    disabled={isLoading}
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-2">
                                Password
                            </label>
                            <div className="relative">
                                <Lock
                                    size={18}
                                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-500"
                                />

                                <input
                                    type={showPassword ? "text" : "password"}
                                    value={password}
                                    onChange={(e) =>
                                        setPassword(e.target.value)
                                    }
                                    placeholder="••••••••"
                                    className="w-full pl-10 pr-12 py-2.5 bg-slate-700/50 border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-white placeholder-slate-500"
                                    disabled={isLoading}
                                />

                                {/* 👁️ SHOW / HIDE EYE ICON */}
                                <button
                                    type="button"
                                    onClick={() =>
                                        setShowPassword(!showPassword)
                                    }
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-white"
                                >
                                    {showPassword ? <EyeOff /> : <Eye />}
                                </button>
                            </div>
                        </div>

                        <div className="text-right">
                            <p className="mt-4 text-sm">
                                Forgot your password?{" "}
                                <span
                                    onClick={() => setShowResetModal(true)}
                                    className="text-blue-400 cursor-pointer hover:underline"
                                >
                                    Reset it here
                                </span>
                            </p>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full px-4 py-2.5 bg-linear-to-r from-blue-500 to-purple-600 rounded-lg font-semibold hover:shadow-lg hover:shadow-blue-500/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isLoading ? "Signing in..." : "Sign In"}
                        </button>
                    </form>

                    <div className="mt-6 text-center">
                        <p className="text-slate-400 text-sm">
                            Don't have an account?{" "}
                            <button
                                onClick={() => navigate("/register")}
                                className="text-blue-400 hover:text-blue-300 font-semibold transition-colors"
                            >
                                Sign Up
                            </button>
                        </p>
                    </div>
                </div>
            </div>

            {showPopup && (
                <div className="fixed top-5 right-5 bg-green-600 text-white px-4 py-2 rounded shadow-lg animate-slideIn">
                    ✅ Password reset email sent!
                </div>
            )}

            {showResetModal && (
                <div className="fixed inset-0 bg-transparent backdrop-blur-sm bg-opacity-60 flex items-center justify-center z-50">
                    <div className="bg-gray-800 p-6 rounded-lg shadow-lg max-w-sm w-full text-white">
                        <h3 className="text-lg font-semibold mb-2">
                            Reset Password
                        </h3>
                        <p className="text-sm text-gray-400 mb-4">
                            Enter your email to receive a reset link.
                        </p>

                        <input
                            type="email"
                            value={resetEmail}
                            onChange={(e) => setResetEmail(e.target.value)}
                            className="w-full p-2 rounded bg-gray-900 border border-gray-700 outline-none mb-4"
                            placeholder="Enter your email"
                        />

                        <div className="flex justify-end gap-3">
                            <button
                                onClick={() => setShowResetModal(false)}
                                className="bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded"
                            >
                                Cancel
                            </button>

                            <button
                                onClick={() => {
                                    if (!resetEmail) {
                                        useFeature.setState({
                                            error: "Email is required!",
                                        });
                                        return;
                                    }

                                    forgatPasswordEmail(resetEmail);
                                    setShowResetModal(false);
                                    setShowPopup(true);

                                    setTimeout(() => setShowPopup(false), 3000);
                                }}
                                className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded"
                            >
                                Send
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Login;
