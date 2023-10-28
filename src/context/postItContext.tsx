// context for global state handling
import React, { createContext, useContext, ReactNode, useState } from 'react';
import { Node } from 'reactflow';
interface DataContextProps {
    nodes: Node[];
    setNodes: React.Dispatch<React.SetStateAction<Node[]>>;
}

const DataContext = createContext<DataContextProps | undefined>(undefined);

interface DataProviderProps {
    children: ReactNode;
}

export const DataProvider: React.FC<DataProviderProps> = ({ children }) => {
    const [nodes, setNodes] = useState<Node[]>([]);
    return (
        <DataContext.Provider value={{ nodes, setNodes }}>
            {children}
        </DataContext.Provider>
    );
};

export const useData = (): DataContextProps => {
    const context = useContext(DataContext);
    if (!context) {
        throw new Error('useData must be used within a DataProvider');
    }
    return context;
};
