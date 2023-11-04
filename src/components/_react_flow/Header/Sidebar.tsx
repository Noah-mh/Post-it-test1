import React from 'react';
import { Save } from 'lucide-react';

import DownloadImageButton from '@/components/_react_flow/Header/DownloadImageButton';
import DownloadPDFButton from './DownloadPDFButton';
import IconButton from '../IconButton/IconButton';
import { PinnedNotes } from './PinnedNotes';
import { HidedNotes } from './HidedNotes';
interface SidebarProps {
    onSave?: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ onSave }: SidebarProps) => {
    return (
        <aside className='flex gap-x-3'>
            <IconButton text={"Save"} icon={<Save size={"20px"} />} draggable={false} onclick={onSave} />
            <IconButton text={"Pinned Notes"} icon={<PinnedNotes />} draggable={false} />
            <IconButton text={"Hided Notes"} icon={<HidedNotes />} draggable={false} />
            <IconButton text={"Download Image"} icon={<DownloadImageButton />} draggable={false} />
            <IconButton text={"Download PDF"} icon={<DownloadPDFButton />} draggable={false} />
        </aside >
    );
};

export default Sidebar;