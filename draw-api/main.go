package main

import (
	"fmt"
	"log"
	"net/http"
	"os"

	ws "uwo-owo.io-backend/ws/drawing"
    "github.com/rs/cors"
)


func main() {
	hub := ws.NewDrawingHub()

	mux := http.NewServeMux()

	mux.HandleFunc("/ws", hub.OnWebsocket)
	mux.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		w.Write([]byte("Hello World!"))
	})

	handler := cors.Default().Handler(mux)

	err := http.ListenAndServe(getPort(), handler)

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
