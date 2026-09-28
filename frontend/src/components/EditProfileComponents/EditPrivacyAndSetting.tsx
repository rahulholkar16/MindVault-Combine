import { useRef, useState } from "react";
import { useAuth } from "../../store/auth/useAuth";
import { useFeature } from "../../store/feature/useFeature";

const EditPrivacyAndSetting = () => {
    const isPublic = useAuth((s) => s.user?.isPublic);
    const userEmail = useAuth((s) => s.user?.email);
    const isVerified = useAuth((s) => s.user?.isVerified);

    const status = useFeature((s) => s.status);
    const toggleProfileVisibilty = useFeature((s) => s.toggleProfileVisibilty);
    const resendEmailVerification = useFeature(
        (s) => s.resendEmailVerification,
    );
    const changePassword = useFeature((s) => s.changePassword);
    const forgatPasswordEmail = useFeature((s) => s.forgotPasswordEmail);

    const [oldPassword, setOldPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const [showPopup, setShowPopup] = useState(false);
    const [showResetModal, setShowResetModal] = useState(false);
    const [resetEmail, setResetEmail] = useState(userEmail || "");

    const debounceRef = useRef<number | null>(null);

    const handlePasswordChange = () => {
        if (newPassword !== confirmPassword) {
            useFeature.setState({
                error: "Passwords do not match!",
            });
            return;
        }

        changePassword(oldPassword, newPassword);

        if (status === "success") {
            setOldPassword("");
            setNewPassword("");
            setConfirmPassword("");
        }
    };

    const handlePrivacyToggle = () => {
        if (debounceRef.current) {
            clearTimeout(debounceRef.current);
        }

        debounceRef.current = setTimeout(() => {
            toggleProfileVisibilty();
        }, 200);
    };

    const handleResendVerification = () => {
        if (debounceRef.current) {
            clearTimeout(debounceRef.current);
        }

        debounceRef.current = setTimeout(() => {
            resendEmailVerification();
        }, 200);
    };

    return (
        <div className="w-full flex justify-center">
            <div className="p-4 text-white max-w-md w-full">
                <h2 className="text-2xl font-semibold mb-4">
                    Privacy & Settings
                </h2>

                {/* PUBLIC / PRIVATE TOGGLE */}
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <p className="font-medium">Profile Visibility</p>
                        <p className="text-sm text-gray-400">
                            {isPublic
                                ? "Your profile is public"
                                : "Your profile is private"}
                        </p>
                    </div>

                    <div
                        onClick={handlePrivacyToggle}
                        className={`w-12 h-6 flex items-center rounded-full p-1 cursor-pointer transition-all ${
                            isPublic ? "bg-green-500" : "bg-gray-600"
                        }`}
                    >
                        <div
                            className={`bg-white w-5 h-5 rounded-full shadow-md transform transition-all ${
                                isPublic ? "translate-x-6" : "translate-x-0"
                            }`}
                        ></div>
                    </div>
                </div>

                {/* RESEND VERIFICATION EMAIL */}
                {!isVerified && (
                    <div className="mb-6 p-3 border border-gray-700 rounded bg-gray-900">
                        <p className="text-sm text-yellow-400 mb-2">
                            ⚠️ Your email is not verified
                        </p>
                        <button
                            onClick={handleResendVerification}
                            disabled={status === "loading"}
                            className={`text-sm px-3 py-1 rounded ${
                                status === "loading"
                                    ? "bg-gray-600 cursor-not-allowed opacity-70"
                                    : "bg-gray-700 hover:bg-gray-600"
                            }`}
                        >
                            {status === "loading"
                                ? "Sending..."
                                : "Resend verification email"}
                        </button>
                    </div>
                )}

                <hr className="border-gray-700 my-4" />

                {/* CHANGE PASSWORD */}
                <h3 className="font-semibold mb-2">Change Password</h3>

                <div className="flex flex-col gap-3">
                    <input
                        type="password"
                        value={oldPassword}
                        onChange={(e) => setOldPassword(e.target.value)}
                        className="p-2 rounded bg-gray-800 border border-gray-600 outline-none"
                        placeholder="Old Password"
                    />

                    <input
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className="p-2 rounded bg-gray-800 border border-gray-600 outline-none"
                        placeholder="New Password"
                    />

                    <input
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="p-2 rounded bg-gray-800 border border-gray-600 outline-none"
                        placeholder="Confirm New Password"
                    />

                    <button
                        onClick={handlePasswordChange}
                        disabled={status === "loading"}
                        className={`p-2 rounded ${
                            status === "loading"
                                ? "bg-blue-400 cursor-not-allowed opacity-70"
                                : "bg-blue-600 hover:bg-blue-700"
                        }`}
                    >
                        Update Password
                    </button>
                </div>

                {/* FORGOT PASSWORD LINK */}
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

            {/* SUCCESS TOAST */}
            {showPopup && (
                <div className="fixed top-5 right-5 bg-green-600 text-white px-4 py-2 rounded shadow-lg animate-slideIn">
                    ✅ Password reset email sent!
                </div>
            )}

            {/* RESET PASSWORD MODAL */}
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

export default EditPrivacyAndSetting;
