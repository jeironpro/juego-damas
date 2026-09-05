// Constantes del juego de damas (tablero 8x8, 12 fichas por jugador)
export const BOARD_SIZE = 8;
export const PLAYER_1 = 1;
export const PLAYER_2 = 2;
export const PIECES_PER_PLAYER = 12;

// Dirección de avance de cada jugador: el jugador 1 avanza hacia arriba (filas decrecientes)
export const FORWARD_DIRECTION = {
  [PLAYER_1]: -1,
  [PLAYER_2]: 1,
};

// Fila a la que cada jugador debe llegar para coronar una dama
export const PROMOTION_ROW = {
  [PLAYER_1]: 0,
  [PLAYER_2]: BOARD_SIZE - 1,
};
