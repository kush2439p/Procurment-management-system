export const TableSkeleton = ({ rows = 5, cols = 4 }: { rows?: number; cols?: number }) => (
  <div className="glass-card overflow-hidden">
    <table className="data-table">
      <thead>
        <tr>
          {Array.from({ length: cols }).map((_, i) => (
            <th key={i}><div className="h-3 bg-muted rounded w-20 animate-pulse" /></th>
          ))}
        </tr>
      </thead>
      <tbody>
        {Array.from({ length: rows }).map((_, r) => (
          <tr key={r}>
            {Array.from({ length: cols }).map((_, c) => (
              <td key={c}><div className="h-4 bg-muted rounded w-full animate-pulse" /></td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

export const CardSkeleton = () => (
  <div className="glass-card p-5 space-y-3">
    <div className="h-3 bg-muted rounded w-24 animate-pulse" />
    <div className="h-8 bg-muted rounded w-16 animate-pulse" />
    <div className="h-3 bg-muted rounded w-32 animate-pulse" />
  </div>
);
