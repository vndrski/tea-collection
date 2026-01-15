import { useMemo, useState } from 'react';
import TeaCard from './TeaCard';

const TEA_TYPES = ['All', 'Oolong', 'Black', 'Green', 'White', 'Herbal'];

function Wishlist({ teas, loading }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('All');

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
    return list;
  }, [teas, selectedType, searchTerm]);

  if (loading) {
    return <div className="loading">Chargement...</div>;
  }

  return (
    <div className="collection">
      <header className="collection-header">
        <h1>Wishlist</h1>
        <div className="header-actions">
          <span className="tea-count">{filteredTeas.length} teas</span>
        </div>
      </header>

      <div className="search-bar">
        <span className="search-icon">🔍</span>
        <input
          type="text"
          placeholder="Search wishlist..."
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
            <p>No wishlist teas found</p>
          </div>
        ) : (
          filteredTeas.map((tea) => <TeaCard key={tea.id} tea={tea} />)
        )}
      </div>
    </div>
  );
}

export default Wishlist;
