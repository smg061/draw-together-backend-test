package main

import (
	"context"
	"fmt"
	"log"
	"net/http"
	"os"
	"os/signal"
	"time"

	"github.com/lesismal/nbio/nbhttp"
	"github.com/rs/cors"
	ws "uwo-owo.io-backend/ws/drawing"
)

func main() {
	hub := ws.NewDrawingHub()

	mux := http.NewServeMux()

	mux.HandleFunc("/ws", hub.OnWebsocket)
	mux.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		w.Write([]byte("Hello World!"))
	})

	handler := cors.Default().Handler(mux)

	svr := nbhttp.NewServer(nbhttp.Config{
		Network:                 "tcp",
		Addrs:                   []string{getPort()},
		Handler:                 handler,
		MaxLoad:                 500,
		ReleaseWebsocketPayload: true,
		ReadBufferSize:          1024 * 4,
		IOMod:                   nbhttp.IOModNonBlocking,
	})

	err := svr.Start()
	if err != nil {
		log.Fatal("ListenAndServe: ", err)
	}

	fmt.Println("Server started on port", getPort())
	interrupt := make(chan os.Signal, 1)
	signal.Notify(interrupt, os.Interrupt)
	<-interrupt
	ctx, cancel := context.WithTimeout(context.Background(), time.Second*5)
	defer cancel()
	svr.Shutdown(ctx)

}

func getPort() string {
	port := os.Getenv("PORT")
	if port == "" {
		port = ":3001"
	} else {
		port = ":" + port
	}

	return port
}
