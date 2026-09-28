import { Suspense } from "react";
import Card from "../Card";
import CardSkeleton from "../skeleton/CardSkeleton";
import type { ContentOverlayProp } from "../../types";

const ContentOverlay: React.FC<ContentOverlayProp> = ({
    content,
}) => {

    if (content?.length == 0) {
        return (
            <div className="flex w-full items-center justify-center text-gray-700">
                No Content
            </div>
        );
    }

    return (
        <div className="grid gap-8 grid-cols-[repeat(auto-fill,minmax(280px,1fr))] justify-items-center">
            {content?.map((item) => (
                <Suspense key={item._id} fallback={<CardSkeleton />}>
                    <Card
                        id={item._id}
                        title={item.title}
                        type={item.type}
                        description={item.description}
                        url={item.url}
                        date={item.createdAt}
                    />
                </Suspense>
            ))}
        </div>
    );
};

export default ContentOverlay;
