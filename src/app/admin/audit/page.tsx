import { supabaseAdmin } from "@/lib/supabase-admin";
import { Clock, Shield, Database } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function AuditPage() {
    const { data: logs } = await supabaseAdmin
        .from('admin_audit_logs')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(100);

    return (
        <div className="space-y-6">
            <header className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                        <Shield className="w-6 h-6 text-gray-700" />
                        Audit Logs
                    </h1>
                    <p className="text-gray-500 text-sm">Historique des 100 dernières actions administratives</p>
                </div>
            </header>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-gray-50 border-b border-gray-200">
                            <th className="p-4 text-xs font-bold text-gray-500 uppercase">Date</th>
                            <th className="p-4 text-xs font-bold text-gray-500 uppercase">Action</th>
                            <th className="p-4 text-xs font-bold text-gray-500 uppercase">Entité</th>
                            <th className="p-4 text-xs font-bold text-gray-500 uppercase">Détails (Diff)</th>
                            <th className="p-4 text-xs font-bold text-gray-500 uppercase">IP</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {logs && logs.map((log: any) => (
                            <tr key={log.id} className="hover:bg-gray-50 group transition-colors">
                                <td className="p-4 whitespace-nowrap text-sm text-gray-600 font-mono">
                                    {new Date(log.created_at).toLocaleString('fr-FR')}
                                </td>
                                <td className="p-4">
                                    <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-bold ${log.action.includes('update') ? 'bg-blue-50 text-blue-700' :
                                            log.action.includes('approve') ? 'bg-emerald-50 text-emerald-700' :
                                                log.action.includes('reject') ? 'bg-red-50 text-red-700' :
                                                    'bg-gray-100 text-gray-600'
                                        }`}>
                                        {log.action}
                                    </span>
                                </td>
                                <td className="p-4 text-sm text-gray-700">
                                    <div className="flex flex-col">
                                        <span className="font-medium">{log.entity_type}</span>
                                        <span className="text-xs text-gray-400 font-mono">{log.entity_id?.slice(0, 8)}...</span>
                                    </div>
                                </td>
                                <td className="p-4 text-xs text-gray-600 font-mono max-w-xs break-all">
                                    {/* Simply showing after data for MVP, or diff logic could go here */}
                                    <div className="opacity-70 group-hover:opacity-100 transition-opacity">
                                        {JSON.stringify(log.after_data || log.before_data).slice(0, 100)}
                                        {(JSON.stringify(log.after_data || log.before_data).length > 100) && '...'}
                                    </div>
                                </td>
                                <td className="p-4 text-sm text-gray-400">
                                    {log.ip || '-'}
                                </td>
                            </tr>
                        ))}
                        {(!logs || logs.length === 0) && (
                            <tr>
                                <td colSpan={5} className="p-8 text-center text-gray-500">
                                    Aucun log trouvé.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
