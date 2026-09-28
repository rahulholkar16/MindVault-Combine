import { useNavigate, useParams } from "react-router";
import ErrorOverlay from "../components/ErrorCard/ErrorOverlay/ErrorOverlay";
import { useFeature } from "../store/feature/useFeature";
import { useState } from "react";
import { ArrowLeft } from "lucide-react";

const ForgetPassword = () => {
    const forgotPassword = useFeature((s) => s.forgotPassword);
    const status = useFeature(s => s.status);
    const { resetToken } = useParams();
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const nevigate = useNavigate();

    async function onClick() {
        console.log("New: ", newPassword);
        console.log("con: ", confirmPassword);
    
        if (!newPassword) {
            useFeature.setState({
                error: "New Password is required!",
            });
            return;
        }

        if (!confirmPassword) {
            useFeature.setState({
                error: "Confirm Password is required!",
            });
            return;
        }

        if (newPassword !== confirmPassword) {
            useFeature.setState({
                error: "Passwords do not match!",
            });
            return;
        }

        if (!resetToken) {
            useFeature.setState({
                error: "Reset token is required!",
            });
            return;
        }

        await forgotPassword(resetToken, newPassword);
    }

    return (
        <div className="flex flex-col h-screen bg-gray-900 w-full items-center justify-center text-white">
            <ErrorOverlay />
            <div className="max-w-md w-full">
                <button
                    onClick={() => nevigate(-1)}
                    className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors mb-8"
                >
                    <ArrowLeft size={20} />
                    Back
                </button>
            </div>

            <div className="bg-gray-800 p-6 rounded-lg shadow-lg max-w-md w-full text-center">
                {/* SUCCESS UI */}
                {status === "success" ? (
                    <div className="flex flex-col items-center gap-3">
                        <h2 className="text-xl font-semibold text-green-400">
                            Password Reset Successful 🎉
                        </h2>
                        <p className="text-gray-400">
                            Your password has been updated successfully. You can
                            now log in with your new password.
                        </p>
                        <button
                            onClick={() => (window.location.href = "/login")}
                            className="mt-2 bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded"
                        >
                            Go to Login
                        </button>
                    </div>
                ) : (
                    <>
                        <h2 className="text-xl font-semibold mb-2">
                            Reset Password
                        </h2>
                        <p className="text-gray-400 mb-4">
                            Enter your new password below to reset your account
                            password.
                        </p>

                        <div className="flex flex-col gap-3">
                            <input
                                type="password"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                className="p-2 rounded bg-gray-900 border border-gray-700 outline-none"
                                placeholder="Enter new password"
                            />

                            <input
                                type="password"
                                value={confirmPassword}
                                onChange={(e) =>
                                    setConfirmPassword(e.target.value)
                                }
                                className="p-2 rounded bg-gray-900 border border-gray-700 outline-none"
                                placeholder="Confirm new password"
                            />

                            <button
                                disabled={status === "loading"}
                                onClick={onClick}
                                className="bg-blue-600 hover:bg-blue-700 p-2 rounded"
                            >
                                {status === "loading"
                                    ? "Resetting..."
                                    : "Reset Password"}
                            </button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );

};

export default ForgetPassword;