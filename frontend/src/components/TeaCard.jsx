function TeaCard({ tea, onSelect }) {
  const brand = tea.brand || '';
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
        <div className="tea-details">
          <span>🌡️ {tea.temperature}</span>
          <span>⏱️ {tea.time}</span>
          <span>🍵 {tea.method}</span>
        </div>
      </div>
    </div>
  );
}

export default TeaCard;
