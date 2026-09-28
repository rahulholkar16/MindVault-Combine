export function normalizeTweetUrl(url: string | undefined) {
    if (!url) return null;
    try {
        const u = new URL(url?.trim());

        // convert x.com → twitter.com
        if (u.hostname === "x.com") {
            u.hostname = "twitter.com";
        }

        // mobile.twitter.com → twitter.com
        if (u.hostname === "mobile.twitter.com") {
            u.hostname = "twitter.com";
        }

        // extract tweet id
        const match = u.pathname.match(/status\/(\d+)/);
        if (!match) return null;

        const tweetId = match[1];
        return {
            tweetId,
            cleanUrl: `https://twitter.com${u.pathname.split("/status")[0]}/status/${tweetId}`
        };
    } catch {
        return null;
    }
}