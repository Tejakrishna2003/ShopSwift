
"use client";

import { useState, useEffect } from 'react';

export default function DynamicFooterYear() {
  const [year, setYear] = useState<number | string>("..."); // Initial placeholder

  useEffect(() => {
    // This will run only on the client, after hydration
    setYear(new Date().getFullYear());
  }, []); // Empty dependency array ensures this runs once on mount

  return <>{year}</>;
}
