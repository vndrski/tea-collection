function TeaCard({ tea }) {
  const brand = tea.brand || '';
  return (
    <div className={`tea-card ${!tea.inStock ? 'out-of-stock' : ''}`}>
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
