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
import { Eye } from "lucide-react";
import ReactFlow, { useReactFlow } from 'reactflow';
import { ScrollArea } from "@/components/ui/scroll-area"
import { Button } from "@/components/ui/button";

export function HidedNotes() {
    const reactFlowInstance = useReactFlow();
    const nodes = reactFlowInstance?.getNodes() || [];
    // console.log(nodes);

    const unhideNotes = (nodeId: string) => {
        console.log(nodeId)
        reactFlowInstance.setNodes((prevNodes) =>
            prevNodes.map((node) => {
                if (node.id === nodeId) {
                    return {
                        ...node,
                        hidden: false,
                    };
                }
                return node;
            })
        );
    };

    return (
        <Sheet>
            <SheetTrigger asChild>
                <Eye size={"20px"} />
            </SheetTrigger>
            <SheetContent>
                <SheetHeader>
                    <SheetTitle>Hided Notes</SheetTitle>
                    <SheetDescription>
                        View all your hided notes here.
                    </SheetDescription>
                </SheetHeader>
                <ScrollArea className="h-5/6 p-3">
                    <div className="grid gap-4 py-4">
                        {
                            nodes.filter(node => node.hasOwnProperty('hidden') && node.hidden === true).map(node => (
                                <div key={node.id} style={{ border: '1px solid black', borderRadius: 15, fontSize: 12, background: '#FED7D7', padding: 20 }} className="flex flex-row justify-between">
                                    {node.data.title}
                                    <Eye size={"20px"} onClick={() => { unhideNotes(node.id) }} />
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
