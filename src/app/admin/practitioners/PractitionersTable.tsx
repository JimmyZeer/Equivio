'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { MapPin, Edit, Eye, MoreHorizontal, Check, Trash2, Power } from 'lucide-react';
import { PractitionerDrawer } from './PractitionerDrawer';
import { bulkUpdateStatus } from '@/app/admin/actions';

interface PractitionersTableProps {
    practitioners: any[];
}

export function PractitionersTable({ practitioners }: PractitionersTableProps) {
    const router = useRouter();
    const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
    const [editingPractitioner, setEditingPractitioner] = useState<any | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);

    const toggleSelect = (id: string) => {
        const newSet = new Set(selectedIds);
        if (newSet.has(id)) newSet.delete(id);
        else newSet.add(id);
        setSelectedIds(newSet);
    };

    const toggleSelectAll = () => {
        if (selectedIds.size === practitioners.length) {
            setSelectedIds(new Set());
        } else {
            setSelectedIds(new Set(practitioners.map(p => p.id)));
        }
    };

    const handleBulkStatus = async (status: 'active' | 'inactive') => {
        if (selectedIds.size === 0 || !confirm(`Modifier ${selectedIds.size} fiches ?`)) return;

        setIsProcessing(true);
        try {
            const result = await bulkUpdateStatus(Array.from(selectedIds), status);
            if (!result.success) {
                alert("Erreur: " + result.error);
            } else {
                setSelectedIds(new Set());
                router.refresh();
            }
        } catch (err) {
            console.error(err);
            alert("Erreur inattendue lors de la mise à jour");
        } finally {
            setIsProcessing(false);
        }
    };

    const openEdit = (p: any) => {
        setEditingPractitioner(p);
    };

    const handleExport = () => {
        const params = new URLSearchParams(window.location.search);
        window.location.href = `/api/admin/export?${params.toString()}`;
    };

    return (
        <div className="space-y-4">
            {/* Toolbar */}
            <div className="flex items-center justify-between gap-4 bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                <div className="flex items-center gap-2">
                    {selectedIds.size > 0 && (
                        <>
                            <span className="text-sm font-medium text-gray-700">{selectedIds.size} sélectionné(s)</span>
                            <div className="h-4 w-px bg-gray-300 mx-2" />
                            <button
                                onClick={() => handleBulkAction('active')}
                                disabled={isProcessing}
                                className="text-sm text-emerald-600 hover:text-emerald-700 font-medium flex items-center gap-1"
                            >
                                <Check className="w-4 h-4" /> Activer
                            </button>
                            <button
                                onClick={() => handleBulkAction('inactive')}
                                disabled={isProcessing}
                                className="text-sm text-gray-500 hover:text-gray-700 font-medium flex items-center gap-1"
                            >
                                <Power className="w-4 h-4" /> Désactiver
                            </button>
                        </>
                    )}
                </div>

                <div className="flex items-center gap-3">
                    <button
                        onClick={handleExport}
                        className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-2 transition-colors"
                    >
                        <svg className="w-4 h-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                        </svg>
                        Exporter CSV
                    </button>
                    {/* Could add columns toggle here later */}
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm text-gray-600">
                        <thead className="bg-gray-50 text-gray-900 font-bold uppercase text-xs tracking-wider border-b border-gray-200">
                            <tr>
                                <th className="p-4 w-10">
                                    <input
                                        type="checkbox"
                                        checked={practitioners.length > 0 && selectedIds.size === practitioners.length}
                                        onChange={toggleSelectAll}
                                        className="rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
                                    />
                                </th>
                                <th className="p-4">Nom / Slug</th>
                                <th className="p-4">Spécialité</th>
                                <th className="p-4">Localisation</th>
                                <th className="p-4">Statut</th>
                                <th className="p-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {practitioners?.map((p) => {
                                const isSelected = selectedIds.has(p.id);
                                return (
                                    <tr key={p.id} className={`transition-colors ${isSelected ? 'bg-blue-50/50' : 'hover:bg-gray-50'}`}>
                                        <td className="p-4">
                                            <input
                                                type="checkbox"
                                                checked={isSelected}
                                                onChange={() => toggleSelect(p.id)}
                                                className="rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
                                            />
                                        </td>
                                        <td className="p-4">
                                            <div className="font-bold text-gray-900">{p.name}</div>
                                            <div className="text-xs text-gray-400 font-mono truncate max-w-[200px]">{p.slug_seo}</div>
                                        </td>
                                        <td className="p-4">
                                            <span className="inline-block px-2 py-1 bg-blue-50 text-blue-700 rounded text-xs font-semibold">
                                                {p.specialty || "N/A"}
                                            </span>
                                        </td>
                                        <td className="p-4">
                                            <div className="flex items-center gap-1.5">
                                                <MapPin className={`w-4 h-4 ${!p.lat ? 'text-orange-400' : 'text-gray-400'}`} />
                                                <span>{p.city || <span className="text-red-400 italic">Ville manquante</span>}</span>
                                            </div>
                                        </td>
                                        <td className="p-4">
                                            {p.status === 'active' ? (
                                                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-700 text-xs font-bold">
                                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                                                    Actif
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-gray-100 text-gray-600 text-xs font-bold">
                                                    Inactif
                                                </span>
                                            )}
                                        </td>
                                        <td className="p-4 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <button
                                                    onClick={() => openEdit(p)}
                                                    className="inline-flex items-center gap-1 px-3 py-1.5 bg-slate-900 text-white rounded-lg text-xs font-bold hover:bg-slate-700 transition-colors"
                                                >
                                                    <Edit className="w-3 h-3" />
                                                    Modifier
                                                </button>
                                                {p.slug_seo && (
                                                    <a
                                                        href={`/praticien/${p.slug_seo}`}
                                                        target="_blank"
                                                        className="p-1.5 text-gray-400 hover:text-blue-600 transition-colors"
                                                        title="Voir fiche publique"
                                                    >
                                                        <Eye className="w-4 h-4" />
                                                    </a>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}

                            {practitioners.length === 0 && (
                                <tr>
                                    <td colSpan={6} className="p-8 text-center text-gray-400 italic">
                                        Aucun praticien trouvé avec ces critères.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            <PractitionerDrawer
                isOpen={!!editingPractitioner}
                onClose={() => setEditingPractitioner(null)}
                practitioner={editingPractitioner}
            />
        </>
    );
}
