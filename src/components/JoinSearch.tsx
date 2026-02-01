'use client';

import { useState } from 'react';
import { Search, ChevronRight, UserPlus } from 'lucide-react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';

export function JoinSearch() {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [hasSearched, setHasSearched] = useState(false);

    const handleSearch = async (term: string) => {
        setQuery(term);
        if (term.length < 3) {
            setResults([]);
            return;
        }

        setLoading(true);
        const { data } = await supabase
            .from('practitioners')
            .select('id, name, city, specialty, slug_seo')
            .ilike('name', `%${term}%`)
            .eq('status', 'active')
            .limit(5);

        setResults(data || []);
        setLoading(false);
        setHasSearched(true);
    };

    return (
        <div className="w-full max-w-xl mx-auto space-y-4">
            <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                    type="text"
                    placeholder="Tapez votre nom..."
                    className="w-full pl-12 pr-4 py-4 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all shadow-sm"
                    value={query}
                    onChange={(e) => handleSearch(e.target.value)}
                />
            </div>

            {query.length >= 3 && (
                <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden animate-in fade-in slide-in-from-top-2">
                    {loading ? (
                        <div className="p-4 text-center text-gray-400">Recherche...</div>
                    ) : results.length > 0 ? (
                        <ul className="divide-y divide-gray-50">
                            {results.map((practitioner) => (
                                <li key={practitioner.id}>
                                    <Link
                                        href={`/praticien/${practitioner.slug_seo}`}
                                        className="flex items-center justify-between p-4 hover:bg-gray-50 transition-colors group"
                                    >
                                        <div>
                                            <p className="font-bold text-gray-900">{practitioner.name}</p>
                                            <p className="text-sm text-gray-500">{practitioner.specialty} • {practitioner.city}</p>
                                        </div>
                                        <div className="flex items-center gap-2 text-primary font-bold text-sm bg-primary/5 px-3 py-1.5 rounded-full group-hover:bg-primary/10 transition-colors">
                                            C'est moi
                                            <ChevronRight className="w-4 h-4" />
                                        </div>
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <div className="p-6 text-center space-y-3">
                            <p className="text-gray-500">Aucun praticien trouvé pour "{query}"</p>
                        </div>
                    )}

                    {/* Always show the create option if searched */}
                    <div className="p-4 bg-gray-50 border-t border-gray-100">
                        <Link
                            href="/rejoindre/nouveau"
                            className="flex items-center justify-between p-3 rounded-lg border-2 border-dashed border-gray-300 hover:border-primary hover:bg-white transition-all group"
                        >
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                                    <UserPlus className="w-5 h-5 text-gray-400 group-hover:text-primary" />
                                </div>
                                <div className="text-left">
                                    <p className="font-bold text-gray-900">Je ne suis pas dans la liste</p>
                                    <p className="text-xs text-gray-500">Créer ma fiche gratuitement</p>
                                </div>
                            </div>
                            <ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-primary" />
                        </Link>
                    </div>
                </div>
            )}
        </div>
    );
}
