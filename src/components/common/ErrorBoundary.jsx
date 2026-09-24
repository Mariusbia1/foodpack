import { Component } from 'react'

export default class ErrorBoundary extends Component {
  state = { hasError: false, error: null, showDetails: false }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, errorInfo) {
    console.error('Erreur de rendu FOOD PACK :', error, errorInfo)
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null })
    window.location.href = '/'
  }

  render() {
    if (this.state.hasError) {
      return (
        <main className="grid min-h-screen place-items-center bg-[#F2F0F1] px-5 py-10 text-center">
          <div className="max-w-lg">
            <div className="inline-flex flex-col items-center">
              <span className="font-display text-4xl font-black uppercase tracking-tight text-black leading-none">
                FOODPACK<span className="text-[#FF3333]">.</span>
              </span>
              <span className="text-xs font-extrabold tracking-[0.2em] text-black/50 uppercase mt-1">
                by Maurelle
              </span>
            </div>
            <h1 className="mt-6 font-display text-2xl font-black text-black">La page n’a pas pu s’afficher.</h1>
            <p className="mt-3 text-sm text-black/60">
              Une erreur inattendue est survenue lors de l'affichage. Vous pouvez actualiser ou retourner à l'accueil.
            </p>

            {this.state.error?.message && (
              <div className="mt-4 rounded-xl border border-red-200 bg-red-50 p-4 text-left font-mono text-xs text-red-900">
                <p className="font-bold text-red-950">Détail technique :</p>
                <p className="mt-1 break-words">{this.state.error.message}</p>
              </div>
            )}

            <div className="mt-7 flex flex-wrap justify-center gap-3">
              <button
                className="rounded-full bg-black px-6 py-3 text-sm font-bold text-white transition hover:bg-black/80"
                onClick={() => window.location.reload()}
              >
                Actualiser la page
              </button>
              <button
                className="rounded-full border border-black/20 bg-white px-6 py-3 text-sm font-bold text-black transition hover:bg-black/5"
                onClick={this.handleReset}
              >
                Retour à l’accueil
              </button>
            </div>
          </div>
        </main>
      )
    }

    return this.props.children
  }
}
