import * as React from "react";

import { cn } from "@/lib/utils";

type BrandCardProps = React.ComponentProps<"div"> & {
  tone?: "surface" | "accent";
};

function BrandCard({ className, tone = "surface", ...props }: BrandCardProps) {
  return (
    <div
      className={cn(
        "rounded-[24px] border border-white/10 shadow-[0_14px_40px_-28px_rgba(59,51,189,0.9)]",
        tone === "surface" && "bg-[#1C1C1E]",
        tone === "accent" &&
          "bg-[radial-gradient(circle_at_0%_0%,rgba(59,51,189,0.24),rgba(20,21,35,0.98)_54%,rgba(13,14,24,0.98)_100%)]",
        className,
      )}
      {...props}
    />
  );
}

export { BrandCard };
