export function ScoringExplanation() {
  return (
    <div className="bg-blue-50 rounded-lg border border-blue-200 p-6">
      <h2 className="text-lg font-semibold text-blue-800 mb-3">How Scoring Works</h2>
      <div className="text-blue-700 space-y-2 text-sm">
        <p>Points are awarded using a reverse exponential decay formula: <code className="bg-blue-100 px-2 py-1 rounded">Points = MaxPoints × e^(-0.1 × timeRatio)</code></p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
          <div className="bg-white p-3 rounded border">
            <div className="font-medium text-green-700">Easy Tasks</div>
            <div className="text-sm">24h to get 90% points</div>
          </div>
          <div className="bg-white p-3 rounded border">
            <div className="font-medium text-yellow-700">Medium Tasks</div>
            <div className="text-sm">48h to get 90% points</div>
          </div>
          <div className="bg-white p-3 rounded border">
            <div className="font-medium text-red-700">Hard Tasks</div>
            <div className="text-sm">72h to get 90% points</div>
          </div>
        </div>
      </div>
    </div>
  );
}