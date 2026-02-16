'use client';

import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface SearchBarProps {
  defaultValue?: string;
}

export function SearchBar({ defaultValue }: SearchBarProps) {
  return (
    <form action="/" method="get" className="flex gap-2 w-full max-w-xl mx-auto">
      <Input
        name="q"
        placeholder="Search articles or authors..."
        defaultValue={defaultValue}
        className="flex-1"
      />
      <Button type="submit" variant="primary" size="md">
        Search
      </Button>
    </form>
  );
}
