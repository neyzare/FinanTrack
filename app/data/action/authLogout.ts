'use server'
import {cookies} from "next/headers";
import {redirect} from "next/navigation";
import {revalidatePath} from "next/cache";

export async function authLogout() {
    const cookieStore = await cookies()

    try {
        cookieStore.delete("userId")
        revalidatePath('/')       // ← Ajoutez
        revalidatePath('/dashboard')  // ← Ajoutez
    } catch (e) {
        if (e && typeof e === 'object' && 'digest' in e &&
            typeof e.digest === 'string' && e.digest.includes('NEXT_REDIRECT')) {
            throw e;
        }
        return {
            success: false,
            error: "Erreur lors de la deconnexion"
        }
    }
}