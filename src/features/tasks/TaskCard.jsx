import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useDispatch } from 'react-redux';
import { deleteTask, updateTask } from './tasksSlice';

const PRIORITY_COLOR = { low: 'bg-green-100 text-green-800', medium: 'bg-yellow-100 text-yellow-800', high: 'bg-red-100 text-red-800' };

export function TaskCard({ task }) {
  const dispatch = useDispatch();
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: task.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes}
      className="bg-white rounded-xl border p-4 shadow-sm cursor-grab active:cursor-grabbing">
      {/* Drag handle */}
      <div {...listeners} className="text-gray-300 mb-2 text-xs select-none">⠿ drag</div>
      <h3 className="font-medium text-gray-800 mb-1">{task.title}</h3>
      <p className="text-gray-500 text-sm mb-3">{task.description}</p>
      <div className="flex items-center justify-between">
        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${PRIORITY_COLOR[task.priority] || ''}`}>
          {task.priority}
        </span>
        <div className="flex gap-2">
          <button onClick={() => dispatch(updateTask({ id: task.id, changes: { status: 'done' } }))}
            className="text-xs text-blue-600 hover:underline">✓ Done</button>
          <button onClick={() => dispatch(deleteTask(task.id))}
            className="text-xs text-red-500 hover:underline">✕</button>
        </div>
      </div>
    </div>
  );
}