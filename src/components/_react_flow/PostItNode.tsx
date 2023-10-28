// components/PostItNode.tsx
import React, { useState, useRef, useEffect } from 'react';
import { Handle, NodeProps, Position } from 'reactflow';
import { PostItNoteItem } from '@/Types/postIt';
import { useData } from '@/context/postItContext';

const PostItNode: React.FC<NodeProps> = ({ data }) => {
    const [noteData, setNoteData] = useState<PostItNoteItem>(data);
    const { nodes, setNodes } = useData();
    const noteContainer = useRef<HTMLDivElement>(null);

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
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
          if (noteContainer.current && !noteContainer.current.contains(event.target as Node)) {
            handleUpdate(data.id);
          }
        }
        
        document.addEventListener('mousedown', handleClickOutside);
        
        return () => {
          document.removeEventListener('mousedown', handleClickOutside);
        };
      }, [data, noteData, nodes]);

    return (
        <div ref={noteContainer} style={{ backgroundColor: '#FFDD55', padding: '10px', borderRadius: '5px' }}>
            <Handle type="target" position={Position.Top} style={{ background: '#FEB2B2', borderRadius: '4px' }} />
            <div className="flex items-center justify-between space-x-8">
                <input
                    className="w-full cursor-text p-2 font-bold bg-transparent"
                    name="title"
                    value={noteData.title}
                    onChange={handleDataChange}
                />
            </div>
            <textarea
                className="text-sm text-gray-600 bg-transparent w-64 h-32"
                name="description"
                value={noteData.description}
                onChange={handleDataChange}
            />
            <Handle type="source" position={Position.Bottom} style={{ background: '#FEB2B2', borderRadius: '4px' }} />
        </div>
    );
};

export default PostItNode;
