import { features } from '../data/index.tsx';
import FeatureCard from './FeatureCard.tsx';
const FeaturesSection = () => {
    
  return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto px-4 py-10 justify-items-center">
          {features.map((feature, index) => (
              <FeatureCard
                  key={index}
                  title={feature.title}
                  description={feature.description}
              >
                  {feature.icon}
              </FeatureCard>
          ))}
      </div>
  );
}

export default FeaturesSection;