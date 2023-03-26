import { useEffect, useMemo, useRef, useState } from "react";
import useSendStroke from "./useSendStroke";
import { DrawHistory } from "./History";
import { getCanvasAndContext } from "./utils";

type props = {
  canvasRef: React.MutableRefObject<HTMLCanvasElement | null>;
  history: DrawHistory;
  width: number;
  height: number;
};

export default function Canvas(props: props) {
  const { canvasRef, width, height, history } = props;

  const contextRef = useRef<CanvasRenderingContext2D | null>(null);

  const sendStroke = useSendStroke(contextRef);

  const tempCanvas = useMemo(() => {
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    return canvas;
  }, [width, height]);

  const tempCtx = useMemo(() => {
    const ctx = tempCanvas.getContext("2d");
    if (!ctx) return;
    ctx.lineWidth = 5;
    ctx.lineCap = "round";
    ctx.strokeStyle = "black";
    return ctx;
  }, [tempCanvas]);

  const [drawing, setDrawing] = useState(false);

  const starDraw = (e: React.MouseEvent<HTMLCanvasElement, MouseEvent>) => {
    const { canvas, ctx } = getCanvasAndContext(canvasRef);
    if (!canvas || !ctx) return;
    ctx.translate(0.5, 0.5);

    setDrawing(true);
    const { offsetX: x, offsetY: y } = e.nativeEvent;
    ctx.beginPath();
    ctx.moveTo(x, y);
    history.addPoint({ x, y });
  };
  const stopDraw = (e: React.MouseEvent<HTMLCanvasElement, MouseEvent>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    setDrawing(false);
    ctx.closePath();
    const stroke = history.addStroke();
    sendStroke(stroke);
  };
  const draw = (e: React.MouseEvent<HTMLCanvasElement, MouseEvent>) => {
    const { canvas, ctx } = getCanvasAndContext(canvasRef);
    if (!canvas || !ctx || !drawing) return;
    const { offsetX: x, offsetY: y } = e.nativeEvent;

    ctx.lineTo(x, y);
    ctx.stroke();
    history.addPoint({ x, y });
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    contextRef.current = ctx;
    contextRef.current.lineCap = "round";
  }, [canvasRef]);

  return (
    <div id='drawingBoard' className='w-[900px]  h-[700px]'>
      <canvas className='canvas rounded-lg bg-white shadow-lg' onMouseDown={starDraw} onMouseUp={stopDraw} onMouseMove={draw} ref={canvasRef} width={width} height={height} />
    </div>
  );
}
