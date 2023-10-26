import React from 'react';

export default () => {
    const onDragStart = (event: React.DragEvent<HTMLDivElement>, nodeType: string) => {
        event.dataTransfer.setData('application/reactflow', nodeType);
        event.dataTransfer.effectAllowed = 'move';
    };
    const postItStyle = {
        backgroundColor: '#FFEB3B', // Yellow color, similar to post-it notes
        padding: '10px',
        borderRadius: '5px',
        boxShadow: '2px 2px 5px rgba(0, 0, 0, 0.2)', // Adding a slight shadow
        marginBottom: '10px'
    };

    return (
        <aside>
            <div className="">You can drag these nodes to the pane </div>
            <div style={postItStyle} onDragStart={(event) => onDragStart(event, 'postItNode')} draggable>
                Post It Node
            </div>
        </aside>
    );
};