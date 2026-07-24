"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { ArrowUpRight, ChevronLeft, ChevronRight, Search } from "lucide-react";
import { motion } from "framer-motion";
import Header from "../components/landingPage/Header";
import Footer from "../components/landingPage/Footer";

// Images
import heroPlane from "../assets/images/landing/hero-plane.jpg";
import aboutImg from "../assets/images/landing/about.jpg";
import plane1 from "../assets/images/landing/plane1.jpg";

const fadeInUp = {
  initial: { opacity: 0, y: 40 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-100px" },
  transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] }
};

export default function Home() {
  const router = useRouter();
  const [trackingCode, setTrackingCode] = useState("");

  const handleTrackSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (trackingCode.trim()) {
      router.push(`/track?code=${encodeURIComponent(trackingCode.trim())}`);
    }
  };

  return (
    <div className="min-h-screen bg-[#F7F6F2] text-[#1E1E1E] font-sans selection:bg-[#8A5A44] selection:text-white">
      <Header />

      {/* HERO SECTION */}
      <section id="home" className="relative pt-40 pb-20 px-6 overflow-hidden flex flex-col items-center text-center min-h-[90vh]">
        <div className="absolute inset-0 bg-gradient-to-b from-[#F2E5D0] to-[#F7F6F2] -z-10" />
        
        <motion.h1 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          className="text-6xl md:text-8xl font-medium tracking-tight max-w-4xl mx-auto leading-[1.05] mb-8"
        >
          Travel Beyond<br />Boundaries.
        </motion.h1>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
        >
          <form onSubmit={handleTrackSubmit} className="flex flex-col sm:flex-row items-center gap-3 w-full max-w-md mx-auto">
            <div className="relative w-full">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input 
                type="text" 
                placeholder="Enter Tracking Code..." 
                value={trackingCode}
                onChange={(e) => setTrackingCode(e.target.value)}
                className="w-full pl-12 pr-4 py-4 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-[#8A5A44] shadow-lg border border-transparent bg-white"
                required
              />
            </div>
            <button type="submit" className="w-full sm:w-auto flex-shrink-0 inline-flex items-center justify-center gap-2 bg-[#8A5A44] text-white px-8 py-4 rounded-full text-sm font-bold hover:bg-[#724a38] transition-colors shadow-lg group">
              Track Flight
              <ArrowUpRight className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
            </button>
          </form>
        </motion.div>

        {/* Large Background Text & Hero Image Placeholder */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.4, ease: "easeOut" }}
          className="relative mt-20 w-full max-w-[1200px] mx-auto"
        >
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[16vw] font-bold text-white/50 tracking-tighter whitespace-nowrap -z-10 select-none">
            LIBERTY
          </div>
          <div className="w-full h-[300px] md:h-[450px] rounded-xl shadow-2xl relative z-10 overflow-hidden">
            <Image src={heroPlane} alt="Liberty Express Flight" fill style={{objectFit:"cover"}} placeholder="blur" priority />
          </div>
        </motion.div>
      </section>

      {/* WHY CHOOSE US SECTION */}
      <section id="about" className="py-24 px-6 max-w-[1200px] mx-auto overflow-hidden">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          <motion.div {...fadeInUp} className="relative">
            <div className="w-full h-[500px] rounded-2xl relative overflow-hidden">
              <Image src={aboutImg} alt="About Liberty Express" fill style={{objectFit:"cover"}} placeholder="blur" />
            </div>
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="absolute -bottom-6 -right-6 md:-bottom-8 md:-right-8 bg-white p-6 rounded-2xl shadow-xl max-w-[280px]"
            >
              <p className="text-sm font-medium leading-relaxed mb-4">
                "We have a deep commitment to always delivering first-class service with full visibility."
              </p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gray-200 rounded-full overflow-hidden">
                  <img src="https://i.pravatar.cc/100?img=33" alt="Avatar" />
                </div>
                <div>
                  <div className="text-sm font-bold">John T.</div>
                  <div className="text-xs text-gray-500">First-time User</div>
                </div>
              </div>
            </motion.div>
          </motion.div>
          
          <motion.div {...fadeInUp} className="pl-0 md:pl-12 mt-12 md:mt-0">
            <div className="flex items-center gap-3 text-xs font-bold uppercase tracking-widest text-gray-500 mb-6">
              <div className="w-2 h-2 bg-[#8A5A44] rounded-sm" /> WHY WE ARE BEST
            </div>
            <h2 className="text-4xl md:text-5xl font-medium tracking-tight leading-tight mb-8">
              Your Adventure Awaits in the Skies.
            </h2>
            <p className="text-gray-600 mb-10 leading-relaxed">
              At Liberty Express, we're committed to making your travel experience exceptional from start to finish. Here's why we stand out as your go-to platform for booking flights: Hassle-Free Booking. We've streamlined the booking process to ensure it's effortless and user-friendly. With just a few clicks, you can secure your flight tickets, saving you time and stress.
            </p>
            
            <div className="grid grid-cols-2 gap-y-10 gap-x-8">
              <div>
                <div className="text-5xl font-medium mb-2 tracking-tight">25<span className="text-[#8A5A44]">+</span></div>
                <div className="text-sm text-gray-600 font-medium">Years Of Experience</div>
              </div>
              <div>
                <div className="text-5xl font-medium mb-2 tracking-tight">90<span className="text-[#8A5A44]">+</span></div>
                <div className="text-sm text-gray-600 font-medium">Countries Office</div>
              </div>
              <div>
                <div className="text-5xl font-medium mb-2 tracking-tight">24<span className="text-[#8A5A44]">/7</span></div>
                <div className="text-sm text-gray-600 font-medium">Customer Support</div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* TRUSTED SECTION */}
      <motion.section {...fadeInUp} className="py-24 px-6 max-w-[1000px] mx-auto text-center border-t border-gray-200/60">
        <div className="flex items-center justify-center gap-3 text-xs font-bold uppercase tracking-widest text-gray-500 mb-8">
          <div className="w-2 h-2 bg-[#8A5A44] rounded-sm" /> GLOBALLY TRUSTED
        </div>
        <h2 className="text-3xl md:text-5xl font-medium tracking-tight leading-tight mb-16 max-w-3xl mx-auto">
          From First-Time Flyers To Frequent Travelers, Users Trust Liberty Express For Seamless Bookings.
        </h2>
        
        <div className="flex justify-center mb-16">
          <Link href="/track" className="inline-flex items-center gap-2 bg-white text-[#1E1E1E] pl-6 pr-2 py-2 rounded-full text-sm font-medium hover:bg-gray-50 transition-colors shadow-sm group border border-gray-100">
            Track Flight
            <span className="bg-[#8A5A44] text-white p-2 rounded-full group-hover:bg-[#724a38] transition-colors">
              <ArrowUpRight className="w-4 h-4" />
            </span>
          </Link>
        </div>
      </motion.section>

      {/* INSIGHTS / SERVICES SECTION */}
      <section id="services" className="py-24 px-6 max-w-[1200px] mx-auto">
        <motion.div {...fadeInUp}>
          <div className="flex items-center gap-3 text-xs font-bold uppercase tracking-widest text-gray-500 mb-6">
            <div className="w-2 h-2 bg-[#8A5A44] rounded-sm" /> COMPREHENSIVE LOGISTICS
          </div>
          <h2 className="text-4xl md:text-5xl font-medium tracking-tight leading-tight mb-16 max-w-xl">
            Fly to Your Dream & Destinations
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8">
          <motion.div {...fadeInUp} transition={{ delay: 0.1, duration: 0.7 }} className="group rounded-3xl overflow-hidden bg-white shadow-sm border border-gray-100 flex flex-col">
            <div className="h-[300px] relative overflow-hidden">
              <Image src={plane1} alt="Global Service" fill style={{objectFit:"cover"}} placeholder="blur" className="group-hover:scale-105 transition-transform duration-700" />
            </div>
            <div className="p-8">
              <div className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-4">WORLDWIDE</div>
              <h3 className="text-2xl font-medium mb-3">Global Service</h3>
              <p className="text-gray-600 leading-relaxed">
                We always provide people a complete solution focused moving Flight, plane. Experience the reliability of our services, ensuring you reach your destination with precision.
              </p>
            </div>
          </motion.div>

          <motion.div {...fadeInUp} transition={{ delay: 0.2, duration: 0.7 }} className="group rounded-3xl overflow-hidden bg-[#F2F0EA] flex flex-col justify-between p-10 shadow-inner">
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-4">LOCAL CONNECTIONS</div>
              <h3 className="text-3xl font-medium mb-4">Local Service</h3>
              <p className="text-gray-700 leading-relaxed mb-8">
                We have knowledge of the local terrain which enables us to provide unmatched secondary distribution service. Explore strategies to enhance travel speed, cut costs, and improve customer experience.
              </p>
            </div>
            <Link href="/track" className="inline-flex self-start items-center gap-2 bg-[#1E1E1E] text-white pl-6 pr-2 py-2 rounded-full text-sm font-medium hover:bg-gray-800 transition-colors group/btn mt-8 md:mt-0">
              Track Status
              <span className="bg-white text-[#1E1E1E] p-2 rounded-full group-hover/btn:bg-gray-100 transition-colors">
                <ArrowUpRight className="w-4 h-4" />
              </span>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="py-24 px-6 max-w-[1200px] mx-auto border-t border-gray-200/60">
        <motion.div {...fadeInUp} className="flex flex-col md:flex-row items-start md:items-center justify-between mb-16">
          <div>
            <div className="flex items-center gap-3 text-xs font-bold uppercase tracking-widest text-gray-500 mb-6">
              <div className="w-2 h-2 bg-[#8A5A44] rounded-sm" /> CLIENT TESTIMONIALS
            </div>
            <h2 className="text-4xl md:text-5xl font-medium tracking-tight max-w-lg leading-tight">
              Stories from our users.
            </h2>
          </div>
          <div className="hidden md:flex gap-4 mt-8 md:mt-0">
            <button className="w-12 h-12 rounded-full border border-gray-300 flex items-center justify-center hover:bg-white transition-colors">
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button className="w-12 h-12 rounded-full border border-gray-300 flex items-center justify-center hover:bg-white transition-colors bg-white shadow-sm">
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6">
          <motion.div {...fadeInUp} transition={{ delay: 0.1 }} className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 flex flex-col justify-between h-[360px]">
            <p className="text-base leading-relaxed">
              "I've been booking flights with Liberty Express for years, and I couldn't be happier. The website is so easy to use, and I always find the best deals here. Plus, their customer support team is top-notch. Highly recommended!"
            </p>
            <div className="flex items-center gap-4 mt-8">
              <img src="https://i.pravatar.cc/100?img=47" className="w-12 h-12 rounded-full" alt="Sarah M." />
              <div>
                <div className="font-bold text-sm">Sarah M.</div>
                <div className="text-xs text-gray-500">Frequent Flyer</div>
              </div>
            </div>
          </motion.div>

          <motion.div {...fadeInUp} transition={{ delay: 0.2 }} className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 flex flex-col justify-between h-[360px]">
            <p className="text-base leading-relaxed">
              "As a first-time user of Liberty Express, I was pleasantly surprised. The process was incredibly straightforward, and I found a last-minute flight at a great price. I'll definitely be using this website for all my future travel plans."
            </p>
            <div className="flex items-center gap-4 mt-8">
              <img src="https://i.pravatar.cc/100?img=5" className="w-12 h-12 rounded-full" alt="Maria R." />
              <div>
                <div className="font-bold text-sm">Maria R.</div>
                <div className="text-xs text-gray-500">First-time User</div>
              </div>
            </div>
          </motion.div>

          <motion.div {...fadeInUp} transition={{ delay: 0.3 }} className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 flex flex-col justify-between h-[360px]">
            <p className="text-base leading-relaxed">
              "I had to make a last-minute change to my flight, and I was worried it would be a nightmare. But they came through! Their customer support team was incredibly helpful and got everything sorted out quickly. I'm grateful for their assistance."
            </p>
            <div className="flex items-center gap-4 mt-8">
              <img src="https://i.pravatar.cc/100?img=11" className="w-12 h-12 rounded-full" alt="David P." />
              <div>
                <div className="font-bold text-sm">David P.</div>
                <div className="text-xs text-gray-500">Exceptional Support</div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
