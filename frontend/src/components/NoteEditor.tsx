import { useState } from "react";
import { Link2 } from "lucide-react";
import type { NoteType } from "../types/index";
import Button from "./Button";
import { useContent } from "../store/content/useContent";
import { useNavigate } from "react-router";
import ErrorOverlay from "./ErrorCard/ErrorOverlay/ErrorOverlay";

const NoteEditor = () => {
    const [type, setType] = useState<NoteType>("document");
    const [title, setTitle] = useState("");
    const [url, setUrl] = useState("");
    const [description, setDescription] = useState("");
    const [isPublic, setIsPublic] = useState(true);
    const navigate = useNavigate();

    const createContent = useContent((state) => state.create);

    const handleTypeChange = (newType: NoteType) => {
        setType(newType);
    };

    async function handleUpload() {
        if (!title || !description || !type) {
            alert("Please fill in all fields");
            return;
        }

        if (type === "tweet" || type === "video" || type === "url") {
            if (!url) {
                alert("Please fill in all fields");
                return;
            }
        }

        const success = await createContent(
            title,
            url,
            description,
            type,
            isPublic,
        );

        if (success) {
            setTitle("");
            setDescription("");
            setUrl("");
            navigate("/dashboard/profile");
        }
    }

    return (
        <div className="flex flex-col h-full">
            <ErrorOverlay />

            {/* MAIN EDITOR CONTAINER (SCROLLABLE) */}
            <div className="flex-1 overflow-y-auto">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
                    {/* Public / Private Toggle */}
                    <div className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-2xl p-4 mb-6 flex items-center gap-4">
                        <span className="text-white font-medium">
                            {isPublic ? "Public Post" : "Private Post"}:
                        </span>
                        <label className="relative inline-block h-7 w-[48px] cursor-pointer rounded-full bg-gray-900 transition has-[:checked]:bg-[#03c513]">
                            <input
                                type="checkbox"
                                className="peer sr-only"
                                checked={isPublic}
                                onChange={() => setIsPublic(!isPublic)}
                            />
                            <span className="absolute inset-y-0 start-0 m-1 size-5 rounded-full bg-gray-300 ring-[5px] ring-inset ring-white transition-all peer-checked:start-7 peer-checked:bg-white peer-checked:ring-transparent"></span>
                        </label>
                    </div>

                    {/* TITLE CARD */}
                    <div className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-2xl p-6 sm:p-8 mb-6">
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="Note Title"
                            className="w-full text-2xl sm:text-3xl md:text-4xl font-bold text-white placeholder-slate-500 focus:outline-none bg-transparent"
                        />
                    </div>

                    {/* NOTE TYPE SELECTOR */}
                    <div className="bg-slate-800/50 mb-6 backdrop-blur border border-slate-700 rounded-2xl p-6 sm:p-8">
                        <label className="block text-sm font-semibold text-white mb-3">
                            Note Type
                        </label>

                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                            {(
                                [
                                    "document",
                                    "tweet",
                                    "video",
                                    "link",
                                ] as NoteType[]
                            ).map((noteType) => (
                                <button
                                    key={noteType}
                                    onClick={() => handleTypeChange(noteType)}
                                    className={`px-4 py-2 rounded-lg transition-all text-sm font-medium capitalize ${
                                        type === noteType
                                            ? "bg-blue-500 text-white"
                                            : "bg-slate-700/50 text-slate-300 hover:bg-slate-700"
                                    }`}
                                >
                                    {noteType}
                                </button>
                            ))}
                        </div>

                        {(type === "tweet" ||
                            type === "video" ||
                            type === "url") && (
                            <div className="mt-4">
                                <label className="block text-sm font-semibold text-white mb-2">
                                    <Link2 size={14} className="inline mr-2" />
                                    {type === "tweet"
                                        ? "Tweet URL"
                                        : type === "video"
                                          ? "Video URL"
                                          : "Link URL"}
                                </label>
                                <input
                                    type="url"
                                    value={url}
                                    onChange={(e) => setUrl(e.target.value)}
                                    placeholder={`Paste ${type} URL here...`}
                                    className="w-full px-4 py-2 bg-slate-700/50 border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm text-white placeholder-slate-400"
                                />
                            </div>
                        )}
                    </div>

                    {/* DESCRIPTION / EDITOR */}
                    <div className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-2xl p-6 sm:p-8">
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Start writing your thoughts..."
                            className="w-full min-h-[250px] sm:min-h-[300px] text-white placeholder-slate-500 focus:outline-none resize-none leading-relaxed bg-transparent"
                            style={{ fontSize: "16px", lineHeight: "1.75" }}
                        />
                    </div>
                </div>
            </div>

            {/* FIXED ACTION BUTTONS (BOTTOM) */}
            <div className="border-t border-slate-700 bg-gray-900 py-4">
                <div className="max-w-4xl mx-auto flex justify-center gap-4 px-4">
                    <Button
                        text="Close"
                        size="large"
                        disabled={false}
                        color="danger"
                        onClick={() => navigate(-1)}
                    />
                    <Button
                        text="Upload"
                        size="large"
                        disabled={false}
                        color="success"
                        onClick={handleUpload}
                    />
                </div>
            </div>
        </div>
    );
};

export default NoteEditor;