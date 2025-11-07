"use client";

import { useState, useEffect } from "react";

export default function LoadingScreen({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 3000);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-black text-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-14 w-14 border-b-2 border-white mx-auto mb-4"></div>
          <h4 className="text-base md:text-lg lg:text-xl font-semibold tracking-wide p-2 md:p-3 lg:p-4 text-center">
            Sabar loading dulu...
          </h4>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
