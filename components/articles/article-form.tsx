"use client";

import { useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  createArticleSchema,
  type CreateArticleInput,
} from "@/lib/validations/article";
import { useArticleMutations } from "@/hooks/use-article-mutations";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useTranslations } from "next-intl";

interface ArticleFormProps {
  article?: {
    id: string;
    title: string;
    content: string;
    coverImage: string;
  };
  onSuccess?: () => void;
}

export function ArticleForm({ article, onSuccess }: ArticleFormProps) {
  const { createMutation, updateMutation, router } = useArticleMutations();
  const isEditing = !!article;
  const t = useTranslations("article");
  const tCommon = useTranslations("common");

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

  const onSubmit = async (data: CreateArticleInput) => {
    if (isEditing) {
      await updateMutation.mutateAsync({
        id: article.id,
        ...data,
      });
    } else {
      await createMutation.mutateAsync(data);
    }

    if (onSuccess) {
      onSuccess();
    } else {
      router.push("/dashboard");
    }
  };

  const error = useMemo(
    () => createMutation.error || updateMutation.error,
    [createMutation.error, updateMutation.error],
  );

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <Input
        label={t("titleLabel")}
        placeholder={t("titlePlaceholder")}
        error={errors.title?.message}
        {...register("title")}
      />

      <Input
        label={t("coverImageLabel")}
        type="url"
        placeholder={t("coverImagePlaceholder")}
        helperText={t("coverImageHelper")}
        error={errors.coverImage?.message}
        {...register("coverImage")}
      />

      <Textarea
        label={t("contentLabel")}
        placeholder={t("contentPlaceholder")}
        rows={12}
        error={errors.content?.message}
        {...register("content")}
      />

      {error && (
        <div className="p-3 text-sm text-red-600 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md">
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
          {isEditing ? t("updateButton") : t("publishButton")}
        </Button>

        <Button
          type="button"
          variant="ghost"
          size="lg"
          onClick={() => router.back()}
        >
          {tCommon("cancel")}
        </Button>
      </div>
    </form>
  );
}
