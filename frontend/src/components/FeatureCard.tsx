import type { Featurs } from "../types";

const FeatureCard: React.FC<Featurs> = ({ title, description, children }) => {
    return (
        <div className="bg-slate-800/50 border border-slate-700 backdrop-blur rounded-xl p-6 text-start max-w-82 max-h-62">
            {children}
            <h3 className="text-lg font-semibold mb-2 text-white">{title}</h3>
            <p className="text-slate-400">{description}</p>
        </div>
    );
};

export default FeatureCard;
