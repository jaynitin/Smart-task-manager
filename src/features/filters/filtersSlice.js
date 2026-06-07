import { createSlice } from '@reduxjs/toolkit';

const filtersSlice = createSlice({
  name: 'filters',
  initialState: { status: 'all', priority: 'all', search: '' },
  reducers: {
    setStatusFilter: (state, { payload }) => { state.status = payload; },
    setPriorityFilter: (state, { payload }) => { state.priority = payload; },
    setSearch: (state, { payload }) => { state.search = payload; },
  },
});

export const { setStatusFilter, setPriorityFilter, setSearch } = filtersSlice.actions;
export default filtersSlice.reducer;