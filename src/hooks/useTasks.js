import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { taskService } from '../services/api';

export function useTasks() {
  return useQuery({
    queryKey: ['tasks'],
    queryFn: () => taskService.getAll().then(r => r.data),
    staleTime: 1000 * 60 * 2, // 2 min
  });
}

export function useUpdateTask() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, changes }) => taskService.patch(id, changes),
    onMutate: async ({ id, changes }) => {
      await qc.cancelQueries({ queryKey: ['tasks'] });
      const prev = qc.getQueryData(['tasks']);
      // Optimistic update
      qc.setQueryData(['tasks'], old =>
        old.map(t => t.id === id ? { ...t, ...changes } : t)
      );
      return { prev };
    },
    onError: (_err, _vars, context) => {
      qc.setQueryData(['tasks'], context.prev); // rollback
    },
    onSettled: () => qc.invalidateQueries({ queryKey: ['tasks'] }),
  });
}