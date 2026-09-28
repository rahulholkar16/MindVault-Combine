export { };

declare global {
    interface Window {
        twttr?: {
            widgets: {
                createTweet: (tweetId: string, ref: HTMLDivElement | null, {
                    
                        theme: string,
                        conversation: string,
                        align: string,
                    
                }) => void;
            };
        };
    }
}
