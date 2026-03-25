"use server"

import {auth} from "@/app/lib/auth";
import {prisma} from "@/app/lib/prisma";

export async function getSandboxStock() {
    const user = await auth()
    if (!user) {
        return [];
    }

   A
}
