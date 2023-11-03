import React, { useEffect, useState } from "react";
import { api } from "@/utils/api"; // import api to use trpc APIs
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
  SheetClose,
} from "@/components/ui/sheet";
import { useUser } from "@clerk/nextjs";
import { AiOutlineSend } from "react-icons/ai";
import { ScrollArea } from "@/components/ui/scroll-area";
import IconButton from "@/components/_react_flow/IconButton/IconButton";
import { MessageCircle } from "lucide-react";
export default function Comment({
  selectedNodeObj,
  selectedNodeId,
  createCommentFunc,
}: any) {
  const { user } = useUser();
  const [comment, setComment] = useState("");
  if (selectedNodeObj == undefined) return;

  const callCreateCommentFunc = () => {
    createCommentFunc(selectedNodeId, comment);
  };

  return (
    <Sheet>
      <SheetTrigger>
        <IconButton
          text={"Comment"}
          icon={<MessageCircle size={"20px"} />}
          draggable={false}
        />
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Comments</SheetTitle>
        </SheetHeader>
        <ScrollArea className="h-5/6 p-3">
          <div className="grid gap-4 py-4">
            {selectedNodeObj.data.comments != undefined
              ? selectedNodeObj.data.comments.map((commentObj: any) => (
                <div
                  key={commentObj.commentId}
                  className="flex items-center gap-3"
                >
                  <img className="h-8 w-8 rounded-full bg-slate-500" />
                  <div>{commentObj.comment}</div>
                </div>
              ))
              : null}
          </div>
        </ScrollArea>
        <SheetFooter className="w-full">
          <div className="flex h-10 w-full items-center justify-center ">
            <img src={user?.imageUrl} className="mr-4 h-full rounded-full" />
            <input
              className="h-8  w-80 rounded-l-md border border-black px-3 py-1 outline-none"
              placeholder="comment"
              value={comment}
              onChange={(e) => {
                setComment(e.target.value);
              }}
            />
            <button
              className="flex h-8 w-10 items-center justify-center rounded-r-md  bg-black"
              onClick={callCreateCommentFunc}
            >
              <AiOutlineSend className="text-2xl text-white" />
            </button>
          </div>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
