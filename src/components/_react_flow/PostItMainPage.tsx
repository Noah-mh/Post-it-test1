import { api } from "@/utils/api"; // import api to use trpc APIs
import React, { useState, useRef, useCallback, useEffect } from "react"; // import react hooks
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
    ProOptions,
    NodeDragHandler,
    SelectionDragHandler,
    OnNodesDelete,
    OnEdgesDelete,
    useNodesState,
    SelectionMode,
} from "reactflow"; // import required props from reactflow
import "reactflow/dist/style.css";

import { Button } from "@/components/ui/button";
import IconButton from "@/components/_react_flow/IconButton/IconButton";
import useUndoRedo from "@/hooks/useUndoRedo"; //import custom hook for undo redo
import { PostItNodeElement } from "@/Types/postIt"; // import type for postit node
import PostItNode from "@/components/_react_flow/PostItNode"; // import custom node for postit node
import { on } from "events";
import Header from "./Header";
import Comment from "./Comment";
import { v4 as uuidv4 } from "uuid";
import { StickyNote, Undo, Redo, MessageCircle } from "lucide-react";
import { useUser } from "@clerk/nextjs";

// create new node type for reactflow
const nodeTypes = {
    postItNode: PostItNode,
};

const proOptions: ProOptions = { account: "paid-pro", hideAttribution: true };

