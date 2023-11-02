import React from "react";
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
import { BiPin } from "react-icons/bi";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";

export default function Comment() {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <BiPin />
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Pinned Notes</SheetTitle>
          <SheetDescription>View all your pinned notes here.</SheetDescription>
        </SheetHeader>
        <ScrollArea className="h-5/6 p-3">
          <div className="grid gap-4 py-4"></div>
        </ScrollArea>
        <SheetFooter>
          <SheetClose asChild>
            <Button type="button">Close</Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
