import resend from "@/lib/resend";
import VerificationEmail from "../../emails/verificationEmails";
import { ApiResponse } from "@/types/ApiResponse";

//function to send emails
export async function sendVerificationEmail(
  email: string,
  username: string,
  otp: string
): Promise<ApiResponse> {
  try {
    await resend.emails.send({
      from: "Acme <onboarding@resend.dev>",
      to: email,
      subject: "MystryMessage | Verification Code",
      react: VerificationEmail({ username, otp }),
    });

    return { success: true, message: "Verification email sent successfully" };
  } catch (error) {
    console.log("error encountered while sendin Email", error);
    return { success: false, message: "Failed to send verification email" };
  }
}
