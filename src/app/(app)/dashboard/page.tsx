"use client";
import MessageCard from "@/components/MessageCard";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/components/ui/use-toast";
import { Message } from "@/models/user";
import { acceptMessageSchema } from "@/schemas/acceptMessageSchema";
import { ApiResponse } from "@/types/ApiResponse";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { Loader2, RefreshCcw } from "lucide-react";
import { User } from "next-auth";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import React, { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";

const Dashboard = () => {
  const router = useRouter();
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSwitchLoading, setIsSwitchLoading] = useState(false);
  const { toast } = useToast();

  //update the UI [message is instantly deleted from UI]
  const handleDeleteMessage = (messageId: string) => {
    setMessages(messages.filter((message) => message._id !== messageId));
  };
  const { data: session } = useSession();

  //react-hook-form to manages accept message toogle
  const form = useForm({
    resolver: zodResolver(acceptMessageSchema),
  });
  const { register, watch, setValue } = form;
  //IMP: watch method watches the given field and allow to do rendering based on some condition
  const acceptMessages = watch("acceptMessages"); //boolean state

  //function to fetch User's message state :: another alternative
  // could be to make a simple fnc rather than using  useCallback
  const fetchMessageAcceptance = useCallback(async () => {
    setIsSwitchLoading(true);
    try {
      const response = await axios.get<ApiResponse>("/api/acceptMessage");
      setValue("acceptMessages", response.data.isAcceptingMessages);
    } catch (e) {
      toast({
        title: "Error",
        description: "Failed to fetch message settings",
        variant: "destructive",
      });
    } finally {
      setIsSwitchLoading(false);
    }
  }, [setValue]);

  //Method to fetch User's messages
  const fetchMessages = async (refresh: boolean = false) => {
    setIsLoading(true);
    setIsSwitchLoading(true);
    try {
      const response = await axios.get("/api/getMessages");
      setMessages(response.data.messages || []);
      if (refresh) {
        toast({
          title: "Refreshed messages",
          description: "showing refreshed messages",
        });
      }
    } catch (e) {
      toast({
        title: "Error",
        description: "Failed to fetch message settings",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
      setIsSwitchLoading(false);
    }
  };

  //useEffect to render changes
  useEffect(() => {
    if (!session || !session.user) return;
    fetchMessageAcceptance();
    fetchMessages();
  }, [session, fetchMessageAcceptance, fetchMessages, setValue]);

  //handle switch change
  const handleSwitchChange = async () => {
    //update the state in DB using current state;
    try {
      await axios.post("/api/acceptMessage", {
        acceptMessages: acceptMessages,
      });
      //toogle the value in the UI
      setValue("acceptMessages", !acceptMessages);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to toogle state",
        variant: "destructive",
      });
    }
  };
  //redirect the user
  if (!session || !session.user) {
    return (
      <>
        <h2>Please Visit Login Page</h2>
        {router.replace("/signIn")}
      </>
    );
  }

  const { username } = session?.user as User;
  //user's url formation
  const baseUrl = `${window.location.protocol}//${window.location.host}`;
  const profileUrl = `${baseUrl}/u/${username}`;

  //clipboard functionality
  const copyToClipboard = () => {
    navigator.clipboard.writeText(profileUrl);
    toast({
      title: "URL Copied!",
      description: "Profile URL has been copied to clipboard.",
    });
  };
  
  return (
    <div className="my-8 mx-4 md:mx-8 lg:mx-auto p-6 bg-white rounded w-full max-w-6xl">
      <h1 className="text-4xl font-bold mb-4">User Dashboard</h1>

      <div className="mb-4">
        <h2 className="text-lg font-semibold mb-2">Copy Your Unique Link</h2>{" "}
        <div className="flex items-center">
          <input
            type="text"
            value={profileUrl}
            disabled
            className="input input-bordered w-full p-2 mr-2"
          />
          <Button onClick={copyToClipboard}>Copy</Button>
        </div>
      </div>

      <div className="mb-4">
        <Switch
          {...register("acceptMessages")}
          checked={acceptMessages}
          onCheckedChange={handleSwitchChange}
          disabled={isSwitchLoading}
        />
        <span className="ml-2">
          Accept Messages: {acceptMessages ? "On" : "Off"}
        </span>
      </div>
      <Separator />

      <Button
        className="mt-4"
        variant="outline"
        onClick={(e) => {
          e.preventDefault();
          fetchMessages(true);
        }}
      >
        {isLoading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <RefreshCcw className="h-4 w-4" />
        )}
      </Button>
      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-6">
        {messages.length > 0 ? (
          messages.map((message, index) => (
            <MessageCard
              key={message._id}
              message={message}
              onMessageDelete={handleDeleteMessage}
            />
          ))
        ) : (
          <p>No messages to display.</p>
        )}
      </div>
    </div>
  );
};
export default Dashboard;
