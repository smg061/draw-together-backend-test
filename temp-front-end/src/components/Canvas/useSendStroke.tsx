import { useEffect, useState } from "react";
import { useSocket } from "../../Websocketprovider";
import { Stroke } from "./History";

type Message = {
  type: string;
  body: string;
  user: string;
  room_id: string;
};

const onMessage = (e: MessageEvent) => {
  const message: Message = JSON.parse(e.data);
  if (message.type === "stroke") {
    const stroke: Stroke = JSON.parse(message.body);
    return stroke;
  }
};

export default function useSendStroke(ctx: React.MutableRefObject<CanvasRenderingContext2D | null>) {
  const { socket } = useSocket();
  const [currentStroke, setCurrentStroke] = useState<Stroke | null>(null);

  useEffect(() => {
    if (!socket) return;
    const onMessage = (e: MessageEvent) => {
      const message: Message = JSON.parse(e.data);
      if (message.type === "stroke") {
        const stroke: Stroke = JSON.parse(message.body);
        setCurrentStroke(stroke);
      }
    };
    socket.addEventListener("message", onMessage);
    return () => {
      socket.removeEventListener("message", onMessage);
    }
  }, [socket]);
  
  useEffect(() => {
    if (!currentStroke) return;
    
    if (!ctx.current) return;
    ctx.current.beginPath();
    ctx.current.moveTo(currentStroke[0].x, currentStroke[0].y);
    currentStroke.forEach((point) => {
      ctx.current?.lineTo(point.x, point.y);
    });
    ctx.current.stroke();
  }, [currentStroke]);


  return (stroke: Stroke) => {
    if (socket) {
      socket.send(
        JSON.stringify({
          type: "stroke",
          body: JSON.stringify(stroke),
          user: "non-chan",
          room_id: "default",
        })
      );
    }
  };
}
