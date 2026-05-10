import {
    Bell,
    Hammer,
    HeartPulse,
    Pill,
    Plus,
    Stethoscope,
    Syringe,
    ChevronRight,
    Home,
    FileText,
    User,
    Sparkles,
    type LucideIcon,
} from "lucide-react";

type ScreenVariant = "home" | "soins" | "rappel";

interface IPhoneFrameProps {
    children: React.ReactNode;
    /** Tailwind width classes for the frame, e.g. "w-72" or "w-64". */
    widthClass?: string;
    /** Apply a subtle floating animation. */
    floating?: boolean;
    /** Slight tilt for visual depth (degrees). */
    tiltDeg?: number;
    /** Optional className on the outer wrapper. */
    className?: string;
}

/**
 * Pure-CSS iPhone frame. No images, no JS, prints well.
 * Aspect ratio matches a current-gen iPhone (≈ 9:19.5).
 */
function IPhoneFrame({
    children,
    widthClass = "w-72",
    floating = false,
    tiltDeg = 0,
    className = "",
}: IPhoneFrameProps) {
    return (
        <div
            className={`relative mx-auto ${widthClass} ${className} ${floating ? "animate-float" : ""}`}
            style={{
                aspectRatio: "9 / 19.5",
                transform: tiltDeg ? `rotate(${tiltDeg}deg)` : undefined,
            }}
        >
            {/* Outer titanium / steel frame */}
            <div
                className="absolute inset-0 rounded-[3rem] p-[3px]"
                style={{
                    background:
                        "linear-gradient(145deg, #2a2a2e 0%, #4a4a52 25%, #1f1f23 50%, #4a4a52 75%, #2a2a2e 100%)",
                    boxShadow:
                        "0 30px 60px -15px rgba(0,0,0,0.35), 0 12px 24px -8px rgba(0,0,0,0.18), inset 0 0 0 1px rgba(255,255,255,0.08)",
                }}
            >
                {/* Inner glass bezel */}
                <div
                    className="relative h-full w-full rounded-[2.85rem] overflow-hidden"
                    style={{
                        background: "linear-gradient(180deg, #f7f6f3 0%, #fafaf8 100%)",
                    }}
                >
                    {/* Dynamic Island */}
                    <div className="absolute top-[10px] left-1/2 -translate-x-1/2 h-[26px] w-[100px] bg-black rounded-full z-30 shadow-[inset_0_1px_2px_rgba(255,255,255,0.06)]" />

                    {/* Status bar */}
                    <div className="absolute top-0 inset-x-0 h-[44px] flex items-center justify-between px-7 z-20 text-[10px] font-semibold text-neutral-charcoal">
                        <span className="tracking-tight">9:41</span>
                        <span className="flex items-center gap-[3px]">
                            {/* signal */}
                            <span className="flex items-end gap-[1.5px] h-[8px]">
                                <span className="w-[2px] h-[3px] rounded-[0.5px] bg-neutral-charcoal" />
                                <span className="w-[2px] h-[5px] rounded-[0.5px] bg-neutral-charcoal" />
                                <span className="w-[2px] h-[6.5px] rounded-[0.5px] bg-neutral-charcoal" />
                                <span className="w-[2px] h-[8px] rounded-[0.5px] bg-neutral-charcoal" />
                            </span>
                            {/* wifi */}
                            <svg width="11" height="9" viewBox="0 0 11 9" fill="currentColor" aria-hidden>
                                <path d="M5.5 0C7.7 0 9.7 0.8 11 2L9.6 3.4C8.5 2.5 7 2 5.5 2S2.5 2.5 1.4 3.4L0 2C1.3 0.8 3.3 0 5.5 0Z M5.5 4C6.6 4 7.7 4.4 8.5 5.1L7.1 6.5C6.7 6.2 6.1 6 5.5 6S4.3 6.2 3.9 6.5L2.5 5.1C3.3 4.4 4.4 4 5.5 4Z M5.5 7.5L4.2 8.8C4.5 9 5 9 5.5 9S6.5 9 6.8 8.8L5.5 7.5Z" />
                            </svg>
                            {/* battery */}
                            <span className="relative inline-flex items-center">
                                <span className="w-[20px] h-[10px] rounded-[2px] border border-neutral-charcoal/80 p-[1px]">
                                    <span className="block h-full w-[80%] rounded-[0.5px] bg-neutral-charcoal" />
                                </span>
                                <span className="absolute -right-[2px] top-1/2 -translate-y-1/2 w-[1.5px] h-[4px] rounded-r-[1px] bg-neutral-charcoal/80" />
                            </span>
                        </span>
                    </div>

                    {/* Screen content */}
                    <div className="absolute inset-0 pt-[44px] pb-[28px] overflow-hidden">
                        {children}
                    </div>

                    {/* Home indicator */}
                    <div className="absolute bottom-[8px] left-1/2 -translate-x-1/2 w-[100px] h-[4px] bg-neutral-charcoal rounded-full z-30 opacity-90" />

                    {/* Subtle reflective gradient overlay */}
                    <div
                        className="absolute inset-0 pointer-events-none rounded-[2.85rem]"
                        style={{
                            background:
                                "linear-gradient(135deg, rgba(255,255,255,0.18) 0%, rgba(255,255,255,0) 30%, rgba(255,255,255,0) 70%, rgba(255,255,255,0.04) 100%)",
                        }}
                    />
                </div>
            </div>
        </div>
    );
}

