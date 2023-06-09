package drawing

import (
	"encoding/json"
	"fmt"
	"net/http"

	"github.com/lesismal/nbio/nbhttp/websocket"
)

type DrawingRoom struct {

	connections map[*websocket.Conn]bool
	history []Stroke
}

type DrawingHub struct {
	connections map[string]map[*websocket.Conn]bool
	//c map [string] DrawingRoom
}

type Message struct {
	Type string `json:"type"`
	Body string `json:"body"`
	User string `json:"user"`
	RoomId string `json:"room_id"`
}

func (m *Message) String() string {
	return fmt.Sprintf("%s: %s %s", m.User, m.Body, m.Type)
}
func NewDrawingHub() *DrawingHub {
	hub := &DrawingHub{
		connections: make(map[string]map[*websocket.Conn]bool),
		//c: make(map[string]DrawingRoom),
	}
	//hub.c["default"] = DrawingRoom{connections: make(map[*websocket.Conn]bool), history: make([]Stroke, 100)}

	hub.connections["default"] = make(map[*websocket.Conn]bool)
	return hub
}

func (h *DrawingHub) Register(conn *websocket.Conn) {
	h.connections["default"][conn] = true
	for user := range h.connections["default"] {
		fmt.Printf("%s user is connected \n", user.RemoteAddr().String())
	}	
	fmt.Printf("%d user(s) in the room...\n", len(h.connections["default"]))
	//h.c["default"].connections[conn] = true
}

func (h *DrawingHub) Unregister(conn *websocket.Conn) {
	delete(h.connections["default"], conn)
	fmt.Printf("%s user disconnected\n", conn.RemoteAddr().String())
	fmt.Printf("%d user(s) remain in the room\n ", len(h.connections["default"]))
	//delete(h.c["default"].connections, conn)
}

func (h *DrawingHub) Broadcast(c *websocket.Conn, messageType websocket.MessageType, data []byte) {
	var message Message
	err := json.Unmarshal(data, &message)
	if err != nil {
		fmt.Println(err)
		return
	}
	room, ok := h.connections[message.RoomId]
	if !ok {
		h.connections[message.RoomId] = make(map[*websocket.Conn]bool)
		room = h.connections[message.RoomId]
	}


	for user := range room {
		// Do not send message to the sender
		if user == c {
			continue
		}
		user.WriteMessage(messageType, data)
	}
}

func (h *DrawingHub) NewUpgrader() *websocket.Upgrader {
	u := websocket.NewUpgrader()
	u.BlockingModAsyncWrite = true
	u.CheckOrigin = func(r *http.Request) bool {
		return true
	}
	u.OnMessage(func(c *websocket.Conn, messageType websocket.MessageType, data []byte) {
		h.Broadcast(c, messageType, data)
	})
	u.OnClose(func(c *websocket.Conn, err error) {
		h.Unregister(c)
	})
	return u
}

func (h *DrawingHub) OnWebsocket(w http.ResponseWriter, r *http.Request) {
	upgrader := h.NewUpgrader()
	conn, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
		fmt.Println(err)
		return
	}
	wsConn := conn.(*websocket.Conn)
	h.Register(wsConn)
}