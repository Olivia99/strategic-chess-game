import { PIECE_TYPES } from "../gameLogic/constants";

const GridBackground = () => (
  <svg
    className="absolute inset-0 w-full h-full"
    viewBox="0 0 420 420"
    style={{ width: "420px", height: "420px" }}
  >
    {/* Horizontal grid lines */}
    {[0, 1, 2, 3, 4, 5, 6].map((row) => (
      <line
        key={`h-${row}`}
        x1={30}
        y1={30 + row * 60}
        x2={390}
        y2={30 + row * 60}
        stroke="#d1d5db"
        strokeWidth="2"
      />
    ))}
    {/* Vertical grid lines */}
    {[0, 1, 2, 3, 4, 5, 6].map((col) => (
      <line
        key={`v-${col}`}
        x1={30 + col * 60}
        y1={30}
        x2={30 + col * 60}
        y2={390}
        stroke="#d1d5db"
        strokeWidth="2"
      />
    ))}
    {/* Special golden diamond markers in middle area */}
    {[
      [2, 3],
      [3, 3],
      [4, 3],
    ].map(([row, col]) => (
      <circle
        key={`marker-${row}-${col}`}
        cx={30 + col * 60}
        cy={30 + row * 60}
        r="8"
        fill="#fbbf24"
        stroke="#f59e0b"
        strokeWidth="2"
      />
    ))}
  </svg>
);

const Piece = ({ piece }) => (
  <span
    className={`${piece.color === "white" ? "text-blue-700" : "text-red-700"} drop-shadow-sm`}
  >
    {PIECE_TYPES[piece.type]?.symbol || "?"}
  </span>
);

const ValidMoveIndicator = () => (
  <div className="w-4 h-4 bg-green-600 rounded-full border-2 border-green-800"></div>
);

export default function GameBoard({
  board,
  selectedPiece,
  validMoves,
  handlePieceClick,
  gameStatus,
}) {
  return (
    <div className="lg:col-span-3">
      <div className="bg-white rounded-xl p-6 shadow-lg">
        <div className="relative max-w-2xl mx-auto">
          <GridBackground />
          <div className="relative" style={{ width: "420px", height: "420px" }}>
            {board.map((row, rowIndex) =>
              row.map((piece, colIndex) => {
                const isSelected =
                  selectedPiece?.row === rowIndex &&
                  selectedPiece?.col === colIndex;
                const isValidMove = validMoves.some(
                  ([r, c]) => r === rowIndex && c === colIndex,
                );

                return (
                  <button
                    key={`${rowIndex}-${colIndex}`}
                    onClick={() => handlePieceClick(rowIndex, colIndex)}
                    className={`
                      absolute w-12 h-12 rounded-full transition-all duration-200 flex items-center justify-center text-xl font-bold
                      ${
                        isSelected
                          ? "bg-amber-200 border-4 border-amber-500 shadow-lg scale-110 z-20"
                          : isValidMove
                            ? "bg-green-200 border-3 border-green-500 hover:bg-green-300 z-10"
                            : piece
                              ? "bg-white border-2 border-gray-400 hover:border-gray-600 shadow-md hover:shadow-lg z-10"
                              : "hover:bg-gray-100 hover:border-2 hover:border-gray-300 rounded-full"
                      }
                      ${piece || isValidMove ? "cursor-pointer" : "cursor-default"}
                    `}
                    style={{
                      left: `${6 + colIndex * 60}px`,
                      top: `${6 + rowIndex * 60}px`,
                    }}
                    disabled={gameStatus !== "playing"}
                  >
                    {piece && <Piece piece={piece} />}
                    {isValidMove && !piece && <ValidMoveIndicator />}
                  </button>
                );
              }),
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
