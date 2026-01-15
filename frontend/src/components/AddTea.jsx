import { useState } from 'react';

const TEA_TYPES = ['Oolong', 'Black', 'Green', 'White', 'Herbal'];
const METHODS = ['Gongfu', 'Western', 'Grandpa', 'Cold Brew'];

function AddTea({ onTeaAdded, onCancel }) {
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
    description: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/teas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      if (response.ok) {
        onTeaAdded();
      }
    } catch (error) {
      console.error('Error adding tea:', error);
    }
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="add-tea">
      <header>
        <h1>Add New Tea</h1>
        <p>Build your collection</p>
      </header>

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Name</label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => handleChange('name', e.target.value)}
            placeholder="Dragon Well"
          />
        </div>

        <div className="form-group">
          <label>Brand</label>
          <input
            type="text"
            value={formData.brand}
            onChange={(e) => handleChange('brand', e.target.value)}
            placeholder="Golden Dragon"
          />
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
          <label>Description</label>
          <textarea
            value={formData.description}
            onChange={(e) => handleChange('description', e.target.value)}
            placeholder="Spring 2025. Lishan. Sweet aroma, fruit and floral taste profile."
            rows={4}
          />
        </div>

        <div className="form-actions">
          <button type="button" onClick={onCancel} className="btn-secondary">
            Cancel
          </button>
          <button type="submit" className="btn-primary">
            💾 Save Tea
          </button>
        </div>
      </form>
    </div>
  );
}

export default AddTea;
