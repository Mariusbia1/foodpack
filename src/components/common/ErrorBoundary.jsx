import { Component } from 'react'

export default class ErrorBoundary extends Component {
  state = { hasError: false }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  componentDidCatch(error) {
    console.error('Erreur de rendu FOOD PACK :', error)
  }

  render() {
    if (this.state.hasError) {
      return (
        <main className="grid min-h-screen place-items-center bg-[#F2F0F1] px-5 text-center">
          <div>
            <p className="font-display text-4xl font-black uppercase tracking-tight text-black">
              FOOD PACK<span className="text-[#FF3333]">.</span>
            </p>
            <h1 className="mt-6 font-display text-2xl font-black text-black">La page n’a pas pu s’afficher.</h1>
            <p className="mt-3 text-sm text-black/60">
              Actualisez la page pour reprendre votre visite.
            </p>
            <button
              className="mt-7 rounded-full bg-black px-8 py-3 text-sm font-bold text-white hover:bg-black/80"
              onClick={() => window.location.reload()}
            >
              Actualiser la page
            </button>
          </div>
        </main>
      )
    }

    return this.props.children
  }
}
