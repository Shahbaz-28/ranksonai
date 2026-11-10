/**
 * The five answer engines, cropped straight out of `public/applogo.png` so the
 * sheet's white background never reaches the page — each tile shows only its
 * own rounded square.
 *
 * Crop boxes were measured off the decoded PNG: the sheet is 2172x724 and the
 * tiles sit on one row from y=172, each 340px square at the lefts below.
 */

const SHEET_W = 2172
const SHEET_H = 724

/**
 * Per-tile crop boxes, found by searching each tile for the largest centred
 * square whose entire border is black. The sizes differ by a few pixels
 * because the tiles aren't identical on the sheet — cropping each to its own
 * box is what guarantees no sheet background reaches the edges.
 */
const ENGINES = [
  { name: "ChatGPT", left: 254, top: 196, box: 294 },
  { name: "Claude", left: 612, top: 204, box: 278 },
  { name: "Perplexity", left: 946, top: 204, box: 278 },
  { name: "Gemini", left: 1282, top: 203, box: 280 },
  { name: "Google", left: 1625, top: 197, box: 292 },
]

export default function EngineIcons({ size = 52 }: { size?: number }) {
  return (
    <div className="flex flex-col items-center gap-3">
      <span className="text-[11.5px] font-semibold uppercase tracking-[0.16em] text-[rgba(73,66,61,0.5)]">
        Every answer, on every engine
      </span>

      <ul className="flex items-center justify-center gap-3 sm:gap-4">
        {ENGINES.map((e, i) => {
          const k = size / e.box
          return (
          <li key={e.name} className="group relative">
            {/* Outer span owns the idle drift, inner span owns the hover lift,
                so the two transforms never fight over the same element. */}
            <span className="engine-drift block" style={{ animationDelay: `${i * 0.36}s` }}>
              <span
                role="img"
                aria-label={e.name}
                className="block rounded-[22%] bg-no-repeat shadow-[0px_6px_16px_-6px_rgba(55,50,47,0.42)] transition-transform duration-300 ease-out group-hover:scale-[1.09]"
                style={{
                  width: size,
                  height: size,
                  backgroundImage: "url('/applogo.png')",
                  backgroundSize: `${(SHEET_W * k).toFixed(2)}px ${(SHEET_H * k).toFixed(2)}px`,
                  backgroundPosition: `-${(e.left * k).toFixed(2)}px -${(e.top * k).toFixed(2)}px`,
                }}
              />
            </span>
            <span className="pointer-events-none absolute -bottom-6 left-1/2 -translate-x-1/2 whitespace-nowrap text-[11px] font-medium text-[rgba(73,66,61,0.62)] opacity-0 transition-opacity duration-200 group-hover:opacity-100">
              {e.name}
            </span>
          </li>
          )
        })}
      </ul>

      <style>{`
        .engine-drift { animation: engine-drift 4.4s ease-in-out infinite; }
        @keyframes engine-drift {
          0%, 100% { transform: translateY(0) }
          50%      { transform: translateY(-6px) }
        }
        @media (prefers-reduced-motion: reduce) {
          .engine-drift { animation: none; }
        }
      `}</style>
    </div>
  )
}
