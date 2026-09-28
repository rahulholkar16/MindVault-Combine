import { useEffect, useRef } from "react";
import { normalizeTweetUrl } from "../utils/normalizeTweetUrl.js";
import InvalidTweet from "./InvalidTweet";

export function TweetEmbed({
    url,
    description,
}: {
    url: string | undefined;
    description: string | undefined}) {
    const ref = useRef<HTMLDivElement>(null);

    const data = normalizeTweetUrl(url);

    useEffect(() => {
        if (!data || !window.twttr || !ref.current) return;

        ref.current.innerHTML = "";

        window.twttr.widgets.createTweet(data.tweetId, ref.current, {
            theme: "dark",
            conversation: "none",
            align: "center",
        });
    }, [data]);

    if (!data) return <InvalidTweet />;

    return (
        <div className="relative my-4 rounded-lg overflow-hidden">
            <div
                ref={ref}
                className={`max-h-[200px] overflow-y-auto no-scrollbar rounded-lg`}
            />

            <p className="m-2 text-white line-clamp-2">{description}</p>
        </div>
    );
}
