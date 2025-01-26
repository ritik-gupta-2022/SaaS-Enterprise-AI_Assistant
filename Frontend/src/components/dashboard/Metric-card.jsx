export function MetricCard({ title, value, icon }) {
    return (
      <div className="bg-white p-6 rounded-lg shadow m-4">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-gray-600">{title}</p>
            <h3 className="text-2xl font-semibold mt-1">{value}</h3>
          </div>
          <div className="text-gray-400">{icon}</div>
        </div>
      </div>
    )
  }
  
  