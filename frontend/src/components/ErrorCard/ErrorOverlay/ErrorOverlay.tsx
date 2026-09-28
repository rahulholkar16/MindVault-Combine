import { useEffect } from "react";
import { useAuth } from "../../../store/auth/useAuth";
import { useFeature } from "../../../store/feature/useFeature";
import ErrorCard from "../ErrorCard";
import { useContent } from "../../../store/content/useContent";

const ErrorOverlay = () => {
    const authError = useAuth((s) => s.error);
    const featureError = useFeature((s) => s.error);
    const contentError = useContent(s => s.error);

    // Prefer featureError if it exists, otherwise authError
    const error = featureError || authError || contentError;

    useEffect(() => {
        if (!error) return;

        const timer = setTimeout(() => {
            // Clear BOTH stores
            useAuth.setState({ error: null });
            useFeature.setState({ error: null });
        }, 3000);

        return () => clearTimeout(timer);
    }, [error]);

    if (!error) return null;

    const containerClass = `
    fixed right-4 top-4 z-50 flex flex-col gap-2 
    transition-all duration-300 
    animate-slideIn
  `;

    // Handle Zod / field errors
    if (
        typeof error === "object" &&
        error !== null &&
        "errors" in error &&
        error.errors?.fieldErrors
    ) {
        const fieldErrors = error.errors.fieldErrors;
        const messages = Object.values(fieldErrors).flat().filter(Boolean);

        return (
            <div className={containerClass}>
                {messages.map((msg, i) => (
                    <ErrorCard key={`${msg}-${i}`} error={msg} />
                ))}
            </div>
        );
    }

    // Handle simple string errors
    if (typeof error === "string") {
        return (
            <div className={containerClass}>
                <ErrorCard error={error} />
            </div>
        );
    }

    // Fallback
    return (
        <div className={containerClass}>
            <ErrorCard error="Something went wrong" />
        </div>
    );
};

export default ErrorOverlay;
