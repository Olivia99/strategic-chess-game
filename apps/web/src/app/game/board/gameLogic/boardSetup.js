export const createInitialBoard = () => {
  const board = Array(7)
    .fill(null)
    .map(() => Array(7).fill(null));

  // White pieces (bottom)
  board[6][0] = { type: "tower", color: "white" };
  board[6][1] = { type: "horse", color: "white" };
  board[6][2] = { type: "guard", color: "white" };
  board[6][3] = { type: "commander", color: "white" };
  board[6][4] = { type: "guard", color: "white" };
  board[6][5] = { type: "horse", color: "white" };
  board[6][6] = { type: "tower", color: "white" };

  // White soldiers
  for (let i = 0; i < 7; i++) {
    board[5][i] = { type: "soldier", color: "white" };
  }

  // Black pieces (top)
  board[0][0] = { type: "tower", color: "black" };
  board[0][1] = { type: "horse", color: "black" };
  board[0][2] = { type: "guard", color: "black" };
  board[0][3] = { type: "commander", color: "black" };
  board[0][4] = { type: "guard", color: "black" };
  board[0][5] = { type: "horse", color: "black" };
  board[0][6] = { type: "tower", color: "black" };

  // Black soldiers
  for (let i = 0; i < 7; i++) {
    board[1][i] = { type: "soldier", color: "black" };
  }

  return board;
};
