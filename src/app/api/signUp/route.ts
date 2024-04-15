//end point:--> /api/signUp
import { NextResponse, NextRequest } from "next/server";
import connectDb from "@/lib/dbConnect";
import bcrypt from "bcryptjs";
import User from "@/models/user";
import { sendVerificationEmail } from "@/helpers/sendVerificationEmail";
connectDb();
export default async function POST(request: NextRequest) {
  try {
    const reqBody = await request.json();
    const { email, username, password } = reqBody;
    // if either of the field is missing send error message
    if (!email || !password || !username)
      return NextResponse.json({
        success: false,
        message: "All Fields are required while registering User",
      });
    //if  user with verified Email exists
    const existingUserByVerifiedEmail = await User.findOne({
      username,
      isVerified: true,
    });
    if (existingUserByVerifiedEmail)
      return NextResponse.json({
        success: false,
        message: "Verified user already exists",
      });
    // if user already exists
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const existingUserByEmail = await User.findById({ email });
    if (existingUserByEmail) {
      if (existingUserByEmail.isVerified) {
        return NextResponse.json({
          success: false,
          message: "Email Already exists",
        });
      }
      // user might have forgot his password { trying resetting it }:: email exists but not verified
      else {
        const hashedPassword = await bcrypt.hash(password, 10);
        existingUserByEmail.password = hashedPassword;
        existingUserByEmail.verifyCode = otp;
        existingUserByEmail.verifyCodeExpiry = Date.now() + 3600000;
        await existingUserByEmail.save();
      }
    }
    // new User { visiting first time }
    else {
      const hashedPassword = await bcrypt.hash(password, 10);
      await User.create({
        username,
        email,
        password: hashedPassword,
        verifyCode: otp,
        verifyCodeExpiry: Date.now() + 3600000,
        messages: [],
      });
    }
    //send verification email
    const emailResponse = await sendVerificationEmail(email, username, otp);
    //if error encountered
    if (!emailResponse.success) {
      return NextResponse.json({
        success: false,
        message: emailResponse.message,
      });
    }
    //email sent successfully
    return NextResponse.json({
      success: true,
      message: "Verification Email sent successfully",
    });
  } catch (error) {
    console.log("error encountered while registering user", error);
    return NextResponse.json({
      success: false,
      message: "Error encountered while registering user",
    });
  }
}
