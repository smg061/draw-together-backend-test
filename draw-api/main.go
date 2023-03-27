package main

import (
	"fmt"
	"log"
	"net/http"
	"os"

	ws "uwo-owo.io-backend/ws/drawing"
)


func main() {
	hub := ws.NewDrawingHub()
	http.HandleFunc("/ws", hub.OnWebsocket)
	http.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		w.Write([]byte("Hello World!"))
	})

	err := http.ListenAndServe(getPort(), nil)

	if err != nil {
		log.Fatal("ListenAndServe: ", err)
	}
	fmt.Println("Server started on port", getPort())
}


func getPort() string {
	port := os.Getenv("PORT")
	if port == "" {
		port = ":3000"
	} else {
		port = ":" + port
	}

	return port
}
