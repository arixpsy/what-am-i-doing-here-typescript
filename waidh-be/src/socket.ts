import http from 'http'
import { Server } from 'socket.io'

const setup = (server: http.Server) => {
  const io = new Server(server);

  io.on('connection', (socket) => {
    console.log('a user connected');
  });
}

export default {
	setup,
}
