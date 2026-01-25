import { cn } from "@/lib/utils";

interface SkeletonProps {
    className?: string;
}

export function Skeleton({ className }: SkeletonProps) {
    return (
        <div
            className={cn(
                "relative overflow-hidden bg-neutral-stone/30 rounded-md",
                className
            )}
        >
            <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite_linear] bg-gradient-to-r from-transparent via-white/20 to-transparent" />
        </div>
    );
}

export function PractitionerCardSkeleton() {
    return (
        <div className="bg-white rounded-xl border border-neutral-stone/60 p-6 md:p-8 shadow-premium">
            <div className="flex flex-col md:flex-row justify-between gap-8">
                <div className="space-y-5 flex-1">
                    <div className="flex flex-wrap items-center gap-4">
                        <Skeleton className="h-8 w-48" />
                        <div className="flex gap-2">
                            <Skeleton className="h-5 w-24 rounded-full" />
                            <Skeleton className="h-5 w-24 rounded-full" />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Skeleton className="h-4 w-32" />
                        <Skeleton className="h-4 w-40" />
                    </div>
                </div>
                <div className="flex flex-col items-start md:items-end justify-center gap-4 min-w-[200px] border-t md:border-t-0 md:border-l border-neutral-stone/20 pt-6 md:pt-0 md:pl-8">
                    <Skeleton className="h-6 w-32" />
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-10 w-full mt-2" />
                </div>
            </div>
        </div>
    );
}
