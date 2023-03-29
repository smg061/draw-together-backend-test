# Start from golang base image
FROM golang:1.20.0 AS builder

RUN mkdir /app
ADD . /app
WORKDIR /app

RUN CGO_ENABLED=0 GOOS=linux go build -o app main.go

FROM alpine:latest AS production

COPY --from=builder /app . 
CMD ["./app"]
