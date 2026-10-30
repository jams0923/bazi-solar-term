import HeroSection from '@/components/home/HeroSection';
import FeatureSection from '@/components/home/FeatureSection';
import ClearBirthSession from '@/components/home/ClearBirthSession';

export default function HomePage() {
  return (
    <>
      <ClearBirthSession />
      <HeroSection />
      <FeatureSection />
    </>
  );
}
