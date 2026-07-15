import ConceptSection from "./components/ConceptSection";
import ContactSection from "./components/ContactSection";
import ExperienceSection from "./components/ExperienceSection";
import Footer from "./components/Footer";
import Hero from "./components/Hero";
import MenuSection from "./components/MenuSection";

export default function App() {
  return (
    <div className="site">
      <Hero />
      <main id="main-content">
        <ConceptSection />
        <MenuSection />
        <ExperienceSection />
        <ContactSection />
      </main>
      <Footer />
    </div>
  );
}

