import User from "@/models/user";
import { NextRequest, NextResponse } from "next/server";
import connectDb from "@/lib/dbConnect";
import { z } from "zod";
import { usernameValidation } from "@/schemas/signUpSchema";

//ZOD usage::-->usernameQuerySchema to use zod for schemaValidation
const usernameQuerySchema = z.object({
  username: usernameValidation,
});
export async function GET(request: NextRequest) {
  try {
    connectDb();
    //fetch the username from params
    const searchParams = request.nextUrl.searchParams;
    const queryParam = {
      // IMP: http://localhost:3000/api/cuu?username=paras
      username: searchParams.get("username"),
    };
    //if no username fetched:: send error
    if (!queryParam.username) {
      return NextResponse.json({
        success: false,
        message: "Username expected",
      });
    }
    //validate with zod
    const result = usernameQuerySchema.safeParse(queryParam);
    if (!result.success) {
      //we can send our custom error aswell
      const usernameErrors = result.error.format().username?._errors || []; //fetch the errors from username schema
      return NextResponse.json({
        success: false,
        message:
          usernameErrors.length > 0
            ? usernameErrors.join(",")
            : "Invalid query parameters",
      });
    }
    //validation success
    const { username } = result.data;
    //check if verifiedUsername exists in db
    const existingUserByVerifiedUsername = await User.findOne({
      username,
      isVerified: true,
    });
    if (existingUserByVerifiedUsername) {
      return NextResponse.json({
        success: false,
        message: "Username already exists",
      });
    }
    return NextResponse.json({
      success: true,
      message: "Username is unique",
    });
  } catch (error) {
    console.log(
      "error encountered while checking the uniqueness of username",
      error
    );
    return NextResponse.json({
      success: false,
      message: "Error encountered while checking uniqueness of username",
    });
  }
}
