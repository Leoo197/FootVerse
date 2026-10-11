import React, { useEffect, useState } from "react";

interface PlayerPhotoProps {
  name: string;
  src?: string;
  /** "box" = rectangular portrait card (4:5), "avatar" = circle. Both show the SAME photo. */
  variant: "box" | "avatar";
  /** Size / extra classes, e.g. "w-12", "w-24", "w-full" (height always follows the shape). */
  className?: string;
  /** Zoom the photo slightly on parent `group` hover (cards). */
  zoomOnHover?: boolean;
}

const initials = (name: string) =>
  name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();

/**
 * One component for every player picture in the app so that all photo frames
 * have the same shape and the photo is cropped from the top (keeps the face in
 * the circle). If the picture is missing or fails to load, initials are shown.
 */
export const PlayerPhoto: React.FC<PlayerPhotoProps> = ({ name, src, variant, className = "", zoomOnHover }) => {
  const [failed, setFailed] = useState(false);
  useEffect(() => setFailed(false), [src]);

  const shape = variant === "avatar" ? "rounded-full aspect-square" : "rounded-2xl aspect-[4/5]";
  return (
    <div
      role="img"
      aria-label={name}
      className={`relative overflow-hidden flex-shrink-0 bg-gradient-to-br from-slate-200 to-slate-100 dark:from-white/10 dark:to-white/5 ${shape} ${className}`}
    >
      {src && !failed ? (
        <img
          src={src}
          alt=""
          loading="lazy"
          referrerPolicy="no-referrer"
          onError={() => setFailed(true)}
          className={`absolute inset-0 w-full h-full object-cover object-top ${zoomOnHover ? "transition-transform duration-300 group-hover:scale-105" : ""}`}
        />
      ) : (
        <span className={`absolute inset-0 flex items-center justify-center font-extrabold text-slate-400 dark:text-white/40 select-none ${variant === "avatar" ? "text-base" : "text-4xl"}`}>
          {initials(name)}
        </span>
      )}
    </div>
  );
};
