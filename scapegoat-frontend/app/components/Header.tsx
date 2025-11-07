"use client";
import Link from "next/link";
import { useState } from "react";
import { Menu, X } from "lucide-react";

export default function Header() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isMobileCategoryOpen, setIsMobileCategoryOpen] = useState(false);


  return (
    <header className="fixed top-0 left-0 w-full z-50 backdrop-blur-xl bg-white/5 border-b border-white/10 text-white">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <h1 className="text-2xl font-bold uppercase">
          <Link href="/">SCAPEGOAT</Link>
        </h1>

        {/* Desktop Menu */}
        <nav className="hidden md:flex gap-8 text-sm font-bold uppercase items-center relative">
          <h2><Link href="/" className="hover:text-gray-400">Home</Link></h2>
          <h2><Link href="/latest" className="hover:text-gray-400">Latest</Link></h2>
          <h2><Link href="/popular" className="hover:text-gray-400">Popular</Link></h2>
          <div className="relative group">
            <h2 className="hover:text-gray-400 cursor-pointer flex items-center gap-1 select-none">
              Category
              <span className="transition-transform duration-200 group-hover:rotate-180">▼</span>
            </h2>
            <div
              className="absolute left-0 mt-3 w-64 rounded-xl border border-white/10 backdrop-blur-xl
                        bg-white/5 shadow-[0_8px_30px_rgba(0,0,0,0.3)] 
                        opacity-0 scale-95 group-hover:opacity-100 group-hover:scale-100
                        transition-all duration-300 origin-top z-50 p-3">
              <div className="grid grid-cols-2 gap-2 text-sm font-medium">
                <h2><Link href="/category/cosplay" className="px-3 py-2 rounded-lg hover:bg-white/10 transition">COSPLAY</Link></h2>
                <h2><Link href="/category/jilbab" className="px-3 py-2 rounded-lg hover:bg-white/10 transition">JILBAB</Link></h2>
                <h2><Link href="/category/kolpri" className="px-3 py-2 rounded-lg hover:bg-white/10 transition">KOLPRI</Link></h2>
                <h2><Link href="/category/media-exc" className="px-3 py-2 rounded-lg hover:bg-white/10 transition">MEDIA EXC</Link></h2>
                <h2><Link href="/category/of" className="px-3 py-2 rounded-lg hover:bg-white/10 transition">OF</Link></h2>
                <h2><Link href="/category/talent" className="px-3 py-2 rounded-lg hover:bg-white/10 transition">TALENT</Link></h2>
              </div>
            </div>
          </div>
          <h2><Link href="/" className="hover:text-gray-400">Support</Link></h2>
        </nav>

        {/* Burger Button */}
        <button 
          className="md:hidden" 
          onClick={() => setIsMobileOpen(!isMobileOpen)}
          aria-label="Toggle Menu"
        >
          {isMobileOpen ? <X size={26} /> : <Menu size={26} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMobileOpen && (
        <div className="md:hidden flex font-semibold flex-col items-center backdrop-blur-xl border-t border-white/10 px-4 py-6 space-y-4 text-center">
          <h1><Link href="/" className="hover:text-gray-400">Home</Link></h1>
          <h1><Link href="/" className="hover:text-gray-400">Latest</Link></h1>
          <h1><Link href="/" className="hover:text-gray-400">Popular</Link></h1>
          <h1>
            <details className="w-full">
              <summary className="cursor-pointer py-2 hover:text-gray-400">Category</summary>
              <div className="text-sm  font-light flex flex-col lowercase space-y-2 pt-2">
                <h3><Link href="/category/cosplay">COSPLAY</Link></h3>
                <h3><Link href="/category/jilbab">JILBAB</Link></h3>
                <h3><Link href="/category/kolpri">KOLPRI</Link></h3>
                <h3><Link href="/category/media-exc">MEDIA EXC</Link></h3>
                <h3><Link href="/category/of">OF</Link></h3>
                <h3><Link href="/category/talent">TALENT</Link></h3>
              </div>
            </details>
          </h1>

          <h1><Link href="/" className="hover:text-gray-400">Support</Link></h1>
        </div>
      )}
    </header>
  );
}
