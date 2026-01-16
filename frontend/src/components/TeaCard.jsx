const stockLabelFor = (grams) => {
  if (grams === null || grams === undefined) return null;
  const value = Number(grams);
  if (Number.isNaN(value)) return null;
  if (value <= 25) return 'Très peu';
  if (value <= 50) return 'Peu';
  if (value <= 100) return 'Moyen';
  return 'Beaucoup';
};

function TeaCard({ tea, onSelect }) {
  const brand = tea.brand || '';
  const stockLabel = stockLabelFor(tea.stockGrams);
  const isLowStock = stockLabel === 'Très peu' || stockLabel === 'Peu';
  const isClickable = Boolean(onSelect);
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
      <div className="tea-info">
        <h3>{tea.name}</h3>
        <p className="tea-type">{tea.type}</p>
        {brand && <p className="tea-brand">{brand}</p>}
        {tea.rating ? (
          <div className="tea-rating">{'★'.repeat(tea.rating)}</div>
        ) : null}
        <div className="tea-details">
          <span>🌡️ {tea.temperature}</span>
          <span>⏱️ {tea.time}</span>
          <span>🍵 {tea.method}</span>
        </div>
        {stockLabel && (
          <div className={`stock-indicator ${isLowStock ? 'low' : ''}`}>
            Stock: {stockLabel} ({tea.stockGrams}g)
          </div>
        )}
      </div>
    </div>
  );
}

export default TeaCard;
