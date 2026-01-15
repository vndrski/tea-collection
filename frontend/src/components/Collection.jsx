import { useState, useEffect } from 'react';
import TeaCard from './TeaCard';

function Collection({ teas, loading, onRefresh }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('All');
  const [showOutOfStock, setShowOutOfStock] = useState(false);
  const [teaTypes, setTeaTypes] = useState([]);
  const [filteredTeas, setFilteredTeas] = useState([]);

  useEffect(() => {
    fetch('/api/tea-types')
      .then(res => res.json())
      .then(data => setTeaTypes(data));
  }, []);

  useEffect(() => {
    const params = new URLSearchParams();
    if (selectedType !== 'All') params.append('type', selectedType);
    if (searchTerm) params.append('search', searchTerm);
    if (showOutOfStock) params.append('showOutOfStock', 'true');

    fetch(`/api/teas?${params}`)
      .then(res => res.json())
      .then(data => setFilteredTeas(data));
  }, [searchTerm, selectedType, showOutOfStock]);

  if (loading) {
    return <div className="loading">Chargement...</div>;
  }

  return (
    <div className="collection">
      <header className="collection-header">
        <h1>My Tea Collection</h1>
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
        <span className="search-icon">🔍</span>
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
          {teaTypes.map(type => (
            <button
              key={type}
              className={selectedType === type ? 'active' : ''}
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
