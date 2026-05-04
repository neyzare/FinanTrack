"use server"
import {cookies} from "next/headers";
import {z} from "zod"
import {prisma} from "@/app/lib/prisma";
import bcrypt from "bcrypt";
import {redirect} from "next/navigation";
import {revalidatePath} from "next/cache";

const authSchema = z.object({
    email: z.                                               email( "Email invalide"),
    password: z.string().min(1, "Le mot de passe est requis")
})

export async function loginAction(_previousState: any | undefined, formData: FormData) {

  try {
      const data = {
          email: formData.get("email"),
          password: formData.get("password")
      }

      const validateData = authSchema.safeParse(data)

      if (!validateData.success) {
          return {
              success: false,
              error: "format email or password invalid"
          }
      }

      const { email, password } = validateData.data

      const user = await prisma.user.findUnique({
          where: {
              email
          }
      })

      if (!user) {
          return {
              success: false,
              error: "Incorrect email or password"
          }
      }

      const passwordMatch = await bcrypt.compare(
          password,
          user.password)

      if (!passwordMatch) {
          return {
              success: false,
              error: "email or password invalid"
          }
      }

      const cookieStore = await cookies()
      cookieStore.set("userId", user.id, {
          httpOnly:true,
          secure: process.env.NODE_ENV === "production",
          sameSite: 'lax',
          maxAge: 60 * 60 * 24 * 7
      })

      revalidatePath('/')
      revalidatePath('/', 'layout')
      redirect("/")

      return {
          success: true,
          id: user?.id,
          user: user?.email
      }

  }catch (e) {
      console.log(e)
      
      if (e && typeof e === 'object' && 'digest' in e && 
          typeof e.digest === 'string' && e.digest.includes('NEXT_REDIRECT')) {
          throw e;
      }
      
      return {
          success: false,
          error: "Une erreur est survenue lors de la connexion"
      }
  }
}