import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
    SheetFooter,
    SheetClose
} from "@/components/ui/sheet"
import { BiPin } from "react-icons/bi";
import ReactFlow, { useReactFlow } from 'reactflow';
import { ScrollArea } from "@/components/ui/scroll-area"
import { Button } from "@/components/ui/button";

export function PinnedNotes() {
    const reactFlowInstance = useReactFlow();
    const nodes = reactFlowInstance?.getNodes() || [];
    console.log('nodes: ', nodes);

    return (
        <Sheet>
            <SheetTrigger asChild>
                <BiPin />
            </SheetTrigger>
            <SheetContent>
                <SheetHeader>
                    <SheetTitle>Pinned Notes</SheetTitle>
                    <SheetDescription>
                        View all your pinned notes here.
                    </SheetDescription>
                </SheetHeader>
                <ScrollArea className="h-5/6 p-3">
                    <div className="grid gap-4 py-4">
                        {
                            nodes.filter(node => node.data.pinned).map(node => (
                                <div key={node.id} style={{ border: '1px solid black', borderRadius: 15, fontSize: 12, background: '#FED7D7', padding: 20 }}>
                                    {node.data.label}
                                </div>
                            ))
                        }
                    </div>
                </ScrollArea>
                <SheetFooter>
                    <SheetClose asChild>
                        <Button type="button">Close</Button>
                    </SheetClose>
                </SheetFooter>
            </SheetContent>
        </Sheet >
    )
}
