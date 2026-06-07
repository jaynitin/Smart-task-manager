import { createSelector } from '@reduxjs/toolkit';

export const selectFilteredTasks = createSelector(
    (state) => state.tasks.items,
    (state) => state.filters,
    (tasks, filters) => tasks
      .filter(t => filters.status === 'all' || t.status === filters.status)
      .filter(t => filters.priority === 'all' || t.priority === filters.priority)
      .filter(t => t.title.toLowerCase().includes(filters.search.toLowerCase()))
);