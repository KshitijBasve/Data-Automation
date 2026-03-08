import StatusBadge from './StatusBadge';
import { downloadExportUrl } from '../services/api';

export default function DatasetTable({ datasets, onDelete }) {
  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900 p-6 shadow-lg">
      <h2 className="text-xl font-semibold text-white">Processing Dashboard</h2>
      <p className="mt-2 text-sm text-slate-400">Track statuses, inserted records, and error logs.</p>

      <div className="mt-4 overflow-x-auto">
        <table className="min-w-full text-left text-sm">
          <thead>
            <tr className="text-slate-300">
              <th className="pb-3">Dataset</th>
              <th className="pb-3">Status</th>
              <th className="pb-3">Rows</th>
              <th className="pb-3">Inserted</th>
              <th className="pb-3">Errors</th>
              <th className="pb-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {datasets.map((dataset) => (
              <tr key={dataset._id} className="border-t border-slate-800 text-slate-200">
                <td className="py-3">
                  <p className="font-medium">{dataset.name}</p>
                  <p className="text-xs text-slate-400">{dataset.sourceFileName}</p>
                </td>
                <td><StatusBadge status={dataset.status} /></td>
                <td>{dataset.totalRows}</td>
                <td>{dataset.insertedRows}</td>
                <td>{dataset.invalidRows}</td>
                <td>
                  <div className="flex flex-wrap gap-2">
                    {['csv', 'excel', 'json'].map((format) => (
                      <a
                        key={format}
                        href={downloadExportUrl(dataset._id, format)}
                        className="rounded bg-slate-800 px-2 py-1 text-xs text-sky-300 hover:bg-slate-700"
                      >
                        {format.toUpperCase()}
                      </a>
                    ))}
                    <button
                      onClick={() => onDelete(dataset._id)}
                      className="rounded bg-rose-500/20 px-2 py-1 text-xs text-rose-300 hover:bg-rose-500/30"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
