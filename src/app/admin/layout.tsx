import Link from 'next/link';
import { LayoutDashboard, FileText, Users, Shield, FileUp } from 'lucide-react';

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row font-sans">
            {/* Sidebar Navigation */}
            <aside className="w-full md:w-64 bg-slate-900 text-white flex-shrink-0">
                <div className="p-6 border-b border-slate-800">
                    <Link href="/admin" className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center font-bold text-slate-900">E</div>
                        <span className="text-xl font-bold tracking-tight">Equivio Admin</span>
                    </Link>
                </div>

                <nav className="p-4 space-y-2">
                    <Link href="/admin" className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-slate-800 transition-colors text-slate-300 hover:text-white">
                        <LayoutDashboard className="w-5 h-5" />
                        <span>Dashboard</span>
                    </Link>

                    <Link href="/admin/claims" className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-slate-800 transition-colors text-slate-300 hover:text-white">
                        <FileText className="w-5 h-5" />
                        <span>Revendications</span>
                    </Link>

                    <Link href="/admin/audit" className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-slate-800 transition-colors text-slate-300 hover:text-white">
                        <Shield className="w-5 h-5" />
                        <span>Logs System</span>
                    </Link>

                    <Link href="/admin/practitioners" className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-emerald-700 rounded-lg transition-colors">
                        <Users className="w-5 h-5" />
                        Praticiens
                    </Link>

                    <Link href="/admin/import" className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-emerald-700 rounded-lg transition-colors">
                        <FileUp className="w-5 h-5" />
                        Import CSV
                    </Link>

                    <div className="pt-8 mt-8 border-t border-slate-800">
                        <div className="px-4 py-2 text-xs font-bold text-slate-500 uppercase tracking-widest">Système</div>
                        <a href="/" target="_blank" className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-slate-800 transition-colors text-slate-300 hover:text-white">
                            <span className="w-5 h-5 flex items-center justify-center">↗</span>
                            <span>Voir le site</span>
                        </a>
                    </div>
                </nav>
            </aside>

            {/* Main Content */}
            <main className="flex-1 p-8 overflow-y-auto h-screen">
                <div className="max-w-7xl mx-auto">
                    {children}
                </div>
            </main>
        </div>
    );
}
