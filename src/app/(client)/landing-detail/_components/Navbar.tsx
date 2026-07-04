"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

import { cn } from "@/lib/utils";
import { MenuButton, MenuButtonItem } from "@/components/ui/menu-button";
import { AvatarCarika } from "@/components/ui/avatar-carika";

export default function Navbar() {
  const [visible, setVisible] = useState(true);
  const idleTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      // At the very top, always show.
      if (window.scrollY <= 8) {
        setVisible(true);
        if (idleTimer.current) {
          clearTimeout(idleTimer.current);
          idleTimer.current = null;
        }
        return;
      }

      // Actively scrolling -> hide.
      setVisible(false);

      if (idleTimer.current) clearTimeout(idleTimer.current);
      idleTimer.current = setTimeout(() => {
        setVisible(true);
      }, 200);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (idleTimer.current) clearTimeout(idleTimer.current);
    };
  }, []);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 bg-transparent transition-transform duration-300 ease-out",
        visible ? "translate-y-0" : "-translate-y-full"
      )}
    >
      <div className="px-4 pt-2 md:px-8 md:pt-3">
        <div className="mx-auto flex w-full max-w-7xl items-center justify-between">
          <div className="flex items-center">
            <Image
              src="/brand-logo.png"
              alt="Oni"
              width={64}
              height={64}
              className="h-14 w-14 object-contain brightness-0 md:h-16 md:w-16"
              priority
            />
          </div>

          <MenuButton>
            <MenuButtonItem active variant="glass">
              /Send
            </MenuButtonItem>
            <MenuButtonItem aria-label="Chat with Carika">
              <AvatarCarika />
            </MenuButtonItem>
          </MenuButton>
        </div>
      </div>
    </header>
  );
}
