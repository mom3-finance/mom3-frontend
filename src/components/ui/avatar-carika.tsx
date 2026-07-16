"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

interface AvatarCarikaProps {
  /** Optional avatar image URL. Place `carika-avatar.png` in `public/` and pass `/carika-avatar.png`. */
  src?: string;
  alt?: string;
  fallback?: string;
  className?: string;
}

export function AvatarCarika({
  src,
  alt = "Carika",
  fallback = "C",
  className,
}: AvatarCarikaProps) {
  return (
    <Avatar
      size="sm"
      className={cn(
        "size-6 ring-2 ring-white/50 md:size-7",
        className
      )}
    >
      {src ? <AvatarImage src={src} alt={alt} /> : null}
      <AvatarFallback className="bg-gradient-to-br from-[#3B33BD] via-[#5A52D4] to-[#FF6B6B] text-xs font-bold text-white">
        {fallback}
      </AvatarFallback>
    </Avatar>
  );
}
