import {
  Skeleton,
  SkeletonCircle,
  SkeletonListRow,
  SkeletonPageHeader,
  SkeletonText,
} from "@/components/ui/skeleton";
import { MobileShell } from "@/components/ui/mobile-shell";

export function AssetsSkeleton() {
  return (
    <MobileShell>
      <SkeletonPageHeader hasBack />

      <section className="mt-6 rounded-[28px] border border-white/10 bg-[#111217] p-4 text-center">
        <SkeletonText className="mx-auto h-3 w-24" />
        <SkeletonText className="mx-auto mt-3 h-9 w-40" />
        <SkeletonText className="mx-auto mt-3 h-3 w-64" />
        <Skeleton className="mx-auto mt-5 h-36 w-56 rounded-[28px]" />
      </section>

      <section className="mt-5 grid grid-cols-3 gap-4">
        {Array.from({ length: 3 }).map((_, index) => (
          <div key={index} className="flex min-h-[72px] flex-col items-center justify-center gap-2">
            <SkeletonCircle className="h-11 w-11" />
            <SkeletonText className="h-3 w-14" />
          </div>
        ))}
      </section>

      <div className="mt-5 grid grid-cols-3 gap-1 rounded-full bg-[#1C1C1E] p-1">
        {Array.from({ length: 3 }).map((_, index) => (
          <Skeleton key={index} className="h-9 rounded-full" />
        ))}
      </div>

      <section className="mt-4 overflow-hidden rounded-[24px] bg-[#1F1F21]">
        {Array.from({ length: 5 }).map((_, index) => (
          <SkeletonListRow key={index} className="border-b border-white/[0.06] last:border-b-0" />
        ))}
      </section>
    </MobileShell>
  );
}
