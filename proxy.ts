import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import {verifySignedValue} from "@/app/lib/cookie-sign";

export function proxy(request : NextRequest) {

    const signed = request.cookies.get("userId")?.value
    const userId = verifySignedValue(signed)

    if (!userId) {
        return NextResponse.redirect(new URL("/login", request.url))
    }

    return NextResponse.next()
}

export const config = {
    matcher: ["/dashboard/:path*"]
}
