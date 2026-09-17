export default function LoadingScreen({ label = 'Chargement...' }) {
  return (
    <div
      className="fixed inset-0 z-[100] grid min-h-screen place-items-center bg-white px-6 text-center"
      role="status"
      aria-live="polite"
    >
      <div className="flex flex-col items-center">
        <div className="h-10 w-10 animate-spin rounded-full border-[3px] border-black/10 border-t-black" />
        <p className="mt-5 font-display text-lg font-black uppercase tracking-tight text-black">
          FOOD PACK<span className="text-[#FF3333]">.</span>
        </p>
        <p className="mt-1 text-xs font-semibold uppercase tracking-widest text-black/40">
          {label}
        </p>
      </div>
      <span className="sr-only">Chargement en cours</span>
    </div>
  )
}

