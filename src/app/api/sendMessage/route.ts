import userModel, { Message } from "@/models/user";
import { NextRequest, NextResponse } from "next/server";
import connectDb from "@/lib/dbConnect";

connectDb();
export async function POST(request: NextRequest) {
  const { username, content } = await request.json();
  try {
    const user = await userModel.findOne({ username });
    if (!user) {
      return NextResponse.json({
        success: false,
        message: "user does not exists",
      });
    }
    // check if user can acceptMessages or not [ check the state]
    if (!user.isAcceptingMessages) {
      return NextResponse.json({
        success: false,
        message: "user cannot accept messages",
      });
    }
    //user is accepting messages
    const newMessage = { content, createdAt: new Date() };
    user.messages.push(newMessage as Message);
    await user.save();
    return NextResponse.json({
      success: true,
      message: "Message sent successfully",
    });
  } catch (error) {
    console.log("failed to send messages", error);
    return NextResponse.json({
      success: false,
      message: "failed to send messages",
    });
  }
}
