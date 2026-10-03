export default function PipelineView({ steps }) {
  return (
    <div className="flex items-center gap-1 mt-3 flex-wrap">
      {steps.map((s, i) => (
        <div key={i} className="flex items-center gap-1">
          <span className="text-xs bg-blue-600 text-white px-3 py-1 rounded-full">
            {s}
          </span>
          {i < steps.length - 1 && <span className="text-gray-400">→</span>}
        </div>
      ))}
    </div>
  )
}