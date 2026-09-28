import { useContent } from "../../store/content/useContent";
import ContentOverlay from "../ContentOverlay/ContentOverlay";

const DashboardContent = () => {
    const content = useContent((s) => s.content);
  return <ContentOverlay content={content} />;
}

export default DashboardContent;