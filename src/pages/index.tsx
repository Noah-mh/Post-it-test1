import React, { useState, useRef, useEffect, useCallback } from 'react';
import ReactFlow, {
  ReactFlowProvider,
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  Connection,
  Edge,
  BackgroundVariant,
  useReactFlow,
  ReactFlowInstance,
  Node
} from 'reactflow';
import 'reactflow/dist/style.css';

import Header from "@/components/_react_flow/Header";
import PostItNode from "@/components/_react_flow/PostItNode";

const flowKey = 'example-flow';

type Elements = (Node | Edge)[];

let id = 0;
const getId = (): string => `dndnode_${id++}`;

const nodeTypes = {
  postItNode: PostItNode,
};

type PostItNodeElement = {
  id: string;
  type: string;
  position: { x: number; y: number };
  data: { label: string, pinned: boolean };
  style?: any;
};

const SaveRestore = () => {
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [rfInstance, setRfInstance] = useState<ReactFlowInstance | null>(null);
  const { setViewport } = useReactFlow();

  useEffect(() => {
    const updateHeight = () => {
      const windowHeight = window.innerHeight - 60;
      if (reactFlowWrapper.current) {
        reactFlowWrapper.current.style.height = `${windowHeight}px`;
      }
    };

    updateHeight();

    window.addEventListener('resize', updateHeight);

    return () => {
      window.removeEventListener('resize', updateHeight);
    };
  }, []);

  const onConnect = useCallback((params: Edge | Connection) => setEdges((eds) => addEdge(params, eds)), [setEdges]);

  const onDragOver = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

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
      const newNode: PostItNodeElement = {
        id: getId(),
        type: 'postItNode', // use your custom node type
        position,
        data: { label: 'A new idea 💡', pinned: false }, // default content
        style: { border: '1px solid black', borderRadius: 15, fontSize: 12, background: '#FED7D7' },
      };

      setNodes((nds) => nds.concat([newNode]));
    },
    [rfInstance]
  );

  const onSave = useCallback(() => {
    console.log("save button is clicked!");
    if (rfInstance) {
      const flow = rfInstance.toObject();
      localStorage.setItem(flowKey, JSON.stringify(flow));
    }
  }, [rfInstance]);

  const proOptions = {
    account: 'paid-pro',
    hideAttribution: true,
  };

  return (
    <>
      <div className="h-full" ref={reactFlowWrapper}>
        <Header onSave={onSave} />

        <ReactFlow
          proOptions={proOptions}
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
          style={{ width: '100%', height: '90%' }}
        >
          {/* <Panel className="fixed top-0 left-0 bg-gray w-full" position="top-left"> */}
          {/* <Header onSave={onSave} onRestore={onRestore} /> */}
          {/* </Panel> */}
          <Controls />
          <MiniMap />
          <Background variant={"dots" as BackgroundVariant} gap={12} size={1} />
        </ReactFlow>

      </div>
    </>
  );
};

export default function Home() {

  return (

    <ReactFlowProvider>
      <SaveRestore />
    </ReactFlowProvider>

  );
}
