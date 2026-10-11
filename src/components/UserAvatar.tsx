import React from "react";

/** Circle with the fan's picture, or their initials when they have none (new accounts). */
export const UserAvatar: React.FC<{ name: string; src?: string; className?: string }> = ({ name, src, className = "w-12 h-12" }) => {
  const letters = name.split(/\s+/).filter(Boolean).slice(0, 2).map((w) => w[0]).join("").toUpperCase();
  return src ? (
    <img src={src} alt={name} referrerPolicy="no-referrer" className={`rounded-full object-cover ${className}`} />
  ) : (
    <div aria-label={name} className={`rounded-full flex items-center justify-center font-extrabold bg-[#007A4D] text-white dark:bg-[#CCFF00] dark:text-[#0A0A0A] ${className}`}>
      {letters}
    </div>
  );
};
