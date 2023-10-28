import { api } from '@/utils/api'; // import api to use trpc APIs
import React, { useState, useRef, useCallback, useEffect } from 'react'; // import react hooks
import ReactFlow, {
    MiniMap,
    Controls,
    Background,
    useEdgesState,
    addEdge,
    Connection,
    Edge,
    BackgroundVariant,
    useReactFlow,
    Panel,
    ReactFlowInstance,
    applyNodeChanges
} from 'reactflow';// import required props from reactflow
import 'reactflow/dist/style.css';

import { Button } from "@/components/ui/button";
import Sidebar from "@/components/_react_flow/Sidebar";
import { PostItNodeElement } from "@/Types/postIt"; // import type for postit node
import PostItNode from "@/components/_react_flow/PostItNode"; // import custom node for postit node
import { useData } from "@/context/postItContext"; // import useData for share state globally for all components

// create new node type for reactflow
const nodeTypes = {
    postItNode: PostItNode,
};

export default () => {
    const reactFlowWrapper = useRef<HTMLDivElement>(null);
    const id: string = "clo6tzkzs0000us4wi39z9qld"; // for demo purposes, now we use default id. in the production environment, this id will be received when from BE form DB.
    const { nodes, setNodes } = useData(); // sharing data with context hook
    const [edges, setEdges, onEdgesChange] = useEdgesState([]);
    const [rfInstance, setRfInstance] = useState<ReactFlowInstance | null>(null);
    const { setViewport } = useReactFlow();
    const postItUpdate = api.postIt.postItUpdate.useMutation(); // api usage for update
    const { data: postIt, isLoading } = api.postIt.postItSelect.useQuery({ id: id }); // api call to fetch data with trpc call from prisma orm
    const onNodesChange = useCallback((changes: any) => setNodes((nds) => applyNodeChanges(changes, nds)), []); // callback function to update nodes with changes
    const onConnect = useCallback((params: Edge | Connection) => setEdges((eds) => addEdge(params, eds)), [setEdges]);
    const onDragOver = useCallback((event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        event.dataTransfer.dropEffect = 'move';
    }, []);

    const getId = (): string => `dndnode_${nodes.length++}`; // creating unique ids for each nodes.
    const onDrop = useCallback(
        (event: React.DragEvent<HTMLDivElement>) => {
            event.preventDefault();

            const reactFlowBounds = reactFlowWrapper.current?.getBoundingClientRect();
            const type = event.dataTransfer.getData('application/reactflow');

            // check if the dropped element is valid
            if (typeof type === 'undefined' || !type || !reactFlowBounds) {
                return;
            }

            const position = rfInstance?.project({
                x: event.clientX - (reactFlowBounds?.left || 0),
                y: event.clientY - (reactFlowBounds?.top || 0),
            }) ?? { x: 0, y: 0 };
            const newNodeId = getId();
            const newNode: PostItNodeElement = {
                id: newNodeId,
                type: 'postItNode', // use your custom node type
                position,
                data: { id: newNodeId, title: 'A new idea 💡', description: "Time to shine with your idea" }, // default content
            };

            setNodes((nds) => nds.concat([newNode]));
        },
        [rfInstance]
    );

    // callback function to save the data of the whole page in json format
    const onSave = useCallback(() => {
        if (rfInstance) {
            const flow = rfInstance.toObject();
            postItUpdate.mutateAsync({ id: id, state: flow }).then((res) => {
                console.log(res); // will implement better error handlings
            });
        }
    }, [rfInstance]);

    // useEffect to load the data from the database
    useEffect(() => {
        const restoreFlow = async () => {
            if (!postIt) return;
            const flow = (postIt as any).state;

            if (flow) {
                const { x = 0, y = 0, zoom = 1 } = flow.viewport;
                setNodes(flow.nodes || []);
                setEdges(flow.edges || []);
                setViewport({ x, y, zoom });
            }
        };

        restoreFlow();
    }, [postIt])

    // UI element to display when data is loading from database
    if (isLoading) {
        return <div>Loading...</div> // will implement better UI after discussion for libs is over
    }
    return (
        <>
            <div className="" ref={reactFlowWrapper} style={{ height: '90vh' }}>
                <ReactFlow
                    nodeTypes={nodeTypes}
                    nodes={nodes}
                    edges={edges}
                    onNodesChange={onNodesChange}
                    onEdgesChange={onEdgesChange}
                    onConnect={onConnect}
                    onInit={setRfInstance}
                    onDrop={onDrop}
                    onDragOver={onDragOver}
                    fitView
                    style={{ width: '100%', height: '100%' }}
                >
                    <Panel position="top-right">
                        <Button className="border border-black p-3" onClick={onSave}>save</Button>
                        {/* <Button className="border border-black p-3" onClick={onRestore}>restore</Button> */}
                    </Panel>
                    <Controls />
                    <MiniMap />
                </ReactFlow>

            </div><Sidebar />
        </>
    );
}