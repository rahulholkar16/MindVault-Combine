import { Plus } from "lucide-react";
import { useCallback, useRef, useState } from "react";
import { useAuth } from "../../store/auth/useAuth";
import { useFeature } from "../../store/feature/useFeature";
import Button from "../Button";
import ErrorOverlay from "../ErrorCard/ErrorOverlay/ErrorOverlay";

const EditPhoto = () => {
    const avatar = useAuth((s) => s.user?.avatar);
    const status = useFeature((s) => s.status);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [image, setImage] = useState<File | null>(null);
    const [imageUrl, setImageUrl] = useState<string | undefined>(avatar);
    const changeAvatar = useFeature((s) => s.changeAvatar);

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
        const formData = new FormData();
        if (image) {
            formData.append("avatar", image);
        }
        await changeAvatar(formData);
    }, [changeAvatar, image]);

    return (
        <div className="flex flex-col gap-6 p-4 min-w-90 justify-center items-center text-white">
            <ErrorOverlay />
            <h1 className="text-2xl font-bold">Set Profile Picture</h1>

            <div className="rounded-full h-24 w-24 border-2 object-cover bg-slate-600 border-gray-300 p-1">
                <img
                    src={imageUrl}
                    alt="Selected avatar"
                    className="rounded-full h-full w-full object-cover"
                    loading="lazy"
                    decoding="async"
                />
            </div>

            <div className="px-4 py-3 rounded-lg shadow-lg overflow-hidden bg-gray-600 active:bg-gray-500 active:scale-80 transition-all duration-300">
                <input
                    className="hidden"
                    type="file"
                    ref={fileInputRef}
                    accept="image/*"
                    onChange={handleImageChange}
                />
                <button onClick={handleButtonClick}>
                    <div className="flex items-center gap-2 justify-center">
                        <Plus />
                        Upload Image
                    </div>
                </button>
            </div>

            <Button
                onClick={submitData}
                text={status === "loading" ? "Saving..." : "Done"}
                size="small"
                color="success"
                disabled={status === "loading"}
            />
        </div>
    );
};

export default EditPhoto;
