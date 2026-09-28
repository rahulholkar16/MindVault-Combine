import { Brain } from "lucide-react";
import { useAuth } from "../store/auth/useAuth";
import { useNavigate } from "react-router";

const Navbar = () => {
    const nevigate = useNavigate();
    const isAuthenticated = useAuth((state) => state.isAuthenticated);
    const logout = useAuth((state) => state.logout);
    return (
        <div className="bg-gray-900 text-white sticky top-0">
            <nav className="flex items-center justify-between px-4 md:px-6 py-4 max-w-7xl mx-auto">
                <div className="flex items-center gap-2">
                    <div className="p-2 bg-linear-to-br from-blue-500 to-purple-600 rounded-lg">
                        <Brain size={24} />
                    </div>
                    <span className="text-xl font-bold">Mind Vault</span>
                </div>
                {isAuthenticated ? (
                    <button
                        onClick={() => logout()}
                        className="group flex items-center justify-start w-9 h-9 bg-blue-600 rounded-full cursor-pointer relative overflow-hidden transition-all duration-200 shadow-lg hover:w-32 hover:rounded-lg active:translate-x-1 active:translate-y-1"
                    >
                        <div className="flex items-center justify-center w-full transition-all duration-300 group-hover:justify-start group-hover:px-3">
                            <svg
                                className="w-4 h-4"
                                viewBox="0 0 512 512"
                                fill="white"
                            >
                                <path d="M377.9 105.9L500.7 228.7c7.2 7.2 11.3 17.1 11.3 27.3s-4.1 20.1-11.3 27.3L377.9 406.1c-6.4 6.4-15 9.9-24 9.9c-18.7 0-33.9-15.2-33.9-33.9l0-62.1-128 0c-17.7 0-32-14.3-32-32l0-64c0-17.7 14.3-32 32-32l128 0 0-62.1c0-18.7 15.2-33.9 33.9-33.9c9 0 17.6 3.6 24 9.9zM160 96L96 96c-17.7 0-32 14.3-32 32l0 256c0 17.7 14.3 32 32 32l64 0c17.7 0 32 14.3 32 32s-14.3 32-32 32l-64 0c-53 0-96-43-96-96L0 128C0 75 43 32 96 32l64 0c17.7 0 32 14.3 32 32s-14.3 32-32 32z" />
                            </svg>
                        </div>
                        <div className="absolute right-5 transform translate-x-full opacity-0 text-white text-lg font-semibold transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100">
                            Logout
                        </div>
                    </button>
                ) : (
                    <button
                        onClick={() => nevigate("/login")}
                        className="px-6 py-2 text-slate-300 hover:text-white transition-colors"
                    >
                        Sign Up
                    </button>
                )}
            </nav>
        </div>
    );
};

export default Navbar;
