"use server"

import {cookies} from "next/headers";
import {prisma} from "@/app/lib/prisma";

export async function auth() {
    const cookieStore = await cookies();
    const userID = cookieStore.get("userId")?.value

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