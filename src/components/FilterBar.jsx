import { useDispatch, useSelector } from 'react-redux';
import { setStatusFilter, setPriorityFilter, setSearch } from '../features/filters/filtersSlice';

const STATUS  = ['all', 'todo', 'in-progress', 'done'];
const PRIORITY = ['all', 'low', 'medium', 'high'];

export function FilterBar() {
  const dispatch = useDispatch();
  const { status, priority, search } = useSelector(s => s.filters);

  return (
    <div className="flex flex-wrap gap-3 p-4 bg-white rounded-xl shadow-sm border">
      <input
        value={search}
        onChange={e => dispatch(setSearch(e.target.value))}
        placeholder="Search tasks…"
        className="border rounded-lg px-3 py-1.5 text-sm flex-1 min-w-[180px]"
      />
      <select value={status} onChange={e => dispatch(setStatusFilter(e.target.value))}
        className="border rounded-lg px-3 py-1.5 text-sm">
        {STATUS.map(s => <option key={s} value={s}>{s}</option>)}
      </select>
      <select value={priority} onChange={e => dispatch(setPriorityFilter(e.target.value))}
        className="border rounded-lg px-3 py-1.5 text-sm">
        {PRIORITY.map(p => <option key={p} value={p}>{p}</option>)}
      </select>
    </div>
  );
}