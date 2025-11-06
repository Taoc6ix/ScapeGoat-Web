"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState, useCallback } from "react";

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

  const lockFor2s = useCallback(() => {
    setLocked(true);
    const t = setTimeout(() => setLocked(false), 1000);
    return () => clearTimeout(t);
  }, []);

  const prev = useCallback(() => {
    if (locked || items.length <= 1) return;
    lockFor2s();
    setIndex((i) => (i - 1 + items.length) % items.length);
  }, [items.length, locked, lockFor2s]);

  const next = useCallback(() => {
    if (locked || items.length <= 1) return;
    lockFor2s();
    setIndex((i) => (i + 1) % items.length);
  }, [items.length, locked, lockFor2s]);

  if (items.length === 0) return null;

  return (
    <div className="relative w-full h-96 rounded-lg overflow-hidden">
      {/* Slides wrapper with translate animation */}
      <div
        className="absolute inset-0 flex transition-transform duration-1000 ease-out"
        style={{ transform: `translateX(-${index * 100}%)` }}
      >
        {items.map((item) => (
          <Link
            key={item.id}
            href={`/post/${item.slug}`}
            className="relative min-w-full h-full"
          >
            <Image
              src={item.full_image_url || item.thumbnail_url}
              alt={item.title}
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/60 to-transparent" />
            <div className="absolute inset-0 flex items-center justify-center px-6">
              <h2 className="text-center text-xl md:text-3xl lg:text-4xl font-bold leading-tight">
                {item.title}
              </h2>
            </div>
          </Link>
        ))}
      </div>

      {/* Controls */}
      {items.length > 1 && (
        <>
          <button
            aria-label="Previous"
            onClick={prev}
            disabled={locked}
            className="absolute left-3 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full bg-black/50 hover:bg-black/70 disabled:opacity-40 disabled:cursor-not-allowed text-white grid place-items-center"
          >
            ←
          </button>
          <button
            aria-label="Next"
            onClick={next}
            disabled={locked}
            className="absolute right-3 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full bg-black/50 hover:bg-black/70 disabled:opacity-40 disabled:cursor-not-allowed text-white grid place-items-center"
          >
            →
          </button>

          {/* Dots */}
          <div className="absolute bottom-3 left-0 right-0 flex items-center justify-center gap-2">
            {items.map((_, i) => (
              <button
                key={i}
                aria-label={`Go to slide ${i + 1}`}
                onClick={() => !locked && setIndex(i)}
                className={`h-2 w-2 rounded-full ${i === index ? 'bg-white' : 'bg-white/40'}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}


