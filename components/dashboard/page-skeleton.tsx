/** Loading placeholder used by the dashboard route segments. */
export default function PageSkeleton({ tiles = 4, blocks = 2 }: { tiles?: number; blocks?: number }) {
  return (
    <div className="flex animate-pulse flex-col gap-7" aria-busy="true" aria-live="polite">
      <span className="sr-only">Loading</span>

      <div className="flex flex-col gap-3">
        <div className="h-3 w-40 rounded bg-[rgba(55,50,47,0.08)]" />
        <div className="h-7 w-[min(520px,80%)] rounded bg-[rgba(55,50,47,0.10)]" />
        <div className="h-4 w-[min(680px,95%)] rounded bg-[rgba(55,50,47,0.06)]" />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: tiles }).map((_, i) => (
          <div
            key={i}
            className="h-[118px] rounded-xl border border-[rgba(55,50,47,0.10)] bg-white p-5 shadow-[0px_1px_2px_rgba(55,50,47,0.05)]"
          >
            <div className="h-2.5 w-24 rounded bg-[rgba(55,50,47,0.08)]" />
            <div className="mt-3 h-7 w-16 rounded bg-[rgba(55,50,47,0.10)]" />
            <div className="mt-3 h-2.5 w-32 rounded bg-[rgba(55,50,47,0.06)]" />
          </div>
        ))}
      </div>

      {Array.from({ length: blocks }).map((_, i) => (
        <div
          key={i}
          className="rounded-xl border border-[rgba(55,50,47,0.10)] bg-white p-5 shadow-[0px_1px_2px_rgba(55,50,47,0.05)]"
        >
          <div className="h-3 w-48 rounded bg-[rgba(55,50,47,0.08)]" />
          <div className="mt-2 h-2.5 w-72 rounded bg-[rgba(55,50,47,0.06)]" />
          <div className="mt-5 flex flex-col gap-3">
            {Array.from({ length: 5 }).map((__, row) => (
              <div key={row} className="flex items-center gap-4">
                <div className="h-3 flex-1 rounded bg-[rgba(55,50,47,0.06)]" />
                <div className="h-3 w-16 rounded bg-[rgba(55,50,47,0.08)]" />
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
