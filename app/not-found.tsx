import Link from "next/link";
import { Button } from "@/components/ui/button";
import { getTranslations } from "next-intl/server";

export default async function NotFound() {
  const t = await getTranslations("errors");

  return (
    <div className="min-h-screen flex items-center justify-center p-8 font-(family-name:--font-geist-sans)">
      <div className="text-center max-w-md">
        <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-gray-100">{t("pageNotFound")}</h2>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          {t("pageNotFoundDescription")}
        </p>
        <Link href="/">
          <Button>{t("goHome")}</Button>
        </Link>
      </div>
    </div>
  );
}
