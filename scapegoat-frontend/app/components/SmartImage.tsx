"use client";
import { useState } from "react";
import Image, { ImageProps } from "next/image";

export default function SmartImage(props: ImageProps) {
  const [loaded, setLoaded] = useState(false);

  return (
    <Image
      {...props}
      className={`lazy-image ${loaded ? "loaded" : ""} ${props.className || ""}`}
      loading="lazy"
      onLoad={() => setLoaded(true)}
    />
  );
}
