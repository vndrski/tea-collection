import { useState } from 'react';
import { supabase } from '../lib/supabaseClient';

const TEA_TYPES = ['Oolong', 'Black', 'Green', 'White', 'Herbal'];
const METHODS = ['Gongfu', 'Western', 'Grandpa', 'Cold Brew'];

function AddTea({ onTeaAdded, onCancel, shops = [] }) {
  const [formData, setFormData] = useState({
    name: '',
    type: 'Green',
    brand: '',
    temperature: '85-90°C',
    quantity: '6g',
    time: '2-3 min',
    infusions: '',
    method: 'Gongfu',
    inStock: true,
    isWishlist: false,
    description: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    const payload = {
      name: formData.name,
      type: formData.type,
      brand: formData.brand,
      temperature: formData.temperature,
      quantity: formData.quantity,
      time: formData.time,
      infusions: formData.infusions,
      method: formData.method,
      in_stock: formData.inStock,
      is_wishlist: formData.isWishlist,
      description: formData.description
    };

    const { error: insertError } = await supabase.from('teas').insert(payload);
    if (insertError) {
      console.error('Error adding tea:', insertError);
      setError(insertError.message);
    } else {
      onTeaAdded();
    }
    setSubmitting(false);
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div id="add-tea-view">
      <header>
        <h1>Add New Tea</h1>
        <p>Build your collection</p>
      </header>

      <form id="add-tea-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Name</label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => handleChange('name', e.target.value)}
            placeholder="Dragon Well"
            required
          />
        </div>

        <div className="form-group">
          <label>Brand</label>
          <input
            type="text"
            value={formData.brand}
            onChange={(e) => handleChange('brand', e.target.value)}
            placeholder="Golden Dragon"
            list="shops-list"
          />
          <datalist id="shops-list">
            {shops.map((shop) => (
              <option key={shop.id} value={shop.name} />
            ))}
          </datalist>
        </div>

        <div className="form-group">
          <label>Type</label>
          <div className="button-group">
            {TEA_TYPES.map(type => (
              <button
                key={type}
                type="button"
                className={formData.type === type ? 'active' : ''}
                onClick={() => handleChange('type', type)}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        <div className="form-group">
          <label>Temperature</label>
          <div className="temperature-selector">
            <button type="button">‹</button>
            <span className="temperature-value">{formData.temperature}</span>
            <button type="button">›</button>
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Quantity</label>
            <input
              type="text"
              value={formData.quantity}
              onChange={(e) => handleChange('quantity', e.target.value)}
              placeholder="6g"
            />
          </div>
          <div className="form-group">
            <label>Time</label>
            <input
              type="text"
              value={formData.time}
              onChange={(e) => handleChange('time', e.target.value)}
              placeholder="2-3 min"
            />
          </div>
        </div>

        <div className="form-group">
          <label>Infusions</label>
          <input
            type="text"
            value={formData.infusions}
            onChange={(e) => handleChange('infusions', e.target.value)}
            placeholder="30s, 45s, 1m30s, 3m, 5m"
          />
        </div>

        <div className="form-group">
          <label>Method</label>
          <div className="button-group">
            {METHODS.map(method => (
              <button
                key={method}
                type="button"
                className={formData.method === method ? 'active' : ''}
                onClick={() => handleChange('method', method)}
              >
                {method}
              </button>
            ))}
          </div>
        </div>

        <div className="form-group">
          <label>Stock</label>
          <div className="button-group">
            <button
              type="button"
              className={formData.inStock ? 'active' : ''}
              onClick={() => handleChange('inStock', true)}
            >
              In Stock
            </button>
            <button
              type="button"
              className={!formData.inStock ? 'active' : ''}
              onClick={() => handleChange('inStock', false)}
            >
              Out of Stock
            </button>
          </div>
        </div>

        <div className="form-group">
          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={formData.isWishlist}
              onChange={(e) => handleChange('isWishlist', e.target.checked)}
            />
            <span>✨ Ajouter à la wishlist</span>
          </label>
          <small>Les thés wishlist n'apparaissent pas dans le stock.</small>
        </div>

        <div className="form-group">
          <label>Description</label>
          <textarea
            value={formData.description}
            onChange={(e) => handleChange('description', e.target.value)}
            placeholder="Spring 2025. Lishan. Sweet aroma, fruit and floral taste profile."
            rows={4}
          />
        </div>

        {error && <div className="form-error">⚠️ {error}</div>}

        <div className="form-actions">
          <button type="button" onClick={onCancel} className="btn-secondary">
            Cancel
          </button>
          <button type="submit" className="btn-primary" disabled={submitting}>
            {submitting ? 'Saving…' : '💾 Save Tea'}
          </button>
        </div>
      </form>
    </div>
  );
}

export default AddTea;
