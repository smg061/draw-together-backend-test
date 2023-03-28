package ws

import (
	"encoding/json"
	"fmt"
	"net/http"
	"time"

	"github.com/lesismal/nbio/nbhttp/websocket"
)

var users = make(map[*websocket.Conn]bool)

func newUpgrader() *websocket.Upgrader {
	u := websocket.NewUpgrader()

	u.CheckOrigin = func(r *http.Request) bool {
		return true
	}
	u.OnMessage(func(c *websocket.Conn, messageType websocket.MessageType, data []byte) {
		var message Message
		err := json.Unmarshal(data, &message)
		if err != nil {
			fmt.Println(err)
		}
		for user := range users {
			user.WriteMessage(messageType, data)
		}
	})

	u.OnClose(func(c *websocket.Conn, err error) {
		delete(users, c)
		fmt.Println("Connection closed", c.RemoteAddr().String(), err)
	})

	return u
}

func OnWebsocket(w http.ResponseWriter, r *http.Request) {
	upgrader := newUpgrader()

	conn, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
		fmt.Println(err)
		return
	}
	wsConn := conn.(*websocket.Conn)
	users[wsConn] = true
	wsConn.SetReadDeadline(time.Time{})
}
