'use client';

import { useState } from 'react';
import { MapPin, Edit, Eye, MoreHorizontal, Check, Trash2, Power } from 'lucide-react';
import { PractitionerDrawer } from './PractitionerDrawer';
import { bulkUpdateStatus } from '@/app/admin/actions';

interface PractitionersTableProps {
    practitioners: any[];
}

export function PractitionersTable({ practitioners }: PractitionersTableProps) {
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
            await bulkUpdateStatus(Array.from(selectedIds), status);
            setSelectedIds(new Set()); // Clear selection
        } catch (err) {
            alert("Erreur lors de la mise à jour");
        } finally {
            setIsProcessing(false);
        }
    };

    const openEdit = (p: any) => {
        setEditingPractitioner(p);
    };

    return (
        <>
            {/* Bulk Actions Header */}
            {selectedIds.size > 0 && (
                <div className="bg-slate-900 text-white p-3 rounded-lg mb-4 flex items-center justify-between animate-in slide-in-from-top duration-200">
                    <span className="font-bold text-sm ml-2">{selectedIds.size} sélectionné(s)</span>
                    <div className="flex gap-2">
                        <button
                            onClick={() => handleBulkStatus('active')}
                            disabled={isProcessing}
                            className="flex items-center gap-1 bg-emerald-600 hover:bg-emerald-500 px-3 py-1.5 rounded text-xs font-bold transition-colors"
                        >
                            <Check className="w-3 h-3" /> Activer
                        </button>
                        <button
                            onClick={() => handleBulkStatus('inactive')}
                            disabled={isProcessing}
                            className="flex items-center gap-1 bg-gray-700 hover:bg-gray-600 px-3 py-1.5 rounded text-xs font-bold transition-colors"
                        >
                            <Power className="w-3 h-3" /> Désactiver
                        </button>
                    </div>
                </div>
            )}

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
                                                {p.job_title || "N/A"}
                                            </span>
                                        </td>
                                        <td className="p-4">
                                            <div className="flex items-center gap-1.5">
                                                <MapPin className={`w-4 h-4 ${!p.lat ? 'text-orange-400' : 'text-gray-400'}`} />
                                                <span className="truncate max-w-[150px]">{p.city || <span className="text-red-400 italic">Ville manquante</span>}</span>
                                            </div>
                                            <div className="text-xs text-gray-400 pl-5.5">{p.postcode}</div>
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
