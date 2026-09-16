import React, { useState } from "react";

export function isImageLogo(logo?: string): boolean {
  if (!logo) return false;
  return (
    logo.startsWith("data:image/") ||
    logo.startsWith("http://") ||
    logo.startsWith("https://") ||
    logo.startsWith("blob:") ||
    /\.(png|jpg|jpeg|svg|webp|gif|avif)(\?.*)?$/i.test(logo)
  );
}

export function getInitials(name?: string, fallback = "??"): string {
  if (!name || !name.trim()) return fallback;
  const parts = name.trim().split(/\s+/);
  if (parts.length >= 2) {
    return (parts[0][0] + parts[1][0]).toUpperCase();
  }
  return name.trim().slice(0, 2).toUpperCase();
}

interface BrokerLogoProps {
  logo?: string;
  name?: string;
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  className?: string;
  alt?: string;
}

const sizeClasses = {
  xs: "h-7 w-7 rounded-lg text-[10px]",
  sm: "h-9 w-9 rounded-xl text-xs",
  md: "h-11 w-11 rounded-2xl text-sm",
  lg: "h-14 w-14 rounded-2xl text-xl",
  xl: "h-20 w-20 rounded-3xl text-2xl",
};

export function BrokerLogo({
  logo,
  name = "",
  size = "md",
  className = "",
  alt,
}: BrokerLogoProps) {
  const [imgError, setImgError] = useState(false);

  // If logo is changed, reset error state
  const [prevLogo, setPrevLogo] = useState(logo);
  if (logo !== prevLogo) {
    setPrevLogo(logo);
    setImgError(false);
  }

  const isImage = isImageLogo(logo) && !imgError;
  const fallbackText =
    logo && !isImageLogo(logo) && logo.length <= 6
      ? logo.toUpperCase()
      : getInitials(name);

  const containerClasses = className
    ? className
    : `${sizeClasses[size]} bg-amber-500 text-slate-950 font-black flex items-center justify-center shrink-0 shadow-md select-none overflow-hidden`;

  if (isImage) {
    return (
      <div
        className={`${containerClasses} bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-1 flex items-center justify-center overflow-hidden`}
      >
        <img
          src={logo}
          alt={alt || `${name} logo`}
          onError={() => setImgError(true)}
          className="h-full w-full object-contain select-none"
          loading="lazy"
        />
      </div>
    );
  }

  return (
    <div
      className={`${containerClasses} bg-amber-500 text-slate-950 font-black flex items-center justify-center shrink-0 shadow-md select-none`}
    >
      <span>{fallbackText}</span>
    </div>
  );
}
