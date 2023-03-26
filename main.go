package main

import (
	"fmt"
	"log"
	"net/http"

	ws "uwo-owo.io-backend/ws/drawing"
)


func main() {

	fs:= http.FileServer(http.Dir("static"))
	hub := ws.NewDrawingHub()
	http.Handle("/", fs)
	http.HandleFunc("/ws", hub.OnWebsocket)
	log.Fatal(http.ListenAndServe(":3000", nil))
	fmt.Println("Server started on port 3000")
}
