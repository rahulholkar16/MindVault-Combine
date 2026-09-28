import CardSkeleton from "./CardSkeleton";

const DashboardSkeleton = () => (
        <div className="grid grid-cols-3 gap-6 mt-10">
            {Array.from({ length: 6 }).map((_, i) => (
                <CardSkeleton key={i} />
            ))}
        </div>
    );

export default DashboardSkeleton;