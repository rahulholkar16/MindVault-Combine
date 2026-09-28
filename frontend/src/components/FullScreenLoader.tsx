const FullScreenLoader = () => {
    return (
        <div className="h-screen w-screen flex items-center justify-center bg-gray-900">
            <div className="flex gap-2">
                <div className="w-3 h-3 bg-white rounded-full animate-bounce" />
                <div className="w-3 h-3 bg-white rounded-full animate-bounce [animation-delay:-.2s]" />
                <div className="w-3 h-3 bg-white rounded-full animate-bounce [animation-delay:-.4s]" />
            </div>
        </div>
    );
};

export default FullScreenLoader;
