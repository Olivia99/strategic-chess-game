const isValidPosition = (row, col) => {
  return row >= 0 && row < 7 && col >= 0 && col < 7;
};

export const calculateValidMoves = (board, piece, row, col) => {
  const moves = [];
  const { type, color } = piece;

  switch (type) {
    case "commander":
      // Move 1 space in any direction
      for (let dr = -1; dr <= 1; dr++) {
        for (let dc = -1; dc <= 1; dc++) {
          if (dr === 0 && dc === 0) continue;
          const newRow = row + dr;
          const newCol = col + dc;
          if (isValidPosition(newRow, newCol)) {
            const target = board[newRow][newCol];
            if (!target || target.color !== color) {
              moves.push([newRow, newCol]);
            }
          }
        }
      }
      break;

    case "soldier":
      const direction = color === "white" ? -1 : 1;
      const midline = 3;

      // Move forward
      const forwardRow = row + direction;
      if (isValidPosition(forwardRow, col) && !board[forwardRow][col]) {
        moves.push([forwardRow, col]);
      }

      // Attack diagonally forward
      for (const dc of [-1, 1]) {
        const newCol = col + dc;
        if (isValidPosition(forwardRow, newCol)) {
          const target = board[forwardRow][newCol];
          if (target && target.color !== color) {
            moves.push([forwardRow, newCol]);
          }
        }
      }

      // Attack sideways at midline
      if (row === midline) {
        for (const dc of [-1, 1]) {
          const newCol = col + dc;
          if (isValidPosition(row, newCol)) {
            const target = board[row][newCol];
            if (target && target.color !== color) {
              moves.push([row, newCol]);
            }
          }
        }
      }
      break;

    case "horse":
      // L-shaped moves (2x1)
      const horseMoves = [
        [-2, -1],
        [-2, 1],
        [-1, -2],
        [-1, 2],
        [1, -2],
        [1, 2],
        [2, -1],
        [2, 1],
      ];
      for (const [dr, dc] of horseMoves) {
        const newRow = row + dr;
        const newCol = col + dc;
        if (isValidPosition(newRow, newCol)) {
          const target = board[newRow][newCol];
          if (!target || target.color !== color) {
            moves.push([newRow, newCol]);
          }
        }
      }
      break;

    case "elephant":
      // Move 2 spaces in any direction
      for (let dr = -2; dr <= 2; dr++) {
        for (let dc = -2; dc <= 2; dc++) {
          if (dr === 0 && dc === 0) continue;
          if (Math.abs(dr) <= 2 && Math.abs(dc) <= 2) {
            const newRow = row + dr;
            const newCol = col + dc;
            if (isValidPosition(newRow, newCol)) {
              const target = board[newRow][newCol];
              if (!target || target.color !== color) {
                moves.push([newRow, newCol]);
              }
            }
          }
        }
      }
      break;

    case "guard":
      // Move 1 space in any direction (like commander)
      for (let dr = -1; dr <= 1; dr++) {
        for (let dc = -1; dc <= 1; dc++) {
          if (dr === 0 && dc === 0) continue;
          const newRow = row + dr;
          const newCol = col + dc;
          if (isValidPosition(newRow, newCol)) {
            const target = board[newRow][newCol];
            if (!target || target.color !== color) {
              moves.push([newRow, newCol]);
            }
          }
        }
      }
      break;

    case "raider":
      // Move 1 space along grid or any distance diagonally
      // Grid moves (orthogonal)
      for (const [dr, dc] of [
        [-1, 0],
        [1, 0],
        [0, -1],
        [0, 1],
      ]) {
        const newRow = row + dr;
        const newCol = col + dc;
        if (isValidPosition(newRow, newCol)) {
          const target = board[newRow][newCol];
          if (!target || target.color !== color) {
            moves.push([newRow, newCol]);
          }
        }
      }

      // Diagonal moves (any distance)
      for (const [dr, dc] of [
        [-1, -1],
        [-1, 1],
        [1, -1],
        [1, 1],
      ]) {
        for (let dist = 1; dist < 7; dist++) {
          const newRow = row + dr * dist;
          const newCol = col + dc * dist;
          if (!isValidPosition(newRow, newCol)) break;

          const target = board[newRow][newCol];
          if (target) {
            if (target.color !== color) {
              moves.push([newRow, newCol]);
            }
            break;
          }
          moves.push([newRow, newCol]);
        }
      }
      break;

    case "tower":
      // Move any distance along grid (orthogonal)
      for (const [dr, dc] of [
        [-1, 0],
        [1, 0],
        [0, -1],
        [0, 1],
      ]) {
        for (let dist = 1; dist < 7; dist++) {
          const newRow = row + dr * dist;
          const newCol = col + dc * dist;
          if (!isValidPosition(newRow, newCol)) break;

          const target = board[newRow][newCol];
          if (target) {
            if (target.color !== color) {
              moves.push([newRow, newCol]);
            }
            break;
          }
          moves.push([newRow, newCol]);
        }
      }
      break;

    case "artillery":
      // Move along grid, attack any distance with piece in between
      // Movement (like tower)
      for (const [dr, dc] of [
        [-1, 0],
        [1, 0],
        [0, -1],
        [0, 1],
      ]) {
        for (let dist = 1; dist < 7; dist++) {
          const newRow = row + dr * dist;
          const newCol = col + dc * dist;
          if (!isValidPosition(newRow, newCol)) break;

          const target = board[newRow][newCol];
          if (target) break; // Can't move through pieces
          moves.push([newRow, newCol]);
        }
      }

      // Attack with piece in between
      for (const [dr, dc] of [
        [-1, 0],
        [1, 0],
        [0, -1],
        [0, 1],
      ]) {
        let foundBlocker = false;
        for (let dist = 1; dist < 7; dist++) {
          const newRow = row + dr * dist;
          const newCol = col + dc * dist;
          if (!isValidPosition(newRow, newCol)) break;

          const target = board[newRow][newCol];
          if (target && !foundBlocker) {
            foundBlocker = true;
            continue;
          }
          if (foundBlocker && target && target.color !== color) {
            moves.push([newRow, newCol]);
            break;
          }
        }
      }
      break;
  }

  return moves;
};
