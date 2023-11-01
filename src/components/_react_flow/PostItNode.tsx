
import React, { useState, useRef, useEffect, memo } from 'react';
import { Handle, NodeProps, Position, NodeResizer, useReactFlow } from 'reactflow';
import { PostItNoteItem } from '@/Types/postIt';
import { BiPin, BiTrash } from "react-icons/bi";
import { PiEyeClosedDuotone } from "react-icons/pi";
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
    const rfInstance = useReactFlow();
    const nodes = rfInstance.getNodes();
    const { setNodes } = rfInstance;
    const [isInputEditable, setInputEditable] = useState<boolean>(false);
    const [isTextareaEditable, setTextareaEditable] = useState<boolean>(false);
    const noteContainer = useRef<HTMLDivElement>(null);
    const initialNoteDataRef = useRef<PostItNoteItem>(data);
    // const contentRef = useRef<HTMLDivElement>(null);
    // function to handle data changes in input and text area elements
    const handleDataChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const target = e.target as HTMLInputElement & HTMLTextAreaElement;
        setNoteData({
            ...noteData,
            [target.name]: target.value,
        });
    };

    // function to handle data update to global state
    const handleUpdate = (nodeId: string | null) => {
        if (nodeId) {
            const updatedNodes = nodes?.map((n) => {
                if (n.id === nodeId) {
                    return {
                        ...n,
                        data: { ...n.data, ...{ title: noteData.title, description: noteData.description } },
                    };
                }
                return n;
            });
            setNodes(updatedNodes);
        }
    };

    const hideNode = (nodeId: string) => {
        const hidedNodes = nodes?.map((n) => {
            if (n.id === nodeId) {
                return {
                    ...n,
                    hidden: true,
                }
            }
            return n;
        });
        setNodes(hidedNodes);
    };

    const deleteNode = (nodeId: string) => {
        const filteredNodes = nodes?.filter((n) => n.id !== nodeId);
        setNodes(filteredNodes);
    };

    const { cut, copy, paste, bufferedNodes } = useCopyPaste();

    const canPaste = bufferedNodes.length > 0;

    // useEffect(() => {
    //     if (noteContainer.current && !noteContainer.current.innerHTML) {
    //         noteContainer.current.innerHTML = noteData.label;
    //     }
    // }, [noteData.label]);


    const handlePin = () => {
        console.log("pin button is clicked!");
        noteData.pinned = !noteData.pinned;
    }
    // custom hook for updating data to global state with click outside event 
    useEffect(() => {
        function clickOutsideEvent(event: MouseEvent) {
            if (noteContainer.current && !noteContainer.current.contains(event.target as HTMLElement)) {
                setInputEditable(false);
                setTextareaEditable(false);
                if (JSON.stringify(noteData) !== JSON.stringify(initialNoteDataRef.current)) {
                    handleUpdate(noteData.id);
                    initialNoteDataRef.current = noteData;
                }
            }
        }
        document.addEventListener("click", clickOutsideEvent);
        return () => {
            document.removeEventListener("click", clickOutsideEvent);
        };
    }, [noteData])

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
                            <div className="flex items-center justify-between space-x-8 pt-2">
                                <input
                                    className={`w-full cursor-text p-2 font-bold bg-transparent ${isInputEditable ? 'focus:outline-auto' : 'focus:outline-none'} outline-1`}
                                    name="title"
                                    readOnly={!isInputEditable}
                                    value={noteData.title}
                                    onChange={handleDataChange}
                                    onDoubleClick={() => { setInputEditable(true); window?.getSelection()?.removeAllRanges(); }}
                                />
                                <PiEyeClosedDuotone
                                    className="h-10 w-10 cursor-pointer transition-all hover:text-gray-600"
                                    onClick={() => { hideNode(noteData.id) }} />
                                <BiTrash
                                    className="h-10 w-10 cursor-pointer transition-all hover:text-red-600"
                                    onClick={() => { deleteNode(noteData.id) }} />
                            </div>
                            <textarea
                                className={`text-sm cursor-text p-2 text-gray-600 bg-transparent w-full h-32 ${isTextareaEditable ? "outline" : "outline-none"} outline-1`}
                                name="description"
                                readOnly={!isTextareaEditable}
                                value={noteData.description}
                                onChange={handleDataChange}
                                onDoubleClick={() => { setTextareaEditable(true); window?.getSelection()?.removeAllRanges(); }}
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