"use server";

import { z } from "zod";
import { isRedirectError } from "next/dist/client/components/redirect-error";
import { prisma } from "@/app/lib/prisma";
import { getResend } from "@/app/lib/Resend";
import {
  generateResetToken,
  hashToken,
  getResetTokenExpiry,
} from "@/app/lib/passwordResetToken";
import ResetPasswordEmail from "@/app/components/email-template";

type ForgotPasswordState = {
  success: boolean;
  error?: string;
};

const forgotPasswordShema = z.object({
  email: z.email("email invalide"),
});

export async function forgotPasswordAction(
  _previousState: ForgotPasswordState | null,
  formData: FormData,
): Promise<ForgotPasswordState> {
  try {
    const data = { email: formData.get("email") };

    const validateData = forgotPasswordShema.safeParse(data);

    if (!validateData.success) {
      return {
        success: false,
        error: validateData.error.issues[0].message,
      };
    }

    const { email } = validateData.data;

    const user = await prisma.user.findUnique({ where: { email } });

    if (user) {
      const rawToken = generateResetToken();
      const tokenHash = hashToken(rawToken);
      const expiresAt = getResetTokenExpiry();

      await prisma.passwordResetToken.create({
        data: { userId: user.id, tokenHash, expiresAt },
      });

      const resetUrl = `${process.env.APP_URL}/reset-password?token=${rawToken}`;

      await getResend().emails.send({
        from: "Finantrack <onboarding@resend.dev>",
        to: email,
        subject: "Réinitialisation de votre mot de passe Finantrack",
        react: ResetPasswordEmail({
          username: user.name,
          resetUrl,
        }),
      });
    }

    return { success: true };
  } catch (e) {
    if (isRedirectError(e)) {
      throw e;
    }

    console.error("[ForgotPassword Error]", e);

    return { success: true };
  }
}
