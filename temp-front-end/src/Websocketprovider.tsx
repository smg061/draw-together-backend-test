import {createContext, useContext} from "react";
import { Stroke } from "./components/Canvas/History";


type State = {
    socket: WebSocket | null;
}
const connection = new WebSocket("ws://localhost:3000/ws");

const initialState: State = {
    socket: connection
}

export const SocketContext = createContext<State>(initialState);

export default function SocketProvider ({children}: {children?: React.ReactNode}) {
    return (
        <SocketContext.Provider value={initialState}>
            {children}
        </SocketContext.Provider>
    )
}

export function useSocket() {
    return useContext(SocketContext);

}

