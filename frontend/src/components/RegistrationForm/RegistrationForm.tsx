import {
    Brain,
    ArrowLeft,
    Mail,
    Lock,
    AlertCircle,
    UserLock,
} from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router";
import { useSingupStore } from "../../store/singupData/useSingupData.js";
import { useAuth } from "../../store/auth/useAuth.js";

const RegistrationForm = () => {
    const setData = useSingupStore(s => s.setData);
    const nevigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [name, setName] = useState("");
    const [accType, setAccType] = useState(false);
    const [localError, setLocalError] = useState<string | null>(null);

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        useAuth.setState({isLoading: false});
        useAuth.setState({ error: null });
        if (!email || !password || !name) {
            setLocalError("Please fill in all fields");
            return;
        }
        if (password.length < 8) {
            setLocalError("Password must be at least 8 characters");
            return;
        }
        setData({ name, email, password, isPublic: accType });
        nevigate("change-pic");
    }

    return (
        <div className="min-h-screen bg-gray-900 flex items-center justify-center px-4 py-8">
            <div className="w-full max-w-md md:max-w-lg">
                <button
                    onClick={() => nevigate(-1)}
                    className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors mb-6"
                >
                    <ArrowLeft size={20} />
                    Back
                </button>

                <div className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-2xl p-6 sm:p-8">
                    <div className="flex items-center justify-center gap-3 mb-6">
                        <div className="p-2 bg-linear-to-br from-blue-500 to-purple-600 rounded-lg">
                            <Brain size={24} />
                        </div>
                        <h1 className="text-2xl font-bold text-white">
                            Second Brain
                        </h1>
                    </div>

                    <h2 className="text-2xl font-bold mb-2 text-center text-white">
                        Create account
                    </h2>
                    <p className="text-slate-400 text-center mb-6">
                        Join us to start building your second brain
                    </p>

                    {localError && (
                        <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 mb-6 flex gap-3">
                            <AlertCircle
                                size={20}
                                className="text-red-400 shrink-0 mt-0.5"
                            />
                            <p className="text-red-300 text-sm">{localError}</p>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        {/* Email */}
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
                                />
                            </div>
                        </div>

                        {/* Password */}
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
                                    type="password"
                                    value={password}
                                    onChange={(e) =>
                                        setPassword(e.target.value)
                                    }
                                    placeholder="••••••••"
                                    className="w-full pl-10 pr-4 py-2.5 bg-slate-700/50 border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-white placeholder-slate-500"
                                />
                            </div>
                        </div>

                        {/* Name (FIXED ICON HERE) */}
                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-2">
                                Name
                            </label>
                            <div className="relative">
                                <UserLock
                                    size={18}
                                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-500"
                                />
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="Your Name"
                                    className="w-full pl-10 pr-4 py-2.5 bg-slate-700/50 border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-white placeholder-slate-500"
                                />
                            </div>
                        </div>

                        {/* Public Account (RESPONSIVE FIX) */}
                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-2">
                                Public Account
                            </label>

                            <div className="flex items-center gap-4 sm:gap-6 ml-2 sm:ml-10">
                                <label className="flex items-center gap-2 cursor-pointer text-white">
                                    <input
                                        type="radio"
                                        name="publicAccount"
                                        checked={accType === true}
                                        onChange={() => setAccType(true)}
                                    />
                                    Yes
                                </label>

                                <label className="flex items-center gap-2 cursor-pointer text-white">
                                    <input
                                        type="radio"
                                        name="publicAccount"
                                        checked={accType === false}
                                        onChange={() => setAccType(false)}
                                    />
                                    No
                                </label>
                            </div>
                        </div>

                        <button
                            type="submit"
                            className="w-full px-4 py-2.5 bg-linear-to-r from-blue-500 to-purple-600 rounded-lg font-semibold hover:shadow-lg hover:shadow-blue-500/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed mt-4"
                        >
                            Next
                        </button>
                    </form>

                    <div className="mt-6 text-center">
                        <p className="text-slate-400 text-sm">
                            Already have an account?{" "}
                            <button
                                onClick={() => nevigate("/login")}
                                className="text-blue-400 hover:text-blue-300 font-semibold transition-colors"
                            >
                                Sign in
                            </button>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );

};

export default RegistrationForm;
