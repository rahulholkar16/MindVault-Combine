import { useState } from "react";
import { Bird, BookText, Share, Youtube, Link } from "lucide-react";
import type { CardProp } from "../types";
import { TweetEmbed } from "./TweetEmbed";

const Card: React.FC<CardProp> = ({
    id,
    type,
    description,
    title,
    url,
    date,
}) => {
    const [copied, setCopied] = useState(false);
    
    function formatDate() {
        const newDate = new Date(date);
        return newDate.toLocaleDateString("en-GB").replaceAll("/", "-");
    }

    const handleCopyLink = async () => {
        const link = `https://mindvault-kappa.vercel.app/dashboard/content/${id}`;

        try {
            await navigator.clipboard.writeText(link);
            setCopied(true);
            setTimeout(() => setCopied(false), 1500);
        } catch (err) {
            console.error("Failed to copy:", err);
        }
    };

    return (
        <div className="relative bg-gray-800 text-white rounded-lg shadow-lg outline-gray-200 p-4 max-w-75 min-h-[330px] min-w-[270px]">
            <div className="w-full h-full flex flex-col justify-between">
                <div className="flex justify-between items-center w-full">
                    <div className="flex items-center gap-4">
                        {type === "document" && <BookText size={20} />}
                        {type === "video" && <Youtube size={20} />}
                        {type === "tweet" && <Bird size={20} />}
                        {type === "url" && <Link size={20} />}
                        <p className="font-medium text-lg">{title}</p>
                    </div>

                    <div className="flex items-center gap-4">
                        <button
                            onClick={handleCopyLink}
                            className="cursor-pointer hover:text-blue-600 active:scale-110"
                        >
                            <Share />
                        </button>
                    </div>
                </div>

                {/* DOCUMENT */}
                {type === "document" && (
                    <div className="mt-4">
                        <h2 className="font-bold text-2xl m-2">{title}</h2>
                        <p className="m-2 text-white line-clamp-6">
                            {description}
                        </p>
                    </div>
                )}

                {/* VIDEO */}
                {type === "video" && (
                    <div className="my-4 rounded-lg">
                        <iframe
                            sandbox="allow-scripts allow-same-origin allow-presentation"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            className="rounded-lg w-full"
                            loading="lazy"
                            src={url}
                            allowFullScreen
                        />
                        <p className="mt-2 line-clamp-3">{description}</p>
                    </div>
                )}

                {/* TWEET */}
                {type === "tweet" && (
                    <TweetEmbed url={url} description={description} />
                )}

                {/* DATE */}
                <div className="mt-6 px-2 font-semibold text-gray-400 text-sm">
                    Added on {formatDate()}
                </div>
            </div>

            {/* COPIED FEEDBACK */}
            {copied && (
                <span className="absolute bottom-2 right-2 text-xs text-green-400">
                    Copied!
                </span>
            )}
        </div>
    );
};

export default Card;
