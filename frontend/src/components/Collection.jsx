import { useMemo, useState } from 'react';
import TeaCard from './TeaCard';

const TEA_TYPES = ['All', 'Oolong', 'Black', 'Green', 'White', 'Herbal', 'Smoked', 'Pu erh'];

const typeKey = (type) => (type || 'all').toLowerCase().replace(/\s+/g, '-');

function Collection({
  teas,
  loading,
  onSelectTea,
  onExportData,
  onImportData,
  onSyncData,
  syncing,
  storageMode,
  onSwitchToSupabase
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('All');
  const [showOutOfStock, setShowOutOfStock] = useState(false);
  const filteredTeas = useMemo(() => {
    let list = teas;
    if (selectedType !== 'All') {
      list = list.filter((tea) => tea.type === selectedType);
    }
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      list = list.filter(
        (tea) =>
          tea.name.toLowerCase().includes(searchLower) ||
          (tea.brand || '').toLowerCase().includes(searchLower)
      );
    }
    if (!showOutOfStock) {
      list = list.filter((tea) => tea.inStock);
    }
    return list;
  }, [teas, selectedType, searchTerm, showOutOfStock]);

  const showSkeletons = loading;
  const skeletonItems = Array.from({ length: 6 });
  return (
    <div className="collection">
      <header className="collection-header">
        <div className="header-top">
          <div className="app-branding">
            <img src="/logo.png" alt="Sereni-Tea Logo" className="app-logo" />
            <div>
              <h1>Sereni-Tea</h1>
              <p className="header-subtitle">Tea collection</p>
            </div>
          </div>
          <div className="header-actions">
            {storageMode === 'local' && (
              <span className="mode-badge">Mode local</span>
            )}
            <span className="tea-count-badge">{filteredTeas.length} teas</span>
            <div className="toggle-row">
              <span className="toggle-label">Out of stock</span>
              <label className="switch">
                <input
                  type="checkbox"
                  checked={showOutOfStock}
                  onChange={() => setShowOutOfStock(!showOutOfStock)}
                />
                <span className="slider"></span>
              </label>
            </div>
            {(onExportData || onImportData || onSyncData) && (
              <div className="header-tools">
                {onExportData && (
                  <button className="ghost-btn" onClick={onExportData}>
                    Export JSON
                  </button>
                )}
                {onImportData && (
                  <button className="ghost-btn" onClick={onImportData}>
                    Import JSON
                  </button>
                )}
                {onSyncData && (
                  <button className="ghost-btn" onClick={onSyncData} disabled={syncing}>
                    {syncing ? 'Syncing…' : 'Sync Supabase'}
                  </button>
                )}
                {storageMode === 'local' && onSwitchToSupabase && (
                  <button className="ghost-btn" onClick={onSwitchToSupabase}>
                    Switch to Supabase
                  </button>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="search-bar header-search">
          <svg
            className="search-icon"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <circle cx="11" cy="11" r="8"></circle>
            <path d="m21 21-4.35-4.35"></path>
          </svg>
          <input
            type="text"
            placeholder="Search teas or brands..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </header>

      <div className="filter-section">
        <label>Filter by type</label>
        <div className="filter-buttons">
          {TEA_TYPES.map((type) => (
            <button
              key={type}
              className={`filter-btn ${selectedType === type ? 'active' : ''}`}
              onClick={() => setSelectedType(type)}
            >
              <span className={`type-dot type-${typeKey(type)}`}></span>
              <span>{type}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="tea-list">
        {showSkeletons ? (
          skeletonItems.map((_, index) => (
            <div className="tea-card skeleton-card" key={`skeleton-${index}`}>
              <div className="skeleton-image"></div>
              <div className="tea-card-body">
                <div className="skeleton-line wide"></div>
                <div className="skeleton-line medium"></div>
                <div className="skeleton-line short"></div>
              </div>
            </div>
          ))
        ) : filteredTeas.length === 0 ? (
          <div className="empty-state">
            <div className="empty-illustration"></div>
            <p>No teas found</p>
          </div>
        ) : (
          filteredTeas.map(tea => (
            <TeaCard key={tea.id} tea={tea} onSelect={onSelectTea} />
          ))
        )}
      </div>
    </div>
  );
}

export default Collection;
