import Link from "next/link";
import {
  ArrowDown,
  ArrowUp,
  ChevronRight,
  History,
  RefreshCw,
  Search,
} from "lucide-react";

const assets = [
  {
    symbol: "ETH",
    name: "Ethereum",
    amount: "0.0000 ETH",
    value: "$0.00",
    change: "Base",
    color: "from-[#627EEA] to-[#8DA2FF]",
  },
  {
    symbol: "USDC",
    name: "USD Coin",
    amount: "0.00 USDC",
    value: "$0.00",
    change: "Stablecoin",
    color: "from-[#2775CA] to-[#5EA2FF]",
  },
  {
    symbol: "MOM",
    name: "mom3 Coin",
    amount: "0.00 MOM",
    value: "$0.00",
    change: "Rewards",
    color: "from-[#ccff00] to-[#3B33BD]",
  },
];

export const metadata = {
  title: "Your Assets | Oni",
  description: "Manage your Oni wallet assets.",
};

export default function AssetsPage() {
  return (
    <main className="min-h-screen bg-black text-white">
      <div className="mx-auto flex min-h-screen w-full flex-col px-5 pt-4 pb-10 sm:max-w-md">
        <header className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="h-10 w-10 rounded-full bg-gradient-to-br from-[#3B33BD] via-[#5A52D4] to-[#7E78EA]" />
            <div>
              <p className="text-base font-semibold leading-tight">@ubayy</p>
              <p className="text-xs font-medium text-[#9A9AA2]">Universal wallet</p>
            </div>
          </div>

          <button
            type="button"
            className="flex h-10 w-10 items-center justify-center rounded-full text-white transition-colors hover:bg-white/10 focus-visible:ring-2 focus-visible:ring-[#3B33BD]"
            aria-label="History"
          >
            <History className="h-6 w-6" aria-hidden="true" />
          </button>
        </header>

        <section className="relative mt-5 overflow-hidden rounded-[32px] bg-[#3B33BD] p-6 text-center shadow-[0_12px_40px_-12px_rgba(59,51,189,0.45)]">
          <div className="pointer-events-none absolute -right-10 -top-14 h-48 w-48 rounded-full bg-[#7C73FF]/25 blur-[64px]" />
          <div className="pointer-events-none absolute -left-16 top-1/2 h-52 w-52 -translate-y-1/2 rounded-full bg-[#5149FF]/25 blur-[56px]" />

          <div className="relative z-10">
            <p className="text-sm font-semibold text-white/70">Total balance</p>
            <p className="mt-2 text-5xl font-bold tracking-tight text-white">
              <span className="align-top text-2xl">$</span>00.00
            </p>
            <p className="mt-2 text-sm font-medium text-white/75">
              Add assets to start earning with mom3.
            </p>
          </div>
        </section>

        <section className="mt-5 grid grid-cols-3 gap-4">
          <Link
            href="#"
            className="group flex min-h-24 flex-col items-center justify-center gap-2 rounded-[24px] transition-transform active:scale-95 focus-visible:ring-2 focus-visible:ring-[#3B33BD]"
          >
            <span className="flex h-14 w-14 items-center justify-center rounded-full bg-[#3B33BD] text-[#ccff00] shadow-[0_8px_24px_-8px_rgba(59,51,189,0.7)]">
              <ArrowDown className="h-7 w-7" aria-hidden="true" />
            </span>
            <span className="text-base font-semibold text-white">Deposit</span>
          </Link>

          <Link
            href="#"
            className="group flex min-h-24 flex-col items-center justify-center gap-2 rounded-[24px] transition-transform active:scale-95 focus-visible:ring-2 focus-visible:ring-[#3B33BD]"
          >
            <span className="flex h-14 w-14 items-center justify-center rounded-full bg-[#1f1f21] text-white">
              <RefreshCw className="h-6 w-6" aria-hidden="true" />
            </span>
            <span className="text-base font-semibold text-white">Convert</span>
          </Link>

          <Link
            href="/send"
            className="group flex min-h-24 flex-col items-center justify-center gap-2 rounded-[24px] transition-transform active:scale-95 focus-visible:ring-2 focus-visible:ring-[#3B33BD]"
          >
            <span className="flex h-14 w-14 items-center justify-center rounded-full bg-[#1f1f21] text-white">
              <ArrowUp className="h-7 w-7" aria-hidden="true" />
            </span>
            <span className="text-base font-semibold text-white">Send</span>
          </Link>
        </section>

        <section className="mt-6">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-bold text-white">Your Assets</h1>
            <button
              type="button"
              className="flex h-10 w-10 items-center justify-center rounded-full bg-[#1C1C1E] text-[#9A9AA2] transition-colors hover:bg-[#262628] focus-visible:ring-2 focus-visible:ring-[#3B33BD]"
              aria-label="Search assets"
            >
              <Search className="h-5 w-5" aria-hidden="true" />
            </button>
          </div>

          <div className="mt-3 overflow-hidden rounded-[28px] bg-[#1C1C1E]">
            {assets.map((asset, index) => (
              <Link
                key={asset.symbol}
                href="#"
                className="flex min-h-[76px] items-center gap-3 px-4 py-3 transition-colors hover:bg-white/[0.04] focus-visible:ring-2 focus-visible:ring-[#3B33BD]"
              >
                <span
                  className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gradient-to-br ${asset.color} text-xs font-black text-white`}
                >
                  {asset.symbol.slice(0, 1)}
                </span>

                <span className="min-w-0 flex-1">
                  <span className="block truncate text-base font-semibold text-white">
                    {asset.name}
                  </span>
                  <span className="mt-0.5 block text-sm text-[#9A9AA2]">
                    {asset.amount}
                  </span>
                </span>

                <span className="text-right">
                  <span className="block text-sm font-semibold text-white">
                    {asset.value}
                  </span>
                  <span className="mt-0.5 block text-xs text-[#9A9AA2]">
                    {asset.change}
                  </span>
                </span>

                <ChevronRight className="h-5 w-5 shrink-0 text-[#66666D]" aria-hidden="true" />
              </Link>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