/* ---------------------------------- Cards --------------------------------- */

function HorseAvatar({ initial = "V", color = "leather" }: { initial?: string; color?: "leather" | "primary" }) {
    const palette =
        color === "leather"
            ? "from-leather to-leather/70 text-white"
            : "from-primary to-primary-soft text-white";
    return (
        <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${palette} flex items-center justify-center font-bold text-base shadow-md ring-2 ring-white`}>
            {initial}
        </div>
    );
}

function ReminderRow({
    icon: Icon,
    title,
    when,
    accent,
}: {
    icon: LucideIcon;
    title: string;
    when: string;
    accent: "primary" | "leather" | "warning";
}) {
    const accents = {
        primary: { bg: "bg-primary/10", text: "text-primary" },
        leather: { bg: "bg-leather/15", text: "text-leather" },
        warning: { bg: "bg-amber-500/15", text: "text-amber-700" },
    } as const;
    const c = accents[accent];
    return (
        <div className="flex items-center gap-3 bg-white rounded-xl px-3 py-2.5 shadow-[0_1px_3px_rgba(0,0,0,0.05)]">
            <div className={`w-8 h-8 rounded-lg ${c.bg} flex items-center justify-center flex-shrink-0`}>
                <Icon className={`w-4 h-4 ${c.text}`} strokeWidth={2.2} />
            </div>
            <div className="flex-1 min-w-0">
                <p className="text-[12px] font-semibold text-neutral-charcoal leading-tight truncate">{title}</p>
                <p className="text-[10px] text-neutral-charcoal/55 leading-tight mt-0.5">{when}</p>
            </div>
            <ChevronRight className="w-3.5 h-3.5 text-neutral-charcoal/30 flex-shrink-0" />
        </div>
    );
}

/* --------------------------------- Screens -------------------------------- */

function HomeScreenContent() {
    return (
        <div className="h-full flex flex-col px-4 pt-2 pb-2">
            {/* Greeting */}
            <div className="mb-3">
                <p className="text-[10px] font-medium text-neutral-charcoal/50 uppercase tracking-wider">Lundi 12 mai</p>
                <h2 className="text-[18px] font-bold text-primary leading-tight mt-0.5">Salut Marie</h2>
            </div>

            {/* Horse card hero */}
            <div className="rounded-2xl p-3 bg-gradient-to-br from-primary to-primary-soft text-white shadow-[0_8px_20px_-6px_rgba(31,61,43,0.4)] relative overflow-hidden mb-3">
                <div className="absolute -top-6 -right-6 w-20 h-20 rounded-full bg-white/10 blur-xl pointer-events-none" />
                <div className="flex items-center gap-3 relative">
                    <HorseAvatar initial="V" color="leather" />
                    <div className="flex-1 min-w-0">
                        <p className="font-bold text-[14px] leading-tight">Vesper</p>
                        <p className="text-[10px] text-white/75 leading-tight mt-0.5">Pure Race Espagnole · 8 ans</p>
                    </div>
                </div>
                <div className="grid grid-cols-3 gap-2 mt-3 relative">
                    <div className="bg-white/10 backdrop-blur-sm rounded-lg px-2 py-1.5 text-center">
                        <p className="text-[9px] text-white/70 uppercase tracking-wider">Soins</p>
                        <p className="text-[14px] font-bold leading-none mt-0.5">14</p>
                    </div>
                    <div className="bg-white/10 backdrop-blur-sm rounded-lg px-2 py-1.5 text-center">
                        <p className="text-[9px] text-white/70 uppercase tracking-wider">Rappels</p>
                        <p className="text-[14px] font-bold leading-none mt-0.5">3</p>
                    </div>
                    <div className="bg-white/10 backdrop-blur-sm rounded-lg px-2 py-1.5 text-center">
                        <p className="text-[9px] text-white/70 uppercase tracking-wider">Pros</p>
                        <p className="text-[14px] font-bold leading-none mt-0.5">5</p>
                    </div>
                </div>
            </div>

            {/* Reminders */}
            <div className="flex items-center justify-between mb-2">
                <h3 className="text-[12px] font-bold text-primary">À venir</h3>
                <span className="text-[10px] text-primary-soft font-semibold">Voir tout</span>
            </div>
            <div className="space-y-1.5 flex-1">
                <ReminderRow icon={Syringe} title="Vaccin grippe + tétanos" when="Dans 12 jours · Dr Lemoine" accent="leather" />
                <ReminderRow icon={Hammer} title="Ferrure complète" when="Dans 18 jours · J. Marchal" accent="primary" />
                <ReminderRow icon={Pill} title="Vermifuge printemps" when="Dans 3 semaines" accent="warning" />
            </div>

            {/* Bottom tab bar */}
            <BottomTabBar active="home" />
        </div>
    );
}

function HealthListContent() {
    return (
        <div className="h-full flex flex-col px-4 pt-2 pb-2">
            <div className="flex items-center justify-between mb-3">
                <h2 className="text-[18px] font-bold text-primary leading-tight">Soins de Vesper</h2>
                <div className="w-7 h-7 rounded-full bg-primary flex items-center justify-center shadow-[0_2px_6px_rgba(31,61,43,0.3)]">
                    <Plus className="w-4 h-4 text-white" strokeWidth={2.5} />
                </div>
            </div>

            <div className="flex gap-1.5 mb-3">
                {["Tout", "Véto", "Ostéo", "Maréchal"].map((tag, i) => (
                    <span
                        key={tag}
                        className={`text-[10px] font-semibold px-2.5 py-1 rounded-full ${i === 0
                            ? "bg-primary text-white"
                            : "bg-neutral-stone/60 text-neutral-charcoal/70"
                            }`}
                    >
                        {tag}
                    </span>
                ))}
            </div>

            <div className="space-y-2 flex-1 overflow-hidden">
                <SoinHistoryCard
                    icon={HeartPulse}
                    title="Séance d'ostéopathie"
                    by="Léa Poteloin"
                    date="2 mai 2026"
                    note="RAS, légère tension lombaire."
                    accent="primary"
                />
                <SoinHistoryCard
                    icon={Hammer}
                    title="Ferrure 4 pieds"
                    by="J. Marchal"
                    date="18 avril 2026"
                    note="Antérieurs neufs, postérieurs rappel."
                    accent="leather"
                />
                <SoinHistoryCard
                    icon={Stethoscope}
                    title="Visite véto annuelle"
                    by="Dr Lemoine"
                    date="3 avril 2026"
                    note="Bilan ok. Vermifuge prescrit."
                    accent="primary"
                />
            </div>

            <BottomTabBar active="soins" />
        </div>
    );
}

function ReminderScreenContent() {
    return (
        <div className="h-full relative bg-gradient-to-b from-neutral-offwhite via-neutral-offwhite to-leather-light/30">
            {/* Subtle gradient orbs */}
            <div className="absolute -top-10 -left-10 w-32 h-32 rounded-full bg-leather/10 blur-2xl pointer-events-none" />
            <div className="absolute top-1/3 -right-10 w-32 h-32 rounded-full bg-primary/10 blur-2xl pointer-events-none" />

            <div className="relative h-full flex flex-col px-4 pt-2 pb-2">
                <div className="text-center mt-3 mb-4">
                    <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-leather/15 mb-3">
                        <Bell className="w-7 h-7 text-leather" strokeWidth={2} />
                    </div>
                    <p className="text-[10px] font-bold text-leather uppercase tracking-wider">Rappel</p>
                    <h2 className="text-[16px] font-bold text-primary leading-tight mt-1 px-2">
                        Vaccin grippe à prévoir
                    </h2>
                    <p className="text-[11px] text-neutral-charcoal/60 mt-1.5 px-3 leading-relaxed">
                        Le rappel grippe + tétanos arrive dans <span className="font-semibold text-leather">12 jours</span>. Tu veux qu'on prévienne ton véto ?
                    </p>
                </div>

                <div className="bg-white rounded-2xl p-3 shadow-[0_4px_12px_rgba(0,0,0,0.06)] mb-3">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                            <Stethoscope className="w-5 h-5 text-primary" strokeWidth={2} />
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="font-bold text-[12px] text-primary leading-tight">Dr Caroline Lemoine</p>
                            <p className="text-[10px] text-neutral-charcoal/55 leading-tight mt-0.5">Vétérinaire équin · Lisieux</p>
                        </div>
                    </div>
                </div>

                <button className="bg-primary text-white text-[12px] font-bold py-3 rounded-xl shadow-[0_4px_12px_rgba(31,61,43,0.3)] mb-2">
                    Demander un rendez-vous
                </button>
                <button className="bg-white text-primary text-[12px] font-semibold py-3 rounded-xl shadow-[0_1px_3px_rgba(0,0,0,0.06)] border border-neutral-stone/40">
                    Reporter
                </button>

                <div className="flex-1" />

                <BottomTabBar active="rappels" />
            </div>
        </div>
    );
}

/* -------------------------------- Sub-bits -------------------------------- */

function SoinHistoryCard({
    icon: Icon,
    title,
    by,
    date,
    note,
    accent,
}: {
    icon: LucideIcon;
    title: string;
    by: string;
    date: string;
    note: string;
    accent: "primary" | "leather";
}) {
    const c =
        accent === "primary"
            ? { bg: "bg-primary/10", text: "text-primary" }
            : { bg: "bg-leather/15", text: "text-leather" };
    return (
        <div className="bg-white rounded-xl p-2.5 shadow-[0_1px_3px_rgba(0,0,0,0.05)]">
            <div className="flex items-start gap-2.5">
                <div className={`w-7 h-7 rounded-lg ${c.bg} flex items-center justify-center flex-shrink-0`}>
                    <Icon className={`w-3.5 h-3.5 ${c.text}`} strokeWidth={2.2} />
                </div>
                <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                        <p className="text-[11.5px] font-bold text-primary leading-tight truncate">{title}</p>
                        <p className="text-[9px] text-neutral-charcoal/50 flex-shrink-0">{date}</p>
                    </div>
                    <p className="text-[10px] text-neutral-charcoal/60 leading-tight mt-0.5">par {by}</p>
                    <p className="text-[10px] text-neutral-charcoal/70 leading-snug mt-1 line-clamp-2">{note}</p>
                </div>
            </div>
        </div>
    );
}

function BottomTabBar({ active }: { active: "home" | "soins" | "rappels" | "profil" }) {
    const tabs: Array<{ key: typeof active; icon: LucideIcon; label: string }> = [
        { key: "home", icon: Home, label: "Accueil" },
        { key: "soins", icon: FileText, label: "Soins" },
        { key: "rappels", icon: Bell, label: "Rappels" },
        { key: "profil", icon: User, label: "Profil" },
    ];
    return (
        <div className="flex items-center justify-around mt-3 -mx-4 px-2 pt-1.5 border-t border-neutral-stone/40">
            {tabs.map((t) => {
                const isActive = t.key === active;
                return (
                    <div key={t.key} className="flex flex-col items-center gap-0.5 py-1">
                        <t.icon
                            className={`w-4 h-4 ${isActive ? "text-primary" : "text-neutral-charcoal/35"}`}
                            strokeWidth={isActive ? 2.5 : 2}
                        />
                        <span className={`text-[8px] font-semibold ${isActive ? "text-primary" : "text-neutral-charcoal/40"}`}>
                            {t.label}
                        </span>
                    </div>
                );
            })}
        </div>
    );
}

/* ---------------------------- Public composers ---------------------------- */

export function AppMockup({
    variant = "home",
    widthClass = "w-72",
    floating = false,
    tiltDeg = 0,
    className = "",
}: {
    variant?: ScreenVariant;
    widthClass?: string;
    floating?: boolean;
    tiltDeg?: number;
    className?: string;
}) {
    return (
        <IPhoneFrame widthClass={widthClass} floating={floating} tiltDeg={tiltDeg} className={className}>
            {variant === "home" && <HomeScreenContent />}
            {variant === "soins" && <HealthListContent />}
            {variant === "rappel" && <ReminderScreenContent />}
        </IPhoneFrame>
    );
}

/**
 * Three phone mockups arranged with depth (centre slightly forward).
 * Mobile: stacks the screens horizontally with snap-scroll.
 */
export function AppMockupTrio() {
    return (
        <div className="relative">
            {/* Desktop: side-by-side with depth */}
            <div className="hidden md:flex items-end justify-center gap-6 lg:gap-10">
                <div className="translate-y-6 opacity-90">
                    <AppMockup variant="soins" widthClass="w-56 lg:w-60" tiltDeg={-3} />
                </div>
                <div className="z-10">
                    <AppMockup variant="home" widthClass="w-64 lg:w-72" floating />
                </div>
                <div className="translate-y-6 opacity-90">
                    <AppMockup variant="rappel" widthClass="w-56 lg:w-60" tiltDeg={3} />
                </div>
            </div>

            {/* Mobile: snap-scroll carousel */}
            <div className="md:hidden -mx-5 px-5 overflow-x-auto snap-x snap-mandatory scroll-smooth">
                <div className="flex gap-5 pb-2">
                    <div className="snap-center flex-shrink-0">
                        <AppMockup variant="home" widthClass="w-60" />
                    </div>
                    <div className="snap-center flex-shrink-0">
                        <AppMockup variant="soins" widthClass="w-60" />
                    </div>
                    <div className="snap-center flex-shrink-0">
                        <AppMockup variant="rappel" widthClass="w-60" />
                    </div>
                </div>
            </div>
        </div>
    );
}

/**
 * Floating sparkle decoration around a phone mockup — for hero punch.
 */
export function MockupSparkles({ className = "" }: { className?: string }) {
    return (
        <div className={`absolute inset-0 pointer-events-none ${className}`} aria-hidden>
            <Sparkles className="absolute top-4 -left-2 w-5 h-5 text-leather/40 animate-pulse-glow" />
            <Sparkles className="absolute top-1/2 -right-3 w-4 h-4 text-primary/40 animate-pulse-glow [animation-delay:1s]" />
            <Sparkles className="absolute bottom-10 left-2 w-3.5 h-3.5 text-primary-soft/40 animate-pulse-glow [animation-delay:2s]" />
        </div>
    );
}

