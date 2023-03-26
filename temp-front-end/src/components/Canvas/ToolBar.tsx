// this toolbar is used to change the canvas size, brush color, brush size, and brush type

import React, {useEffect, useRef} from 'react';
import { FaSave, FaPaintBrush, FaEraser} from "react-icons/fa";
import { DrawHistory } from './History';
import { clearCanvas, getCanvasAndContext } from './utils';

type props = {
    canvasRef: React.MutableRefObject<HTMLCanvasElement | null>;
    width: number;
    height: number;
    history: DrawHistory;
}


export function Toolbar(props: props) {

    const {canvasRef, width, height} = props;

    const contextRef= useRef<CanvasRenderingContext2D | null>(null);

    useEffect(() => {
        const {canvas, ctx} = getCanvasAndContext(canvasRef);
        if (!canvas || !ctx) return;
        contextRef.current = ctx;
    }, [canvasRef]);

    const handleBrushColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const {canvas, ctx} = getCanvasAndContext(canvasRef);
        if (!canvas || !ctx) return;
        ctx.strokeStyle = e.target.value;
    }

    const handleBrushSizeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const {canvas, ctx} = getCanvasAndContext(canvasRef);
        if (!canvas || !ctx) return;
        ctx.lineWidth = parseInt(e.target.value);
    }

    const handleBrushTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const {canvas, ctx} = getCanvasAndContext(canvasRef);
        if (!canvas || !ctx) return;
        ctx.lineCap = e.target.value as CanvasLineCap;
    }

    const handleClearCanvas = () => {
        const {canvas, ctx} = getCanvasAndContext(canvasRef);
        if (!canvas || !ctx) return;
        clearCanvas(canvasRef);
    }
    const handleErase = () => {
        const {canvas, ctx} = getCanvasAndContext(canvasRef);
        if (!canvas || !ctx) return;
        ctx.strokeStyle = "white";
    }
    const replayHistory = () => {
        const {canvas, ctx} = getCanvasAndContext(canvasRef);
        if (!canvas || !ctx) return;
        ctx.fillStyle = "white";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        const history = props.history;
        const strokes = history.getStrokes();
        for (let i = 0; i < strokes.length; i++) {
            const stroke = strokes[i];
            for (let j = 0; j < stroke.length; j++) {
                const point = stroke[j];
                if (j === 0) {
                    ctx.beginPath();
                    ctx.moveTo(point.x, point.y);
                } else {
                    ctx.lineTo(point.x, point.y);
                }
            }
            ctx.stroke();
        }

    }
    return (
        <div className="flex absolute top-24 left-0 rounded-lg bg-slate-500 h-[90%] flex-col items-center justify-center">
            <div className="flex flex-col items-center justify-center">
                <div className='flex flex-row'>
                    <label htmlFor="brush-color"><FaPaintBrush/></label>
                    <input className='w-6 h-6' type="color" name="brush-color" id="brush-color" onChange={handleBrushColorChange}/>

                </div>
            </div>
            <div className="flex flex-col items-center justify-center">
                <label htmlFor="brush-size">Brush Size</label>
                <input type="range" name="brush-size" id="brush-size" min="1" max="100" onChange={handleBrushSizeChange}/>
            </div>
            <div className="flex flex-col items-center justify-center">
                <label htmlFor="brush-type">Brush Type</label>
                <select name="brush-type" id="brush-type" onChange={handleBrushTypeChange}>
                    <option value="butt">Butt</option>
                    <option value="round">Round</option>
                    <option value="square">Square</option>
                </select>
            </div>
            <button onClick={handleClearCanvas}>Clear Canvas</button>
            <button
            onClick={() => {
                const {canvas, ctx} = getCanvasAndContext(canvasRef);
                if (!canvas || !ctx) return;
                const link = document.createElement("a");
                link.download = "image.png";
                link.href = canvas.toDataURL();
                link.click();
            }}
            ><FaSave/></button>

            <button onClick={replayHistory}>Replay History</button>
            <button onClick={handleErase}><FaEraser/></button>
        </div>


    )
}