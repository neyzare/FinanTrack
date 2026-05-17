"use server"

import {cookies} from "next/headers";
import {prisma} from "@/app/lib/prisma";
import {verifySignedValue} from "@/app/lib/cookie-sign";

export async function auth() {
    const cookieStore = await cookies();
    const signed = cookieStore.get("userId")?.value
    const userID = verifySignedValue(signed)

    if (!userID) {
        return null
    }

    const user = await prisma.user.findUnique({
        where: {id: userID},
        select: {
        id: true,
        email: true,
        name: true}
        }
    )
    return user;
}