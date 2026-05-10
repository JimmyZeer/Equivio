"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, CheckCircle2, User, Stethoscope } from "lucide-react";
import { submitEarlyAccess } from "@/app/carnet/actions";

const PRO_SPECIALTIES = [
    "Vétérinaire équin",
    "Ostéopathe équin",
    "Ostéopathe animalier",
    "Maréchal-ferrant",
    "Pareur",
    "Dentiste équin",
    "Comportementaliste",
    "Saddle fitter",
    "Bit fitter",
    "Nutritionniste",
    "Shiatsu",
    "Kinésithérapeute équin",
    "Autre",
];

interface Props {
    /** Optional override for the post-signup destination. */
    redirectTo?: string;
    /** Pre-fill the role toggle. */
    defaultRole?: "owner" | "pro";
    /** Identifier of the spot the form was placed at (hero, footer, etc.). */
    placement?: string;
    /** Compact variant for footer/dense placements. */
    compact?: boolean;
}

export function EmailCaptureForm({
    redirectTo = "/carnet/merci",
    defaultRole = "owner",
    placement = "hero",
    compact = false,
}: Props) {
    const router = useRouter();
    const [isPending, startTransition] = useTransition();

    const [role, setRole] = useState<"owner" | "pro">(defaultRole);
    const [email, setEmail] = useState("");
    const [horseCount, setHorseCount] = useState("");
    const [specialty, setSpecialty] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [errorField, setErrorField] = useState<string | null>(null);

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError(null);
        setErrorField(null);

        const formData = new FormData(e.currentTarget);
        formData.set("role", role);
        formData.set("source", placement);

        // Read UTM params at submit time from the live URL —
        // avoids the Next.js useSearchParams() Suspense requirement.
        if (typeof window !== "undefined") {
            const params = new URLSearchParams(window.location.search);
            const utmSource = params.get("utm_source");
            const utmMedium = params.get("utm_medium");
            const utmCampaign = params.get("utm_campaign");
            if (utmSource) formData.set("utm_source", utmSource);
            if (utmMedium) formData.set("utm_medium", utmMedium);
            if (utmCampaign) formData.set("utm_campaign", utmCampaign);
        }

        startTransition(async () => {
            const result = await submitEarlyAccess(formData);
            if (result.success) {
                router.push(redirectTo);
            } else {
                setError(result.error);
                setErrorField(result.field || null);
            }
        });
    };

    return (
        <form
            onSubmit={handleSubmit}
            className={`space-y-4 ${compact ? "" : "max-w-md mx-auto"}`}
            noValidate
        >
            {/* Role toggle — segmented control style, large touch targets */}
            <div
                role="radiogroup"
                aria-label="Je suis"
                className="grid grid-cols-2 gap-2 p-1 bg-neutral-stone/40 rounded-2xl"
            >
                <button
                    type="button"
                    role="radio"
                    aria-checked={role === "owner"}
                    onClick={() => setRole("owner")}
                    className={`flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold transition-all press-effect min-h-[48px] ${
                        role === "owner"
                            ? "bg-white text-primary shadow-card-rest"
                            : "text-neutral-charcoal/60 hover:text-primary"
                    }`}
                >
                    <User className="w-4 h-4" />
                    Propriétaire
                </button>
                <button
                    type="button"
                    role="radio"
                    aria-checked={role === "pro"}
                    onClick={() => setRole("pro")}
                    className={`flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold transition-all press-effect min-h-[48px] ${
                        role === "pro"
                            ? "bg-white text-primary shadow-card-rest"
                            : "text-neutral-charcoal/60 hover:text-primary"
                    }`}
                >
                    <Stethoscope className="w-4 h-4" />
                    Professionnel
                </button>
            </div>

            {/* Email */}
            <div>
                <label htmlFor={`email-${placement}`} className="sr-only">
                    Adresse email
                </label>
                <input
                    id={`email-${placement}`}
                    name="email"
                    type="email"
                    inputMode="email"
                    autoComplete="email"
                    required
                    placeholder="ton.email@exemple.fr"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    aria-invalid={errorField === "email"}
                    className={`w-full px-4 py-4 text-base rounded-xl bg-white border-2 transition-colors min-h-[52px] ${
                        errorField === "email"
                            ? "border-red-300 focus:border-red-500"
                            : "border-neutral-stone focus:border-primary"
                    } focus:outline-none focus:ring-2 focus:ring-primary/20`}
                />
            </div>

            {/* Conditional: owner = horse count, pro = specialty */}
            {role === "owner" ? (
                <div>
                    <label htmlFor={`horse-count-${placement}`} className="sr-only">
                        Combien de chevaux
                    </label>
                    <input
                        id={`horse-count-${placement}`}
                        name="horse_count"
                        type="number"
                        inputMode="numeric"
                        min={1}
                        max={200}
                        placeholder="Combien de chevaux ? (optionnel)"
                        value={horseCount}
                        onChange={(e) => setHorseCount(e.target.value)}
                        className="w-full px-4 py-4 text-base rounded-xl bg-white border-2 border-neutral-stone focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 min-h-[52px]"
                    />
                </div>
            ) : (
                <div>
                    <label htmlFor={`specialty-${placement}`} className="sr-only">
                        Spécialité
                    </label>
                    <select
                        id={`specialty-${placement}`}
                        name="pro_specialty"
                        value={specialty}
                        onChange={(e) => setSpecialty(e.target.value)}
                        className="w-full px-4 py-4 text-base rounded-xl bg-white border-2 border-neutral-stone focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 min-h-[52px] appearance-none bg-[url('data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%2220%22 height=%2220%22 viewBox=%220 0 24 24%22 fill=%22none%22 stroke=%22%231F3D2B%22 stroke-width=%222%22 stroke-linecap=%22round%22 stroke-linejoin=%22round%22><polyline points=%226 9 12 15 18 9%22/></svg>')] bg-no-repeat bg-[right_1rem_center] pr-12"
                    >
                        <option value="">Ta spécialité (optionnel)</option>
                        {PRO_SPECIALTIES.map((s) => (
                            <option key={s} value={s}>
                                {s}
                            </option>
                        ))}
                    </select>
                </div>
            )}

            {/* Error */}
            {error && (
                <p
                    role="alert"
                    className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2"
                >
                    {error}
                </p>
            )}

            {/* Submit */}
            <button
                type="submit"
                disabled={isPending || !email}
                className="w-full inline-flex items-center justify-center gap-2 bg-primary text-white font-semibold text-base px-6 py-4 rounded-xl shadow-card-rest hover:bg-primary-soft transition-all press-effect disabled:opacity-60 disabled:cursor-not-allowed min-h-[56px]"
            >
                {isPending ? (
                    <>
                        <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                        Inscription...
                    </>
                ) : (
                    <>
                        Rejoindre les premiers
                        <ArrowRight className="w-5 h-5" />
                    </>
                )}
            </button>

            <p className="text-xs text-center text-neutral-charcoal/50 flex items-center justify-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-primary-soft" />
                Pas de spam. Désinscription en 1 clic.
            </p>
        </form>
    );
}
