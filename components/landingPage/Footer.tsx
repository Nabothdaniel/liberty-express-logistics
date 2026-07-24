"use client";

import Link from "next/link";
import Image from "next/image";
import logoImg from "../../assets/images/logo.png";

export default function Footer() {
  return (
    <footer className="bg-[#121212] text-gray-400 pt-24 pb-8 px-6 relative overflow-hidden">
      <div className="max-w-[1200px] mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 mb-24 relative z-10">
        <div className="col-span-1 md:col-span-2">
          <div className="flex items-center gap-2 font-bold text-xl tracking-tight text-white mb-6">
            <div className="relative h-8 w-8 md:h-10 md:w-10 flex items-center justify-center bg-white rounded-sm p-1">
              <Image src={logoImg} alt="Liberty Express Logo" fill style={{objectFit:"contain"}} />
            </div>
            Liberty Express
          </div>
          <p className="max-w-sm text-sm leading-relaxed mb-8">
            Delivering reliable flight and logistics solutions that help businesses and individuals move seamlessly across local and global markets.
          </p>
          <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-8 text-sm">
            <div className="flex items-center gap-2">
              <span className="text-white">📞</span> 0445 8253 0832
            </div>
            <div className="flex items-center gap-2">
              <span className="text-white">✉️</span> info@libertyexpress.com
            </div>
          </div>
        </div>
        
        <div>
          <h4 className="text-white font-medium mb-6 text-sm">COMPANY</h4>
          <ul className="space-y-4 text-sm">
            <li><Link href="/#about" className="hover:text-white transition-colors">About Us</Link></li>
            <li><Link href="/#services" className="hover:text-white transition-colors">Services</Link></li>
            <li><Link href="/track" className="hover:text-white transition-colors">Tracking</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-white font-medium mb-6 text-sm">RESOURCES</h4>
          <ul className="space-y-4 text-sm">
            <li><Link href="#" className="hover:text-white transition-colors">FAQ</Link></li>
            <li><Link href="#" className="hover:text-white transition-colors">Shipping Guide</Link></li>
            <li><Link href="#" className="hover:text-white transition-colors">Support Center</Link></li>
          </ul>
        </div>
      </div>

      <div className="max-w-[1200px] mx-auto flex flex-col md:flex-row items-center justify-between text-xs pt-8 border-t border-gray-800 relative z-10 gap-4">
        <div>© 2026 Liberty Express. All rights reserved.</div>
        <div className="flex gap-6">
          <Link href="#" className="hover:text-white transition-colors">Privacy Policy</Link>
          <Link href="#" className="hover:text-white transition-colors">Terms Of Service</Link>
        </div>
      </div>

      <div className="absolute -bottom-16 left-1/2 -translate-x-1/2 text-[18vw] font-bold text-white/[0.02] tracking-tighter whitespace-nowrap pointer-events-none select-none">
        LIBERTY
      </div>
    </footer>
  );
}
