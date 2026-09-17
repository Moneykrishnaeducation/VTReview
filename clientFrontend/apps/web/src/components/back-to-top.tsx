import React, { useState, useEffect } from "react";
import { ArrowUp } from "lucide-react";
import { useComparison } from "@/lib/comparison-context";
import { useLocation } from "react-router";

export default function BackToTop() {
  const [isVisible, setIsVisible] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const { selectedBrokers } = useComparison();
  const location = useLocation();

  const isTrayVisible = location.pathname !== "/compare" && selectedBrokers.length > 0;

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      
      // Calculate scroll progress percentage (0 - 100)
      if (scrollHeight > 0) {
        const progress = Math.min(100, Math.max(0, (scrollTop / scrollHeight) * 100));
        setScrollProgress(progress);
      }

      // Show button after scrolling down 200px
      if (scrollTop > 200) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll(); // Initial check
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // SVG circular progress calculation
  const radius = 18;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (scrollProgress / 100) * circumference;

  return (
    <div
      className={`fixed right-5 z-50 transition-all duration-300 ease-out ${
        isTrayVisible ? "bottom-20 md:bottom-22" : "bottom-4"
      } ${
        isVisible
          ? "opacity-100 translate-y-0 pointer-events-auto"
          : "opacity-0 translate-y-6 pointer-events-none"
      }`}
    >
      <button
        type="button"
        onClick={scrollToTop}
        className="group relative h-11 w-11 rounded-full bg-slate-900/90 dark:bg-slate-850/95 text-white backdrop-blur-md border border-slate-700/80 shadow-2xl flex items-center justify-center hover:bg-amber-500 hover:text-slate-950 dark:hover:bg-amber-500 dark:hover:text-slate-950 hover:border-amber-400 hover:scale-110 active:scale-95 transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-amber-500/50"
        aria-label="Back to top"
        title={`Back to top (${Math.round(scrollProgress)}% scrolled)`}
      >
        {/* SVG Progress Ring */}
        <svg
          className="absolute inset-0 h-11 w-11 -rotate-90 pointer-events-none"
          viewBox="0 0 44 44"
        >
          {/* Background track circle */}
          <circle
            cx="22"
            cy="22"
            r={radius}
            className="stroke-slate-700/40 dark:stroke-slate-800"
            strokeWidth="2.5"
            fill="transparent"
          />
          {/* Dynamic progress circle */}
          <circle
            cx="22"
            cy="22"
            r={radius}
            className="stroke-amber-500 group-hover:stroke-slate-950 dark:group-hover:stroke-slate-950 transition-all duration-150"
            strokeWidth="2.5"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            fill="transparent"
          />
        </svg>

        {/* Arrow Icon */}
        <ArrowUp className="h-4 w-4 relative z-10 transition-transform group-hover:-translate-y-0.5 duration-200" />
      </button>
    </div>
  );
}
