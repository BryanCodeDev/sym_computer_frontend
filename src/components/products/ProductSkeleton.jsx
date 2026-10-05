export default function ProductSkeleton({ variant = 'default' }) {
  if (variant === 'list') {
    return (
      <article className="card flex gap-4 p-4" role="listitem" aria-busy="true">
        <div className="skeleton w-20 sm:w-24 h-20 sm:h-24 rounded-lg flex-shrink-0" aria-hidden="true" />
        <div className="flex-1 space-y-3 min-w-0">
          <div className="skeleton h-3 w-1/4 rounded" aria-hidden="true" />
          <div className="skeleton h-4 w-3/4 rounded" aria-hidden="true" />
          <div className="skeleton h-4 w-1/2 rounded" aria-hidden="true" />
          <div className="skeleton h-5 w-1/3 rounded" aria-hidden="true" />
          <div className="skeleton h-4 w-1/4 rounded" aria-hidden="true" />
          <div className="flex flex-col sm:flex-row gap-2">
            <div className="skeleton h-10 w-full sm:w-24 rounded-lg" aria-hidden="true" />
            <div className="skeleton h-10 w-full sm:w-24 rounded-lg" aria-hidden="true" />
            <div className="skeleton h-10 flex-1 rounded-lg" aria-hidden="true" />
          </div>
        </div>
      </article>
    )
  }

  return (
    <article className="card" role="listitem" aria-busy="true">
      <div className="card-image aspect-[4/3] skeleton" aria-hidden="true" />
      <div className="p-3 sm:p-4 space-y-2 sm:space-y-3">
        <div className="skeleton h-3 w-20 rounded-full" aria-hidden="true" />
        <div className="skeleton h-4 w-3/4 rounded" aria-hidden="true" />
        <div className="skeleton h-4 w-1/2 rounded" aria-hidden="true" />
        <div className="flex items-baseline gap-3">
          <div className="skeleton h-5 w-1/4 rounded" aria-hidden="true" />
          <div className="skeleton h-3 w-1/5 rounded" aria-hidden="true" />
        </div>
        <div className="skeleton h-3 w-1/3 rounded-full" aria-hidden="true" />
        <div className="flex flex-col sm:flex-row gap-2 pt-3 border-t border-charcoal-100">
          <div className="skeleton h-10 flex-1 rounded-lg" aria-hidden="true" />
          <div className="skeleton h-10 w-full sm:w-24 rounded-lg" aria-hidden="true" />
        </div>
      </div>
    </article>
  )
}