// components/PostItNode.tsx
import React, { useState, useRef, useEffect } from 'react';
import { Handle, NodeProps, Position } from 'reactflow';
import { PostItNoteItem } from '@/Types/postIt';
import { useData } from '@/context/postItContext';

const PostItNode: React.FC<NodeProps> = ({ data }) => {
    const [noteData, setNoteData] = useState<PostItNoteItem>(data);
    const { nodes, setNodes } = useData();
    const [isInputEditable, setInputEditable] = useState<Boolean>(false);
    const [isTextareaEditable, setTextareaEditable] = useState<Boolean>(false);
    const noteContainer = useRef<HTMLDivElement>(null);
    const [lastClickedNodeID, setLastClickedNodeID] = useState<string | null>(null);
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
    const handleUpdate = (nodeId: string | null) => {
        if (nodeId) {
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
        }
    };

    const hideNode = (nodeId: string) => {
        setNodes((prevNodes) => 
          prevNodes.map((node) => {
            if (node.id === nodeId) {
              return {
                ...node,
                hidden: true,
              };
            }
            return node;
          })
        );
      };
    
    // custom hook for updating data to global state with click outside event 
    useEffect(() => {
        function clickOutsideEvent(event: MouseEvent) {
            if (noteContainer.current && !noteContainer.current.contains(event.target as HTMLElement)) {
                setInputEditable(false);
                setTextareaEditable(false);
            }
            else {
                //console.log(noteData.id)
                setLastClickedNodeID(noteData.id); 
            }

            // if(noteContainer.current && noteContainer.current.contains(event.target as HTMLElement)) {
            //     console.log(noteContainer.current);
            //     const nestedDiv = Array.from(noteContainer.current.children).find((child: Element) => {
            //         return child.hasAttribute('data-nodeid');
            //       }) as HTMLElement;

            //       if (nestedDiv) {
            //         const dataID = nestedDiv.getAttribute('data-nodeid');
            //         if (dataID) {
            //           console.log(dataID);
            //         }
            //       }
            // }
        }
        document.addEventListener("click", clickOutsideEvent);
        return () => {
            document.removeEventListener("click", clickOutsideEvent);
        };
    }, [noteContainer])

    useEffect(() => {
        if (lastClickedNodeID !== null) {
            console.log("lastClickedNodeID", lastClickedNodeID);
            //handleUpdate(lastClickedNodeID);
            setLastClickedNodeID(null);
        }
    }, [lastClickedNodeID]);

    return (
        <div ref={noteContainer} style={{ backgroundColor: '#FFDD55', padding: '10px', borderRadius: '5px' }}>
            <Handle type="target" position={Position.Top} style={{ background: '#FEB2B2', borderRadius: '4px' }} />
            <div className="flex items-center justify-between space-x-8">
                <input
                    className={`w-full cursor-text p-2 font-bold bg-transparent ${isInputEditable ? 'focus:outline' : 'focus:outline-none'}`}
                    name="title"
                    readOnly={!isInputEditable}
                    value={noteData.title}
                    onChange={handleDataChange}
                    onDoubleClick={() => { setInputEditable(!isInputEditable) }}
                />
                <button onClick={() => { handleUpdate(noteData.id) }}>update</button>
                <button onClick={() => { hideNode(noteData.id)}}>hide</button>
            </div>
            <textarea
                className={`text-sm text-gray-600 bg-transparent w-full h-32 ${isTextareaEditable ? 'focus:outline' : 'focus:outline-none'}`}
                readOnly={!isTextareaEditable}
                name="description"
                value={noteData.description}
                onChange={handleDataChange}
                onDoubleClick={() => { setTextareaEditable(!isTextareaEditable) }}
            />
            <Handle type="source" position={Position.Bottom} style={{ background: '#FEB2B2', borderRadius: '4px' }} />
        </div>
    );
};

export default PostItNode;
