"use server"
import {z} from "zod"
import {prisma} from "@/app/lib/prisma";
import bcrypt from 'bcrypt'


const registerSchema = z.object({
    email: z.string().email('Email invalide'),
    password: z.string().min(8, 'Mot de passe trop court'),
    fullname: z.string().min(2, 'Nom requis'),

})

export async function registerAction(formData: FormData) {

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
                message: "user already exists"
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
        


        return {
            success: true,
            user: {
                id: user.id,
                email: user.email,
                fullname: user.fullname
            }
        }

    } catch (error) {
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