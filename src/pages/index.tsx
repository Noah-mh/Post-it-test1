import Head from "next/head";
import Link from "next/link";

import { api } from "@/utils/api";
import React, { useState, useRef, useCallback } from 'react';
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
  Panel,
  ReactFlowInstance,
  Node
} from 'reactflow';
import 'reactflow/dist/style.css';

import { Button } from "@/components/ui/button";
import Sidebar from "@/components/_react_flow/Sidebar";
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
  data: { label: string };
};


const SaveRestore = () => {
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [rfInstance, setRfInstance] = useState<ReactFlowInstance | null>(null);
  const { setViewport } = useReactFlow();

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
        data: { label: 'A new idea 💡' }, // default content
      };

      setNodes((nds) => nds.concat([newNode]));
    },
    [rfInstance]
  );

  const onSave = useCallback(() => {
    if (rfInstance) {
      const flow = rfInstance.toObject();
      localStorage.setItem(flowKey, JSON.stringify(flow));
    }
  }, [rfInstance]);

  const onRestore = useCallback(() => {
    const restoreFlow = async () => {
      const flow = JSON.parse(localStorage.getItem(flowKey) as string);

      if (flow) {
        const { x = 0, y = 0, zoom = 1 } = flow.viewport;
        setNodes(flow.nodes || []);
        setEdges(flow.edges || []);
        setViewport({ x, y, zoom });
      }
    };

    restoreFlow();
  }, [setNodes, setViewport]);

  return (
    <>
      <div className="" ref={reactFlowWrapper} style={{ height: '800px' }}>
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
            <Button className="border border-black p-3" onClick={onRestore}>restore</Button>
          </Panel>
          <Controls />
          <MiniMap />
          <Background variant={"dots" as BackgroundVariant} gap={12} size={1} />
        </ReactFlow>

      </div><Sidebar />
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
