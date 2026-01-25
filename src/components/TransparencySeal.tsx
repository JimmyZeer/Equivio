import { cn } from "@/lib/utils";

interface TransparencySealProps {
    className?: string;
    size?: "sm" | "md";
}

export function TransparencySeal({ className, size = "sm" }: TransparencySealProps) {
    return (
        <div className={cn("flex items-center gap-2 select-none", className)}>
            <div className={cn(
                "rounded-full border border-leather/30 flex items-center justify-center text-leather font-bold bg-leather/5",
                size === "sm" ? "w-8 h-8 text-[10px]" : "w-12 h-12 text-xs"
            )}>
                <svg viewBox="0 0 40 40" className="w-full h-full p-1.5 opacity-80" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <circle cx="20" cy="20" r="18" />
                    <path d="M12 20l5 5 11-11" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
            </div>
            <div className="flex flex-col -space-y-0.5">
                <span className="text-[10px] uppercase font-bold tracking-[0.1em] text-primary whitespace-nowrap">Source Vérifiée</span>
                <span className="text-[8px] uppercase font-bold tracking-[0.05em] text-leather/60 whitespace-nowrap">Méthodologie Equivio</span>
            </div>
        </div>
    );
}
