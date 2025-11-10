"use server"

export async function registerAction(formData : FormData) {
    console.log("bienvenue dans la logique du register")

    const fields = {
        username: formData.get("fullName"),
        email: formData.get('email'),
        password: formData.get("password")
    }

    console.log(fields)
}