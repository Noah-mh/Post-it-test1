import { useState, useCallback, useEffect, useRef } from 'react';
import { Node, useReactFlow, getConnectedEdges, Edge, XYPosition, useStore } from 'reactflow';

export function useCopyPaste<NodeData, EdgeData>() {
  const mousePosRef = useRef<XYPosition>({ x: 0, y: 0 });
  const rfDomNode = useStore((state) => state.domNode);

  const { getNodes, setNodes, getEdges, setEdges, project } = useReactFlow<NodeData, EdgeData>();

  // Set up the paste buffers to store the copied nodes and edges.
  const [bufferedNodes, setBufferedNodes] = useState([] as Node<NodeData>[]);
  const [bufferedEdges, setBufferedEdges] = useState([] as Edge<EdgeData>[]);

  const enableShortcuts = true;

  // initialize the copy/paste hook
  // 1. remove native copy/paste/cut handlers
  // 2. add mouse move handler to keep track of the current mouse position
  useEffect(() => {
    const events = ['cut', 'copy', 'paste'];

    if (rfDomNode) {
      const preventDefault = (e: Event) => e.preventDefault();

      const onMouseMove = (event: MouseEvent) => {
        const bounds = rfDomNode.getBoundingClientRect();
        mousePosRef.current = {
          x: event.clientX - (bounds?.left ?? 0),
          y: event.clientY - (bounds?.top ?? 0),
        };
      };

      for (const event of events) {
        rfDomNode.addEventListener(event, preventDefault);
      }

      rfDomNode.addEventListener('mousemove', onMouseMove);

      return () => {
        for (const event of events) {
          rfDomNode.removeEventListener(event, preventDefault);
        }

        rfDomNode.removeEventListener('mousemove', onMouseMove);
      };
    }
  }, [rfDomNode]);

  const copy = useCallback(() => {
    const selectedNodes = getNodes().filter((node) => node.selected);
    const selectedEdges = getConnectedEdges(selectedNodes, getEdges()).filter((edge) => {
      const isExternalSource = selectedNodes.every((n) => n.id !== edge.source);
      const isExternalTarget = selectedNodes.every((n) => n.id !== edge.target);

      return !(isExternalSource || isExternalTarget);
    });

    setBufferedNodes(selectedNodes);
    setBufferedEdges(selectedEdges);
  }, [getNodes, getEdges]);

  const cut = useCallback(() => {
    const selectedNodes = getNodes().filter((node) => node.selected);
    const selectedEdges = getConnectedEdges(selectedNodes, getEdges()).filter((edge) => {
      const isExternalSource = selectedNodes.every((n) => n.id !== edge.source);
      const isExternalTarget = selectedNodes.every((n) => n.id !== edge.target);

      return !(isExternalSource || isExternalTarget);
    });

    setBufferedNodes(selectedNodes);
    setBufferedEdges(selectedEdges);

    // A cut action needs to remove the copied nodes and edges from the graph.
    setNodes((nodes) => nodes.filter((node) => !node.selected));
    setEdges((edges) => edges.filter((edge) => !selectedEdges.includes(edge)));
  }, [getNodes, setNodes, getEdges, setEdges]);

  const paste = useCallback(
    ({ x: pasteX, y: pasteY } = project({ x: mousePosRef.current.x, y: mousePosRef.current.y })) => {
      const minX = Math.min(...bufferedNodes.map((s) => s.position.x));
      const minY = Math.min(...bufferedNodes.map((s) => s.position.y));

      const now = Date.now();

      const newNodes: Node<NodeData>[] = bufferedNodes.map((node) => {
        const id = `${node.id}-${now}`;
        const x = pasteX + (node.position.x - minX);
        const y = pasteY + (node.position.y - minY);

        return { ...node, id, position: { x, y } };
      });

      const newEdges: Edge<EdgeData>[] = bufferedEdges.map((edge) => {
        const id = `${edge.id}-${now}`;
        const source = `${edge.source}-${now}`;
        const target = `${edge.target}-${now}`;

        return { ...edge, id, source, target };
      });

      setNodes((nodes) => [...nodes.map((node) => ({ ...node, selected: false })), ...newNodes]);
      setEdges((edges) => [...edges, ...newEdges]);
    },
    [bufferedNodes, bufferedEdges, project, setNodes, setEdges]
  );

  useEffect(() => {

    const keyDownHandler = (event: KeyboardEvent) => {
      if (event.key === 'c' && (event.ctrlKey || event.metaKey)) {
        copy();
      }  else if (event.key === 'v' && (event.ctrlKey || event.metaKey)) {
        paste();
      } else if (event.key === 'x' && (event.ctrlKey || event.metaKey)) {
        cut();
      }
    };

    document.addEventListener('keydown', keyDownHandler);

    return () => {
      document.removeEventListener('keydown', keyDownHandler);
    };
  }, [cut, copy, paste, enableShortcuts]);

  return { cut, copy, paste, bufferedNodes, bufferedEdges };
}

export default useCopyPaste;
