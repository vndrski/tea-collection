import { useEffect, useMemo, useRef, useState } from 'react';
import Collection from './components/Collection';
import AddTea from './components/AddTea';
import Wishlist from './components/Wishlist';
import Shops from './components/Shops';
import OriginsMap from './components/OriginsMap';
import TeaDetail from './components/TeaDetail';
import TimerWidget from './components/TimerWidget';
import { supabase } from './lib/supabaseClient';
import {
  deleteLocalTea,
  getLocalShops,
  getLocalTeas,
  seedLocalData,
  setLocalShops,
  setLocalTeas
} from './lib/localStore';
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

const mapTeaForLocal = (tea) => ({
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
  imageUrl: tea.imageUrl ?? tea.image_url ?? null,
  inStock: tea.inStock ?? tea.in_stock ?? true,
  isWishlist: tea.isWishlist ?? tea.is_wishlist ?? false,
  stockGrams: tea.stockGrams ?? tea.stock_grams ?? null,
  rating: tea.rating ?? null
});

const mapTeaToDb = (tea) => ({
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
  image_url: tea.imageUrl ?? null,
  in_stock: tea.inStock ?? true,
  is_wishlist: tea.isWishlist ?? false,
  stock_grams: Number.isFinite(Number(tea.stockGrams)) ? Number(tea.stockGrams) : null,
  rating: tea.rating ?? null
});

const MOCK_TEAS = [
  {
    id: 'mock-1',
    name: 'Jardin de Printemps',
    type: 'Green',
    brand: 'Palais des Thes',
    origin: 'Chine',
    description: 'The vert frais aux notes florales, parfait pour la matinee.',
    imageUrl: 'https://images.unsplash.com/photo-1508253578933-a3fbe9dbfa31?auto=format&fit=crop&w=600&q=80',
    inStock: true,
    isWishlist: false,
    stockGrams: 75,
    rating: 3
  },
  {
    id: 'mock-2',
    name: 'Noir de l Himalaya',
    type: 'Black',
    brand: 'Dammann Freres',
    origin: 'Nepal',
    description: 'The noir intense, notes boisees et cacao.',
    imageUrl: 'https://images.unsplash.com/photo-1485182708500-e8f1f318ba72?auto=format&fit=crop&w=600&q=80',
    inStock: true,
    isWishlist: false,
    stockGrams: 40,
    rating: 2
  },
  {
    id: 'mock-3',
    name: 'Oolong du Soir',
    type: 'Oolong',
    brand: 'Tea & Ty',
    origin: 'Taiwan',
    description: 'Oolong onctueux aux notes de miel.',
    imageUrl: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=600&q=80',
    inStock: true,
    isWishlist: false,
    stockGrams: 25,
    rating: 3
  },
  {
    id: 'mock-4',
    name: 'Brise Blanche',
    type: 'White',
    brand: 'Mariage Freres',
    origin: 'Chine',
    description: 'The blanc doux et delicat, ideal pour une pause.',
    imageUrl: 'https://images.unsplash.com/photo-1498804103079-a6351b050096?auto=format&fit=crop&w=600&q=80',
    inStock: true,
    isWishlist: false,
    stockGrams: 110,
    rating: 1
  },
  {
    id: 'mock-5',
    name: 'Jardin aux Herbes',
    type: 'Herbal',
    brand: 'Unami Tea',
    origin: 'France',
    description: 'Infusion douce, menthe et verveine.',
    imageUrl: 'https://images.unsplash.com/photo-1504754524776-8f4f37790ca0?auto=format&fit=crop&w=600&q=80',
    inStock: false,
    isWishlist: false,
    stockGrams: 0,
    rating: null
  }
];

const MOCK_SHOPS = [
  { id: 'shop-1', name: 'Palais des Thes', website: 'https://www.palaisdesthes.com' },
  { id: 'shop-2', name: 'Dammann Freres', website: 'https://www.dammann.fr' },
  { id: 'shop-3', name: 'Tea & Ty', website: 'https://teaandty.com' },
  { id: 'shop-4', name: 'Mariage Freres', website: 'https://www.mariagefreres.com' },
  { id: 'shop-5', name: 'Unami Tea', website: 'https://unamitea.com' }
];

