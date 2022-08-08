export enum SocketEvent {
  // TO SERVER
  CONNECTED = 'connection',
  DISCONNECT = 'disconnect',
	LOGIN_SUCCESS = 'login_success',
  JOIN_MAP = 'join_map',
	REQUEST_ALL_PLAYERS = 'request_all_players',

  // TO CLIENT
	PLAYER_CONNECT = 'player_connect',
	PLAYER_DISCONNECT = 'player_disconnect',
}