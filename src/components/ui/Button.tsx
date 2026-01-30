import { cn } from "@/lib/utils";
import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: "primary" | "outline" | "secondary";
    children: React.ReactNode;
}

export function Button({ variant = "primary", children, className, ...props }: ButtonProps) {
    const variants = {
        primary: "bg-primary text-white hover:bg-primary-soft shadow-card-rest transition-all duration-200 ease-in-out",
        outline: "border border-[#DADADA] text-primary-soft hover:bg-primary-soft hover:text-white transition-all duration-200 ease-in-out",
        secondary: "bg-leather text-white hover:bg-leather/90 shadow-card-rest transition-all duration-200 ease-in-out",
    };

    return (
        <button
            className={cn(
                "inline-flex items-center justify-center px-6 py-2.5 rounded-xl font-semibold text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed press-effect",
                variants[variant],
                className
            )}
            {...props}
        >
            {children}
        </button>
    );
}
