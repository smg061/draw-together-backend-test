export function getCanvasAndContext(canvasRef: React.MutableRefObject<HTMLCanvasElement | null>) {
    const canvas = canvasRef.current;
    if (!canvas) return {
        canvas: null,
        ctx: null
    }
    ;
    const ctx = canvas.getContext("2d");
    if (!ctx) 
    return {
        canvas: null,
        ctx: null
    }
    return {canvas, ctx};
}

export function clearCanvas(canvasRef: React.MutableRefObject<HTMLCanvasElement | null>) {
    const {canvas, ctx} = getCanvasAndContext(canvasRef);
    if (!canvas || !ctx) 
    return;
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}