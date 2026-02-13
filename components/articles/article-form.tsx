"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import {
  createArticleSchema,
  type CreateArticleInput,
} from "@/lib/validations/article";
import { trpc } from "@/lib/trpc/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface ArticleFormProps {
  /**
   * Article data for editing (optional)
   */
  article?: {
    id: string;
    title: string;
    content: string;
    coverImage: string;
  };
  /**
   * Called when form is successfully submitted
   */
  onSuccess?: () => void;
}

/**
 * Article form component
 * Handles both create and edit modes
 */
export function ArticleForm({ article, onSuccess }: ArticleFormProps) {
  const router = useRouter();
  const isEditing = !!article;

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<CreateArticleInput>({
    resolver: zodResolver(createArticleSchema),
    defaultValues: article
      ? {
          title: article.title,
          content: article.content,
          coverImage: article.coverImage,
        }
      : undefined,
  });

  // Create mutation
  const createMutation = trpc.article.create.useMutation({
    onSuccess: () => {
      if (onSuccess) {
        onSuccess();
      } else {
        router.push("/dashboard");
      }
      router.refresh();
    },
  });

  // Update mutation
  const updateMutation = trpc.article.update.useMutation({
    onSuccess: () => {
      if (onSuccess) {
        onSuccess();
      } else {
        router.push("/dashboard");
      }
      router.refresh();
    },
  });

  const onSubmit = async (data: CreateArticleInput) => {
    if (isEditing) {
      await updateMutation.mutateAsync({
        id: article.id,
        ...data,
      });
    } else {
      await createMutation.mutateAsync(data);
    }
  };

  const error = createMutation.error || updateMutation.error;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <Input
        label="Title"
        placeholder="Enter article title"
        error={errors.title?.message}
        {...register("title")}
      />

      <Input
        label="Cover Image URL"
        type="url"
        placeholder="https://example.com/image.jpg"
        helperText="Must be a valid image URL (jpg, jpeg, png, gif, webp)"
        error={errors.coverImage?.message}
        {...register("coverImage")}
      />

      <Textarea
        label="Content"
        placeholder="Write your article content here..."
        rows={12}
        error={errors.content?.message}
        {...register("content")}
      />

      {error && (
        <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md">
          {error.message}
        </div>
      )}

      <div className="flex gap-3">
        <Button
          type="submit"
          variant="primary"
          size="lg"
          isLoading={isSubmitting}
        >
          {isEditing ? "Update Article" : "Publish Article"}
        </Button>

        <Button
          type="button"
          variant="ghost"
          size="lg"
          onClick={() => router.back()}
        >
          Cancel
        </Button>
      </div>
    </form>
  );
}
