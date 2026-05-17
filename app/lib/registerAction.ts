"use server"

import { z } from "zod"
import { prisma } from "@/app/lib/prisma"
import bcrypt from "bcrypt"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { isRedirectError } from "next/dist/client/components/redirect-error"
import { revalidatePath } from "next/cache"
import {signValue} from "@/app/lib/cookie-sign";

type RegisterState = {
    success: boolean
    error?: string
}

const registerSchema = z.object({
    email: z.email("Email invalide"),
    password: z.string().min(12, "Mot de passe trop court"),
    fullname: z.string().min(2, "Nom requis"),
})

export async function registerAction(
    previousState: RegisterState | null,
    formData: FormData
): Promise<RegisterState> {

    try {
        const data = {
            fullname: formData.get("fullname"),
            email: formData.get("email"),
            password: formData.get("password"),
        }

        const validateData = registerSchema.safeParse(data)

        if (!validateData.success) {
            return {
                success: false,
                error: validateData.error.issues[0].message,
            }
        }

        const { email, password, fullname } = validateData.data

        const existingUser = await prisma.user.findUnique({
            where: { email },
        })

        if (existingUser) {
            return {
                success: false,
                error: "Cet email est déjà utilisé",
            }
        }

        const hashedPassword = await bcrypt.hash(password, 10)

        const user = await prisma.user.create({
            data: {
                name: fullname,
                email,
                password: hashedPassword,
            },
        })

        const cookieStore = await cookies()
        cookieStore.set("userId", signValue(user.id), {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: 60 * 60 * 24 * 7,
        })

        revalidatePath("/", "layout")

    } catch (e) {
        if (isRedirectError(e)) {
            throw e
        }

        console.error("[Register Error]", e)

        return {
            success: false,
            error: "Une erreur est survenue lors de l'enregistrement",
        }
    }

    redirect("/dashboard")
}