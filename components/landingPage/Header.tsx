"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import logoImg from "../../assets/images/logo.png";

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const isTrackingPage = pathname === "/track";

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const headerBgClass = isScrolled || isTrackingPage || mobileMenuOpen
    ? "bg-white/90 backdrop-blur-md shadow-sm border-b border-gray-100"
    : "bg-transparent";

  return (
    <>
      <header className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-300 ${headerBgClass}`}>
        <div className="flex items-center justify-between px-6 py-4 max-w-[1400px] mx-auto">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 font-bold text-xl tracking-tight text-[#1E1E1E]">
            <div className="relative h-8 w-8 md:h-10 md:w-10 flex items-center justify-center">
              <Image src={logoImg} alt="Liberty Express Logo" fill style={{objectFit:"contain"}} priority />
            </div>
            Liberty Express
          </Link>
          
          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-[#1E1E1E]">
            <Link href="/" className="hover:opacity-70 transition-opacity">Home</Link>
            <Link href="/#services" className="hover:opacity-70 transition-opacity">Services</Link>
            <Link href="/track" className="hover:opacity-70 transition-opacity">Tracking</Link>
            <Link href="/#about" className="hover:opacity-70 transition-opacity">About Us</Link>
          </nav>

          {/* Right Action */}
          <div className="hidden md:flex items-center gap-4">
            <span className="text-sm font-medium text-[#1E1E1E]">EN</span>
            <Link href="/track" className="bg-[#1E1E1E] text-white px-5 py-2.5 rounded-full text-sm font-semibold hover:bg-gray-800 transition-colors shadow-sm">
              Track Flight
            </Link>
          </div>

          {/* Mobile Menu Toggle */}
          <button 
            className="md:hidden text-[#1E1E1E] p-2"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </header>

      {/* Mobile Nav Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 z-[90] bg-white pt-20 px-6"
          >
            <nav className="flex flex-col gap-6 text-xl font-medium text-[#1E1E1E] mt-8">
              <Link href="/" onClick={() => setMobileMenuOpen(false)}>Home</Link>
              <Link href="/#services" onClick={() => setMobileMenuOpen(false)}>Services</Link>
              <Link href="/track" onClick={() => setMobileMenuOpen(false)}>Tracking</Link>
              <Link href="/#about" onClick={() => setMobileMenuOpen(false)}>About Us</Link>
              
              <Link 
                href="/track" 
                onClick={() => setMobileMenuOpen(false)}
                className="mt-6 bg-[#1E1E1E] text-white px-6 py-4 rounded-full text-center text-lg font-semibold shadow-md"
              >
                Track Flight
              </Link>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
