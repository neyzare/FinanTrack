"use server"

import {auth} from "@/app/lib/auth";
import {prisma} from "@/app/lib/prisma";
import {authLogout} from "@/app/lib/authLogout";

export default async function deleteAccount() {
    const user = await auth()
    if (!user) {
        return null
    }

    await prisma.user.delete({
        where : {
            id : user.id
        }
    })
    await authLogout()
    return {
        success: true,
        message: "Compte supprimé avec succés vous pouvez aller boire un café"
    }
}