
import React, { useState, useRef, useEffect, memo } from 'react';
import { Handle, NodeProps, Position, NodeResizer } from 'reactflow';
import { PostItNoteItem } from '@/Types/postIt';
import { useData } from '@/context/postItContext';
import { BiPin } from "react-icons/bi";

import {
    ContextMenu,
    ContextMenuContent,
    ContextMenuItem,
    ContextMenuSeparator,
    ContextMenuShortcut,
    ContextMenuTrigger,
} from "@/components/ui/context-menu"

import useCopyPaste from "@/hooks/useCopyPaste";

const PostItNode: React.FC<NodeProps> = ({ data, selected }) => {
    const [noteData, setNoteData] = useState<PostItNoteItem>(data);
    const { nodes, setNodes } = useData();
    const noteContainer = useRef<HTMLDivElement>(null);
    const contentRef = useRef<HTMLDivElement>(null);
      // function to handle data changes in input and text area elements
    const handleDataChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const target = e.target as HTMLInputElement & HTMLTextAreaElement;
        //toast.message(e.target.value);
        setNoteData({
            ...noteData,
            [target.name]: target.value,
        });
    };

    // function to handle data update to global state
    const handleUpdate = (nodeId: string) => {
        const updatedNodes = nodes.map((n) => {
            if (n.id === nodeId) {
                return {
                    ...n,
                    data: { ...n.data, ...{ title: noteData.title, description: noteData.description } },
                };
            }
            return n;
        });
        setNodes(updatedNodes);
    };

    // custom hook for updating data to global state with click outside event 

    const { cut, copy, paste, bufferedNodes } = useCopyPaste();

    const canPaste = bufferedNodes.length > 0;

    useEffect(() => {
        if (noteContainer.current && !noteContainer.current.innerHTML) {
            noteContainer.current.innerHTML = noteData.label;
        }
    }, [noteData.label]);

    const handlePin = () => {
        console.log("pin button is clicked!");
        noteData.pinned = !noteData.pinned;
    }

    return (
        <>
            <ContextMenu>
                <ContextMenuTrigger>
                    <div ref={noteContainer} style={{ backgroundColor: '#FFDD55', padding: '10px', borderRadius: '5px' }}>
                        <NodeResizer color="#ff0071" isVisible={selected} minWidth={100} minHeight={30} />
                        <Handle type="target" position={Position.Left} style={{ background: '#FEB2B2', borderRadius: '4px' }} />
                        <div className="relative" style={{ backgroundColor: data.color, padding: 10 }}>
                            {noteData.pinned ?
                                <div className='absolute top-1 right-1 bg-white p-1 rounded-sm'>
                                    <BiPin />
                                </div>
                                : null
                            }
                           <div className="flex items-center justify-between space-x-8">
                <input
                    className="w-full cursor-text p-2 font-bold bg-transparent"
                    name="title"
                    value={noteData.title}
                    onChange={handleDataChange}
                />
                 <button onClick={()=>{handleUpdate(noteData.id)}}>update</button>
            </div>
            <textarea
                className="text-sm text-gray-600 bg-transparent w-64 h-32"
                name="description"
                value={noteData.description}
                onChange={handleDataChange}
            />
                        </div>
                        <Handle type="source" position={Position.Right} style={{ background: '#FEB2B2', borderRadius: '4px' }} />
                    </div>
                </ContextMenuTrigger>
                <ContextMenuContent className="w-64">
                    <ContextMenuItem inset onClick={() => copy()}>
                        Copy
                        <ContextMenuShortcut>⌘C</ContextMenuShortcut>
                    </ContextMenuItem>
                    <ContextMenuItem inset onClick={() => paste()} disabled={!canPaste}>
                        Paste
                        <ContextMenuShortcut>⌘V</ContextMenuShortcut>
                    </ContextMenuItem>
                    <ContextMenuItem inset onClick={() => cut()}>
                        Cut
                        <ContextMenuShortcut>⌘X</ContextMenuShortcut>
                    </ContextMenuItem>
                    <ContextMenuSeparator />
                    <ContextMenuItem inset>
                        Bring to the front
                    </ContextMenuItem>
                    <ContextMenuItem inset>
                        Bring to the back
                    </ContextMenuItem>
                    <ContextMenuItem inset>
                        Detach from cluster
                    </ContextMenuItem>
                    <ContextMenuSeparator />
                    <ContextMenuItem inset onClick={handlePin}>
                        Pin
                    </ContextMenuItem>
                    <ContextMenuItem inset onClick={handlePin}>
                        Unpin
                    </ContextMenuItem>
                    <ContextMenuItem inset>
                        Comment
                    </ContextMenuItem>
                    <ContextMenuItem inset>
                        Start Vote
                    </ContextMenuItem>
                    <ContextMenuItem inset>
                        Lock
                    </ContextMenuItem>
                </ContextMenuContent>
            </ContextMenu >
        </>

    );
};

export default memo(PostItNode);