export default () => {
    const { user } = useUser();
    const reactFlowWrapper = useRef<HTMLDivElement>(null);
    const id: string = "clo6tzkzs0000us4wi39z9qld"; // for demo purposes, now we use default id. in the production environment, this id will be received when from BE form DB.
    const [nodes, setNodes, onNodesChange] = useNodesState([]);
    const [edges, setEdges, onEdgesChange] = useEdgesState([]);
    const [rfInstance, setRfInstance] = useState<ReactFlowInstance | null>(null);
    const { setViewport } = useReactFlow();
    const [openCreateComment, setOpenCreateComment] = useState(false);
    const [selectedNodeId, setSelectedNodeId] = useState<any>(null);
    const [selectedNodeObj, setSelectedNodeObj] = useState();

    const { undo, redo, takeSnapshot, canUndo, canRedo, past, future } =
        useUndoRedo();

    //Obtains node ID of selected node/postit
    const onSelectionChangeFunc = (elements: any) => {
        if (elements.nodes.length === 1) {
            setSelectedNodeObj(elements.nodes[0]);
            setSelectedNodeId(elements.nodes[0].id);
        } else {
            setSelectedNodeId(null);
        }
    };

    const createComment = (selectedNodeId: string, comment: string) => {
        return new Promise(async (resolve, reject) => {
            if (rfInstance == undefined) return;
            let flow = rfInstance.toObject();
            flow.nodes.forEach((node) => {
                if (node.id == selectedNodeId) {
                    console.log(node.id);
                    node.data.comments == undefined
                        ? (node.data.comments = [
                            { userId: user?.id, commentId: uuidv4(), comment: comment },
                        ])
                        : node.data.comments.push({
                            userId: user?.id,
                            commentId: uuidv4(),
                            comment: comment,
                        });
                }
            });

            await postItUpdate.mutateAsync({ id: id, state: flow }).then((res) => {
                resolve(res);
            });
        });
    };

    useEffect(() => {
        console.log("past", past);
        console.log("future", future);
    }, [past, future]);

    const postItUpdate = api.postIt.postItUpdate.useMutation(); // api usage for update
    const { data: postIt, isLoading } = api.postIt.postItSelect.useQuery({
        id: id,
    }); // api call to fetch data with trpc call from prisma orm
    const onConnect = useCallback(
        (params: Edge | Connection) => {
            takeSnapshot();
            setEdges((eds) => addEdge(params, eds));
        },
        [setEdges, takeSnapshot],
    );
    const onDragOver = useCallback((event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        event.dataTransfer.dropEffect = "move";
    }, []);

    const onNodeDragStart: NodeDragHandler = useCallback(() => {
        // 👇 make dragging a node undoable
        takeSnapshot();
        // 👉 you can place your event handlers here
    }, [takeSnapshot]);

    const onSelectionDragStart: SelectionDragHandler = useCallback(() => {
        // 👇 make dragging a selection undoable
        takeSnapshot();
    }, [takeSnapshot]);

    const onNodesDelete: OnNodesDelete = useCallback(() => {
        // 👇 make deleting nodes undoable
        takeSnapshot();
    }, [takeSnapshot]);

    const onEdgesDelete: OnEdgesDelete = useCallback(() => {
        // 👇 make deleting edges undoable
        takeSnapshot();
    }, [takeSnapshot]);
    const getId = (): string => uuidv4(); // creating unique ids for each nodes.
    const onDrop = useCallback(
        (event: React.DragEvent<HTMLDivElement>) => {
            takeSnapshot();
            event.preventDefault();

            const reactFlowBounds = reactFlowWrapper.current?.getBoundingClientRect();
            const type = event.dataTransfer.getData("application/reactflow");

            // check if the dropped element is valid
            if (typeof type === "undefined" || !type || !reactFlowBounds) {
                return;
            }

            const position = rfInstance?.project({
                x: event.clientX - (reactFlowBounds?.left || 0),
                y: event.clientY - (reactFlowBounds?.top || 0),
            }) ?? { x: 0, y: 0 };
            const newNodeId = getId();
            const newNode: PostItNodeElement = {
                id: newNodeId,
                type: "postItNode", // use your custom node type
                position,
                data: {
                    id: newNodeId,
                    title: "A new idea 💡",
                    description: "Time to shine with your idea",
                }, // default content
            };

            setNodes((nds) => nds.concat([newNode]));
        },
        [rfInstance, takeSnapshot],
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
    }, [postIt]);
    const panOnDrag = [1, 2];

    // UI element to display when data is loading from database
    if (isLoading) {
        return <div>Loading...</div>; // will implement better UI after discussion for libs is over
    }
    return (
        <>
            <div className="" ref={reactFlowWrapper} style={{ height: "90vh" }}>
                {openCreateComment ? <Comment /> : null}
                <Header onSave={onSave} />
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
                    onNodeDragStart={onNodeDragStart}
                    onSelectionDragStart={onSelectionDragStart}
                    onNodesDelete={onNodesDelete}
                    onEdgesDelete={onEdgesDelete}
                    onSelectionChange={onSelectionChangeFunc}
                    fitView
                    proOptions={proOptions}
                    panOnScroll
                    selectionOnDrag
                    panOnDrag={panOnDrag}
                    selectionMode={SelectionMode.Partial}
                    style={{ width: "100%", height: "100%" }}
                >
                    {/* <Panel position="top-right">
            <Button className="border border-black p-3" onClick={onSave}>
              save
            </Button>
            <Button className="border border-black p-3" onClick={onRestore}>restore</Button>
          </Panel> */}
                    <Panel position="bottom-center">
                        <div className="flex gap-x-3 rounded-lg bg-gray-200 p-2">
                            <IconButton
                                text={"You can drag these nodes to the pane!"}
                                icon={<StickyNote size={"20px"} />}
                                draggable={true}
                            />
                            <button disabled={canUndo} onClick={undo}>
                                <IconButton
                                    text={"Undo"}
                                    icon={<Undo size={"20px"} />}
                                    draggable={false}
                                />
                            </button>
                            <button disabled={canRedo} onClick={redo}>
                                <IconButton
                                    text={"Redo"}
                                    icon={<Redo size={"20px"} />}
                                    draggable={false}
                                />
                            </button>
                            <button
                                className="disabled:opacity-50"
                                onClick={() => {
                                    setOpenCreateComment(true);
                                }}
                                disabled={!selectedNodeId}
                                title="Please select a Post It!"
                            >
                                <Comment
                                    selectedNodeObj={selectedNodeObj}
                                    selectedNodeId={selectedNodeId}
                                    createCommentFunc={createComment}
                                >

                                </Comment>
                            </button>
                        </div>
                    </Panel>
                    <Controls />
                    <MiniMap />
                    <Background variant={"dots" as BackgroundVariant} gap={12} size={1} />
                </ReactFlow>
            </div>
        </>
    );
};
