import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    className?: string;
}

export function Pagination({ currentPage, totalPages, className }: PaginationProps) {
    return (
        <div className={cn("flex items-center justify-center gap-3", className)}>
            <button
                disabled={currentPage === 1}
                className="p-3 rounded-xl border border-neutral-stone/60 text-neutral-charcoal/60 hover:bg-neutral-offwhite hover:shadow-card-rest disabled:opacity-30 transition-all press-subtle"
            >
                <ChevronLeft className="w-5 h-5" />
            </button>

            {[...Array(totalPages)].map((_, i) => (
                <button
                    key={i}
                    className={cn(
                        "min-w-10 h-10 px-4 rounded-xl font-medium transition-all press-subtle",
                        currentPage === i + 1
                            ? "bg-gradient-to-br from-primary to-primary-soft text-white shadow-card-rest"
                            : "border border-neutral-stone/60 text-neutral-charcoal hover:bg-neutral-offwhite hover:shadow-card-rest"
                    )}
                >
                    {i + 1}
                </button>
            ))}

            <button
                disabled={currentPage === totalPages}
                className="p-3 rounded-xl border border-neutral-stone/60 text-neutral-charcoal/60 hover:bg-neutral-offwhite hover:shadow-card-rest disabled:opacity-30 transition-all press-subtle"
            >
                <ChevronRight className="w-5 h-5" />
            </button>
        </div>
    );
}
