// components/PostItNode.tsx
import React from 'react';
import { Handle, NodeProps, Position } from 'reactflow';

const PostItNode: React.FC<NodeProps> = ({ data }) => {
    return (
        <div style={{ backgroundColor: '#FED7D7', padding: '10px', borderRadius: '5px' }}>
            <Handle type="target" position={Position.Top} style={{ background: '#FEB2B2', borderRadius: '4px' }} />
            <div contentEditable style={{ minHeight: '50px', outline: 'none' }}>
                {data.label}
            </div>
            <Handle type="source" position={Position.Bottom} style={{ background: '#FEB2B2', borderRadius: '4px' }} />
        </div>
    );
};

export default PostItNode;
