package ws

import "fmt"

type Message struct {
	Body string `json:"body"`
	User string `json:"user"`
	RoomId string `json:"room_id"`
}

func (m *Message) String() string {
	return fmt.Sprintf("%s: %s", m.User, m.Body)
}

func (m *Message) Bytes() []byte {
	return []byte(m.String())
}