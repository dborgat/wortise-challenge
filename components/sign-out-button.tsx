'use client';

import { useRouter } from 'next/navigation';
import { authClient } from '@/lib/auth-client';
import { Button } from '@/components/ui/button';
import { useState } from 'react';

interface SignOutButtonProps {
  label: string;
}

export function SignOutButton({ label }: SignOutButtonProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleSignOut = async () => {
    setIsLoading(true);
    await authClient.signOut();
    router.push('/login');
    router.refresh();
  };

  return (
    <Button
      type="button"
      variant="ghost"
      size="sm"
      onClick={handleSignOut}
      isLoading={isLoading}
    >
      {label}
    </Button>
  );
}
