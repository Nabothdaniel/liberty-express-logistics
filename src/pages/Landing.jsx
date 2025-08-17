import { useNavigate } from "react-router-dom";
import { FaComments } from "react-icons/fa";
import Features from "../components/landingPage/Features";
import Header from "../components/landingPage/Header";
import Hero from "../components/landingPage/Hero";
import About from "../components/landingPage/About";
import Footer from "../components/landingPage/Footer";
import Services from "../components/landingPage/Services";
import Pricing from "../components/landingPage/Pricing";

const Landing = () => {
  const navigate = useNavigate();

  return (
    <div className="mx-0 md:mx-auto py-0 relative">
      <Header />
      <Hero />
      <About />
      <Features />
      <Pricing />
      <Services />
      <Footer />

      {/* Floating Chat Icon */}
      <button
        onClick={() => navigate("/chat")}
        className="fixed bottom-6 right-6 bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-full shadow-lg animate-bounce z-50"
      >
        <FaComments size={28} />
      </button>
    </div>
  );
};

export default Landing;
