import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    className?: string;
}

export function Pagination({ currentPage, totalPages, className }: PaginationProps) {
    return (
        <div className={cn("flex items-center justify-center gap-2", className)}>
            <button
                disabled={currentPage === 1}
                className="p-2 rounded-md border border-neutral-stone text-neutral-charcoal/60 hover:bg-neutral-stone/50 disabled:opacity-30 transition-colors"
            >
                <ChevronLeft className="w-5 h-5" />
            </button>

            {[...Array(totalPages)].map((_, i) => (
                <button
                    key={i}
                    className={cn(
                        "w-10 h-10 rounded-md border font-medium transition-all",
                        currentPage === i + 1
                            ? "bg-primary text-white border-primary"
                            : "border-neutral-stone text-neutral-charcoal hover:bg-neutral-stone/50"
                    )}
                >
                    {i + 1}
                </button>
            ))}

            <button
                disabled={currentPage === totalPages}
                className="p-2 rounded-md border border-neutral-stone text-neutral-charcoal/60 hover:bg-neutral-stone/50 disabled:opacity-30 transition-colors"
            >
                <ChevronRight className="w-5 h-5" />
            </button>
        </div>
    );
}
