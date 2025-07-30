
import { Navbar } from "@/components/navbar";
import { HeroSection } from "@/components/hero-section";
import { GamesSection } from "@/components/games-section";
import { ServicesSection } from "@/components/services-section";
import { ContactSection } from "@/components/contact-section";
import { Footer } from "@/components/footer";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <Navbar />
      <HeroSection />
      <GamesSection />
      <ServicesSection />
      <ContactSection />
      <Footer />
    </main>
  );
}
