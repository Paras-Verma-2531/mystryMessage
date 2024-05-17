import User from "@/models/user";
import connectDb from "@/lib/dbConnect";
import { z } from "zod";
import { verifySchema } from "@/schemas/verifySchema";
import { NextRequest, NextResponse } from "next/server";

const otpQuerySchema = z.object({
  otp: verifySchema,
});
export async function GET(request: NextRequest) {
  try {
    connectDb();
    const searchParams = request.nextUrl.searchParams;
    const queryParam = {
      otp: searchParams.get("otp"),
    };
    if (!queryParam.otp) {
      return NextResponse.json({
        success: false,
        message: "OTP expected",
      });
    }
    const result = otpQuerySchema.safeParse(queryParam);
    if (!result.success) {
      console.log(result.error.format().otp?._errors);
      return NextResponse.json({
        success: false,
        message: "Invalid query parameters",
      });
    }
    const { otp } = result.data;
    const isOtpValid = await User.findOne({
      verifyCode: otp,
      verifyCodeExpiry: { $gt: Date.now() },
    });
    //invalid OTP
    if (!isOtpValid) {
      return NextResponse.json({
        success: false,
        message: "Invalid OTP",
      });
    }
    //OTP verified
    isOtpValid.isVerified = true;
    await isOtpValid.save();
    return NextResponse.json({
      success: true,
      message: "OTP verified",
    });
  } catch (error) {
    console.log("error encountered while verifying the OTP", error);
    return NextResponse.json({
      success: false,
      message: "Error encountered while verifying the OTP",
    });
  }
}
