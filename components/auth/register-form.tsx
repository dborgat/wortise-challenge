'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { registerSchema, type RegisterInput } from '@/lib/validations/auth';
import { trpc } from '@/lib/trpc/client';
import { authClient } from '@/lib/auth-client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Link from 'next/link';
import { useTranslations } from 'next-intl';

export function RegisterForm() {
  const router = useRouter();
  const [error, setError] = useState<string>('');
  const t = useTranslations('auth');

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
  });

  const registerMutation = trpc.auth.register.useMutation({
    onError: (err) => {
      setError(err.message);
    },
  });

  const onSubmit = async (data: RegisterInput) => {
    setError('');
    await registerMutation.mutateAsync(data);

    try {
      await authClient.signIn.email({
        email: data.email,
        password: data.password,
      });
      router.push('/dashboard');
    } catch {
      router.push('/login');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <div className="space-y-4">
        <Input
          label={t('nameLabel')}
          placeholder={t('namePlaceholder')}
          error={errors.name?.message}
          {...register('name')}
        />

        <Input
          label={t('emailLabel')}
          type="email"
          placeholder={t('emailPlaceholder')}
          error={errors.email?.message}
          {...register('email')}
        />

        <Input
          label={t('passwordLabel')}
          type="password"
          placeholder={t('passwordPlaceholder')}
          helperText={t('passwordHelper')}
          error={errors.password?.message}
          {...register('password')}
        />
      </div>

      {error && (
        <div className="p-3 text-sm text-red-600 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md">
          {error}
        </div>
      )}

      <Button
        type="submit"
        variant="primary"
        size="lg"
        className="w-full"
        isLoading={isSubmitting}
      >
        {t('createAccountButton')}
      </Button>

      <p className="text-center text-sm text-gray-600 dark:text-gray-400">
        {t('alreadyHaveAccount')}{' '}
        <Link href="/login" className="font-medium text-gray-900 dark:text-gray-100 hover:underline">
          {t('signInLink')}
        </Link>
      </p>
    </form>
  );
}
