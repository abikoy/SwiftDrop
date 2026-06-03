import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

export default function RestaurantsPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-[72px] flex items-center justify-center">
        <div className="text-center">
          <p className="text-6xl mb-4">🍔</p>
          <h1 className="font-display text-4xl font-extrabold text-white mb-3">
            Restaurants
          </h1>
          <p className="text-[#9CA3AF]">
            Coming soon — browse all restaurants in your area.
          </p>
        </div>
      </main>
      <Footer />
    </>
  );
}
