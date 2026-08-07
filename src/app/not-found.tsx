import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex flex-1 w-full max-w-3xl flex-col items-center justify-between py-24 px-8 bg-white dark:bg-black sm:items-start">
        
        {/* Status / Error Badge */}
        <div className="flex items-center gap-2">
          <span className="flex h-2.5 w-2.5 rounded-full bg-rose-500" />
          <span className="text-xs font-semibold tracking-wider text-zinc-500 uppercase dark:text-zinc-400">
            404 — Page Not Found
          </span>
        </div>

        {/* Hero Title & Description */}
        <div className="flex flex-col items-center gap-6 text-center sm:items-start sm:text-left my-12">
          <h1 className="max-w-xl text-4xl font-semibold leading-tight tracking-tight text-black dark:text-zinc-50 sm:text-5xl">
            Looks like this tool doesn&apos;t exist yet.
          </h1>
          <p className="max-w-md text-lg leading-relaxed text-zinc-600 dark:text-zinc-400">
            The page or utility you are looking for could not be found, might have been moved, or hasn&apos;t been built yet.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col gap-4 text-base font-medium sm:flex-row w-full sm:w-auto">
          <Link
            className="flex h-12 items-center justify-center gap-2 rounded-full bg-zinc-900 px-6 text-zinc-50 transition-colors hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200"
            href="/"
          >
            Back to Home
          </Link>
          <a
            className="flex h-12 items-center justify-center rounded-full border border-solid border-black/[.08] px-6 text-black transition-colors hover:bg-black/[.04] dark:border-white/[.145] dark:text-white dark:hover:bg-[#1a1a1a]"
            href="https://github.com/AiDarkEzio/Local-Tools/issues/new"
            target="_blank"
            rel="noopener noreferrer"
          >
            Request a Tool on GitHub
          </a>
        </div>

      </main>
    </div>
  );
}