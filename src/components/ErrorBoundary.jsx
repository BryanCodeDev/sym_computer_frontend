import { Component } from 'react'

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null, errorInfo: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo)
    this.setState({ errorInfo })
  }

  handleReload = () => {
    window.location.href = '/'
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null, errorInfo: null })
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-white flex items-center justify-center px-4" role="alert">
          <div className="max-w-md w-full text-center space-y-6">
            <div className="w-20 h-20 mx-auto bg-charcoal-50 rounded-full flex items-center justify-center">
              <svg className="w-10 h-10 text-charcoal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
              </svg>
            </div>
            <div>
              <h1 className="font-display font-bold text-2xl text-primary-900 mb-2">Uy, algo se nos escapó</h1>
              <p className="text-primary-800/70 text-sm leading-relaxed">
                Tuvimos un tropiezo inesperado. Intenta de nuevo o recarga la página — tu carrito y tu lista de favoritos siguen guardados.
                {this.state.error?.message && (
                  <span className="block mt-2 text-xs text-primary-700/50 bg-charcoal-50 rounded-lg p-2 text-left">
                    {this.state.error.message}
                  </span>
                )}
              </p>
            </div>
            <div className="flex flex-col gap-3">
              <button
                onClick={this.handleRetry}
                className="w-full btn-primary py-3 text-base font-medium"
              >
                Intentar de nuevo
              </button>
              <button
                onClick={this.handleReload}
                className="w-full btn-secondary py-3 text-base font-medium"
              >
                Recargar página
              </button>
            </div>
            {this.state.errorInfo && (
              <details className="text-left">
                <summary className="text-xs text-primary-700/40 cursor-pointer hover:text-primary-700/60 transition-colors">
                  Ver detalles técnicos
                </summary>
                <pre className="mt-2 text-xs text-primary-700/50 bg-primary-50 rounded-lg p-3 overflow-auto max-h-40">
                  {this.state.errorInfo.componentStack}
                </pre>
              </details>
            )}
          </div>
        </div>
      )
    }

    return this.props.children
  }
}