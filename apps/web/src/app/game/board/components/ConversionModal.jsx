import { PIECE_TYPES } from "../gameLogic/constants";

export default function ConversionModal({
  showConversionModal,
  handleConversion,
  setShowConversionModal,
}) {
  if (!showConversionModal) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4">
        <h3 className="text-xl font-bold text-gray-800 mb-4">
          Convert Piece
        </h3>
        <p className="text-gray-600 mb-6">
          Your {showConversionModal.piece.type} can be converted to a more
          powerful piece. Choose your conversion:
        </p>
        <div className="space-y-3">
          {showConversionModal.pairs
            .find((pair) => pair.includes(showConversionModal.piece.type))
            ?.filter((type) => type !== showConversionModal.piece.type)
            .map((convertType) => (
              <button
                key={convertType}
                onClick={() => handleConversion(convertType)}
                className="w-full bg-amber-600 hover:bg-amber-700 text-white px-4 py-3 rounded-lg transition-colors flex items-center"
              >
                <span className="text-xl mr-3">
                  {PIECE_TYPES[convertType]?.symbol}
                </span>
                <div className="text-left">
                  <div className="font-semibold">
                    {PIECE_TYPES[convertType]?.name}
                  </div>
                </div>
              </button>
            ))}
          <button
            onClick={() => setShowConversionModal(null)}
            className="w-full bg-gray-600 hover:bg-gray-700 text-white px-4 py-3 rounded-lg transition-colors"
          >
            Keep as {PIECE_TYPES[showConversionModal.piece.type]?.name}
          </button>
        </div>
      </div>
    </div>
  );
}
