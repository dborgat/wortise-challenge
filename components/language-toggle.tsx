'use client';

import { useLocale, useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';

export function LanguageToggle() {
  const locale = useLocale();
  const t = useTranslations('language');
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    document.cookie = `NEXT_LOCALE=${e.target.value};path=/;max-age=31536000`;
    router.refresh();
  };

  return (
    <select
      value={locale}
      onChange={handleChange}
      aria-label={t('label')}
      className="px-2 py-1.5 text-sm rounded-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-300 dark:focus:ring-offset-gray-900 dark:focus:ring-gray-600"
    >
      <option value="en">{t('en')}</option>
      <option value="es">{t('es')}</option>
    </select>
  );
}
