import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { X, Save, Lock, Unlock, MapPin, Loader2, AlertTriangle, Search } from 'lucide-react';
import { updatePractitioner, createPractitioner, geocodeAddress } from '../actions';
import { Button } from '@/components/ui/Button';

interface PractitionerDrawerProps {
    isOpen: boolean;
    onClose: () => void;
    practitioner: any | null; // null = creation mode
}

export function PractitionerDrawer({ isOpen, onClose, practitioner }: PractitionerDrawerProps) {
    const router = useRouter();
    const [formData, setFormData] = useState<any>({});
    const [isSaving, setIsSaving] = useState(false);
    const [isGeocoding, setIsGeocoding] = useState(false);
    const [slugLocked, setSlugLocked] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        if (isOpen) {
            if (practitioner) {
                setFormData({ ...practitioner });
                setSlugLocked(true);
            } else {
                // Creation Mode: Reset form
                setFormData({ status: 'active', country: 'FRANCE' });
                setSlugLocked(false);
            }
            setError('');
        }
    }, [isOpen, practitioner]);

    if (!isOpen) return null;

    const isCreation = !practitioner;

    const handleChange = (field: string, value: any) => {
        setFormData((prev: any) => ({ ...prev, [field]: value }));
    };

    const handleGeocode = async () => {
        const query = formData.address_full || (formData.city ? `${formData.city} FRANCE` : '');

        if (!query) {
            setError("Veuillez remplir l'adresse ou la ville pour géocoder.");
            return;
        }

        setIsGeocoding(true);
        setError('');

        try {
            const result = await geocodeAddress(query);
            if (result.success && result.lat && result.lng) {
                setFormData((prev: any) => ({
                    ...prev,
                    lat: result.lat,
                    lng: result.lng
                }));
            } else {
                setError(result.error || "Impossible de localiser cette adresse.");
            }
        } catch (err) {
            setError("Erreur technique lors du géocodage.");
        } finally {
            setIsGeocoding(false);
        }
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        setError('');

        try {
            // Helper to parse numbers safely
            const parseNum = (v: any) => {
                if (v === '' || v === null || v === undefined) return null;
                const n = parseFloat(v);
                return isNaN(n) ? null : n;
            };

            const dataToSave = {
                name: formData.name,
                specialty: formData.specialty,
                city: formData.city,
                address_full: formData.address_full,
                lat: parseNum(formData.lat),
                lng: parseNum(formData.lng),
                phone_norm: formData.phone_norm,
                website: formData.website,
                profile_url: formData.profile_url,
                status: formData.status,
                is_verified: formData.is_verified,
                slug_seo: formData.slug_seo
            };

            let result;
            if (isCreation) {
                result = await createPractitioner(dataToSave);
            } else {
                result = await updatePractitioner(practitioner.id, dataToSave);
            }

            if (!result.success) {
                setError(result.error || 'Erreur lors de la sauvegarde');
            } else {
                onClose();
                router.refresh();
            }
        } catch (err: any) {
            setError(err.message || 'Erreur inattendue');
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex justify-end">
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" onClick={onClose} />

            {/* Drawer */}
            <div className="relative w-full max-w-md h-full bg-white shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">

                {/* Header */}
                <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-gray-50">
                    <h2 className="font-bold text-lg text-gray-900">
                        {isCreation ? "Nouveau Praticien" : "Modifier Praticien"}
                    </h2>
                    <button onClick={onClose} className="p-2 hover:bg-gray-200 rounded-full transition-colors">
                        <X className="w-5 h-5 text-gray-500" />
                    </button>
                </div>

                {/* Body */}
                <form onSubmit={handleSave} className="flex-1 overflow-y-auto p-6 space-y-8">

                    {/* Identité */}
                    <div className="space-y-4">
                        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest border-b pb-1">Identité</h3>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Nom</label>
                            <input
                                required
                                type="text"
                                value={formData.name || ''}
                                onChange={(e) => handleChange('name', e.target.value)}
                                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500 outline-none"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Spécialité</label>
                                <select
                                    value={formData.specialty || ''}
                                    onChange={(e) => handleChange('specialty', e.target.value)}
                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500 outline-none"
                                >
                                    <option value="">Sélectionner...</option>
                                    <option value="Ostéopathe animalier">Ostéopathe animalier</option>
                                    <option value="Dentisterie équine">Dentisterie équine</option>
                                    <option value="Maréchal-ferrant">Maréchal-ferrant</option>
                                    <option value="Vétérinaire équin">Vétérinaire équin</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Statut</label>
                                <select
                                    value={formData.status || 'active'}
                                    onChange={(e) => handleChange('status', e.target.value)}
                                    className={`w-full border rounded-lg px-3 py-2 text-sm outline-none font-bold ${formData.status === 'active' ? 'border-emerald-200 bg-emerald-50 text-emerald-800' : 'border-gray-300 bg-gray-50 text-gray-600'}`}
                                >
                                    <option value="active">Actif</option>
                                    <option value="inactive">Inactif</option>
                                </select>
                            </div>
                        </div>

                        <div className="flex items-center gap-2 mt-2">
                            <input
                                type="checkbox"
                                id="is_verified"
                                checked={formData.is_verified || false}
                                onChange={(e) => handleChange('is_verified', e.target.checked)}
                                className="w-4 h-4 text-emerald-600 rounded focus:ring-emerald-500"
                            />
                            <label htmlFor="is_verified" className="text-sm text-gray-700">Profil vérifié (Badge)</label>
                        </div>
                    </div>

                    {/* Localisation */}
                    <div className="space-y-4">
                        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest border-b pb-1">Localisation</h3>

                        <div className="grid grid-cols-1 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Ville</label>
                                <input
                                    type="text"
                                    value={formData.city || ''}
                                    onChange={(e) => handleChange('city', e.target.value)}
                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Adresse Complète</label>
                            <textarea
                                rows={2}
                                value={formData.address_full || ''}
                                onChange={(e) => handleChange('address_full', e.target.value)}
                                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Latitude</label>
                                <input
                                    type="number"
                                    step="any"
                                    value={formData.lat || ''}
                                    onChange={(e) => handleChange('lat', e.target.value)}
                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm bg-gray-50"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Longitude</label>
                                <input
                                    type="number"
                                    step="any"
                                    value={formData.lng || ''}
                                    onChange={(e) => handleChange('lng', e.target.value)}
                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm bg-gray-50"
                                />
                            </div>
                        </div>

                        <button
                            type="button"
                            onClick={handleGeocode}
                            disabled={isGeocoding || (!formData.address_full && !formData.city)}
                            className="text-xs text-blue-600 font-bold hover:underline flex items-center gap-1 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isGeocoding ? <Loader2 className="w-3 h-3 animate-spin" /> : <MapPin className="w-3 h-3" />}
                            {isGeocoding ? "Géocodage..." : "Géocoder (Auto)"}
                        </button>
                    </div>

                    {/* Contact */}
                    <div className="space-y-4">
                        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest border-b pb-1">Contact</h3>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Téléphone</label>
                            <input
                                type="text"
                                value={formData.phone_norm || ''}
                                onChange={(e) => handleChange('phone_norm', e.target.value)}
                                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                                placeholder="0612345678"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Site Web</label>
                            <input
                                type="url"
                                value={formData.website || ''}
                                onChange={(e) => handleChange('website', e.target.value)}
                                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                                placeholder="https://..."
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">URL Profil (Source)</label>
                            <input
                                type="url"
                                value={formData.profile_url || ''}
                                onChange={(e) => handleChange('profile_url', e.target.value)}
                                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-500"
                            />
                        </div>
                    </div>

                    {/* SEO / Slug */}
                    <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 space-y-3">
                        <div className="flex items-center justify-between">
                            <h3 className="text-xs font-bold text-gray-500 uppercase">Paramètres Avancés</h3>
                            <button
                                type="button"
                                onClick={() => setSlugLocked(!slugLocked)}
                                className="text-gray-400 hover:text-gray-600"
                            >
                                {slugLocked ? <Lock className="w-4 h-4" /> : <Unlock className="w-4 h-4 text-orange-500" />}
                            </button>
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-gray-500 mb-1">Slug URL</label>
                            <input
                                type="text"
                                disabled={slugLocked}
                                value={formData.slug_seo || ''}
                                onChange={(e) => handleChange('slug_seo', e.target.value)}
                                className="w-full border border-gray-300 rounded px-2 py-1 text-xs font-mono disabled:bg-gray-100 disabled:text-gray-400"
                            />
                            {!slugLocked && (
                                <p className="text-[10px] text-orange-600 mt-1 flex items-start gap-1">
                                    <AlertTriangle className="w-3 h-3 shrink-0" />
                                    Attention: Changer le slug casse les liens existants.
                                </p>
                            )}
                        </div>
                    </div>

                    {error && (
                        <div className="text-red-600 text-sm bg-red-50 p-3 rounded-lg border border-red-100">
                            {error}
                        </div>
                    )}

                </form>

                {/* Footer Actions */}
                <div className="p-4 border-t border-gray-100 bg-gray-50 flex items-center justify-end gap-3">
                    <Button variant="outline" onClick={onClose} disabled={isSaving}>Annuler</Button>
                    <Button onClick={handleSave} disabled={isSaving} className="flex items-center gap-2">
                        {isSaving && <Loader2 className="w-4 h-4 animate-spin" />}
                        Enregistrer
                    </Button>
                </div>
            </div>
        </div>
    );
}
