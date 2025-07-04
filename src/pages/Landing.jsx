import Features from "../components/landingPage/Features";
import Header from "../components/landingPage/Header";
import Hero from "../components/landingPage/Hero";
import About from "../components/landingPage/About";
import Footer from "../components/landingPage/Footer";
import Services from "../components/landingPage/Services";
import Pricing from "../components/landingPage/Pricing";
const Landing = () => {
  return (
    <div className=" mx-0 md:mx-auto py-0 ">
      <Header />
      <Hero />
      <About />
      <Features />
      <Pricing/>
      <Services />
      <Footer />
    </div>
  )
}

export default Landing
