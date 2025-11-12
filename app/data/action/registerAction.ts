"use server"
import {z} from "zod"
import {prisma} from "@/app/lib/prisma";
import bcrypt from 'bcrypt'


const registerSchema = z.object({
    email: z.string().email('Email invalide'),
    password: z.string().min(8, 'Mot de passe trop court'),
    fullName: z.string().min(2, 'Nom requis'),

})

export async function registerAction(formData: FormData) {
    console.log("bienvenue dans la logique du register")

    try {
        const data = {
            fullName: formData.get("fullName"),
            email: formData.get("email"),
            password: formData.get("password")
        }

        const valideData = registerSchema.parse(data)

        const existingUser = await prisma.user.findUnique({
            where: {
                email: valideData.email
            }
        })

        if (existingUser) {
            return {
                success: false,
                message: "user already exists"
            }
        }

        const hashedPassword = await bcrypt.hash(valideData.password,10)

        const user = await prisma.user.create({
            data:{
                fullName: valideData.fullName,
                email: valideData.email,
                password: hashedPassword,

            }
        })

        return {
            success: true,
            user: {
                id: user.id,
                email: user.email,
                fullName: user.fullName
            }
        }

    } catch (error) {
        if (error instanceof z.ZodError) {
            return {
                success: false,
                error: error.errors[0].message
            }
        }}
}