'use client';

import { useState } from 'react';
import { previewImport, publishImport, ImportRow } from './actions';
import { Upload, FileUp, AlertTriangle, CheckCircle, XCircle, HelpCircle, Save, Download } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function ImportPage() {
    const router = useRouter();
    const [step, setStep] = useState<'upload' | 'preview' | 'result'>('upload');
    const [rows, setRows] = useState<ImportRow[]>([]);
    const [loading, setLoading] = useState(false);
    const [summary, setSummary] = useState<any>(null);

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files?.length) return;

        setLoading(true);
        const formData = new FormData();
        formData.append('file', e.target.files[0]);

        try {
            const result = await previewImport(formData);
            if (result.success && result.rows) {
                setRows(result.rows);
                setStep('preview');
            } else {
                alert(result.error || "Erreur lors de l'analyse");
            }
        } catch (err: any) {
            console.error(err);
            alert(err.message || "Erreur système");
        } finally {
            setLoading(false);
        }
    };

    const handlePublish = async () => {
        if (!confirm("Voulez-vous vraiment publier ces données ? Cela modifiera la base de données.")) return;

        setLoading(true);
        try {
            // Filter out errors/reviews for publish
            const toPublish = rows.filter(r => r.status === 'OK' || r.status === 'UPDATE' || r.status === 'WARNING');

            const result = await publishImport(toPublish);

            if (result.success) {
                setSummary(result.summary);
                setStep('result');
            } else {
                alert("Erreur lors de la publication");
            }
        } catch (err) {
            alert("Erreur système");
        } finally {
            setLoading(false);
        }
    };

    const counts = {
        ok: rows.filter(r => r.status === 'OK').length,
        update: rows.filter(r => r.status === 'UPDATE').length,
        warning: rows.filter(r => r.status === 'WARNING').length,
        error: rows.filter(r => r.status === 'ERROR').length,
        review: rows.filter(r => r.status === 'NEEDS_REVIEW').length,
    };

    const StatusBadge = ({ status }: { status: ImportRow['status'] }) => {
        switch (status) {
            case 'OK': return <span className="bg-emerald-100 text-emerald-800 px-2 py-1 rounded text-xs font-bold flex items-center gap-1"><CheckCircle className="w-3 h-3" /> Nouveau</span>;
            case 'UPDATE': return <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs font-bold flex items-center gap-1"><Save className="w-3 h-3" /> Update</span>;
            case 'WARNING': return <span className="bg-orange-100 text-orange-800 px-2 py-1 rounded text-xs font-bold flex items-center gap-1"><AlertTriangle className="w-3 h-3" /> Warning</span>;
            case 'ERROR': return <span className="bg-red-100 text-red-800 px-2 py-1 rounded text-xs font-bold flex items-center gap-1"><XCircle className="w-3 h-3" /> Erreur</span>;
            case 'NEEDS_REVIEW': return <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded text-xs font-bold flex items-center gap-1"><HelpCircle className="w-3 h-3" /> A vérifier</span>;
        }
    };

    return (
        <div className="space-y-6 max-w-6xl mx-auto">
            <header className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Import CSV (Masse)</h1>
                    <p className="text-gray-500">Mise à jour et création sécurisée de praticiens</p>
                </div>
                {step === 'preview' && (
                    <div className="flex gap-2">
                        <button onClick={() => setStep('upload')} className="px-4 py-2 text-sm border rounded hover:bg-gray-50">Annuler</button>
                        <button
                            onClick={handlePublish}
                            disabled={loading || (counts.ok + counts.update + counts.warning === 0)}
                            className="px-4 py-2 text-sm bg-emerald-600 text-white rounded font-bold hover:bg-emerald-700 disabled:opacity-50"
                        >
                            {loading ? "Traitement..." : `Publier ${counts.ok + counts.update + counts.warning} fiches`}
                        </button>
                    </div>
                )}
            </header>

            {step === 'upload' && (
                <div className="bg-white p-12 rounded-xl border-2 border-dashed border-gray-300 flex flex-col items-center justify-center gap-4 hover:border-emerald-500 transition-colors">
                    <div className="p-4 bg-emerald-50 rounded-full text-emerald-600">
                        <Upload className="w-8 h-8" />
                    </div>
                    <div className="text-center">
                        <p className="font-bold text-lg text-gray-900">Déposer le fichier CSV ici</p>
                        <p className="text-sm text-gray-500">ou cliquer pour sélectionner</p>
                        <div className="mt-6 p-4 bg-gray-50 rounded-lg text-left max-w-lg mx-auto border border-gray-200">
                            <p className="text-xs font-bold text-gray-700 mb-2 uppercase tracking-wide">Colonnes attendues (en-têtes) :</p>
                            <code className="text-xs text-emerald-700 font-mono break-words leading-relaxed">
                                name, specialty, address_full, city, lat, lng, phone_norm, website, profile_url, status
                            </code>
                            <p className="text-[10px] text-gray-500 mt-2 italic">
                                * `name` et `specialty` sont obligatoires. `lat`/`lng` recommandés pour la carte.
                            </p>
                        </div>
                    </div>
                    <input
                        type="file"
                        accept=".csv"
                        className="absolute inset-0 opacity-0 cursor-pointer"
                        onChange={handleFileUpload}
                    />
                    {loading && <p className="text-sm font-bold text-emerald-600 animate-pulse">Analyse en cours...</p>}
                </div>
            )}

            {step === 'preview' && (
                <div className="space-y-6">
                    {/* Stats */}
                    <div className="grid grid-cols-5 gap-4">
                        <div className="bg-emerald-50 p-4 rounded-lg border border-emerald-100">
                            <span className="block text-2xl font-bold text-emerald-700">{counts.ok}</span>
                            <span className="text-xs font-bold text-emerald-600">NOUVEAUX</span>
                        </div>
                        <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                            <span className="block text-2xl font-bold text-blue-700">{counts.update}</span>
                            <span className="text-xs font-bold text-blue-600">MISES À JOUR</span>
                        </div>
                        <div className="bg-orange-50 p-4 rounded-lg border border-orange-100">
                            <span className="block text-2xl font-bold text-orange-700">{counts.warning}</span>
                            <span className="text-xs font-bold text-orange-600">WARNINGS</span>
                        </div>
                        <div className="bg-red-50 p-4 rounded-lg border border-red-100">
                            <span className="block text-2xl font-bold text-red-700">{counts.error}</span>
                            <span className="text-xs font-bold text-red-600">ERREURS</span>
                        </div>
                        <div className="bg-purple-50 p-4 rounded-lg border border-purple-100">
                            <span className="block text-2xl font-bold text-purple-700">{counts.review}</span>
                            <span className="text-xs font-bold text-purple-600">À VÉRIFIER</span>
                        </div>
                    </div>

                    {/* Table */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                        <table className="w-full text-left text-sm">
                            <thead className="bg-gray-50 text-xs uppercase font-bold text-gray-500">
                                <tr>
                                    <th className="p-4">Statut</th>
                                    <th className="p-4">Raison</th>
                                    <th className="p-4">Nom</th>
                                    <th className="p-4">Spécialité</th>
                                    <th className="p-4">Ville</th>
                                    <th className="p-4">Données (Aperçu)</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {rows.slice(0, 100).map((row, i) => (
                                    <tr key={i} className="hover:bg-gray-50">
                                        <td className="p-4"><StatusBadge status={row.status} /></td>
                                        <td className="p-4 text-xs text-gray-600 max-w-[200px]">{row.reasons.join(', ')}</td>
                                        <td className="p-4 font-bold">{row.data.name}</td>
                                        <td className="p-4">{row.data.specialty}</td>
                                        <td className="p-4">{row.data.city}</td>
                                        <td className="p-4 text-xs font-mono text-gray-500">
                                            {row.data.phone_norm && <div>Tel: {row.data.phone_norm}</div>}
                                            {row.data.profile_url && <div className="truncate max-w-[150px]">Url: {row.data.profile_url}</div>}
                                        </td>
                                    </tr>
                                ))}
                                {rows.length > 100 && (
                                    <tr>
                                        <td colSpan={6} className="p-4 text-center text-gray-500 italic">
                                            ... et {rows.length - 100} autres lignes non affichées
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {step === 'result' && summary && (
                <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-200 text-center max-w-lg mx-auto space-y-6">
                    <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                        <CheckCircle className="w-8 h-8" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900">Import Terminé !</h2>

                    <div className="grid grid-cols-2 gap-4 text-left bg-gray-50 p-6 rounded-lg">
                        <div>
                            <span className="block text-sm text-gray-500">Créés</span>
                            <span className="text-xl font-bold text-emerald-600">+{summary.inserted}</span>
                        </div>
                        <div>
                            <span className="block text-sm text-gray-500">Mis à jour</span>
                            <span className="text-xl font-bold text-blue-600">~{summary.updated}</span>
                        </div>
                        <div>
                            <span className="block text-sm text-gray-500">Ignorés (Erreurs)</span>
                            <span className="text-xl font-bold text-red-600">{summary.errors}</span>
                        </div>
                        <div>
                            <span className="block text-sm text-gray-500">Non traités</span>
                            <span className="text-xl font-bold text-gray-600">{summary.skipped}</span>
                        </div>

                        {summary.errors > 0 && summary.errorDetails && summary.errorDetails.length > 0 && (
                            <div className="bg-red-50 p-4 rounded-lg border border-red-100 text-left max-h-60 overflow-y-auto">
                                <h3 className="text-red-800 font-bold text-sm mb-2 flex items-center gap-2">
                                    <AlertTriangle className="w-4 h-4" /> Détail des erreurs
                                </h3>
                                <ul className="space-y-1">
                                    {summary.errorDetails.map((err: string, idx: number) => (
                                        <li key={idx} className="text-xs text-red-700 font-mono border-b border-red-100 pb-1 last:border-0">
                                            {err}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>

                    <button
                        onClick={() => router.push('/admin/practitioners')}
                        className="w-full py-3 bg-gray-900 text-white rounded-lg font-bold hover:bg-gray-800"
                    >
                        Retour aux Praticiens
                    </button>
                    <button
                        onClick={() => { setStep('upload'); setRows([]); setSummary(null); }}
                        className="w-full py-2 text-gray-500 hover:text-gray-900 text-sm"
                    >
                        Nouvel Import
                    </button>
                </div>
            )}
        </div>
    );
}
