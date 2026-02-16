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

/**
 * Register form component
 * Handles user registration with validation
 */
export function RegisterForm() {
  const router = useRouter();
  const [error, setError] = useState<string>('');

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

    // Auto-login with the same credentials
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
          label="Full Name"
          placeholder="John Doe"
          error={errors.name?.message}
          {...register('name')}
        />

        <Input
          label="Email"
          type="email"
          placeholder="john@example.com"
          error={errors.email?.message}
          {...register('email')}
        />

        <Input
          label="Password"
          type="password"
          placeholder="••••••••"
          helperText="At least 8 characters with uppercase, lowercase, and number"
          error={errors.password?.message}
          {...register('password')}
        />
      </div>

      {error && (
        <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md">
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
        Create Account
      </Button>

      <p className="text-center text-sm text-gray-600">
        Already have an account?{' '}
        <Link href="/login" className="font-medium text-gray-900 hover:underline">
          Sign in
        </Link>
      </p>
    </form>
  );
}
