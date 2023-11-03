import { useCallback, useEffect, useState } from "react";
import { Edge, Node, useReactFlow } from "reactflow";
import _ from "lodash";

type UseUndoRedoOptions = {
  maxHistorySize: number;
  enableShortcuts: boolean;
};

type UseUndoRedo = (options?: UseUndoRedoOptions) => {
  undo: () => void;
  redo: () => void;
  takeSnapshot: () => void;
  canUndo: boolean;
  canRedo: boolean;
  past: HistoryItem[];
  future: HistoryItem[];
};

type HistoryItem = {
  nodes: Node[];
  edges: Edge[];
};

const defaultOptions: UseUndoRedoOptions = {
  maxHistorySize: 100,
  enableShortcuts: true,
};

// https://redux.js.org/usage/implementing-undo-history
export const useUndoRedo: UseUndoRedo = ({
  maxHistorySize = defaultOptions.maxHistorySize,
  enableShortcuts = defaultOptions.enableShortcuts,
} = defaultOptions) => {
  // the past and future arrays store the states that we can jump to
  const [past, setPast] = useState<HistoryItem[]>([]);
  const [future, setFuture] = useState<HistoryItem[]>([]);

  const { setNodes, setEdges, getNodes, getEdges } = useReactFlow();

  // const takeSnapshot = useCallback(() => {
  //   // push the current graph to the past state
  //   if (
  //     past[past.length - 1]?.nodes === getNodes() &&
  //     past[past.length - 1]?.edges === getEdges()
  //   ) {
  //     return;
  //   }
  //   setPast((past) => [
  //     ...past.slice(past.length - maxHistorySize + 1, past.length),
  //     { nodes: getNodes(), edges: getEdges() },
  //   ]);
  //   console.log("past in takeSnapshot", past);

  //   // whenever we take a new snapshot, the redo operations need to be cleared to avoid state mismatches
  //   setFuture([]);
  // }, [getNodes, getEdges, maxHistorySize]);

  const isNode = (element: Node | Edge): element is Node => {
    return "position" in element;
  };

  const areNodesEqual = (node1: Node, node2: Node) => {
    return (
      node1.id === node2.id &&
      node1.type === node2.type &&
      node1.position.x === node2.position.x &&
      node1.position.y === node2.position.y &&
      _.isEqual(
        _.omit(node1.data, ["selected"]),
        _.omit(node2.data, ["selected"]),
      )
    );
  };

  const areEdgesEqual = (edge1: Edge, edge2: Edge) => {
    return (
      edge1.id === edge2.id &&
      edge1.type === edge2.type &&
      _.isEqual(
        _.omit(edge1.data, ["selected"]),
        _.omit(edge2.data, ["selected"]),
      )
      // compare any other relevant properties specific to edges
    );
  };

  const areArraysEqual = (array1: (Node | Edge)[], array2: (Node | Edge)[]) => {
    return (
      array1.length === array2.length &&
      array1.every((element, index) => {
        const element2 = array2[index];
        if (!element2) {
          // Element at the current index is undefined, return false to indicate arrays are not equal
          return false;
        }

        if (isNode(element) && isNode(element2)) {
          return areNodesEqual(element, element2);
        } else if (!isNode(element) && !isNode(element2)) {
          return areEdgesEqual(element as Edge, element2 as Edge);
        }

        // If element types don't match, arrays are not equal
        return false;
      })
    );
  };

  const takeSnapshot = useCallback(() => {
    // Get the current state of nodes and edges
    const currentNodes = getNodes();
    const currentEdges = getEdges();

    // Get the last entry from the past
    const lastSnapshot = past[past.length - 1];

    // Perform deep comparison for nodes and edges
    const isNodesSame =
      lastSnapshot && areArraysEqual(lastSnapshot.nodes, currentNodes);
    const isEdgesSame =
      lastSnapshot && areArraysEqual(lastSnapshot.edges, currentEdges);

    // If both nodes and edges are the same as the last entry, do not take a new snapshot
    if (isNodesSame && isEdgesSame) {
      return;
    }

    // Otherwise, add a new snapshot to the past array
    setPast((past) => [
      ...past.slice(past.length - maxHistorySize + 1),
      { nodes: currentNodes, edges: currentEdges },
    ]);

    console.log("took snapshot");

    // Clear the future because we can't redo after taking a new snapshot
    setFuture([]);
  }, [getNodes, getEdges, maxHistorySize, past]);

  const undo = useCallback(() => {
    // get the last state that we want to go back to
    const pastState = past[past.length - 1];

    if (pastState) {
      // first we remove the state from the history
      setPast((past) => past.slice(0, past.length - 1));
      // we store the current graph for the redo operation
      setFuture((future) => [
        ...future,
        { nodes: getNodes(), edges: getEdges() },
      ]);
      // now we can set the graph to the past state
      setNodes(pastState.nodes);
      setEdges(pastState.edges);
    }
  }, [setNodes, setEdges, getNodes, getEdges, past]);

  const redo = useCallback(() => {
    const futureState = future[future.length - 1];

    if (futureState) {
      setFuture((future) => future.slice(0, future.length - 1));
      setPast((past) => [...past, { nodes: getNodes(), edges: getEdges() }]);
      setNodes(futureState.nodes);
      setEdges(futureState.edges);
    }
  }, [setNodes, setEdges, getNodes, getEdges, future]);

  useEffect(() => {
    // this effect is used to attach the global event handlers
    if (!enableShortcuts) {
      return;
    }

    const keyDownHandler = (event: KeyboardEvent) => {
      if (
        event.key === "z" &&
        (event.ctrlKey || event.metaKey) &&
        event.shiftKey
      ) {
        redo();
      } else if (event.key === "z" && (event.ctrlKey || event.metaKey)) {
        undo();
      }
    };

    document.addEventListener("keydown", keyDownHandler);

    return () => {
      document.removeEventListener("keydown", keyDownHandler);
    };
  }, [undo, redo, enableShortcuts]);

  return {
    undo,
    redo,
    takeSnapshot,
    canUndo: !past.length,
    canRedo: !future.length,
    past,
    future,
  };
};

export default useUndoRedo;
