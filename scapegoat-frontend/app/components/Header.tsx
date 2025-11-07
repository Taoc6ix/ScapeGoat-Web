"use client";
import Link from "next/link";
import { useState } from "react";
import { Menu, X } from "lucide-react";

export default function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="border-b border-gray-900 bg-black text-white">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <h1 className="text-2xl font-bold uppercase">
          <Link href="/">SCAPEGOAT</Link>
        </h1>

        {/* Desktop Menu */}
        <nav className="hidden md:flex gap-8 text-sm font-semibold">
            <h2><Link href="/" className="hover:text-gray-400">Home</Link></h2>
            <h2><Link href="/" className="hover:text-gray-400">Latest</Link></h2>
            {/* <h2><Link href="/" className="hover:text-gray-400">Tags</Link></h2> */}
            <h2><Link href="/" className="hover:text-gray-400">Popular</Link></h2>
            <h2><Link href="/" className="hover:text-gray-400">Category</Link></h2>
            <h2><Link href="/" className="hover:text-gray-400">Support</Link></h2>
            {/* <h2><Link href="/" className="hover:text-gray-400">Contact Us</Link></h2> */}
        </nav>

        {/* Burger Button */}
        <button 
          className="md:hidden" 
          onClick={() => setOpen(!open)}
          aria-label="Toggle Menu"
        >
          {open ? <X size={26} /> : <Menu size={26} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {open && (
        <div className="md:hidden flex flex-col items-center bg-black border-t border-gray-900 px-4 py-4 space-y-4">
          <h2><Link href="/" className="hover:text-gray-400">Home</Link></h2>
            <h2><Link href="/" className="hover:text-gray-400">Latest</Link></h2>
            {/* <h2><Link href="/" className="hover:text-gray-400">Tags</Link></h2> */}
            <h2><Link href="/" className="hover:text-gray-400">Popular</Link></h2>
            <h2><Link href="/" className="hover:text-gray-400">Category</Link></h2>
            <h2><Link href="/" className="hover:text-gray-400">Support</Link></h2>
            {/* <h2><Link href="/" className="hover:text-gray-400">Contact Us</Link></h2> */}
        </div>
      )}
    </header>
  );
}
