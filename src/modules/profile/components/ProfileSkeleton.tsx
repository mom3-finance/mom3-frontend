import {
  Skeleton,
  SkeletonCircle,
  SkeletonListRow,
  SkeletonPageHeader,
  SkeletonText,
} from "@/components/ui/skeleton";
import { MobileShell } from "@/components/ui/mobile-shell";

export function ProfileSkeleton() {
  return (
    <MobileShell>
      <SkeletonPageHeader hasBack hasAction />

      <section className="mt-5 rounded-[28px] bg-[#111217] p-4 text-center">
        <SkeletonCircle className="mx-auto h-16 w-16" />
        <SkeletonText className="mx-auto mt-4 h-5 w-24" />
        <SkeletonText className="mx-auto mt-2 h-3 w-44" />
        <div className="mt-4 grid grid-cols-3 gap-1.5">
          {Array.from({ length: 3 }).map((_, index) => (
            <div key={index} className="rounded-xl bg-black/25 p-2">
              <SkeletonText className="mx-auto h-2.5 w-10" />
              <SkeletonText className="mx-auto mt-2 h-4 w-12" />
              <SkeletonText className="mx-auto mt-2 h-2.5 w-10" />
            </div>
          ))}
        </div>
      </section>

      <section className="mt-4 overflow-hidden rounded-[28px] bg-[#1C1C1E]">
        {Array.from({ length: 3 }).map((_, index) => (
          <SkeletonListRow key={index} className="border-b border-white/5 last:border-b-0" />
        ))}
      </section>

      <section className="mt-4 overflow-hidden rounded-[28px] bg-[#1C1C1E]">
        {Array.from({ length: 3 }).map((_, index) => (
          <SkeletonListRow key={index} className="border-b border-white/5 last:border-b-0" />
        ))}
      </section>

      <Skeleton className="mt-4 h-12 rounded-full" />
    </MobileShell>
  );
}
