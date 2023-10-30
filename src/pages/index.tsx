import Head from "next/head";
import Link from "next/link";
import React from 'react';
import ReactFlow, { ReactFlowProvider } from 'reactflow';
import 'reactflow/dist/style.css';
import { DataProvider } from "@/context/postItContext";
import { default as PostItMainPage } from "@/components/_react_flow/PostItMainPage"

export default function Home() {

  return (

    <DataProvider>
      <ReactFlowProvider>
        <PostItMainPage/>
      </ReactFlowProvider>
    </DataProvider>

  );
}
