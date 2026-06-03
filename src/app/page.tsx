import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { HeroSection } from "@/components/sections/HeroSection";
import { CategoriesSection } from "@/components/sections/CategoriesSection";
import { RestaurantsSection } from "@/components/sections/RestaurantsSection";
import { RequestAnythingSection } from "@/components/sections/RequestAnythingSection";

export default function HomePage() {
  return (
    <>
      <Navbar />
      <main>
        <HeroSection />
        <CategoriesSection />
        <RestaurantsSection />
        <RequestAnythingSection />
      </main>
      <Footer />
    </>
  );
}
