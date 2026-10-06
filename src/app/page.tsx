import Header from '@/components/Header';
import Hero from '@/components/Hero';
import About from '@/components/About';
import Services from '@/components/Services';
import PortfolioCategories from '@/components/PortfolioCategories';
import Contact from '@/components/Contact';
import Footer from '@/components/Footer';

export default function Home() {
  return (
    <>
      <a
        href="#main"
        className="sr-only fixed left-4 top-4 z-[100] rounded-full bg-secondary-500 px-5 py-2.5 text-sm font-semibold text-dark-950 focus:not-sr-only"
      >
        Skip to content
      </a>
      <Header />
      <main id="main">
        <Hero />
        <About />
        <Services />
        <PortfolioCategories />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
