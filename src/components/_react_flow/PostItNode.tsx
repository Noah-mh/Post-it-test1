import React, { useRef, useEffect, memo } from 'react';
import { Handle, NodeProps, Position, NodeResizer } from 'reactflow';
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
    const contentRef = useRef<HTMLDivElement>(null);

    const { cut, copy, paste, bufferedNodes } = useCopyPaste();

    const canPaste = bufferedNodes.length > 0;

    useEffect(() => {
        if (contentRef.current && !contentRef.current.innerHTML) {
            contentRef.current.innerHTML = data.label;
        }
    }, [data.label]);

    const handlePin = () => {
        console.log("pin button is clicked!");
        data.pinned = !data.pinned;
    }

    return (
        <>
            <ContextMenu>
                <ContextMenuTrigger>
                    <div style={{ borderRadius: '5px' }}>
                        <NodeResizer color="#ff0071" isVisible={selected} minWidth={100} minHeight={30} />
                        <Handle type="target" position={Position.Left} style={{ background: '#FEB2B2', borderRadius: '4px' }} />
                        <div className="relative" style={{ backgroundColor: data.color, padding: 10 }}>
                            {data.pinned ?
                                <div className='absolute top-1 right-1 bg-white p-1 rounded-sm'>
                                    <BiPin />
                                </div>
                                : null
                            }
                            {data.label}
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