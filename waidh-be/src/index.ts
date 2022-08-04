import express, { Express, Request, Response } from 'express'
import { Server } from 'socket.io'
import 'dotenv/config'
import http from 'http'
import socket from './socket'

const app: Express = express()
const port = process.env.PORT || 3000
const server = http.createServer(app);

app.get('/', (req: Request, res: Response) => {
	res.send('Express + TypeScript Server')
})

server.listen(port, () => {
	console.log(`⚡️[server]: Server is running at https://localhost:${port}`)
})

socket.setup(server)