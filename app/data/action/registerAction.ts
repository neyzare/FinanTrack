"use server"
import {z} from "zod"
import {prisma} from "@/app/lib/prisma";
import bcrypt from 'bcrypt'
import {cookies} from "next/headers";
import {redirect} from "next/navigation";


const registerSchema = z.object({
    email: z.string().email('Email invalide'),
    password: z.string().min(8, 'Mot de passe trop court'),
    fullname: z.string().min(2, 'Nom requis'),

})

export async function registerAction(previousState: any, formData: FormData) {

    try {
        const data = {
            fullname: formData.get("fullname"),
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
                error: "Cet email est déjà utilisé"
            }
        }

        const hashedPassword = await bcrypt.hash(valideData.password,10)


        const user = await prisma.user.create({
            data:{
                fullname: valideData.fullname,
                email: valideData.email,
                password: hashedPassword,

            }
        })
        
        // Créer la session avec cookie
        const cookieStore = await cookies()
        cookieStore.set("userId", user.id, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: 'lax',
            maxAge: 60 * 60 * 24 * 7
        })

        redirect("/")

        return {
            success: true,
            user: {
                id: user.id,
                email: user.email,
                fullname: user.fullname
            }
        }

    } catch (error) {
        // Relancer l'erreur de redirection Next.js
        if (error && typeof error === 'object' && 'digest' in error && 
            typeof error.digest === 'string' && error.digest.includes('NEXT_REDIRECT')) {
            throw error;
        }
        
        if (error instanceof z.ZodError) {
            return {
                success: false,
                error: error.issues[0].message
            }
        }
        return {
            success: false,
            error: "Une erreur est survenue lors de l'enregistrement"
        }
    }
}