import type React from "react";
import type { ButtonProp } from "../types";

const Button: React.FC<ButtonProp> = ({
    text = "Click",
    color,
    size,
    onClick,
    disabled,
    children
}) => {
    return (
        <button
            onClick={onClick}
            disabled={disabled}
            className={`px-6 py-2 rounded-lg flex items-center font-semibold justify-center gap-3 transition-all duration-300 hover:scale-105 active:scale-95
        ${size === "small" ? "text-sm px-2 py-1" : ""}
        ${size === "large" ? "text-lg px-4 py-2" : ""}
        ${color === "primary" ? "bg-linear-to-r from-blue-500 to-purple-600 text-white hover:shadow-lg hover:shadow-blue-500/50" : ""}
        ${color === "secondary" ? "bg-gray-500 hover:bg-gray-600 text-white" : ""}
        ${color === "danger" ? "bg-red-500 hover:bg-red-600 text-white" : ""}
        ${color === "success" ? "bg-green-500 hover:bg-green-600 text-white" : ""}
        ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
        `}
        >
            <>
                {text}
                {children}
            </>
        </button>
    );
};

export default Button;
