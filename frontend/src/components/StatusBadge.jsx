const colorMap = {
  queued: 'bg-amber-500/20 text-amber-300',
  processing: 'bg-blue-500/20 text-blue-300',
  completed: 'bg-emerald-500/20 text-emerald-300',
  failed: 'bg-rose-500/20 text-rose-300',
};

export default function StatusBadge({ status }) {
  return (
    <span className={`rounded-full px-3 py-1 text-xs font-semibold capitalize ${colorMap[status] || 'bg-slate-600 text-white'}`}>
      {status}
    </span>
  );
}
