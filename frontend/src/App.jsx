import { useState, useEffect } from 'react';
import Collection from './components/Collection';
import AddTea from './components/AddTea';
import Moments from './components/Moments';
import './App.css';

function App() {
  const [activeTab, setActiveTab] = useState('collection');
  const [teas, setTeas] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTeas();
  }, []);

  const loadTeas = async () => {
    try {
      const response = await fetch('/api/teas');
      const data = await response.json();
      setTeas(data);
    } catch (error) {
      console.error('Error loading teas:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleTeaAdded = () => {
    loadTeas();
  };

  return (
    <div className="app">
      {activeTab === 'collection' && (
        <Collection teas={teas} loading={loading} onRefresh={loadTeas} />
      )}
      {activeTab === 'add' && (
        <AddTea onTeaAdded={handleTeaAdded} onCancel={() => setActiveTab('collection')} />
      )}
      {activeTab === 'moments' && <Moments />}

      <nav className="bottom-nav">
        <button 
          className={activeTab === 'collection' ? 'active' : ''}
          onClick={() => setActiveTab('collection')}
        >
          <span className="nav-icon">📚</span>
          <span>Collection</span>
        </button>
        <button 
          className={activeTab === 'moments' ? 'active' : ''}
          onClick={() => setActiveTab('moments')}
        >
          <span className="nav-icon">📷</span>
          <span>Moments</span>
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
