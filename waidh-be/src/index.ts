import express, { Express, Request, Response } from 'express'
import { Server } from 'socket.io'
import 'dotenv/config'
import http from 'http'
import cors from 'cors'
import socket from './socket'
import { ENVIRONMENT } from './utils/constants'
import { CORS_ORIGIN } from './config'

const env = (process.env.ENV as ENVIRONMENT) || ENVIRONMENT.DEV
const app: Express = express()
const port = process.env.PORT || 3000

const server = http.createServer(app)

const io = new Server(server, {
  cors: {
    origin: CORS_ORIGIN[env],
    credentials: true,
  },
})

app.use(
	cors({
		origin: CORS_ORIGIN[env],
	})
)

app.get('/', (_: Request, res: Response) => {
	res.send('Express + Socket.io + TypeScript Server')
})

server.listen(port, () => {
	console.log(`⚡️[server]: Server(${env}) is running at https://localhost:${port}`)
	socket(io)
})
