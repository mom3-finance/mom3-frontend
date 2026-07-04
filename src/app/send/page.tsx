import Link from "next/link";
import Image from "next/image";
import { ArrowDown, ChevronLeft, ScanLine, Search } from "lucide-react";

export const metadata = {
  title: "Send to Friend | Oni",
  description: "Send assets to a friend or wallet address.",
};

export default function SendPage() {
  return (
    <main className="min-h-screen bg-black text-white">
      <div className="mx-auto flex min-h-screen w-full flex-col px-5 pt-4 pb-10 sm:max-w-md">
        <header className="relative flex h-12 items-center justify-center">
          <Link
            href="/assets"
            className="absolute left-0 flex h-10 w-10 items-center justify-center rounded-full text-white transition-colors hover:bg-white/10 focus-visible:ring-2 focus-visible:ring-[#3B33BD]"
            aria-label="Back to assets"
          >
            <ChevronLeft className="h-7 w-7" aria-hidden="true" />
          </Link>

          <h1 className="text-base font-bold text-white">/Send to friend</h1>
        </header>

        <label htmlFor="recipient-search" className="sr-only">
          Search with tag or address
        </label>
        <div className="mt-5 flex h-12 items-center gap-3 rounded-2xl bg-[#1f1f21] px-4">
          <Search className="h-5 w-5 shrink-0 text-[#9A9AA2]" aria-hidden="true" />
          <input
            id="recipient-search"
            type="search"
            inputMode="search"
            autoComplete="off"
            placeholder="search with @ tag or address"
            className="min-w-0 flex-1 bg-transparent text-sm text-white placeholder:text-[#8E8E93] focus:outline-none"
          />
          <button
            type="button"
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-[#3B33BD] transition-colors hover:bg-white/5 focus-visible:ring-2 focus-visible:ring-[#3B33BD]"
            aria-label="Scan address"
          >
            <ScanLine className="h-6 w-6" aria-hidden="true" />
          </button>
        </div>

        <section className="flex flex-1 flex-col items-center justify-center pb-32 text-center">
          <Image
            src="/send-friend.png"
            alt=""
            width={132}
            height={96}
            className="h-auto w-32 object-contain"
            priority
          />

          <h2 className="mt-6 text-2xl font-bold tracking-tight text-white">
            Add your friend first
          </h2>
          <p className="mt-3 text-base font-medium text-[#9A9AA2]">
            Start your sending
          </p>

          <Link
            href="#"
            className="mt-11 inline-flex h-12 min-w-44 items-center justify-center gap-2 rounded-full bg-[#3B33BD] px-7 text-base font-bold text-[#ccff00] shadow-[0_10px_28px_-10px_rgba(59,51,189,0.8)] transition-transform active:scale-95 focus-visible:ring-2 focus-visible:ring-[#3B33BD]"
          >
            <ArrowDown className="h-5 w-5" aria-hidden="true" />
            Add Friend
          </Link>
        </section>
      </div>
    </main>
  );
}
