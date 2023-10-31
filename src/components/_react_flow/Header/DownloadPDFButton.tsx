import React from 'react';
import { useReactFlow, getRectOfNodes, getTransformForBounds } from 'reactflow';
import { toPng } from 'html-to-image';
import jsPDF from 'jspdf';
import { BiImport } from 'react-icons/bi';

const imageWidth = 1920;
const imageHeight = 1080;

function downloadPDF(dataUrl: string) {

    console.log("dataUrl: ", dataUrl);

    const pdf = new jsPDF();
    pdf.addImage(dataUrl, 'PNG', 0, 0, imageWidth, imageHeight);
    pdf.save('reactflow.pdf');
}

const DownloadPDFButton = () => {

    const { getNodes } = useReactFlow();

    const onClick = () => {
        console.log("download pdf button is clicked!");

        const nodesBounds = getRectOfNodes(getNodes());
        const transform = getTransformForBounds(nodesBounds, imageWidth, imageHeight, 0.5, 2);

        const aspectRatio = nodesBounds.width / nodesBounds.height;
        const pdfImageWidth = aspectRatio >= 1 ? imageWidth : imageHeight * aspectRatio;
        const pdfImageHeight = aspectRatio >= 1 ? imageWidth / aspectRatio : imageHeight;

        toPng(document.querySelector('.react-flow__viewport') as HTMLElement, {
            backgroundColor: '#1a365d',
            width: pdfImageWidth,
            height: pdfImageHeight,
            style: {
                width: String(pdfImageWidth),
                height: String(pdfImageHeight),
                transform: `translate(${transform[0]}px, ${transform[1]}px) scale(${transform[1]})`,
            },
        }).then(downloadPDF);
    }

    return (
        <BiImport onClick={onClick} />
    )
}

export default DownloadPDFButton;