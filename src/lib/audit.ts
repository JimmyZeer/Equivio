import { supabaseAdmin } from "./supabase-admin";

export async function logAdminAction(
    action: string,
    entityType: string,
    entityId: string,
    beforeData: any = null,
    afterData: any = null,
    ip: string = 'unknown'
) {
    try {
        await supabaseAdmin.from('admin_audit_logs').insert({
            action,
            entity_type: entityType,
            entity_id: entityId,
            before_data: beforeData,
            after_data: afterData,
            admin_label: 'basic-auth', // Can be enhanced later if multi-user system implemented
            ip
        });
    } catch (error) {
        // Audit logging should not block the main action, but we should log the error
        console.error("Failed to log admin action:", error);
    }
}
