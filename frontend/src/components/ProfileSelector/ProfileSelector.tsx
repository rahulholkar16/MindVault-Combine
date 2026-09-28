import { memo, useRef, useState, useCallback } from "react";
import { profilePicture } from "../../data";
import NoProfile from "../../images/noProfile.png";
import { ArrowLeft, Plus } from "lucide-react";
import Button from "../Button";
import { useNavigate } from "react-router";
import { useAuth } from "../../store/auth/useAuth";
import { useSingupStore } from "../../store/singupData/useSingupData";
import ErrorOverlay from "../ErrorCard/ErrorOverlay/ErrorOverlay";

const ProfileSelector = () => {
    const [image, setImage] = useState<File | null>(null);
    const [imageUrl, setImageUrl] = useState<string>(NoProfile);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const navigate = useNavigate();

    const { setData, resetData } = useSingupStore();
    const { name, email, password, isPublic } = useSingupStore();

    const register = useAuth((s) => s.register);
    const isLoading = useAuth((s) => s.isLoading);

    const handleButtonClick = useCallback(() => {
        fileInputRef.current?.click();
    }, []);

    const handleImageChange = useCallback(
        (event: React.ChangeEvent<HTMLInputElement>) => {
            const file = event.target.files?.[0];
            if (!file) return;

            const url = URL.createObjectURL(file);
            setImageUrl(url);
            setImage(file);
        },
        [],
    );

    const submitData = useCallback(async () => {
        useAuth.setState({ error: null });

        setData({ avatar: image });

        const formData = new FormData();
        if (image) {
            formData.append("avatar", image);
        }

        formData.append("name", name);
        formData.append("email", email);
        formData.append("password", password);
        formData.append("isPublic", String(isPublic));

        const success = await register(formData);

        if (success) {
            resetData();
            setImage(null);
            navigate("/login");
        }
    }, [
        image,
        name,
        email,
        password,
        isPublic,
        register,
        resetData,
        navigate,
        setData, 
    ]);


    const urlToFile = useCallback(async (url: string) => {
        const response = await fetch(url);
        const blob = await response.blob();
        const fileName = url.split("/").pop() || "avatar.png";
        return new File([blob], fileName, { type: blob.type });
    }, []);

    return (
        <div className="relative min-h-screen bg-gray-900 px-4 py-8">
            <ErrorOverlay />

            {isLoading && (
                <div className="max-w-lg mx-auto bg-blue-500/10 border border-blue-500/20 rounded-lg p-4 mb-6">
                    <p className="text-blue-300 text-sm text-center">
                        Creating account...
                    </p>
                </div>
            )}

            <div className="max-w-5xl mx-auto flex flex-col items-center">
                {/* Back button */}
                <div className="w-full mb-6">
                    <button
                        onClick={() => navigate(-1)}
                        className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors"
                    >
                        <ArrowLeft size={20} />
                        Back
                    </button>
                </div>

                {/* Main Card */}
                <div
                    className="w-full bg-slate-800/50 backdrop-blur border border-slate-700 rounded-2xl shadow-xl 
                grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] overflow-hidden"
                >
                    {/* LEFT: Upload Section */}
                    <div className="flex flex-col gap-6 p-6 items-center justify-center text-center">
                        <h1 className="text-2xl font-bold text-white">
                            Set Profile Picture
                        </h1>

                        <div className="rounded-full h-28 w-28 border-2 bg-slate-700 border-slate-600 p-1">
                            <img
                                src={imageUrl}
                                alt="Selected avatar"
                                className="rounded-full h-full w-full object-cover"
                            />
                        </div>

                        <div className="px-4 py-3 rounded-lg shadow-lg bg-slate-700 hover:bg-slate-600 transition-all">
                            <input
                                className="hidden"
                                type="file"
                                ref={fileInputRef}
                                accept="image/*"
                                onChange={handleImageChange}
                            />
                            <button
                                onClick={handleButtonClick}
                                className="flex items-center gap-2 text-white"
                            >
                                <Plus size={18} />
                                Upload Image
                            </button>
                        </div>

                        <Button
                            onClick={submitData}
                            text={isLoading ? "Saving..." : "Done"}
                            size="small"
                            color="success"
                            disabled={isLoading}
                        />
                    </div>

                    {/* Divider (only on desktop) */}
                    <div className="hidden md:block w-[1px] bg-slate-700 my-6" />

                    {/* RIGHT: Default Avatars */}
                    <div className="flex flex-col p-6 border-t md:border-t-0 border-slate-700">
                        <h1 className="text-2xl font-bold text-white text-center md:text-left">
                            Default Avatar
                        </h1>

                        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-3 gap-4 mt-6 max-h-[350px] overflow-auto">
                            {profilePicture.map((pic) => (
                                <div
                                    key={pic.id}
                                    onClick={async () => {
                                        const file = await urlToFile(pic.dp);
                                        setImage(file);
                                        setImageUrl(pic.dp);
                                    }}
                                    className="rounded-full h-20 w-20 border-2 bg-slate-700 border-slate-600 p-1 
                                hover:scale-105 active:scale-95 transition-transform cursor-pointer mx-auto"
                                >
                                    <img
                                        src={pic.dp}
                                        alt="Default avatar option"
                                        className="rounded-full h-full w-full object-cover"
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default memo(ProfileSelector);
