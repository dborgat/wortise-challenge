import { RegisterForm } from "@/components/auth/register-form";
import Link from "next/link";
import { getTranslations } from "next-intl/server";

export default async function RegisterPage() {
  const t = await getTranslations("auth");

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-gray-50 to-gray-100 dark:from-gray-950 dark:to-gray-900 px-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-block mb-6">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">CMS</h1>
          </Link>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
            {t("createYourAccount")}
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            {t("registerSubtitle")}
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-white dark:bg-gray-900 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-8">
          <RegisterForm />
        </div>

        {/* Footer */}
        <p className="mt-8 text-center text-sm text-gray-500 dark:text-gray-400">
          {t("termsNotice")}
        </p>
      </div>
    </div>
  );
}
