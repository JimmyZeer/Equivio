import { cn } from "@/lib/utils";
import React from "react";

interface BadgeProps {
    children: React.ReactNode;
    variant?: "claimed" | "verified";
    className?: string;
}

export function Badge({ children, variant = "claimed", className }: BadgeProps) {
    const variants = {
        claimed: "bg-leather text-white",
        verified: "bg-primary-soft text-white",
    };

    return (
        <span
            className={cn(
                "inline-flex items-center px-3 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-[0.08em]",
                variants[variant],
                className
            )}
        >
            {children}
        </span>
    );
}
