package main

import (
	"fmt"
	"log"
	"net/http"
	ws "uwo-owo.io-backend/ws/drawing"
)


func main() {
	hub := ws.NewDrawingHub()
	http.HandleFunc("/ws", hub.OnWebsocket)
	http.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		w.Write([]byte("Hello World!"))
	})
	fmt.Println("Server started on port 3000")

	err := http.ListenAndServe(":3000", nil)

	if err != nil {
		log.Fatal("ListenAndServe: ", err)
	}
}
