import React from 'react';
import { BiNote, BiSave } from "react-icons/bi";

import DownloadImageButton from '@/components/_react_flow/Header/DownloadImageButton';
import DownloadPDFButton from './DownloadPDFButton';
import { PinnedNotes } from './PinnedNotes';
import SidebarIcon from '@/components/_react_flow/Header/SidebarIcon';

interface SidebarProps {
    onSave?: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ onSave }: SidebarProps) => {
    return (
        <aside className='flex gap-x-3'>
            <SidebarIcon text={"You can drag these nodes to the pane!"} icon={<BiNote />} draggable={true} />
            <SidebarIcon text={"Save"} icon={<BiSave />} draggable={false} onclick={onSave} />
            <SidebarIcon text={"Pinned Notes"} icon={<PinnedNotes />} draggable={false} />
            <SidebarIcon text={"Download Image"} icon={<DownloadImageButton />} draggable={false} />
            <SidebarIcon text={"Download PDF"} icon={<DownloadPDFButton />} draggable={false} />
        </aside >
    );
};

export default Sidebar;