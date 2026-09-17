export default function LoadingScreen({ label = 'Chargement...' }) {
  return (
    <div className="fixed inset-0 z-[100] grid min-h-screen place-items-center bg-[#F2F0F1] px-6 text-center" role="status" aria-live="polite">
      <div>
        <div className="relative mx-auto h-20 w-20">
          <span className="absolute inset-0 rounded-full border-2 border-black/10" />
          <span className="absolute inset-0 animate-spin rounded-full border-2 border-transparent border-t-black" />
          <span className="absolute inset-3 grid place-items-center rounded-full bg-black font-display text-xs font-black text-white shadow-lg">
            FP
          </span>
        </div>
        <p className="mt-5 font-display text-2xl font-black uppercase tracking-tight text-black">
          FOOD PACK<span className="text-[#FF3333]">.</span>
        </p>
        <p className="mt-1 text-xs font-semibold uppercase tracking-widest text-black/50">{label}</p>
      </div>
      <span className="sr-only">Chargement en cours</span>
    </div>
  )
}
