package ws

import (
	"encoding/json"
	"fmt"
	"net/http"
	"time"

	"github.com/lesismal/nbio/nbhttp/websocket"
)

type WsHub struct {
	// Registered connections.
	// this is a map of maps, the first key is the room name, the second key is the connection
	connections map[string]map[*websocket.Conn]bool
	// Inbound messages from the connections.
}

func NewWsHub() *WsHub {
	hub := &WsHub{
		connections: make(map[string]map[*websocket.Conn]bool),
	}
	hub.connections["default"] = make(map[*websocket.Conn]bool)
	return hub
}

func (h *WsHub) Register(conn *websocket.Conn) {
	h.connections["default"][conn] = true
}

func (h *WsHub) Unregister(conn *websocket.Conn) {
	delete(h.connections["default"], conn)
}

func (h *WsHub) Broadcast(messageType websocket.MessageType, message []byte) {
	for user := range h.connections["default"] {
		user.WriteMessage(messageType, message)
	}
}

func (h *WsHub) NewUpgrader() *websocket.Upgrader {
	u := websocket.NewUpgrader()

	u.CheckOrigin = func(r *http.Request) bool {
		return true
	}
	u.OnMessage(func(c *websocket.Conn, messageType websocket.MessageType, data []byte) {
		var message Message
		err := json.Unmarshal(data, &message)
		if err != nil {
			fmt.Println(err)
			return
		}
		fmt.Println(message)
		h.Broadcast(messageType, data)
	})

	u.OnClose(func(c *websocket.Conn, err error) {
		h.Unregister(c)
	})
	return u
}

func (h *WsHub) OnWebsocket(w http.ResponseWriter, r *http.Request) {
	upgrader := h.NewUpgrader()

	conn, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
		fmt.Println(err)
		return
	}
	wsConn := conn.(*websocket.Conn)
	h.Register(wsConn)
	wsConn.SetReadDeadline(time.Time{})
}
