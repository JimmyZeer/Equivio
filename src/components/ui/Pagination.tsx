'use client';

import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";
import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    className?: string;
}

export function Pagination({ currentPage, totalPages, className }: PaginationProps) {
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const createPageURL = (pageNumber: number | string) => {
        const params = new URLSearchParams(searchParams?.toString());
        params.set('page', pageNumber.toString());
        return `${pathname}?${params.toString()}`;
    };

    // Smart pagination logic (show first, last, current, and neighbors)
    const getPageNumbers = () => {
        const pages = [];
        const maxVisible = 5; // e.g. 1 ... 4 5 6 ... 10

        if (totalPages <= maxVisible + 2) {
            for (let i = 1; i <= totalPages; i++) pages.push(i);
        } else {
            // Always show first
            pages.push(1);

            if (currentPage > 3) {
                pages.push('...');
            }

            // Neighbors
            const start = Math.max(2, currentPage - 1);
            const end = Math.min(totalPages - 1, currentPage + 1);

            for (let i = start; i <= end; i++) {
                pages.push(i);
            }

            if (currentPage < totalPages - 2) {
                pages.push('...');
            }

            // Always show last
            pages.push(totalPages);
        }
        return pages;
    };

    if (totalPages <= 1) return null;

    return (
        <div className={cn("flex items-center justify-center gap-2", className)}>
            <Link
                href={createPageURL(currentPage - 1)}
                className={cn(
                    "p-2 rounded-xl border border-neutral-stone/60 text-neutral-charcoal/60 hover:bg-neutral-offwhite hover:shadow-card-rest transition-all press-subtle flex items-center justify-center",
                    currentPage <= 1 ? "pointer-events-none opacity-30" : ""
                )}
                aria-disabled={currentPage <= 1}
            >
                <ChevronLeft className="w-5 h-5" />
            </Link>

            {getPageNumbers().map((page, i) => {
                if (page === '...') {
                    return (
                        <span key={`dots-${i}`} className="px-2 text-neutral-charcoal/40">
                            <MoreHorizontal className="w-5 h-5" />
                        </span>
                    );
                }

                return (
                    <Link
                        key={page}
                        href={createPageURL(page)}
                        className={cn(
                            "min-w-10 h-10 px-3 flex items-center justify-center rounded-xl font-bold transition-all press-subtle text-sm",
                            currentPage === page
                                ? "bg-gradient-to-br from-primary to-primary-soft text-white shadow-card-rest scale-105"
                                : "border border-neutral-stone/60 text-neutral-charcoal hover:bg-neutral-offwhite hover:shadow-card-rest hover:text-primary"
                        )}
                    >
                        {page}
                    </Link>
                );
            })}

            <Link
                href={createPageURL(currentPage + 1)}
                className={cn(
                    "p-2 rounded-xl border border-neutral-stone/60 text-neutral-charcoal/60 hover:bg-neutral-offwhite hover:shadow-card-rest transition-all press-subtle flex items-center justify-center",
                    currentPage >= totalPages ? "pointer-events-none opacity-30" : ""
                )}
                aria-disabled={currentPage >= totalPages}
            >
                <ChevronRight className="w-5 h-5" />
            </Link>
        </div>
    );
}
