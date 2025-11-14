"use server"
import {z} from "zod"
import {prisma} from "@/app/lib/prisma";
import bcrypt from "bcrypt";

const authSchema = z.object({
    email: z.email(),
    password: z.string()
})

export async function loginAction(formData : FormData) {
    console.log("bienvenue dans la logique du login")

    const fields = {
        email: formData.get('email'),
        password: formData.get("password"),
    }

    console.log(fields)
}