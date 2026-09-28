import { useEffect } from "react";
import { useContent } from "../store/content/useContent";
import { useParams, useNavigate } from "react-router";
import { ArrowLeft, BookText, Youtube, Bird, Link } from "lucide-react";
import { TweetEmbed } from "../components/TweetEmbed";

const ContentCard = () => {
    const { contentId } = useParams();
    const getContentById = useContent((s) => s.getContentById);
    const content = useContent((s) => s.content); // ← this is an array
    const navigate = useNavigate();

    useEffect(() => {
        if (contentId) getContentById(contentId);
    }, [contentId, getContentById]);

    const item = Array.isArray(content)
        ? content.find((c) => c._id === contentId) || content[0]
        : content;

    if (!item) {
        return (
            <div className="flex h-screen items-center justify-center bg-gray-900 text-white">
                Loading...
            </div>
        );
    }

    const renderIcon = () => {
        if (item.type === "document") return <BookText size={22} />;
        if (item.type === "video") return <Youtube size={22} />;
        if (item.type === "tweet") return <Bird size={22} />;
        if (item.type === "url") return <Link size={22} />;
        return null;
    };

    return (
        <div className="min-h-screen bg-gray-900 text-white p-6">
            <button
                onClick={() => navigate(-1)}
                className="flex items-center gap-2 text-gray-400 hover:text-white mb-6"
            >
                <ArrowLeft size={20} />
                Back
            </button>

            <div className="max-w-4xl mx-auto bg-gray-800 p-6 rounded-xl shadow-lg">
                {/* HEADER */}
                <div className="flex items-center gap-3 mb-4">
                    <div className="text-blue-400">{renderIcon()}</div>
                    <h1 className="text-2xl font-bold">{item.title}</h1>
                </div>

                {/* CONTENT BODY */}
                <div className="mt-4">
                    {item.type === "document" && (
                        <div>
                            <h2 className="text-xl font-semibold mb-2">
                                Description
                            </h2>
                            <p className="text-gray-300 leading-relaxed">
                                {item.description}
                            </p>
                        </div>
                    )}

                    {item.type === "video" && (
                        <div>
                            <iframe
                                sandbox="allow-scripts allow-same-origin allow-presentation"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                className="w-full h-[400px] rounded-lg"
                                loading="lazy"
                                src={item.url}
                                allowFullScreen
                            />
                            <p className="mt-4 text-gray-300">
                                {item.description}
                            </p>
                        </div>
                    )}

                    {item.type === "tweet" && (
                        <div className="flex justify-center">
                            <div className="w-full max-w-lg overflow-hidden">
                                <TweetEmbed
                                    url={item.url}
                                    description={item.description}
                                />
                            </div>
                        </div>
                    )}

                    {item.type === "url" && (
                        <div>
                            <a
                                href={item.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-400 underline"
                            >
                                {item.url}
                            </a>
                            <p className="mt-4 text-gray-300">
                                {item.description}
                            </p>
                        </div>
                    )}
                </div>

                {/* FOOTER */}
                <div className="mt-6 pt-4 border-t border-gray-700 text-sm text-gray-400">
                    Added on{" "}
                    {new Date(item.createdAt)
                        .toLocaleDateString("en-GB")
                        .replaceAll("/", "-")}
                </div>
            </div>
        </div>
    );
};

export default ContentCard;
