import userModel from "@/models/user";
import { NextRequest, NextResponse } from "next/server";
import connectDb from "@/lib/dbConnect";
//NOTE:-> provides the session information :: everything in the session here we have info about user
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import { ApiResponse } from "@/types/ApiResponse";

// IMP :-> allows the currently logedIn user to toggle the state of messageAcceptance
export async function POST(request: NextRequest) {
  try {
    connectDb();
    const session = await getServerSession(authOptions);
    const currentLoggedInUser = session?.user;
    // if neither of the session nor user present
    if (!session || !currentLoggedInUser) {
      return NextResponse.json({
        success: false,
        message: "Please login to continue",
      });
    }
    const userId = currentLoggedInUser?._id;
    //update the user's isAcceptingMessages field
    const { acceptMessages } = await request.json();
    const user = await userModel.findByIdAndUpdate(
      userId,
      {
        isAcceptingMessages: acceptMessages,
      },
      {
        new: true, //sends the updated user
      }
    );
    if (!user) {
      return NextResponse.json({
        success: false,
        message: "failed to update isAcceptingMessages field",
      });
    }
    return NextResponse.json({
      success: true,
      message: "User messageAcceptance status updated successfully",
    });
  } catch (error) {
    console.log("failed to update user status to accept messages", error);
    return NextResponse.json({
      success: false,
      message: "failed to update user status to accept messages",
    });
  }
}

//sends the user messageAcceptance state
export async function GET(request: NextRequest) {
  try {
    connectDb();
    const session = await getServerSession(authOptions);
    const currentLoggedInUser = session?.user;
    // if neither of the session nor user present
    if (!session || !currentLoggedInUser) {
      return NextResponse.json({
        success: false,
        message: "Please login to continue",
      });
    }
    const userId = currentLoggedInUser?._id;
    const user = await userModel.findById(userId);
    // if no user found
    if (!user) {
      return NextResponse.json({
        success: false,
        message: "User not found",
      });
    }
    //success
    return NextResponse.json({
      success: true,
      message: "user found",
      isAcceptingMessages: user.isAcceptingMessages,
    });
  } catch (error) {
    console.log("failed to send user messageAcceptance state", error);
    return NextResponse.json({
      success: false,
      message: "failed to send user messageAcceptance state",
    });
  }
}
