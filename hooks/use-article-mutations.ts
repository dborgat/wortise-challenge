'use client';

import { useRouter } from 'next/navigation';
import { trpc } from '@/lib/trpc/client';
import { useToast } from '@/components/ui/toast';

/**
 * Custom hook encapsulating article create/update/delete mutations
 * with consistent cache invalidation and toast notifications
 */
export function useArticleMutations() {
  const router = useRouter();
  const utils = trpc.useUtils();
  const { showToast } = useToast();

  const invalidateArticles = () => {
    utils.article.getAll.invalidate();
    utils.article.getMyArticles.invalidate();
  };

  const createMutation = trpc.article.create.useMutation({
    onSuccess: () => {
      invalidateArticles();
      showToast('Article created successfully');
    },
    onError: (error) => {
      showToast(error.message, 'error');
    },
  });

  const updateMutation = trpc.article.update.useMutation({
    onSuccess: () => {
      invalidateArticles();
      utils.article.getById.invalidate();
      showToast('Article updated successfully');
    },
    onError: (error) => {
      showToast(error.message, 'error');
    },
  });

  const deleteMutation = trpc.article.delete.useMutation({
    onSuccess: () => {
      invalidateArticles();
      showToast('Article deleted successfully');
    },
    onError: (error) => {
      showToast(error.message, 'error');
    },
  });

  return {
    createMutation,
    updateMutation,
    deleteMutation,
    router,
  };
}
