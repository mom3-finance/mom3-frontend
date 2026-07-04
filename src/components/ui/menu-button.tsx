"use client";

import * as React from "react";

import { cn } from "@/lib/utils";

const MenuButton = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    data-slot="menu-button"
    className={cn(
      "flex items-center gap-0.5 rounded-full border border-white/25 bg-white/10 p-1 shadow-[0_8px_32px_rgba(0,0,0,0.12)] backdrop-blur-xl transition-shadow hover:shadow-[0_12px_40px_rgba(0,0,0,0.18)]",
      className
    )}
    {...props}
  />
));
MenuButton.displayName = "MenuButton";

interface MenuButtonItemProps extends React.ComponentProps<"button"> {
  active?: boolean;
  /** Visual variant for the left (primary) slot. */
  variant?: "default" | "glass";
}

const MenuButtonItem = React.forwardRef<
  HTMLButtonElement,
  MenuButtonItemProps
>(({ className, active, variant = "default", children, ...props }, ref) => (
  <button
    ref={ref}
    type="button"
    data-slot="menu-button-item"
    data-active={active ? "true" : undefined}
    className={cn(
      "relative flex items-center justify-center rounded-full px-4 py-2 text-sm font-bold transition-all md:px-5 md:py-2.5 md:text-base",
      // Active state
      active &&
        "bg-[#0A0A0A] text-white shadow-[inset_0_-3px_6px_0_rgba(255,255,255,0.18),inset_0_3px_6px_0_rgba(0,0,0,0.4),0_2px_6px_0_rgba(0,0,0,0.25)]",
      // Glass variant when not active
      !active &&
        variant === "glass" &&
        "bg-white/15 text-[#0A0A0A] shadow-[inset_0_1px_0_0_rgba(255,255,255,0.4)] backdrop-blur-md ring-1 ring-white/30 hover:bg-white/25",
      // Default non-active
      !active && variant === "default" && "text-[#0A0A0A] hover:bg-white/20",
      className
    )}
    {...props}
  >
    {children}
  </button>
));
MenuButtonItem.displayName = "MenuButtonItem";

export { MenuButton, MenuButtonItem };
