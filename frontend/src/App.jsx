import { useEffect, useMemo, useState } from 'react';
import Collection from './components/Collection';
import AddTea from './components/AddTea';
import Wishlist from './components/Wishlist';
import Shops from './components/Shops';
import { supabase } from './lib/supabaseClient';
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
  isWishlist: tea.is_wishlist ?? tea.isWishlist ?? false
});

function App() {
  const [activeTab, setActiveTab] = useState('collection');
  const [teas, setTeas] = useState([]);
  const [shops, setShops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

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

  return (
    <div className="app">
      {error && <div className="error-banner">⚠️ {error}</div>}
      {activeTab === 'collection' && (
        <Collection teas={collectionTeas} loading={loading} />
      )}
      {activeTab === 'wishlist' && (
        <Wishlist teas={wishlistTeas} loading={loading} />
      )}
      {activeTab === 'shops' && (
        <Shops shops={shops} onRefresh={loadShops} />
      )}
      {activeTab === 'add' && (
        <AddTea
          shops={shops}
          onTeaAdded={async () => {
            await loadTeas();
            setActiveTab('collection');
          }}
          onCancel={() => setActiveTab('collection')}
        />
      )}

      <nav className="bottom-nav">
        <button
          className={activeTab === 'collection' ? 'active' : ''}
          onClick={() => setActiveTab('collection')}
        >
          <span className="nav-icon">📚</span>
          <span>Collection</span>
        </button>
        <button
          className={activeTab === 'wishlist' ? 'active' : ''}
          onClick={() => setActiveTab('wishlist')}
        >
          <span className="nav-icon">✨</span>
          <span>Wishlist</span>
        </button>
        <button
          className={activeTab === 'shops' ? 'active' : ''}
          onClick={() => setActiveTab('shops')}
        >
          <span className="nav-icon">🏪</span>
          <span>Boutiques</span>
        </button>
        <button onClick={() => setActiveTab('add')} className="add-button">
          <span className="nav-icon">➕</span>
          <span>Add Tea</span>
        </button>
      </nav>
    </div>
  );
}

export default App;
