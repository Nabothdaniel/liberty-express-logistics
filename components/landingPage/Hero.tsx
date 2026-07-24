"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import HeroBanner from "../../assets/images/landing/hero-plane.jpg";
import { LuBox } from "react-icons/lu";
import { Plane } from "lucide-react";

const Hero = () => {
  const [trackingCode, setTrackingCode] = useState("");
  const router = useRouter();

  const handleTrackSubmit = (e) => {
    e.preventDefault();
    if (trackingCode.trim()) {
      router.push(`/track?code=${encodeURIComponent(trackingCode.trim())}`);
    } else {
      router.push("/track");
    }
  };

  return (
    <section
      className="relative bg-cover bg-center py-20 my-16 md:my-20 mx-3 md:mx-5 h-auto md:h-[550px] rounded-2xl px-4 text-white shadow-xl overflow-hidden"
      style={{ backgroundImage: `url(${HeroBanner.src || HeroBanner})` }}
    >
      <div className="absolute inset-0 bg-black/40 backdrop-blur-[1px]" />
      <div className="relative z-10 max-w-7xl mx-auto md:mt-16 flex flex-col md:flex-row items-start md:items-center justify-between gap-12">
        {/* Left Content */}
        <div className="md:w-1/2">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-xs font-semibold uppercase tracking-wider mb-4 border border-white/30">
            <Plane className="w-4 h-4" /> Global Flight Logistics
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold mb-6 leading-tight">
            Travel Beyond Boundaries
          </h1>
          <p className="text-lg md:text-xl text-gray-100 font-light max-w-xl">
            Book flight tickets effortlessly with instant tracking code generation. No account registration needed.
          </p>
        </div>

        {/* Right Tracking Input Form */}
        <div className="bg-white/95 backdrop-blur-md rounded-3xl p-6 md:p-8 shadow-2xl text-black w-full md:w-[450px] border border-white/50">
          <div className="flex justify-between mb-6 border border-gray-200 rounded-full overflow-hidden p-1 bg-gray-100">
            <div className="w-full py-2 px-4 flex items-center justify-center gap-2 font-bold text-sm rounded-full bg-gray-900 text-white shadow-sm">
              <LuBox className="w-5 h-5" /> Live Flight Tracker
            </div>
          </div>

          <form onSubmit={handleTrackSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1 uppercase tracking-wide">
                Tracking Code / Booking ID
              </label>
              <input
                type="text"
                placeholder="e.g. FL-123456"
                value={trackingCode}
                onChange={(e) => setTrackingCode(e.target.value)}
                className="w-full px-4 py-3.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900 text-gray-900 font-medium placeholder-gray-400 text-base"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-gray-900 hover:bg-gray-800 cursor-pointer text-white font-bold py-3.5 rounded-xl transition-all shadow-md text-base"
            >
              Track Flight Live
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default Hero;
