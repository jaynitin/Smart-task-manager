import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
// import { fetchTasks, createTask } from './features/tasks/tasksSlice';
import { createTask } from './features/tasks/tasksSlice';
import { setStatusFilter, setPriorityFilter, setSearch } from './features/filters/filtersSlice';
import { selectFilteredTasks } from './features/tasks/selectors';
import { KanbanBoard } from './components/KanbanBoard';
import { SearchBar } from './components/SearchBar';
import { v4 as uuidv4 } from 'uuid';

// ─── Constants ───────────────────────────────────────────────────────────────
const STATUS_TABS  = ['all', 'todo', 'in-progress', 'done'];
const PRIORITY_OPT = ['all', 'low', 'medium', 'high'];

// ─── Task Form Modal ──────────────────────────────────────────────────────────
function TaskFormModal({ onClose }) {
  const dispatch = useDispatch();
  const [form, setForm] = useState({
    title: '',
    description: '',
    priority: 'medium',
    status: 'todo',
    dueDate: '',
  });
  const [error, setError] = useState('');

  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = () => {
    if (!form.title.trim()) {
      setError('Title is required.');
      return;
    }
    dispatch(createTask({ ...form, id: uuidv4(), createdAt: new Date().toISOString() }));
    onClose();
  };

  return (
    // Backdrop
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
      onClick={onClose}
    >
      {/* Modal card */}
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-semibold text-gray-800">New Task</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-2xl leading-none">×</button>
        </div>

        {error && (
          <p className="mb-3 text-sm text-red-600 bg-red-50 px-3 py-2 rounded-lg">{error}</p>
        )}

        <div className="flex flex-col gap-4">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
            <input
              name="title"
              value={form.title}
              onChange={handleChange}
              placeholder="e.g. Fix login bug"
              className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm
                         focus:outline-none focus:ring-2 focus:ring-blue-300"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              rows={3}
              placeholder="Optional details…"
              className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm resize-none
                         focus:outline-none focus:ring-2 focus:ring-blue-300"
            />
          </div>

          {/* Priority + Status row */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
              <select
                name="priority"
                value={form.priority}
                onChange={handleChange}
                className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm
                           focus:outline-none focus:ring-2 focus:ring-blue-300"
              >
                {['low', 'medium', 'high'].map((p) => (
                  <option key={p} value={p}>{p.charAt(0).toUpperCase() + p.slice(1)}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <select
                name="status"
                value={form.status}
                onChange={handleChange}
                className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm
                           focus:outline-none focus:ring-2 focus:ring-blue-300"
              >
                {['todo', 'in-progress', 'done'].map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Due date */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Due Date</label>
            <input
              type="date"
              name="dueDate"
              value={form.dueDate}
              onChange={handleChange}
              className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm
                         focus:outline-none focus:ring-2 focus:ring-blue-300"
            />
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3 mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm rounded-xl border border-gray-200 text-gray-600
                       hover:bg-gray-50 transition"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-5 py-2 text-sm rounded-xl bg-blue-600 text-white font-medium
                       hover:bg-blue-700 active:scale-95 transition"
          >
            Create Task
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Stats Bar ────────────────────────────────────────────────────────────────
function StatsBar({ tasks }) {
  const total      = tasks.length;
  const done       = tasks.filter((t) => t.status === 'done').length;
  const inProgress = tasks.filter((t) => t.status === 'in-progress').length;
  const highPri    = tasks.filter((t) => t.priority === 'high').length;

  const stats = [
    { label: 'Total',       value: total,      color: 'text-gray-800' },
    { label: 'In Progress', value: inProgress, color: 'text-blue-600' },
    { label: 'Done',        value: done,       color: 'text-green-600' },
    { label: 'High Priority', value: highPri,  color: 'text-red-500'  },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
      {stats.map(({ label, value, color }) => (
        <div key={label} className="bg-white rounded-xl border border-gray-100 px-4 py-3 shadow-sm">
          <p className="text-xs text-gray-500 mb-1">{label}</p>
          <p className={`text-2xl font-semibold ${color}`}>{value}</p>
        </div>
      ))}
    </div>
  );
}

// ─── App Root ─────────────────────────────────────────────────────────────────
export default function App() {
  const dispatch = useDispatch();
  const { status, error } = useSelector((state) => state.tasks);
  const filters            = useSelector((state) => state.filters);
  const allTasks           = useSelector((state) => state.tasks.items);
  const filteredTasks      = useSelector(selectFilteredTasks);

  const [showModal, setShowModal] = useState(false);

  // Fetch tasks on mount
  // useEffect(() => {
  //   if (status === 'idle') dispatch(fetchTasks());
  // }, [status, dispatch]);

  return (
    <div className="min-h-screen bg-gray-50 font-sans">

      {/* ── Top Nav ── */}
      <nav className="bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between sticky top-0 z-40 shadow-sm">
        <div className="flex items-center gap-3">
          {/* Logo mark */}
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"/>
            </svg>
          </div>
          <span className="text-base font-semibold text-gray-800 tracking-tight">Smart Task Manager</span>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 active:scale-95
                     text-white text-sm font-medium px-4 py-2 rounded-xl transition"
        >
          <span className="text-lg leading-none">+</span> New Task
        </button>
      </nav>

      {/* ── Main Content ── */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">

        {/* Stats */}
        <StatsBar tasks={allTasks} />

        {/* Filter + Search toolbar */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm px-4 py-3
                        flex flex-wrap gap-3 items-center mb-6">
          <SearchBar />

          {/* Status tabs */}
          <div className="flex gap-1 flex-wrap">
            {STATUS_TABS.map((s) => (
              <button
                key={s}
                onClick={() => dispatch(setStatusFilter(s))}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition
                  ${filters.status === s
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-500 hover:bg-gray-100'}`}
              >
                {s === 'all' ? 'All' : s.charAt(0).toUpperCase() + s.slice(1)}
              </button>
            ))}
          </div>

          {/* Priority filter */}
          <select
            value={filters.priority}
            onChange={(e) => dispatch(setPriorityFilter(e.target.value))}
            className="border border-gray-200 rounded-xl px-3 py-1.5 text-sm text-gray-600
                       focus:outline-none focus:ring-2 focus:ring-blue-300 ml-auto"
          >
            {PRIORITY_OPT.map((p) => (
              <option key={p} value={p}>
                {p === 'all' ? 'All priorities' : p.charAt(0).toUpperCase() + p.slice(1)}
              </option>
            ))}
          </select>
        </div>

        {/* Loading state */}
        {status === 'loading' && (
          <div className="flex justify-center items-center py-24">
            <div className="w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin" />
          </div>
        )}

        {/* Error state */}
        {status === 'failed' && (
          <div className="bg-red-50 border border-red-200 text-red-700 rounded-2xl px-6 py-5 text-sm">
            <p className="font-medium mb-1">Failed to load tasks</p>
            <p className="text-red-500">{error}</p>
            <button
              onClick={() => dispatch(fetchTasks())}
              className="mt-3 text-red-600 underline text-xs hover:no-underline"
            >
              Retry
            </button>
          </div>
        )}

        {/* Empty state */}
        {status === 'succeeded' && filteredTasks.length === 0 && (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="w-14 h-14 bg-gray-100 rounded-2xl flex items-center justify-center mb-4">
              <svg className="w-7 h-7 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/>
              </svg>
            </div>
            <p className="text-gray-700 font-medium mb-1">No tasks found</p>
            <p className="text-gray-400 text-sm mb-4">Try adjusting your filters or create a new task.</p>
            <button
              onClick={() => setShowModal(true)}
              className="bg-blue-600 text-white text-sm px-5 py-2 rounded-xl hover:bg-blue-700 transition"
            >
              + Create Task
            </button>
          </div>
        )}

        {/* Kanban board */}
        {status === 'succeeded' && filteredTasks.length > 0 && (
          <KanbanBoard />
        )}
      </main>

      {/* ── Task Form Modal ── */}
      {showModal && <TaskFormModal onClose={() => setShowModal(false)} />}
    </div>
  );
}