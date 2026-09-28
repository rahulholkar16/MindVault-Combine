import { useEffect } from "react";
import { useFeature } from "../store/feature/useFeature";
import { useParams, useNavigate } from "react-router";

const VerifyEmail = () => {
    const status = useFeature((s) => s.status);
    const verifyEmail = useFeature((s) => s.verifyEmail);
    const { verificationToken } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        if (verificationToken) verifyEmail(verificationToken);
    }, [verifyEmail, verificationToken]);

    return (
        <div className="flex h-screen bg-gray-900 w-full items-center justify-center text-white">
            <div className="bg-gray-800 p-6 rounded-lg shadow-lg text-center max-w-md w-full">
                {/* LOADING STATE */}
                {status === "loading" && (
                    <>
                        <h2 className="text-xl font-semibold mb-2">
                            Verifying Email...
                        </h2>
                        <p className="text-gray-400">
                            Please wait while we verify your email.
                        </p>
                    </>
                )}

                {/* SUCCESS STATE */}
                {status === "success" && (
                    <>
                        <h2 className="text-xl font-semibold mb-2 text-green-400">
                            Email Verified Successfully 🎉
                        </h2>
                        <p className="text-gray-400 mb-4">
                            Your email has been verified. You can now access all
                            features.
                        </p>
                        <button
                            onClick={() => navigate("/login")}
                            className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded"
                        >
                            Go to Login
                        </button>
                    </>
                )}

                {/* ERROR STATE */}
                {status === "error" && (
                    <>
                        <h2 className="text-xl font-semibold mb-2 text-red-400">
                            Verification Failed ❌
                        </h2>
                        <p className="text-gray-400 mb-4">
                            Invalid or expired verification link.
                        </p>
                        <button
                            onClick={() => navigate("/resend-verification")}
                            className="bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded"
                        >
                            Resend Verification Email
                        </button>
                    </>
                )}
            </div>
        </div>
    );
};

export default VerifyEmail;
