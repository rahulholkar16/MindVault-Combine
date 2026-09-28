import { Share, Plus, Check } from "lucide-react";
import { useEffect, useState } from "react";
import Button from "../Button";
import { useFeature } from "../../store/feature/useFeature";
import { useNavigate } from "react-router";

const DashboardNavbar = () => {
    const onShare = useFeature((s) => s.onShare);
    const [isOpen, setIsOpen] = useState(false);
    const [shareLink, setShareLink] = useState<string | boolean>("");
    const [copied, setCopied] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        async function share() {
            const resLink = await onShare();
            setShareLink(resLink);
        }
        share();
    }, [onShare]);

    const fullLink =
        typeof shareLink === "string"
            ? `https://mindvault-kappa.vercel.app/dashboard/user/${shareLink}`
            : "";

    const handleCopy = async () => {
        if (!fullLink) return;
        await navigator.clipboard.writeText(fullLink);
        setCopied(true);

        // Reset after 2 seconds
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="min-h-10 mb-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <h2 className="text-3xl font-bold">All Notes</h2>

            <div className="flex gap-4 items-center">
                <Button
                    text="Share Brain"
                    color="secondary"
                    size="large"
                    onClick={() => setIsOpen(true)}
                    disabled={false}
                >
                    <Share size={20} />
                </Button>

                <Button
                    text="Add Content"
                    color="primary"
                    size="large"
                    onClick={() => navigate("create")}
                    disabled={false}
                >
                    <Plus size={20} />
                </Button>
            </div>

            {/* Share Modal */}
            {isOpen && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-20 px-4 transition-all">
                    <div className="w-full max-w-lg bg-slate-800 rounded-xl backdrop-blur p-6 relative shadow-2xl scale-95 animate-[fadeIn_0.2s_ease-out_forwards]">
                        <button
                            className="absolute top-4 right-4 text-white/70 hover:text-white transition"
                            onClick={() => setIsOpen(false)}
                        >
                            ✕
                        </button>
                        <h2 className="text-2xl sm:text-3xl font-bold mb-6">
                            Share Brain
                        </h2>
                        <div className="bg-white/10 border border-white/20 rounded-lg p-4">
                            <label className="text-sm text-gray-300 mb-2 block">
                                Shareable link
                            </label>
                            <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
                                {shareLink ? (
                                    <>
                                        <input
                                            type="text"
                                            readOnly
                                            value={fullLink}
                                            className="flex-1 bg-black/20 border border-white/20 text-white px-3 py-2 rounded-lg outline-none"
                                        />
                                        <button
                                            onClick={handleCopy}
                                            className={`
                                                px-4 py-2 rounded-lg transition-all 
                                                flex items-center justify-center gap-2
                                                ${
                                                    copied
                                                        ? "bg-green-500 hover:bg-green-600"
                                                        : "bg-blue-500 hover:bg-blue-600"
                                                }
                                                text-white transform active:scale-95
                                            `}
                                        >
                                            {copied ? (
                                                <>
                                                    <Check size={18} />
                                                    Copied
                                                </>
                                            ) : (
                                                "Copy"
                                            )}
                                        </button>
                                    </>
                                ) : (
                                    <p className="text-red-300">
                                        Your Profile is Private.
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Small animation keyframe (Tailwind safe) */}
            <style>
                {`
                @keyframes fadeIn {
                    from { opacity: 0; transform: scale(0.95); }
                    to { opacity: 1; transform: scale(1); }
                }
                `}
            </style>
        </div>
    );
};

export default DashboardNavbar;