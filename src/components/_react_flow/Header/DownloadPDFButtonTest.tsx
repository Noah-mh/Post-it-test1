import React from 'react';
import { useReactFlow, getRectOfNodes, getTransformForBounds } from 'reactflow';
import { toPng } from 'html-to-image';
import { BiDownload } from 'react-icons/bi';
import jsPDF from 'jspdf';

const imageWidth = 1920;
const imageHeight = 1080;

const DownloadPDFButton = () => {
    const { getNodes } = useReactFlow();

    const onClick = () => {
        console.log('download image button is clicked!');

        const nodesBounds = getRectOfNodes(getNodes());
        const transform = getTransformForBounds(nodesBounds, imageWidth, imageHeight, 0.5, 2);

        toPng(document.querySelector('.react-flow__viewport') as HTMLElement, {
            backgroundColor: '#1a365d',
            width: imageWidth,
            height: imageHeight,
            style: {
                width: String(imageWidth),
                height: String(imageHeight),
                transform: `translate(${transform[0]}px, ${transform[1]}px) scale(${transform[2]})`,
            },
        }).then((dataUrl) => {
            const pdf = new jsPDF();
            pdf.addImage(dataUrl, 'PNG', 0, 0, imageWidth, imageHeight);
            pdf.save('reactflow.pdf');
        });
    };

    return <BiDownload onClick={onClick} />;
};

export default DownloadPDFButton;
