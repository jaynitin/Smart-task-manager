import { useDispatch, useSelector } from 'react-redux';
import { setSearch } from '../features/filters/filtersSlice';
import { useCallback } from 'react';

export function SearchBar() {
  const dispatch = useDispatch();
  const search = useSelector((state) => state.filters.search);

  const handleChange = useCallback(
    (e) => dispatch(setSearch(e.target.value)),
    [dispatch]
  );

  const handleClear = () => dispatch(setSearch(''));

  return (
    <div className="relative flex items-center w-full max-w-md">
      {/* Search icon */}
      {/* <svg
        className="absolute left-3 w-4 h-4 text-gray-400 pointer-events-none"
        xmlns="http://www.w3.org/2000/svg"
        fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
      >
        <path strokeLinecap="round" strokeLinejoin="round"
          d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
      </svg> */}

      <input
        type="text"
        value={search}
        onChange={handleChange}
        placeholder="Search tasks…"
        aria-label="Search tasks"
        className="w-full pl-9 pr-8 py-2 text-sm border border-gray-200 rounded-xl
                   bg-white focus:outline-none focus:ring-2 focus:ring-blue-300
                   placeholder-gray-400 transition"
      />

      {/* Clear button — only visible when there's input */}
      {search && (
        <button
          onClick={handleClear}
          aria-label="Clear search"
          className="absolute right-3 text-gray-400 hover:text-gray-600 transition text-lg leading-none"
        >
          ×
        </button>
      )}
    </div>
  );
}