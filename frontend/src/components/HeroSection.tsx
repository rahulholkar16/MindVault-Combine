import { ArrowRight } from "lucide-react";
import HeroImage from "../images/HeroImage.png";
import Button from "./Button";
import { useNavigate } from "react-router";
import { useAuth } from "../store/auth/useAuth";

const HeroSection = () => {
    const nevigate = useNavigate();
    const isAuthenticated = useAuth((state) => state.isAuthenticated);
    return (
        <div className="text-white w-full mx-auto px-4 md:px-6 py-8 md:py-12">
            <div className="flex flex-col-reverse md:flex-row w-full items-center justify-between gap-8 md:gap-10">
                {/* Left Content */}
                <div className="w-full md:w-3/4 text-center md:text-left">
                    <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-4 md:mb-6 leading-tight">
                        Your Personal{" "}
                        <span className="bg-linear-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                            Knowledge Hub
                        </span>
                    </h2>

                    <p className="text-slate-300 text-lg md:text-xl mb-6 md:mb-8 leading-relaxed">
                        Capture, organize, and connect your thoughts. Build a
                        second brain that grows with you and helps you think
                        better.
                    </p>
                </div>

                {/* Right Image */}
                <img
                    src={HeroImage}
                    className="w-64 sm:w-80 md:w-96 lg:w-[450px] mx-auto md:mx-0"
                    alt="Hero"
                />
            </div>

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 sm:gap-5 px-2 items-center justify-center md:justify-start mt-6">
                <Button
                    text={isAuthenticated ? "Get Started Free" : "Sign Up"}
                    color="primary"
                    size="large"
                    disabled={false}
                    onClick={
                        isAuthenticated
                            ? () => nevigate("/dashboard")
                            : () => nevigate("/register")
                    }
                >
                    <ArrowRight
                        size={20}
                        className="group-hover:translate-x-1 transition-transform"
                    />
                </Button>

                {!isAuthenticated && (
                    <Button
                        text="Login"
                        color="secondary"
                        size="large"
                        disabled={false}
                        onClick={() => nevigate("/login")}
                    />
                )}
            </div>
        </div>
    );
};

export default HeroSection;