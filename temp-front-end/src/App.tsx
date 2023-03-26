import { useEffect, useMemo, useRef, useState } from "react";
import Canvas from "./components/Canvas/Canvas";
import { DrawHistory } from "./components/Canvas/History";
import { Toolbar } from "./components/Canvas/ToolBar";
import { getCanvasAndContext } from "./components/Canvas/utils";

export default function DrawTogether() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const history =  useMemo(() => new DrawHistory(), []);


  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.translate(0.5, 0.5);

  }, [canvasRef]);

  const [canvasWidth, setCanvasWidth] = useState<number>(1000);
  const [canvasHeight, setCanvasHeight] = useState<number>(700);

  return (
    <>
      <div className="flex flex-col items-center justify-center h-screen">
        <h1 className="text-4xl font-bold text-center">Draw Together</h1>
        <p className="text-xl font-bold text-center">
          Draw together with your friends
        </p>
        <div className="flex flex-col items-center justify-center h-screen">

          <Canvas history={history}  canvasRef={canvasRef} width={canvasWidth} height={canvasHeight}/>
          <Toolbar history={history} canvasRef={canvasRef} width={canvasWidth} height={canvasHeight}/>
        </div>
      </div>
    </>
  );
}

