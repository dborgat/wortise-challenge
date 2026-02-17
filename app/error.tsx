"use client";

import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const t = useTranslations("errors");

  return (
    <div className="min-h-screen flex items-center justify-center p-8 font-(family-name:--font-geist-sans)">
      <div className="text-center max-w-md">
        <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-gray-100">{t("somethingWentWrong")}</h2>
        <p className="text-gray-600 dark:text-gray-400 mb-6">{error.message}</p>
        <Button onClick={reset}>
          {t("tryAgain")}
        </Button>
      </div>
    </div>
  );
}
