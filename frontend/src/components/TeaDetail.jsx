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

function TeaDetail({ tea, onBack, onEdit, onDelete }) {
  if (!tea) return null;
  const stockLabel = stockLabelFor(tea.stockGrams);
  const stockValue = Number(tea.stockGrams);
  const stockPercent =
    stockLabel && !Number.isNaN(stockValue)
      ? Math.min(100, Math.max(0, (stockValue / 150) * 100))
      : null;
  const stockTone =
    stockLabel === 'Très peu' || stockLabel === 'Peu'
      ? 'low'
      : stockLabel === 'Moyen'
        ? 'mid'
        : 'high';
  const typeClass = `type-${typeKey(tea.type)}`;

  const imageHtml = tea.imageUrl ? (
    <>
      <img src={tea.imageUrl} alt={tea.name} className="tea-detail-image" />
      <span className="image-tag">Dry Tea</span>
    </>
  ) : (
    <div className="tea-detail-image-placeholder">
      <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M3 12h18M3 12v8a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-8M3 12l2-8h14l2 8M9 6v6M15 6v6"></path>
      </svg>
    </div>
  );

  return (
    <div id="tea-detail-view" className="tea-detail-view">
      <div className="tea-detail-sheet">
        <header className="detail-header">
          <button className="back-btn" onClick={onBack}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="15 18 9 12 15 6"></polyline>
            </svg>
          </button>
          <div className="detail-actions">
            <button className="edit-btn" onClick={() => onEdit?.(tea)} title="Edit tea">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
              </svg>
            </button>
            <button className="delete-btn" onClick={() => onDelete?.(tea)} title="Delete tea">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="3 6 5 6 21 6"></polyline>
                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
              </svg>
            </button>
          </div>
        </header>

        <div className="tea-detail-content">
          <div className="tea-detail-image-container">{imageHtml}</div>

          <div className="tea-detail-header">
            <h1>{tea.name}</h1>
            <span className={`tea-type-badge ${typeClass}`}>
              <span className={`type-dot ${typeClass}`}></span>
              {tea.type}
            </span>
          </div>

          {tea.brand && <p className="tea-detail-brand">{tea.brand}</p>}
          {tea.rating ? (
            <div className="tea-rating detail-rating">{'★'.repeat(tea.rating)}</div>
          ) : null}
          {tea.origin && <p className="tea-detail-origin">{tea.origin}</p>}

          {tea.url && (
            <div className="reference-card">
              <p className="reference-label">Reference</p>
              <a href={tea.url} target="_blank" rel="noreferrer" className="reference-url">
                {tea.url}
              </a>
            </div>
          )}

          <div className="brewing-notes-section">
            <h2>Brewing Notes</h2>
            <div className="brewing-cards">
              <div className="brewing-card">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M14 4v10.54a4 4 0 1 1-4 0V4a2 2 0 0 1 2-2h0a2 2 0 0 1 2 2z"></path>
                </svg>
                <div className="brewing-value">{tea.temperature || 'N/A'}</div>
                <div className="brewing-label">Temperature</div>
              </div>
              <div className="brewing-card">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M3 12h18M3 12v8a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-8M3 12l2-8h14l2 8M9 6v6M15 6v6"></path>
                </svg>
                <div className="brewing-value">{tea.quantity || 'N/A'}</div>
                <div className="brewing-label">Quantity</div>
              </div>
              <div className="brewing-card">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10"></circle>
                  <polyline points="12 6 12 12 16 14"></polyline>
                </svg>
                <div className="brewing-value">{tea.time || 'N/A'}</div>
                <div className="brewing-label">Time</div>
              </div>
            </div>

            <div className="method-badge-large">Method: {tea.method || 'N/A'}</div>

            {tea.infusions && (
              <div className="infusions-section">
                <h3>Infusion Durations</h3>
                <div className="infusions-list">{tea.infusions}</div>
              </div>
            )}
          </div>

          <div className="stock-info">
            <div className={`stock-badge ${tea.inStock ? 'in-stock' : 'out-of-stock'}`}>
              {tea.inStock ? 'In Stock' : 'Out of Stock'}
            </div>
            {stockLabel && (
              <div className="stock-grams">
                {stockLabel} · {tea.stockGrams} g
              </div>
            )}
          </div>

          {stockPercent !== null && (
            <div className="stock-bar detail-stock">
              <span
                className={`stock-bar-fill ${stockTone}`}
                style={{ width: `${stockPercent}%` }}
              ></span>
            </div>
          )}

          {tea.description && (
            <div className="about-section">
              <h2>About This Tea</h2>
              <p>{tea.description}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default TeaDetail;
