export enum SocketEvent {
	// TO SERVER
	CONNECTED = 'connection',
	DISCONNECT = 'disconnect',
	LOGIN_SUCCESS = 'login_success',
	JOIN_MAP = 'join_map',
	REQUEST_ALL_PLAYERS = 'request_all_players',
	CLIENT_MOVEMENT = 'client_movement',
	CLIENT_MOVEMENT_STOP = 'client_movement_stop',
	CHANGE_MAP = 'change_map',

	// TO CLIENT
	PLAYER_CONNECT = 'player_connect',
	PLAYER_DISCONNECT = 'player_disconnect',
	PLAYER_MOVE = 'player_move',
	PLAYER_STOP = 'player_stop',
}
