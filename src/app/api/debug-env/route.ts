import { NextResponse } from "next/server";

export const runtime = 'edge';

export async function GET() {
    console.log("Debug Env Var Check");
    const pwd = process.env.ADMIN_PASSWORD;

    return NextResponse.json({
        status: "Debug Check",
        hasAdminPassword: !!pwd,
        passwordLength: pwd ? pwd.length : 0,
        envKeys: Object.keys(process.env),
        timestamp: new Date().toISOString()
    });
}
