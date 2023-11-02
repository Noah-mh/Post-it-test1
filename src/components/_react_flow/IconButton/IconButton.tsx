import React, { ReactElement } from 'react';
import {
    Tooltip as TippyTooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";

interface CustomTooltipProps {
    text: string;
    icon: ReactElement;
    draggable: boolean;
    onclick?: () => void;
}

const IconButton: React.FC<CustomTooltipProps> = ({ text, icon, draggable, onclick }: CustomTooltipProps) => {
    const onDragStart = (event: React.DragEvent<HTMLDivElement>, nodeType: string) => {
        event.dataTransfer.setData('application/reactflow', nodeType);
        event.dataTransfer.effectAllowed = 'move';
    };

    const iconStyle: React.CSSProperties = {
        // backgroundColor: '#FFEB3B', // Yellow color, similar to post-it notes
        padding: '5px',
        // fontSize: '15px',
        // borderRadius: '5px',
        // boxShadow: '2px 2px 5px rgba(0, 0, 0, 0.2)', // Adding a slight shadow
        // marginBottom: '10px'
    };

    return (
        <TooltipProvider>
            <TippyTooltip>
                <TooltipTrigger onClick={onclick}>
                    {
                        draggable ? (
                            <div
                                style={iconStyle}
                                onDragStart={(event) => onDragStart(event, 'postItNode')}
                                draggable
                            >
                                {icon}
                            </div>
                        ) : (
                            <div style={iconStyle}>
                                {icon}
                            </div>
                        )
                    }

                </TooltipTrigger>
                <TooltipContent>
                    <p>
                        {text}
                    </p>
                </TooltipContent>
            </TippyTooltip>
        </TooltipProvider>
    );
};

export default IconButton;