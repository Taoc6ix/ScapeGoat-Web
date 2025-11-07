"use client";

import Link from "next/link";
import SmartImage from "./SmartImage";
import { useMemo, useState, useCallback, useEffect } from "react";

type HeroPost = {
  id: number;
  title: string;
  slug: string;
  thumbnail_url: string;
  full_image_url?: string;
};

export default function HeroSlider({ posts }: { posts: HeroPost[] }) {
  const items = useMemo(() => posts.slice(0, 3), [posts]);
  const [index, setIndex] = useState(0);
  const [locked, setLocked] = useState(false);

  const lockFor5mill = useCallback(() => {
    setLocked(true);
    const t = setTimeout(() => setLocked(false), 500);
    return () => clearTimeout(t);
  }, []);

  const prev = useCallback(() => {
    if (locked || items.length <= 1) return;
    lockFor5mill();
    setIndex((i) => (i - 1 + items.length) % items.length);
  }, [items.length, locked, lockFor5mill]);

  const next = useCallback(() => {
    if (locked || items.length <= 1) return;
    lockFor5mill();
    setIndex((i) => (i + 1) % items.length);
  }, [items.length, locked, lockFor5mill]);

  useEffect(() => {
    if (items.length <= 1) return;
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % items.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [items.length]);


  if (items.length === 0) return null;

  return (
    <div className="relative w-full h-screen pt-[70px] overflow-hidden group">

      {/* SMOOTH SLIDES */}
      <div
        className="absolute inset-0 flex transition-transform duration-1100ms ease-out"
        style={{ transform: `translateX(-${index * 100}%)` }}
      >
        {items.map((post) => (
          <div key={post.id} className="relative min-w-full h-full">
            <SmartImage
              src={post.full_image_url || post.thumbnail_url}
              alt={post.title}
              fill
              unoptimized
              className="object-cover object-center brightness-90"
            />

            <div className="absolute inset-0 bg-linear-to-t from-black via-black/40 to-transparent"></div>

            {/* TEXT */}
            <div className="absolute bottom-16 left-0 w-full px-6 sm:px-16">
              <div className="max-w-3xl">
                <h2 className="text-4xl sm:text-8xl font-extrabold mb-4 drop-shadow-lg">
                  {post.title}
                </h2>

                <Link
                  href={`/post/${post.slug}`}
                  className="inline-block px-6 py-3 text-sm font-bold rounded-lg 
                  bg-white/20 backdrop-blur-xl border border-white/20 
                  hover:bg-white/30 transition"
                >
                  VIEW POST
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* CONTROLS */}
      {items.length > 1 && (
        <>
          <button
            onClick={prev}
            aria-label="Previous Slide"
            className="absolute left-4 top-1/2 -translate-y-1/2 p-3 rounded-full 
            bg-black/40 backdrop-blur-sm border border-white/20 text-white
            opacity-100 md:opacity-0 md:group-hover:opacity-100
            hover:bg-black/60 transition"
          >
            ←
          </button>

          <button
            onClick={next}
            aria-label="Next Slide"
            className="absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-full 
            bg-black/40 backdrop-blur-sm border border-white/20 text-white
            opacity-100 md:opacity-0 md:group-hover:opacity-100
            hover:bg-black/60 transition"
          >
            →
          </button>
        </>
      )}
    </div>
  );
}
