import { useState } from 'react';
import { supabase } from '../lib/supabaseClient';

function Shops({ shops, onRefresh }) {
  const [formData, setFormData] = useState({ name: '', website: '' });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) return;
    setSubmitting(true);
    setError('');
    const payload = {
      name: formData.name.trim(),
      website: formData.website.trim()
    };
    const { error: insertError } = await supabase
      .from('shops')
      .upsert(payload, { onConflict: 'name,website' });
    if (insertError) {
      console.error('Error adding shop:', insertError);
      setError(insertError.message);
    } else {
      setFormData({ name: '', website: '' });
      onRefresh?.();
    }
    setSubmitting(false);
  };

  return (
    <div className="collection shops">
      <header className="collection-header">
        <div className="app-branding">
          <img src="/logo.png" alt="Sereni-Tea Logo" className="app-logo" />
          <h1>Boutiques</h1>
        </div>
        <div className="header-actions">
          <span className="tea-count">{shops.length} boutiques</span>
        </div>
      </header>

      <form className="shop-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Nom de la boutique</label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => handleChange('name', e.target.value)}
            placeholder="Palais des Thés"
            required
          />
        </div>
        <div className="form-group">
          <label>Site web (optionnel)</label>
          <input
            type="url"
            value={formData.website}
            onChange={(e) => handleChange('website', e.target.value)}
            placeholder="https://www.palaisdesthes.com"
          />
        </div>
        {error && <div className="form-error">⚠️ {error}</div>}
        <div className="form-actions">
          <button type="submit" className="btn-primary" disabled={submitting}>
            {submitting ? 'Saving…' : '➕ Ajouter'}
          </button>
        </div>
      </form>

      <div className="shop-list">
        {shops.length === 0 ? (
          <div className="empty-state">
            <p>Aucune boutique pour le moment</p>
          </div>
        ) : (
          shops.map((shop) => (
            <div key={shop.id} className="shop-card">
              <div>
                <h3>{shop.name}</h3>
                {shop.website && (
                  <a href={shop.website} target="_blank" rel="noreferrer">
                    {shop.website}
                  </a>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default Shops;
