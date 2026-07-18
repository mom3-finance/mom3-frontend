"use client";

import * as React from "react";
import { Download, Share2 } from "lucide-react";

type PositionShareCardProps = {
  balance: string;
  profit: string;
  percent: number;
  currency: string;
};

function shareSvg({ balance, profit, percent, currency }: PositionShareCardProps) {
  const safe = (value: string) => value.replace(/[<&>"']/g, "");
  const color = percent >= 0 ? "#ccff00" : "#ff8c8c";
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#3B33BD"/><stop offset="1" stop-color="#111217"/></linearGradient></defs><rect width="1200" height="630" rx="42" fill="url(#g)"/><circle cx="1050" cy="100" r="220" fill="#ffffff" opacity=".08"/><text x="80" y="105" fill="#ccff00" font-family="Arial,sans-serif" font-size="34" font-weight="700">mom3 POSITION</text><text x="80" y="235" fill="#ffffff" font-family="Arial,sans-serif" font-size="84" font-weight="700">${safe(balance)}</text><text x="80" y="285" fill="#c8c8ce" font-family="Arial,sans-serif" font-size="28">Total portfolio balance</text><text x="80" y="450" fill="${color}" font-family="Arial,sans-serif" font-size="58" font-weight="700">${percent >= 0 ? "+" : ""}${percent.toFixed(2)}%</text><text x="80" y="500" fill="#ffffff" font-family="Arial,sans-serif" font-size="28">${percent >= 0 ? "Profit" : "Loss"} ${safe(profit)} ${safe(currency)} · 24h</text><text x="80" y="575" fill="#ffffff" opacity=".6" font-family="Arial,sans-serif" font-size="22">Powered by mom3</text></svg>`;
}

export function PositionShareCard(props: PositionShareCardProps) {
  const [status, setStatus] = React.useState<"idle" | "done" | "error">("idle");

  const saveImage = React.useCallback(() => {
    const blob = new Blob([shareSvg(props)], { type: "image/svg+xml" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "mom3-position.svg";
    anchor.click();
    URL.revokeObjectURL(url);
    setStatus("done");
  }, [props]);

  const share = React.useCallback(async () => {
    try {
      if (navigator.share) {
        await navigator.share({ title: "My mom3 position", text: `${props.percent >= 0 ? "Profit" : "Loss"} ${props.profit} ${props.currency} in 24h.` });
      } else {
        await navigator.clipboard.writeText(`mom3 position: ${props.balance}, ${props.percent >= 0 ? "+" : ""}${props.percent.toFixed(2)}%`);
      }
      setStatus("done");
    } catch {
      setStatus("error");
    }
  }, [props]);

  return (
    <section className="mt-4 rounded-[24px] border border-white/10 bg-[#111217] p-4" aria-labelledby="position-share-title">
      <div className="rounded-[20px] bg-[linear-gradient(135deg,#3B33BD,#17181D)] p-4">
        <p id="position-share-title" className="text-xs font-black uppercase tracking-[0.12em] text-[#ccff00]">Your position</p>
        <p className="mt-3 font-mono text-3xl font-black tabular-nums text-white">{props.balance}</p>
        <p className={`mt-2 text-sm font-black ${props.percent >= 0 ? "text-[#ccff00]" : "text-red-200"}`}>{props.percent >= 0 ? "+" : ""}{props.percent.toFixed(2)}% · {props.percent >= 0 ? "Profit" : "Loss"} {props.profit} {props.currency}</p>
        <p className="mt-1 text-xs font-medium text-white/60">Last 24 hours</p>
      </div>
      <div className="mt-3 grid grid-cols-2 gap-2">
        <button type="button" onClick={() => void share()} className="flex min-h-11 items-center justify-center gap-2 rounded-full bg-[#3B33BD] px-3 text-sm font-black text-white focus-visible:ring-2 focus-visible:ring-[#ccff00]">
          <Share2 className="h-4 w-4" aria-hidden="true" /> Share
        </button>
        <button type="button" onClick={saveImage} className="flex min-h-11 items-center justify-center gap-2 rounded-full bg-white/[0.08] px-3 text-sm font-black text-white focus-visible:ring-2 focus-visible:ring-[#ccff00]">
          <Download className="h-4 w-4" aria-hidden="true" /> Save image
        </button>
      </div>
      {status !== "idle" ? <p className="mt-2 text-center text-xs font-semibold text-[#A7A7B7]" role="status">{status === "done" ? "Ready to share." : "Sharing is unavailable on this device."}</p> : null}
    </section>
  );
}
