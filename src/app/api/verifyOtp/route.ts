import User from "@/models/user";
import connectDb from "@/lib/dbConnect";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    connectDb();
    const { username, otp } = await request.json();
    const decodedUsername = decodeURIComponent(username);
    const isOtpValid = await User.findOne({
      username: decodedUsername,
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
