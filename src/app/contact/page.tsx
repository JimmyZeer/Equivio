"use client";

import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { Button } from "@/components/ui/Button";
import { Mail, MessageCircle, Clock, MapPin } from "lucide-react";

export default function ContactPage() {
    const breadcrumbItems = [
        { label: "Accueil", href: "/" },
        { label: "Contact" },
    ];

    return (
        <div className="flex flex-col min-h-screen">
            <Header />

            <main className="flex-grow bg-neutral-offwhite pt-12 pb-32 px-6">
                <div className="max-w-7xl mx-auto space-y-16">
                    <div className="reveal">
                        <Breadcrumb items={breadcrumbItems} />
                    </div>

                    <div className="max-w-4xl space-y-6 reveal [animation-delay:100ms]">
                        <h1 className="text-4xl md:text-5xl lg:text-7xl font-extrabold text-primary leading-tight tracking-tight text-pretty">
                            Parlons de votre <span className="text-primary-soft">institution</span>
                        </h1>
                        <p className="text-lg md:text-xl text-neutral-charcoal/60 leading-relaxed text-pretty max-w-3xl">
                            Que vous soyez propriétaire cherchant des informations ou membre de la presse, notre équipe institutionnelle vous répond sous 24h.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 reveal [animation-delay:200ms]">
                        <div className="lg:col-span-1 space-y-8">
                            <div className="bg-white p-8 rounded-2xl border border-neutral-stone/30 shadow-premium space-y-6">
                                <div className="flex items-center gap-4 text-primary">
                                    <div className="bg-primary/5 p-3 rounded-xl border border-primary/10">
                                        <Mail className="w-6 h-6" />
                                    </div>
                                    <div className="space-y-0.5">
                                        <p className="text-[10px] font-bold uppercase tracking-widest text-neutral-charcoal/40">Email Institutionnel</p>
                                        <p className="font-bold text-lg">contact@equivio.fr</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4 text-primary">
                                    <div className="bg-primary/5 p-3 rounded-xl border border-primary/10">
                                        <Clock className="w-6 h-6" />
                                    </div>
                                    <div className="space-y-0.5">
                                        <p className="text-[10px] font-bold uppercase tracking-widest text-neutral-charcoal/40">Disponibilité</p>
                                        <p className="font-bold text-lg">24h / 24 — 7j / 7</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4 text-primary">
                                    <div className="bg-primary/5 p-3 rounded-xl border border-primary/10">
                                        <MapPin className="w-6 h-6" />
                                    </div>
                                    <div className="space-y-0.5">
                                        <p className="text-[10px] font-bold uppercase tracking-widest text-neutral-charcoal/40">Siège Social</p>
                                        <p className="font-bold text-lg">Deauville, Normandie</p>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-primary p-8 rounded-2xl text-white space-y-4">
                                <MessageCircle className="w-10 h-10 text-leather-light/60" />
                                <h3 className="text-xl font-bold tracking-tight">Support Praticiens</h3>
                                <p className="text-sm text-white/70 leading-relaxed">
                                    Besoin d'aide pour revendiquer votre profil ou mettre à jour vos zones d'interventions ? Connectez-vous à votre espace personnel.
                                </p>
                            </div>
                        </div>

                        <div className="lg:col-span-2 bg-white rounded-3xl border border-neutral-stone/40 shadow-premium overflow-hidden">
                            <form className="p-10 md:p-16 space-y-10">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                    <div className="space-y-4">
                                        <label className="text-[10px] font-bold uppercase tracking-[0.15em] text-neutral-charcoal/40">Nom & Prénom</label>
                                        <input type="text" className="w-full bg-neutral-offwhite border border-neutral-stone/60 rounded-xl py-4 px-6 focus:ring-1 focus:ring-primary focus:border-primary outline-none font-medium transition-all" placeholder="Ex: Jean Dupont" />
                                    </div>
                                    <div className="space-y-4">
                                        <label className="text-[10px] font-bold uppercase tracking-[0.15em] text-neutral-charcoal/40">Adresse Email</label>
                                        <input type="email" className="w-full bg-neutral-offwhite border border-neutral-stone/60 rounded-xl py-4 px-6 focus:ring-1 focus:ring-primary focus:border-primary outline-none font-medium transition-all" placeholder="jean@equivio.fr" />
                                    </div>
                                </div>
                                <div className="space-y-4">
                                    <label className="text-[10px] font-bold uppercase tracking-[0.15em] text-neutral-charcoal/40">Sujet de votre message</label>
                                    <select className="w-full bg-neutral-offwhite border border-neutral-stone/60 rounded-xl py-4 px-6 focus:ring-1 focus:ring-primary focus:border-primary outline-none font-medium transition-all">
                                        <option>Demande d'information générale</option>
                                        <option>Problème technique sur le site</option>
                                        <option>Partenariat institutionnel</option>
                                        <option>Espace praticien</option>
                                    </select>
                                </div>
                                <div className="space-y-4">
                                    <label className="text-[10px] font-bold uppercase tracking-[0.15em] text-neutral-charcoal/40">Message</label>
                                    <textarea rows={6} className="w-full bg-neutral-offwhite border border-neutral-stone/60 rounded-xl py-4 px-6 focus:ring-1 focus:ring-primary focus:border-primary outline-none font-medium transition-all" placeholder="Décrivez votre demande en quelques mots..."></textarea>
                                </div>
                                <Button className="w-full py-5 text-lg font-bold shadow-xl active:scale-[0.98] transition-all">
                                    Envoyer le message
                                </Button>
                            </form>
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
