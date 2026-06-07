import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { taskService } from '../../services/api';

// Load persisted tasks from localStorage on startup
const loadTasks = () => {
  try {
    const saved = localStorage.getItem('tasks');
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
};

// Save tasks to localStorage whenever they change
const saveTasks = (tasks) => {
  try {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  } catch {}
};

export const createTask = createAsyncThunk('tasks/create', async (task) => {
  return await taskService.create(task);
});

export const updateTask = createAsyncThunk('tasks/update', async ({ id, changes }) => {
  return await taskService.update(id, changes);
});

export const deleteTask = createAsyncThunk('tasks/delete', async (id) => {
  return await taskService.remove(id);
});

const tasksSlice = createSlice({
  name: 'tasks',
  initialState: {
    items: loadTasks(), // ← start from localStorage, not API
    status: 'succeeded',
    error: null,
  },
  reducers: {
    reorderTasks(state, action) {
      const { oldIndex, newIndex } = action.payload;
      const [moved] = state.items.splice(oldIndex, 1);
      state.items.splice(newIndex, 0, moved);
      saveTasks(state.items);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createTask.fulfilled, (state, { payload }) => {
        state.items.unshift(payload);
        saveTasks(state.items);
      })
      .addCase(updateTask.fulfilled, (state, { payload }) => {
        const idx = state.items.findIndex(t => t.id === payload.id);
        if (idx !== -1) state.items[idx] = { ...state.items[idx], ...payload };
        saveTasks(state.items);
      })
      .addCase(deleteTask.fulfilled, (state, { payload }) => {
        state.items = state.items.filter(t => t.id !== payload);
        saveTasks(state.items);
      });
  },
});

export const { reorderTasks } = tasksSlice.actions;
export default tasksSlice.reducer;