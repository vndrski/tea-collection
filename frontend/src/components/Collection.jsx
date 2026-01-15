import { useMemo, useState } from 'react';
import TeaCard from './TeaCard';

const TEA_TYPES = ['All', 'Oolong', 'Black', 'Green', 'White', 'Herbal'];

function Collection({ teas, loading }) {
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

  if (loading) {
    return <div className="loading">Chargement...</div>;
  }

  return (
    <div className="collection">
      <header className="collection-header">
        <div className="app-branding">
          <img src="/logo.png" alt="Sereni-Tea Logo" className="app-logo" />
          <h1>Sereni-Tea</h1>
        </div>
        <div className="header-actions">
          <span className="tea-count">{filteredTeas.length} teas</span>
          <button
            className="toggle-stock"
            onClick={() => setShowOutOfStock(!showOutOfStock)}
          >
            {showOutOfStock ? 'Hide' : 'Show'} Out of Stock
          </button>
        </div>
      </header>

      <div className="search-bar">
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

      <div className="filter-section">
        <label>Filter by Type</label>
        <div className="filter-buttons">
          {TEA_TYPES.map((type) => (
            <button
              key={type}
              className={`filter-btn ${selectedType === type ? 'active' : ''}`}
              onClick={() => setSelectedType(type)}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      <div className="tea-list">
        {filteredTeas.length === 0 ? (
          <div className="empty-state">
            <p>No teas found</p>
          </div>
        ) : (
          filteredTeas.map(tea => (
            <TeaCard key={tea.id} tea={tea} />
          ))
        )}
      </div>
    </div>
  );
}

export default Collection;
