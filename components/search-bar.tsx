'use client';

import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useTranslations } from 'next-intl';

interface SearchBarProps {
  defaultValue?: string;
}

export function SearchBar({ defaultValue }: SearchBarProps) {
  const t = useTranslations('search');
  const tCommon = useTranslations('common');

  return (
    <form action="/" method="get" className="flex gap-2 w-full max-w-xl mx-auto">
      <Input
        name="q"
        placeholder={t('placeholder')}
        defaultValue={defaultValue}
        className="flex-1"
      />
      <Button type="submit" variant="primary" size="md">
        {tCommon('search')}
      </Button>
    </form>
  );
}
