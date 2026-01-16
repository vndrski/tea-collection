import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';

const TEA_TYPES = ['Oolong', 'Black', 'Green', 'White', 'Herbal'];
const METHODS = ['Gongfu', 'Western', 'Grandpa', 'Cold Brew'];
const TEMPERATURES = ['75-80°C', '80-85°C', '85-90°C', '90-95°C'];

function AddTea({ onTeaAdded, onCancel, shops = [], initialTea = null }) {
  const [formData, setFormData] = useState({
    name: '',
    type: 'Green',
    brand: '',
    origin: '',
    url: '',
    imageUrl: '',
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
  const [scraping, setScraping] = useState(false);
  const isEditing = Boolean(initialTea?.id);

  useEffect(() => {
    if (!initialTea) return;
    setFormData({
      name: initialTea.name || '',
      type: initialTea.type || 'Green',
      brand: initialTea.brand || '',
      origin: initialTea.origin || '',
      url: initialTea.url || '',
      imageUrl: initialTea.imageUrl || '',
      temperature: initialTea.temperature || '85-90°C',
      quantity: initialTea.quantity || '',
      time: initialTea.time || '',
      infusions: initialTea.infusions || '',
      method: initialTea.method || 'Gongfu',
      inStock: initialTea.inStock ?? true,
      isWishlist: initialTea.isWishlist ?? false,
      description: initialTea.description || ''
    });
  }, [initialTea]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    const payload = {
      name: formData.name,
      type: formData.type,
      brand: formData.brand,
      origin: formData.origin || null,
      url: formData.url || null,
      image_url: formData.imageUrl || null,
      temperature: formData.temperature,
      quantity: formData.quantity,
      time: formData.time,
      infusions: formData.infusions,
      method: formData.method,
      in_stock: formData.inStock,
      is_wishlist: formData.isWishlist,
      description: formData.description
    };

    const request = isEditing
      ? supabase.from('teas').update(payload).eq('id', initialTea.id)
      : supabase.from('teas').insert(payload);

    const { error: saveError } = await request;
    if (saveError) {
      console.error('Error saving tea:', saveError);
      setError(saveError.message);
    } else {
      onTeaAdded();
    }
    setSubmitting(false);
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleTemperatureChange = (direction) => {
    const currentIndex = TEMPERATURES.indexOf(formData.temperature);
    const safeIndex = currentIndex === -1 ? 2 : currentIndex;
    const nextIndex = Math.min(
      TEMPERATURES.length - 1,
      Math.max(0, safeIndex + direction)
    );
    handleChange('temperature', TEMPERATURES[nextIndex]);
  };

  const handleScrapeInfo = async () => {
    if (!formData.url) {
      alert('Please enter a URL first');
      return;
    }
    setScraping(true);
    try {
      const fetchHtml = async () => {
        const rawUrl = `https://api.allorigins.win/raw?url=${encodeURIComponent(formData.url)}`;
        const jsonUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(formData.url)}`;
        const attempts = [
          { url: rawUrl, parse: (res) => res.text() },
          { url: jsonUrl, parse: async (res) => {
              const data = await res.json();
              return data?.contents || '';
            }
          }
        ];
        for (const attempt of attempts) {
          try {
            const response = await fetch(attempt.url);
            if (!response.ok) continue;
            const html = await attempt.parse(response);
            if (html && html.length > 200) return html;
          } catch {
            // try next
          }
        }
        return '';
      };

      const html = await fetchHtml();
      if (!html) throw new Error('No content');
      const doc = new DOMParser().parseFromString(html, 'text/html');

      const getMeta = (selector) => doc.querySelector(selector)?.getAttribute('content') || '';
      const title =
        getMeta('meta[property="og:title"]') ||
        getMeta('meta[name="twitter:title"]') ||
        doc.querySelector('[itemprop="name"]')?.textContent?.trim() ||
        doc.querySelector('h1')?.textContent?.trim() ||
        doc.querySelector('title')?.textContent?.trim() ||
        '';

      const description =
        getMeta('meta[name="description"]') ||
        getMeta('meta[property="og:description"]') ||
        doc.querySelector('[itemprop="description"]')?.textContent?.trim() ||
        '';

      const imageUrl =
        getMeta('meta[property="og:image"]') ||
        getMeta('meta[name="twitter:image"]') ||
        '';

      // Try JSON-LD image fallback
      if (!imageUrl) {
        const scripts = Array.from(doc.querySelectorAll('script[type="application/ld+json"]'));
        for (const script of scripts) {
          try {
            const data = JSON.parse(script.textContent || '{}');
            const image = Array.isArray(data.image) ? data.image[0] : data.image;
            const candidate = image?.url || image;
            if (candidate) {
              handleChange('imageUrl', candidate);
              break;
            }
          } catch {
            // ignore
          }
        }
      }

      if (title && !formData.name) handleChange('name', title);
      if (description && !formData.description) {
        handleChange('description', description.slice(0, 500));
      }
      if (imageUrl) handleChange('imageUrl', imageUrl);

      alert('✅ Information scrapée. Vérifiez et complétez si besoin.');
    } catch (err) {
      console.error('Scraping error:', err);
      alert('Impossible de scraper cette URL. Merci de renseigner manuellement.');
    } finally {
      setScraping(false);
    }
  };

  return (
    <div id="add-tea-view">
      <header>
        <h1>{isEditing ? 'Edit Tea' : 'Add New Tea'}</h1>
        <p>{isEditing ? 'Update your tea' : 'Build your collection'}</p>
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
          <label>Origin / Provenance</label>
          <input
            type="text"
            value={formData.origin}
            onChange={(e) => handleChange('origin', e.target.value)}
            placeholder="ex: China, Japan, India, Taiwan..."
          />
          <small>L'origine sera normalisée automatiquement (ex: Chine → China, Taïwan → Taiwan)</small>
        </div>

        <div className="form-group">
          <label>URL (Optional)</label>
          <input
            type="url"
            value={formData.url}
            onChange={(e) => handleChange('url', e.target.value)}
            placeholder="https://teashop.com/dragon-well"
          />
          <div className="url-actions">
            <button
              type="button"
              className="btn-scrape"
              onClick={handleScrapeInfo}
              disabled={scraping}
            >
              {scraping ? 'Scraping…' : '⬇️ Scrape Info'}
            </button>
          </div>
        </div>

        <div className="form-group">
          <label>Image URL (Optional)</label>
          <input
            type="url"
            value={formData.imageUrl}
            onChange={(e) => handleChange('imageUrl', e.target.value)}
            placeholder="https://example.com/tea-image.jpg"
          />
          <small>Collez l'URL d'une image ou laissez vide si scrapée automatiquement</small>
          {formData.imageUrl && (
            <div className="image-preview">
              <img src={formData.imageUrl} alt="Preview" onError={() => handleChange('imageUrl', '')} />
              <button type="button" className="remove-image-btn" onClick={() => handleChange('imageUrl', '')}>×</button>
            </div>
          )}
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
            <button type="button" onClick={() => handleTemperatureChange(-1)}>‹</button>
            <span className="temperature-value">{formData.temperature}</span>
            <button type="button" onClick={() => handleTemperatureChange(1)}>›</button>
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
            <span>Ajouter à la wishlist</span>
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
            {submitting ? 'Saving…' : isEditing ? '💾 Save Changes' : '💾 Save Tea'}
          </button>
        </div>
      </form>
    </div>
  );
}

export default AddTea;
