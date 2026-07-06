import Link from "next/link";
import { ChevronRight } from "lucide-react";

import { createEarnLinks } from "../constants/dashboard";
import { cn } from "@/lib/utils";

export function EarnSection({ balanceLabel }: { balanceLabel: string }) {
  const links = createEarnLinks(balanceLabel);

  return (
    <section className="mt-6">
      <h2 className="text-base font-semibold text-white">Earn with mom3</h2>

      <div className="mt-3 space-y-3">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="flex items-center gap-3 rounded-[24px] border border-white/10 bg-[linear-gradient(115deg,#17181d_0%,#111216_100%)] p-3.5 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)] transition-colors hover:bg-[#262628] focus-visible:ring-2 focus-visible:ring-[#3B33BD]"
          >
            <span className="min-w-0 flex-1">
              <span className="flex items-center gap-2">
                <span className="truncate text-base font-bold text-white">
                  {link.title}
                </span>
                {link.badge ? (
                  <span
                    className={cn(
                      "rounded-full px-2.5 py-1 text-[10px] font-black uppercase",
                      link.badgeClassName,
                    )}
                  >
                    {link.badge}
                  </span>
                ) : null}
              </span>
              <span className="mt-1 block text-sm font-medium text-[#9A9AA2]">
                {link.description}
              </span>
            </span>
            {link.value ? (
              <span
                className={cn(
                  "hidden rounded-full px-3 py-1.5 text-xs font-bold min-[390px]:inline-flex",
                  link.valueClassName,
                )}
              >
                {link.value}
              </span>
            ) : null}
            <ChevronRight
              className="h-5 w-5 shrink-0 text-white"
              aria-hidden="true"
            />
          </Link>
        ))}
      </div>
    </section>
  );
}
