"use client";
import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { Message } from "@/models/user";
import { useToast } from "@/components/ui/use-toast";
import axios from "axios";
//define type for prop
type messageCardProp = {
  message: Message;
  //function : function to delete message
  onMessageDelete: (messageId: string) => void;
};


function MessageCard({ message, onMessageDelete }: messageCardProp) {
  const { toast } = useToast();
  const handleDeleteConfirm = async () => {
    const response = await axios.delete(`/api/deleteMessage/${message._id}`);
    toast({
      title: response.data.message,
    });
    onMessageDelete(message._id);
  };
  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Card Title</CardTitle>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive">
                <X className="w-5 h-5" />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete the
                  message from our servers.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                {/* handles the confirmation of delete message */}
                <AlertDialogAction onClick={handleDeleteConfirm}>
                  Continue
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </CardHeader>
        <CardContent></CardContent>
      </Card>
    </>
  );
}

export default MessageCard;
