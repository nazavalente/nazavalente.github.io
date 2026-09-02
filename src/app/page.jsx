import { About } from "@/components/public/About";
import { Achievements } from "@/components/public/Achievements";
import { Contact } from "@/components/public/Contact";
import { FeaturedProjects } from "@/components/public/FeaturedProjects";
import { Footer } from "@/components/public/Footer";
import { Hero } from "@/components/public/Hero";
import { Navbar } from "@/components/public/Navbar";
import { Skills } from "@/components/public/Skills";

export default function HomePage() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <About />
        <FeaturedProjects />
        <Achievements />
        <Skills />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
