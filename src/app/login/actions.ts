"use server"
import { signIn } from "@/auth"
import { AuthError } from "next-auth"

export async function authenticate(
  prevState: string | undefined,
  formData: FormData,
) {
  try {
    const payloads = Object.fromEntries(formData.entries());
    await signIn("credentials", payloads)
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return "Hatalı e-posta veya şifre girdiniz."
        default:
          return "Kimlik doğrulama sırasında bir hata oluştu."
      }
    }
    throw error
  }
}
