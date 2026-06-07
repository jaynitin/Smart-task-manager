import { DndContext, closestCenter, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy, arrayMove } from '@dnd-kit/sortable';
import { useDispatch, useSelector } from 'react-redux';
import { reorderTasks } from '../features/tasks/tasksSlice';
import { selectFilteredTasks } from '../features/tasks/selectors';
import { TaskCard } from '../features/tasks/TaskCard';

const COLUMNS = ['todo', 'in-progress', 'done'];

export function KanbanBoard() {
  const dispatch = useDispatch();
  const tasks = useSelector(selectFilteredTasks);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } })
  );

  function handleDragEnd(event) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = tasks.findIndex(t => t.id === active.id);
    const newIndex  = tasks.findIndex(t => t.id === over.id);
    dispatch(reorderTasks({ oldIndex, newIndex }));
  }

  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <div className="grid grid-cols-3 gap-4">
        {COLUMNS.map(col => {
          const colTasks = tasks.filter(t => t.status === col);
          return (
            <div key={col} className="bg-gray-50 rounded-xl p-3">
              <h2 className="text-sm font-semibold text-gray-600 uppercase mb-3">{col}</h2>
              <SortableContext items={colTasks.map(t => t.id)} strategy={verticalListSortingStrategy}>
                <div className="flex flex-col gap-3">
                  {colTasks.map(task => <TaskCard key={task.id} task={task} />)}
                </div>
              </SortableContext>
            </div>
          );
        })}
      </div>
    </DndContext>
  );
}