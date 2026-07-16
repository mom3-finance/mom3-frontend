import {
  Skeleton,
  SkeletonBottomSearch,
  SkeletonCircle,
  SkeletonListRow,
  SkeletonPageHeader,
  SkeletonText,
} from "@/components/ui/skeleton";
import { MobileShell } from "@/components/ui/mobile-shell";

export function SendSkeleton({ withSearch = false }: { withSearch?: boolean }) {
  return (
    <MobileShell bottomSlot={withSearch ? <SkeletonBottomSearch /> : null}>
      <SkeletonPageHeader hasBack />

      <section className="mt-5">
        <div className="rounded-[28px] bg-[#111217] p-4">
          <div className="flex items-center gap-3">
            <SkeletonCircle className="h-12 w-12" />
            <div className="flex-1 space-y-2">
              <SkeletonText className="h-4 w-28" />
              <SkeletonText className="h-3 w-44" />
            </div>
          </div>
        </div>

        <div className="mt-5 overflow-hidden rounded-[28px] bg-[#1C1C1E]">
          {Array.from({ length: 5 }).map((_, index) => (
            <SkeletonListRow key={index} className="border-b border-white/5 last:border-b-0" />
          ))}
        </div>
      </section>
    </MobileShell>
  );
}

export function ConfirmPaymentSkeleton() {
  return (
    <MobileShell>
      <SkeletonPageHeader hasBack />
      <section className="mt-5 rounded-[28px] bg-[#111217] p-4">
        <div className="flex items-center gap-3">
          <SkeletonCircle className="h-12 w-12" />
          <div className="flex-1 space-y-2">
            <SkeletonText className="h-4 w-32" />
            <SkeletonText className="h-3 w-44" />
          </div>
        </div>
        <SkeletonText className="mx-auto mt-8 h-10 w-40" />
        <SkeletonText className="mx-auto mt-3 h-4 w-24" />
      </section>
      <section className="mt-4 space-y-2 rounded-[28px] bg-[#1C1C1E] p-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <div key={index} className="flex items-center justify-between">
            <SkeletonText className="h-3 w-24" />
            <SkeletonText className="h-3 w-20" />
          </div>
        ))}
      </section>
      <Skeleton className="mt-auto h-14 rounded-full" />
    </MobileShell>
  );
}