function App() {
  const [activeTab, setActiveTab] = useState('collection');
  const [teas, setTeas] = useState([]);
  const [shops, setShops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedTea, setSelectedTea] = useState(null);
  const [editingTea, setEditingTea] = useState(null);
  const [storageMode, setStorageMode] = useState(
    import.meta.env.VITE_LOCAL_MODE === 'true' ? 'local' : 'supabase'
  );
  const [syncing, setSyncing] = useState(false);
  const importInputRef = useRef(null);

  useEffect(() => {
    loadTeas();
    loadShops();
  }, [storageMode]);

  const ensureLocalSeed = () => {
    seedLocalData({ teas: MOCK_TEAS, shops: MOCK_SHOPS });
  };

  const loadTeas = async () => {
    setLoading(true);
    setError('');
    if (storageMode === 'local') {
      ensureLocalSeed();
      setTeas(getLocalTeas());
      setLoading(false);
      return;
    }

    const { data, error: fetchError } = await supabase
      .from('teas')
      .select('*')
      .order('created_at', { ascending: false });

    if (fetchError) {
      console.error('Error loading teas:', fetchError);
      setError('Supabase en pause. Donnees locales affichees.');
      setStorageMode('local');
      ensureLocalSeed();
      setTeas(getLocalTeas());
    } else {
      const mapped = (data || []).map(mapTeaFromDb);
      if (mapped.length === 0) {
        const localTeas = getLocalTeas();
        if (localTeas.length) {
          setError('Base vide. Donnees locales affichees.');
          setStorageMode('local');
          setTeas(localTeas);
        } else {
          setError('Aucune donnee. Donnees de demo affichees.');
          ensureLocalSeed();
          setTeas(getLocalTeas());
          setStorageMode('local');
        }
      } else {
        setTeas(mapped);
      }
    }
    setLoading(false);
  };

  const loadShops = async () => {
    if (storageMode === 'local') {
      ensureLocalSeed();
      setShops(getLocalShops());
      return;
    }

    const { data, error: fetchError } = await supabase
      .from('shops')
      .select('*')
      .order('name', { ascending: true });

    if (fetchError) {
      console.error('Error loading shops:', fetchError);
      setError('Supabase en pause. Boutiques locales affichees.');
      setStorageMode('local');
      ensureLocalSeed();
      setShops(getLocalShops());
    } else {
      const list = data || [];
      if (!list.length) {
        ensureLocalSeed();
        setShops(getLocalShops());
        setStorageMode('local');
      } else {
        setShops(list);
      }
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
    if (storageMode === 'local') {
      deleteLocalTea(tea.id);
      setSelectedTea(null);
      await loadTeas();
      return;
    }

    const { error: deleteError } = await supabase.from('teas').delete().eq('id', tea.id);
    if (deleteError) {
      console.error('Error deleting tea:', deleteError);
      setError('Supabase en pause. Suppression locale uniquement.');
      setStorageMode('local');
      deleteLocalTea(tea.id);
    }
    setSelectedTea(null);
    await loadTeas();
  };

  const handleExportData = () => {
    const localTeas = getLocalTeas();
    const localShops = getLocalShops();
    const payload = {
      teas: localTeas.length ? localTeas : teas,
      shops: localShops.length ? localShops : shops
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], {
      type: 'application/json'
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'sereni-tea-backup.json';
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleImportData = () => {
    importInputRef.current?.click();
  };

  const handleImportFile = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    try {
      const text = await file.text();
      const json = JSON.parse(text);
      const teasList = Array.isArray(json?.teas) ? json.teas : [];
      const shopsList = Array.isArray(json?.shops) ? json.shops : [];
      const mappedTeas = teasList.map(mapTeaForLocal);
      setLocalTeas(mappedTeas);
      setLocalShops(shopsList);
      setStorageMode('local');
      setSelectedTea(null);
      await loadTeas();
      await loadShops();
      setError('Import termine. Donnees locales chargees.');
    } catch (err) {
      console.error('Import error:', err);
      setError('Import invalide. Fichier JSON non reconnu.');
    } finally {
      event.target.value = '';
    }
  };

  const handleSyncSupabase = async () => {
    setSyncing(true);
    setError('');
    try {
      const localTeas = getLocalTeas();
      const localShops = getLocalShops();
      if (!localTeas.length && !localShops.length) {
        setError('Aucune donnee locale a synchroniser.');
        setSyncing(false);
        return;
      }

      const { data: existingTeas, error: teaFetchError } = await supabase
        .from('teas')
        .select('name, brand, type, url');
      if (teaFetchError) throw teaFetchError;

      const { data: existingShops, error: shopFetchError } = await supabase
        .from('shops')
        .select('name, website');
      if (shopFetchError) throw shopFetchError;

      const teaKey = (item) =>
        `${(item.name || '').trim().toLowerCase()}|${(item.brand || '')
          .trim()
          .toLowerCase()}|${(item.type || '').trim().toLowerCase()}|${(item.url || '')
          .trim()
          .toLowerCase()}`;
      const existingTeaKeys = new Set((existingTeas || []).map(teaKey));
      const teasToInsert = localTeas
        .filter((tea) => !existingTeaKeys.has(teaKey(tea)))
        .map(mapTeaToDb);

      const shopKey = (item) =>
        `${(item.name || '').trim().toLowerCase()}|${(item.website || '')
          .trim()
          .toLowerCase()}`;
      const existingShopKeys = new Set((existingShops || []).map(shopKey));
      const shopsToInsert = localShops.filter(
        (shop) => !existingShopKeys.has(shopKey(shop))
      );

      if (shopsToInsert.length) {
        const { error: shopInsertError } = await supabase.from('shops').insert(shopsToInsert);
        if (shopInsertError) throw shopInsertError;
      }
      if (teasToInsert.length) {
        const { error: teaInsertError } = await supabase.from('teas').insert(teasToInsert);
        if (teaInsertError) throw teaInsertError;
      }

      setError('Sync terminee. Donnees envoyees vers Supabase.');
      setStorageMode('supabase');
      await loadTeas();
      await loadShops();
    } catch (err) {
      console.error('Sync error:', err);
      setError('Sync impossible. Supabase encore en pause.');
    } finally {
      setSyncing(false);
    }
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
              onExportData={handleExportData}
              onImportData={handleImportData}
              onSyncData={handleSyncSupabase}
              syncing={syncing}
              storageMode={storageMode}
              onSwitchToSupabase={() => {
                setStorageMode('supabase');
                setError('Tentative de reconnexion a Supabase...');
              }}
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
            <Shops shops={shops} onRefresh={loadShops} storageMode={storageMode} />
          )}
          {activeTab === 'add' && (
            <AddTea
              shops={shops}
              initialTea={editingTea}
              storageMode={storageMode}
              onUseLocal={() => setStorageMode('local')}
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
      <input
        ref={importInputRef}
        type="file"
        accept="application/json"
        style={{ display: 'none' }}
        onChange={handleImportFile}
      />

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
