import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Categories from "@/components/Categories";
import Featured from "@/components/Featured";
import Promotion from "@/components/Promotion";
import Testimonial from "@/components/Testimonial";
import Gallery from "@/components/Gallery";
import CTA from "@/components/CTA";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <Hero />
      <Categories />
      <Featured />
      <Promotion />
      <Testimonial />
      <Gallery />
      <CTA />
      <Footer />
    </div>
  );
};

export default Index;
