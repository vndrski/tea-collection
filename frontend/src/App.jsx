import { useEffect, useMemo, useState } from 'react';
import Collection from './components/Collection';
import AddTea from './components/AddTea';
import Wishlist from './components/Wishlist';
import Shops from './components/Shops';
import OriginsMap from './components/OriginsMap';
import TeaDetail from './components/TeaDetail';
import TimerWidget from './components/TimerWidget';
import { supabase } from './lib/supabaseClient';
import './legacy.css';
import './App.css';

const mapTeaFromDb = (tea) => ({
  id: tea.id,
  name: tea.name,
  type: tea.type,
  brand: tea.brand,
  temperature: tea.temperature,
  quantity: tea.quantity,
  time: tea.time,
  infusions: tea.infusions,
  method: tea.method,
  description: tea.description,
  origin: tea.origin,
  url: tea.url,
  imageUrl: tea.image_url ?? tea.imageUrl ?? null,
  inStock: tea.in_stock ?? tea.inStock ?? true,
  isWishlist: tea.is_wishlist ?? tea.isWishlist ?? false,
  stockGrams: tea.stock_grams ?? tea.stockGrams ?? null,
  rating: tea.rating ?? null
});

function App() {
  const [activeTab, setActiveTab] = useState('collection');
  const [teas, setTeas] = useState([]);
  const [shops, setShops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedTea, setSelectedTea] = useState(null);
  const [editingTea, setEditingTea] = useState(null);

  useEffect(() => {
    loadTeas();
    loadShops();
  }, []);

  const loadTeas = async () => {
    setLoading(true);
    setError('');
    const { data, error: fetchError } = await supabase
      .from('teas')
      .select('*')
      .order('created_at', { ascending: false });

    if (fetchError) {
      console.error('Error loading teas:', fetchError);
      setError(fetchError.message);
      setTeas([]);
    } else {
      setTeas((data || []).map(mapTeaFromDb));
    }
    setLoading(false);
  };

  const loadShops = async () => {
    const { data, error: fetchError } = await supabase
      .from('shops')
      .select('*')
      .order('name', { ascending: true });

    if (fetchError) {
      console.error('Error loading shops:', fetchError);
      setError(fetchError.message);
      setShops([]);
    } else {
      setShops(data || []);
    }
  };

  const collectionTeas = useMemo(
    () => teas.filter((tea) => !tea.isWishlist),
    [teas]
  );
  const wishlistTeas = useMemo(
    () => teas.filter((tea) => tea.isWishlist),
    [teas]
  );

  const handleEditTea = (tea) => {
    setEditingTea(tea);
    setSelectedTea(null);
    setActiveTab('add');
  };

  const handleDeleteTea = async (tea) => {
    if (!tea?.id) return;
    if (!confirm(`Supprimer "${tea.name}" ?`)) return;
    const { error: deleteError } = await supabase.from('teas').delete().eq('id', tea.id);
    if (deleteError) {
      console.error('Error deleting tea:', deleteError);
      setError(deleteError.message);
      return;
    }
    setSelectedTea(null);
    await loadTeas();
  };

  return (
    <div className="app">
      {error && <div className="error-banner">⚠️ {error}</div>}
      {selectedTea ? (
        <TeaDetail
          tea={selectedTea}
          onBack={() => setSelectedTea(null)}
          onEdit={handleEditTea}
          onDelete={handleDeleteTea}
        />
      ) : (
        <>
          {activeTab !== 'collection' && (
            <button
              className="home-btn"
              onClick={() => {
                setEditingTea(null);
                setActiveTab('collection');
              }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                <polyline points="9 22 9 12 15 12 15 22"></polyline>
              </svg>
            </button>
          )}
          {activeTab === 'collection' && (
            <Collection
              teas={collectionTeas}
              loading={loading}
              onSelectTea={setSelectedTea}
            />
          )}
          {activeTab === 'wishlist' && (
            <Wishlist
              teas={wishlistTeas}
              loading={loading}
              onSelectTea={setSelectedTea}
            />
          )}
          {activeTab === 'map' && (
            <OriginsMap teas={collectionTeas} loading={loading} />
          )}
          {activeTab === 'shops' && (
            <Shops shops={shops} onRefresh={loadShops} />
          )}
          {activeTab === 'add' && (
            <AddTea
              shops={shops}
              initialTea={editingTea}
              onTeaAdded={async () => {
                await loadTeas();
                setEditingTea(null);
                setActiveTab('collection');
              }}
              onCancel={() => {
                setEditingTea(null);
                setActiveTab('collection');
              }}
            />
          )}
        </>
      )}

      <TimerWidget />

      {!selectedTea && <nav className="bottom-nav">
        <button
          className={`nav-btn ${activeTab === 'collection' ? 'active' : ''}`}
          onClick={() => setActiveTab('collection')}
        >
          <svg className="nav-icon" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
            <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
          </svg>
          <span>Collection</span>
        </button>
        <button
          className={`nav-btn ${activeTab === 'wishlist' ? 'active' : ''}`}
          onClick={() => setActiveTab('wishlist')}
        >
          <svg className="nav-icon" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
          </svg>
          <span>Wishlist</span>
        </button>
        <button
          className={`nav-btn ${activeTab === 'map' ? 'active' : ''}`}
          onClick={() => setActiveTab('map')}
        >
          <svg className="nav-icon" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6"></polygon>
            <line x1="8" y1="2" x2="8" y2="18"></line>
            <line x1="16" y1="6" x2="16" y2="22"></line>
          </svg>
          <span>Origines</span>
        </button>
        <button
          className={`nav-btn ${activeTab === 'shops' ? 'active' : ''}`}
          onClick={() => setActiveTab('shops')}
        >
          <svg className="nav-icon" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M3 10h18"></path>
            <path d="M5 10v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V10"></path>
            <path d="M7 10V6a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v4"></path>
          </svg>
          <span>Boutiques</span>
        </button>
        <button
          onClick={() => {
            setEditingTea(null);
            setActiveTab('add');
          }}
          className="nav-btn add-button"
        >
          <svg className="nav-icon" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="12" y1="5" x2="12" y2="19"></line>
            <line x1="5" y1="12" x2="19" y2="12"></line>
          </svg>
          <span>Add Tea</span>
        </button>
      </nav>}
    </div>
  );
}

export default App;
