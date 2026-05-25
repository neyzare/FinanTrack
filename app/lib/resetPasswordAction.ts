"use server"

import { z } from "zod"
import { redirect } from "next/navigation"
import { isRedirectError } from "next/dist/client/components/redirect-error"
import bcrypt from "bcrypt"
import { prisma } from "@/app/lib/prisma"
import { hashToken } from "@/app/lib/passwordResetToken"

export interface PreviousState {
    success: boolean;
    error?: string;
}

const resetPasswordSchema = z
    .object({
        token: z.string().min(1, "Token missing"),
        password: z.string().min(12, "password must be at least 12 characters"),
        confirmPassword: z.string(),
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: "Les mots de passe ne correspondent pas",
        path: ["confirmPassword"],
    })

export async function resetPasswordAction(_previousState: PreviousState | null, formdata: FormData) {
    try {
        const data = {
            token: formdata.get('token'),
            password: formdata.get('password'),
            confirmPassword: formdata.get('confirmPassword'),
        }

        const validateData = resetPasswordSchema.safeParse(data)

        if (!validateData.success) {
            return {
                success: false,
                error: validateData.error.issues[0].message,
            }
        }

        const { token, password } = validateData.data
        const tokenHash = hashToken(token)

        const resetToken = await prisma.passwordResetToken.findUnique({
            where: { tokenHash },
        })

        if (!resetToken || resetToken.usedAt || resetToken.expiresAt < new Date()) {
            return { success: false, error: "link Invalid" }
        }

        const hashedPassword = await bcrypt.hash(password, 10)

        await prisma.$transaction([
            prisma.user.update({
                where: { id: resetToken.userId },
                data: { password: hashedPassword },
            }),
            prisma.passwordResetToken.update({
                where: { id: resetToken.id },
                data: { usedAt: new Date() },
            }),
        ])

        redirect("/login?reset=ok")
    }
    catch (e) {
        if (isRedirectError(e)) throw e
        console.error("[ResetPassword Error]", e)
        return { success: false, error: "Erreur serveur" }
    }
}