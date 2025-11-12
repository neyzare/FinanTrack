"use server"
import {z} from "zod"

export async function loginAction(formData : FormData) {
    console.log("bienvenue dans la logique du login")

    const fields = {
        email: formData.get('email'),
        password: formData.get("password"),
    }

    console.log(fields)
}