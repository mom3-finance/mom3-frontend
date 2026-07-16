import {
  Skeleton,
  SkeletonCircle,
  SkeletonListRow,
  SkeletonPageHeader,
  SkeletonText,
} from "@/components/ui/skeleton";
import { MobileShell } from "@/components/ui/mobile-shell";

export function HistorySkeleton() {
  return (
    <MobileShell>
      <SkeletonPageHeader hasAction />

      <section className="mt-5 flex items-center gap-2">
        <Skeleton className="h-9 w-20 rounded-full" />
        <SkeletonCircle className="h-9 w-9" />
      </section>

      <section className="mt-5">
        <div className="flex items-end justify-between">
          <div className="space-y-2">
            <SkeletonText className="h-5 w-24" />
            <SkeletonText className="h-3 w-44" />
          </div>
          <Skeleton className="h-6 w-16 rounded-full" />
        </div>

        <div className="mt-4 overflow-hidden rounded-[28px] bg-[#1C1C1E]">
          {Array.from({ length: 5 }).map((_, index) => (
            <SkeletonListRow key={index} className="border-b border-white/5 last:border-b-0" />
          ))}
        </div>
      </section>
    </MobileShell>
  );
}
