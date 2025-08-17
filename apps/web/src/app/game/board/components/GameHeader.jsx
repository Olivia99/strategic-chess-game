import { Crown, Home } from "lucide-react";

export default function GameHeader({ goHome }) {
  return (
    <div className="text-center mb-6">
      <div className="flex items-center justify-center mb-4">
        <Crown className="w-8 h-8 text-amber-600 mr-2" />
        <h1 className="text-3xl font-bold text-gray-800">
          Strategic Chess Battle
        </h1>
      </div>
      <button
        onClick={goHome}
        className="text-amber-600 hover:text-amber-700 underline flex items-center mx-auto"
      >
        <Home className="w-4 h-4 mr-1" />
        Back to home
      </button>
    </div>
  );
}
