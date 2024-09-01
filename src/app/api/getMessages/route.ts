import userModel from "@/models/user";
import { NextRequest, NextResponse } from "next/server";
import connectDb from "@/lib/dbConnect";
//NOTE:-> provides the session information :: everything in the session here we have info about user
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import mongoose from "mongoose";
/*
Fetch the messages that the current user recieves
*/
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
    // IMP: --> our user is in string [ with aggregation pipeline,it will cause errror]
    // IMP: --> therefore conversion to objectId is required
    const userId = new mongoose.Types.ObjectId(currentLoggedInUser?._id);
    const user = await userModel.aggregate([
      {
        $match: { _id: userId },
      },
      {
        $unwind: "$messages",
      }, // this will open the messages array as set of objects
      {
        $sort: { "messages.createdAt": -1 },
      },
      {
        $group: { _id: "$_id", messages: { $push: "$messages" } },
      },
    ]);
    if (!user || user.length === 0) {
      return NextResponse.json({
        success: false,
        message: "user not found",
      });
    }
    //send the messages
    return NextResponse.json({
      success: true,
      messages: user[0].messages,
    });
  } catch (error) {
    console.log("failed to get messages", error);
    return NextResponse.json({
      success: false,
      message: "failed to get messages",
    });
  }
}
