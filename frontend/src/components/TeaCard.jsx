const stockLabelFor = (grams) => {
  if (grams === null || grams === undefined) return null;
  const value = Number(grams);
  if (Number.isNaN(value)) return null;
  if (value <= 25) return 'Très peu';
  if (value <= 50) return 'Peu';
  if (value <= 100) return 'Moyen';
  return 'Beaucoup';
};

const typeKey = (type) => (type || 'other').toLowerCase().replace(/\s+/g, '-');

function TeaCard({ tea, onSelect }) {
  const brand = tea.brand || '';
  const stockLabel = stockLabelFor(tea.stockGrams);
  const isLowStock = stockLabel === 'Très peu' || stockLabel === 'Peu';
  const stockValue = Number(tea.stockGrams);
  const stockPercent =
    stockLabel && !Number.isNaN(stockValue)
      ? Math.min(100, Math.max(0, (stockValue / 150) * 100))
      : null;
  const stockTone = isLowStock ? 'low' : stockLabel === 'Moyen' ? 'mid' : 'high';
  const isClickable = Boolean(onSelect);
  const typeClass = `type-${typeKey(tea.type)}`;
  return (
    <div
      className={`tea-card ${!tea.inStock ? 'out-of-stock' : ''} ${
        isClickable ? 'clickable' : ''
      }`}
      onClick={() => onSelect?.(tea)}
      role={isClickable ? 'button' : undefined}
      tabIndex={isClickable ? 0 : undefined}
      onKeyDown={(e) => {
        if (!isClickable) return;
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onSelect?.(tea);
        }
      }}
    >
      {isLowStock && (
        <div className="low-stock-badge">Stock faible</div>
      )}
      {!tea.inStock && (
        <div className="out-of-stock-overlay">
          <span>Out of Stock</span>
        </div>
      )}
      <div className="tea-image">
        {tea.imageUrl ? (
          <img src={tea.imageUrl} alt={tea.name} />
        ) : (
          <div className="placeholder-image">🍵</div>
        )}
      </div>
      <div className="tea-card-body">
        <span className={`tea-type-badge ${typeClass}`}>
          <span className={`type-dot ${typeClass}`}></span>
          {tea.type}
        </span>
        <h3>{tea.name}</h3>
        {brand && <span className="tea-brand">{brand}</span>}
        {tea.rating ? (
          <div className="tea-rating">{'★'.repeat(tea.rating)}</div>
        ) : null}
        {stockPercent !== null && (
          <div className="stock-bar">
            <span
              className={`stock-bar-fill ${stockTone}`}
              style={{ width: `${stockPercent}%` }}
            ></span>
          </div>
        )}
      </div>
    </div>
  );
}

export default TeaCard;
