// Tea Collection App - JavaScript
// Utilise localStorage pour sauvegarder les données

// Base de données des boutiques de thé avec mapping des noms
const teaShopsDatabase = {
  shops: [
    {
      id: 1,
      name: "Le Parti du Thé",
      variations: ["lepartiduthe", "le-parti-du-the", "lepartiduthe.com", "partiduthe"],
      urlPatterns: ["lepartiduthe", "partiduthe"],
      website: "https://www.lepartiduthe.com"
    },
    {
      id: 2,
      name: "Palais des Thés",
      variations: ["palaisdesthes", "palais-des-thes", "palaisdesthes.com"],
      urlPatterns: ["palaisdesthes", "palais-des-thes"],
      website: "https://www.palaisdesthes.com"
    },
    {
      id: 3,
      name: "Mariage Frères",
      variations: ["mariagefreres", "mariage-freres", "mariagefreres.com"],
      urlPatterns: ["mariagefreres", "mariage-freres"],
      website: "https://www.mariagefreres.com"
    },
    {
      id: 4,
      name: "Dammann Frères",
      variations: ["dammannfreres", "dammann-freres", "dammannfreres.com"],
      urlPatterns: ["dammannfreres", "dammann-freres"],
      website: "https://www.dammann.fr"
    },
    {
      id: 5,
      name: "Kusmi Tea",
      variations: ["kumitea", "kusmi-tea", "kusmitea.com", "kusmi"],
      urlPatterns: ["kusmi", "kusmitea"],
      website: "https://www.kusmitea.com"
    },
    {
      id: 6,
      name: "Twinings",
      variations: ["twinings", "twinings.com"],
      urlPatterns: ["twinings"],
      website: "https://www.twinings.co.uk"
    },
    {
      id: 7,
      name: "Fortnum & Mason",
      variations: ["fortnum", "fortnumandmason", "fortnum-mason"],
      urlPatterns: ["fortnum", "fortnumandmason"],
      website: "https://www.fortnumandmason.com"
    }
  ]
};

// Auto-import configuration
const DEFAULT_IMPORT_URL = 'https://kdrive.infomaniak.com/app/share/1758972/b339e8b8-c36b-4bbd-9381-2d33dc82280d';
const AUTO_IMPORT_SKIP_CONFIRM = true;

// Fonction pour normaliser un nom (enlever accents, espaces, minuscules)
function normalizeName(name) {
  return name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // Enlever accents
    .replace(/[^a-z0-9]/g, ""); // Enlever tout sauf lettres et chiffres
}

// Fonction pour trouver une boutique par son nom ou URL
function findShopByNameOrUrl(nameOrUrl) {
  if (!nameOrUrl) return null;
  
  const normalized = normalizeName(nameOrUrl);
  
  // Charger les boutiques depuis localStorage (priorité) ou base par défaut
  let shops = [];
  try {
    const stored = localStorage.getItem('teaShopsDatabase');
    if (stored) {
      shops = JSON.parse(stored);
    } else {
      shops = teaShopsDatabase.shops;
    }
  } catch (e) {
    console.error('Erreur chargement boutiques:', e);
    shops = teaShopsDatabase.shops;
  }
  
  // Chercher dans les variations
  for (const shop of shops) {
    // Vérifier les variations
    for (const variation of shop.variations) {
      if (normalizeName(variation) === normalized) {
        return shop;
      }
    }
    
    // Vérifier les patterns d'URL
    for (const pattern of shop.urlPatterns) {
      if (normalized.includes(normalizeName(pattern))) {
        return shop;
      }
    }
    
    // Vérifier le nom principal
    if (normalizeName(shop.name) === normalized) {
      return shop;
    }
  }
  
  return null;
}

// Données initiales
const initialTeas = [
  {
    id: 1,
    name: "Dragon Well",
    type: "Green",
    brand: "Golden Dragon Tea Co.",
    temperature: "75-80°C",
    time: "2-3 min",
    method: "Gongfu",
    quantity: "6g",
    infusions: "30s, 45s, 1m30s, 3m, 5m",
    inStock: true,
    description: "Spring 2025. Lishan. Sweet aroma, fruit and floral taste profile."
  },
  {
    id: 2,
    name: "Earl Grey Supreme",
    type: "Black",
    brand: "Twinings",
    temperature: "95°C",
    time: "4-5 min",
    method: "Western",
    quantity: "3g",
    infusions: "3-5 min",
    inStock: false,
    description: "Classic Earl Grey with bergamot"
  }
];

// Gestion des données
class TeaStore {
  constructor() {
    this.loadTeas();
    this.loadShops();
  }

  loadTeas() {
    const stored = localStorage.getItem('teaCollection');
    if (stored) {
      this.teas = JSON.parse(stored);
    } else {
      this.teas = initialTeas;
      this.saveTeas();
    }
  }

  saveTeas() {
    localStorage.setItem('teaCollection', JSON.stringify(this.teas));
  }

  loadShops() {
    const stored = localStorage.getItem('teaShopsDatabase');
    if (stored) {
      this.shops = JSON.parse(stored);
    } else {
      this.shops = teaShopsDatabase.shops;
      this.saveShops();
    }
  }

  saveShops() {
    localStorage.setItem('teaShopsDatabase', JSON.stringify(this.shops));
  }

  getAllShops() {
    return this.shops;
  }

  addShop(shop) {
    const newId = Math.max(...this.shops.map(s => s.id), 0) + 1;
    const newShop = { ...shop, id: newId };
    this.shops.push(newShop);
    this.saveShops();
    return newShop;
  }

  updateShop(id, updates) {
    const index = this.shops.findIndex(s => s.id === id);
    if (index !== -1) {
      this.shops[index] = { ...this.shops[index], ...updates };
      this.saveShops();
      return this.shops[index];
    }
    return null;
  }

  deleteShop(id) {
    this.shops = this.shops.filter(s => s.id !== id);
    this.saveShops();
  }

  getAllTeas() {
    return this.teas;
  }

  addTea(tea) {
    const newId = Math.max(...this.teas.map(t => t.id), 0) + 1;
    const newTea = { ...tea, id: newId };
    this.teas.push(newTea);
    this.saveTeas();
    return newTea;
  }

  updateTea(id, updates) {
    const index = this.teas.findIndex(t => t.id === id);
    if (index !== -1) {
      this.teas[index] = { ...this.teas[index], ...updates };
      this.saveTeas();
      return this.teas[index];
    }
    return null;
  }

  deleteTea(id) {
    this.teas = this.teas.filter(t => t.id !== id);
    this.saveTeas();
  }
}

// Normalisation des noms de pays/régions
function normalizeOrigin(origin) {
  if (!origin) return null;
  
  const normalized = origin.trim().toLowerCase();
  
  // Mapping des variations vers les noms standards
  const mappings = {
    // China variations
    'chine': 'China',
    'china': 'China',
    'chinese': 'China',
    'chinois': 'China',
    'chinoise': 'China',
    
    // Japan variations
    'japon': 'Japan',
    'japan': 'Japan',
    'japanese': 'Japan',
    'japonais': 'Japan',
    'japonaise': 'Japan',
    'nippon': 'Japan',
    
    // India variations
    'inde': 'India',
    'india': 'India',
    'indian': 'India',
    'indien': 'India',
    'indienne': 'India',
    
    // Taiwan variations
    'taiwan': 'Taiwan',
    'taïwan': 'Taiwan',
    'formosa': 'Taiwan',
    'formose': 'Taiwan',
    
    // Sri Lanka variations
    'sri lanka': 'Sri Lanka',
    'srilanka': 'Sri Lanka',
    'ceylon': 'Sri Lanka',
    'ceylan': 'Sri Lanka',
    
    // Nepal variations
    'nepal': 'Nepal',
    'népal': 'Nepal',
    'nepalese': 'Nepal',
    'népalais': 'Nepal',
    
    // Vietnam variations
    'vietnam': 'Vietnam',
    'viêt nam': 'Vietnam',
    'vietnamese': 'Vietnam',
    'vietnamien': 'Vietnam',
    
    // Thailand variations
    'thailand': 'Thailand',
    'thaïlande': 'Thailand',
    'thai': 'Thailand',
    'thaï': 'Thailand',
    
    // Korea variations
    'korea': 'Korea',
    'corée': 'Korea',
    'coree': 'Korea',
    'korean': 'Korea',
    'coréen': 'Korea',
    
    // Indonesia variations
    'indonesia': 'Indonesia',
    'indonésie': 'Indonesia',
    'indonesie': 'Indonesia',
    'indonesian': 'Indonesia',
    'indonésien': 'Indonesia'
  };
  
  return mappings[normalized] || origin.charAt(0).toUpperCase() + origin.slice(1);
}

// Application principale
class TeaApp {
  constructor() {
    this.store = new TeaStore();
    this.currentView = 'collection';
    this.showOutOfStock = false;
    this.selectedType = 'All';
    this.searchTerm = '';
    this.wishlistSearchTerm = '';
    this.wishlistSelectedType = 'All';
    this.selectedTeaType = 'Green';
    this.selectedMethod = 'Gongfu';
    this.selectedStock = true;
    this.temperature = '85-90°C';
    this.editingTeaId = null;
    this.scrapedUrl = null;
    this.scrapedImageUrl = null;
    
    this.init();
  }

  init() {
    this.setupEventListeners();
    this.showView('collection');
    this.renderTeas();
    this.checkUrlImport();
  }

  setupEventListeners() {
    // Home Button
    document.getElementById('home-btn')?.addEventListener('click', () => {
      this.showView('collection');
    });
    
    // Navigation
    document.querySelectorAll('.nav-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const view = e.currentTarget.dataset.view;
        this.showView(view);
      });
    });

    // Recherche
    document.getElementById('search-input').addEventListener('input', (e) => {
      this.searchTerm = e.target.value;
      this.renderTeas();
    });

    // Recherche wishlist
    document.getElementById('wishlist-search-input')?.addEventListener('input', (e) => {
      this.wishlistSearchTerm = e.target.value;
      this.renderWishlist();
    });

    // Filtres par type
    document.querySelectorAll('#filter-buttons .filter-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        document.querySelectorAll('#filter-buttons .filter-btn').forEach(b => b.classList.remove('active'));
        e.currentTarget.classList.add('active');
        this.selectedType = e.currentTarget.dataset.type;
        this.renderTeas();
      });
    });

    // Filtres wishlist par type
    document.querySelectorAll('#wishlist-filter-buttons .filter-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        document.querySelectorAll('#wishlist-filter-buttons .filter-btn').forEach(b => b.classList.remove('active'));
        e.currentTarget.classList.add('active');
        this.wishlistSelectedType = e.currentTarget.dataset.type;
        this.renderWishlist();
      });
    });

    // Toggle out of stock
    document.getElementById('toggle-stock').addEventListener('click', (e) => {
      this.showOutOfStock = !this.showOutOfStock;
      e.target.textContent = this.showOutOfStock ? 'Hide Out of Stock' : 'Show Out of Stock';
      this.renderTeas();
    });

    // Formulaire d'ajout
    document.getElementById('add-tea-form').addEventListener('submit', (e) => {
      e.preventDefault();
      this.handleAddTea();
    });

    document.getElementById('cancel-btn').addEventListener('click', () => {
      this.showView('collection');
      this.resetForm();
    });

    // Sélection de type dans le formulaire
    document.querySelectorAll('.type-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        document.querySelectorAll('.type-btn').forEach(b => b.classList.remove('active'));
        e.currentTarget.classList.add('active');
        this.selectedTeaType = e.currentTarget.dataset.type;
      });
    });

    // Sélection de méthode
    document.querySelectorAll('.method-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        document.querySelectorAll('.method-btn').forEach(b => b.classList.remove('active'));
        e.currentTarget.classList.add('active');
        this.selectedMethod = e.currentTarget.dataset.method;
      });
    });

    // Sélection de stock
    document.querySelectorAll('.stock-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        document.querySelectorAll('.stock-btn').forEach(b => b.classList.remove('active'));
        e.currentTarget.classList.add('active');
        this.selectedStock = e.currentTarget.dataset.stock === 'true';
      });
    });

    // Contrôle de température
    document.getElementById('temp-up').addEventListener('click', () => {
      this.changeTemperature(1);
    });
    document.getElementById('temp-down').addEventListener('click', () => {
      this.changeTemperature(-1);
    });

    // Scraping
    document.getElementById('scrape-info-btn').addEventListener('click', () => {
      this.handleScrapeInfo();
    });

    // Image preview
    document.getElementById('tea-image-url')?.addEventListener('input', (e) => {
      this.handleImagePreview(e.target.value);
    });

    document.getElementById('remove-image-btn')?.addEventListener('click', () => {
      this.removeImagePreview();
    });

    // Navigation vers détail du thé
    document.addEventListener('click', (e) => {
      const teaCard = e.target.closest('.tea-card');
      if (teaCard && !e.target.closest('.out-of-stock-overlay')) {
        const teaId = parseInt(teaCard.dataset.teaId);
        if (teaId) {
          this.showTeaDetail(teaId);
        }
      }
    });

    // Boutons de navigation
    document.getElementById('back-to-collection')?.addEventListener('click', () => {
      this.showView('collection');
    });

    document.getElementById('delete-tea-btn')?.addEventListener('click', () => {
      this.handleDeleteTea();
    });

    document.getElementById('edit-tea-btn')?.addEventListener('click', () => {
      this.handleEditTea();
    });

    // Timer FAB and Widget
    document.getElementById('timer-fab')?.addEventListener('click', () => {
      this.showTimerModal();
    });

    document.getElementById('close-timer')?.addEventListener('click', () => {
      this.closeTimer();
    });

    document.getElementById('close-timer-modal')?.addEventListener('click', () => {
      this.hideTimerModal();
    });

    document.querySelectorAll('.preset-btn-large').forEach(btn => {
      btn.addEventListener('click', () => {
        const seconds = parseInt(btn.dataset.seconds);
        this.startFloatingTimer(seconds);
      });
    });

    // Map
    document.getElementById('back-from-map')?.addEventListener('click', () => {
      this.showView('collection');
    });

    document.getElementById('close-details')?.addEventListener('click', () => {
      document.getElementById('region-details').classList.add('hidden');
    });

    // Setup map regions after a short delay to ensure DOM is ready
    setTimeout(() => {
      document.querySelectorAll('.region').forEach(region => {
        region.addEventListener('click', (e) => {
          const regionName = e.target.dataset.region;
          this.showRegionDetails(regionName);
        });
      });
    }, 100);

    // Export data
    document.getElementById('export-btn')?.addEventListener('click', (e) => {
      e.preventDefault();
      this.exportData();
    });

    // Import data
    document.getElementById('import-btn')?.addEventListener('click', () => {
      document.getElementById('import-file').click();
    });

    document.getElementById('import-file')?.addEventListener('change', (e) => {
      this.importData(e.target.files[0]);
    });
  }

  showView(viewName) {
    // Masquer toutes les vues
    document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
    
    // Afficher la vue sélectionnée
    const targetView = document.getElementById(`${viewName}-view`);
    if (targetView) {
      targetView.classList.add('active');
    }
    
    // Gérer le bouton Home (visible partout sauf sur la collection)
    const homeBtn = document.getElementById('home-btn');
    if (viewName === 'collection') {
      homeBtn.classList.add('hidden');
    } else {
      homeBtn.classList.remove('hidden');
    }
    
    // Mettre à jour la navigation (masquer si on est dans une vue détail)
    const bottomNav = document.getElementById('bottom-nav');
    if (['tea-detail', 'timer'].includes(viewName)) {
      bottomNav.style.display = 'none';
    } else {
      bottomNav.style.display = 'flex';
      document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.classList.remove('active');
        if (btn.dataset.view === viewName) {
          btn.classList.add('active');
        }
      });
    }

    this.currentView = viewName;

    if (viewName === 'collection') {
      this.renderTeas();
    } else if (viewName === 'map') {
      this.renderMap();
    } else if (viewName === 'wishlist') {
      this.renderWishlist();
    } else if (viewName === 'add-tea' && !this.editingTeaId) {
      // Réinitialiser le formulaire si on n'est pas en mode édition
      this.resetForm();
    }
  }

  showTeaDetail(teaId) {
    const tea = this.store.getAllTeas().find(t => t.id === teaId);
    if (!tea) return;

    this.currentTeaId = teaId;
    this.showView('tea-detail');
    this.renderTeaDetail(tea);
  }

  renderTeaDetail(tea) {
    const content = document.getElementById('tea-detail-content');
    const imageHtml = tea.imageUrl 
      ? `<img src="${tea.imageUrl}" alt="${tea.name}" class="tea-detail-image">`
      : `<div class="tea-detail-image-placeholder">
          <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
            <path d="M3 12h18M3 12v8a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-8M3 12l2-8h14l2 8M9 6v6M15 6v6"></path>
          </svg>
        </div>`;

    content.innerHTML = `
      <div class="tea-detail-image-container">
        ${imageHtml}
        ${tea.imageUrl ? '<span class="image-tag">Dry Tea</span>' : ''}
      </div>
      
      <div class="tea-detail-header">
        <h1>${tea.name}</h1>
        <span class="tea-type-badge">${tea.type}</span>
      </div>
      
      <p class="tea-detail-brand">${tea.brand || ''}</p>
      
      ${tea.origin ? `<p class="tea-detail-origin">🌍 ${tea.origin}</p>` : ''}

      ${tea.url ? `
        <div class="reference-card">
          <p class="reference-label">Reference</p>
          <a href="${tea.url}" target="_blank" class="reference-url">${tea.url}</a>
        </div>
      ` : ''}

      <div class="brewing-notes-section">
        <h2>Brewing Notes</h2>
        <div class="brewing-cards">
          <div class="brewing-card">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#0066FF" stroke-width="2">
              <path d="M14 4v10.54a4 4 0 1 1-4 0V4a2 2 0 0 1 2-2h0a2 2 0 0 1 2 2z"></path>
            </svg>
            <div class="brewing-value">${tea.temperature || 'N/A'}</div>
            <div class="brewing-label">Temperature</div>
          </div>
          <div class="brewing-card">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#0066FF" stroke-width="2">
              <path d="M3 12h18M3 12v8a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-8M3 12l2-8h14l2 8M9 6v6M15 6v6"></path>
            </svg>
            <div class="brewing-value">${tea.quantity || 'N/A'}</div>
            <div class="brewing-label">Quantity</div>
          </div>
          <div class="brewing-card">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#0066FF" stroke-width="2">
              <circle cx="12" cy="12" r="10"></circle>
              <polyline points="12 6 12 12 16 14"></polyline>
            </svg>
            <div class="brewing-value">${tea.time || 'N/A'}</div>
            <div class="brewing-label">Time</div>
          </div>
        </div>
        
        <div class="method-badge-large">Method: ${tea.method || 'N/A'}</div>
        
        ${tea.infusions ? `
          <div class="infusions-section">
            <h3>Infusion Durations</h3>
            <div class="infusions-list">${tea.infusions}</div>
          </div>
        ` : ''}
      </div>

      <div class="stock-badge ${tea.inStock ? 'in-stock' : 'out-of-stock'}">
        ${tea.inStock ? 'In Stock' : 'Out of Stock'}
      </div>

      ${tea.description ? `
        <div class="about-section">
          <h2>About This Tea</h2>
          <p>${tea.description}</p>
        </div>
      ` : ''}
    `;
  }

  startTimer(teaId) {
    // Open timer modal
    this.currentTeaId = teaId;
    this.showTimerModal();
  }

  showTimerModal() {
    document.getElementById('timer-modal').classList.remove('hidden');
  }

  hideTimerModal() {
    document.getElementById('timer-modal').classList.add('hidden');
  }

  startFloatingTimer(seconds) {
    this.hideTimerModal();
    
    // Hide FAB, show widget
    document.getElementById('timer-fab').classList.add('hidden');
    const widget = document.getElementById('timer-widget');
    widget.classList.remove('hidden');
    widget.classList.remove('pulsing');
    
    this.timerSeconds = seconds;
    this.timerTotalSeconds = seconds;
    
    // Initialize circular progress
    const circle = document.getElementById('timer-circle');
    const radius = 63;
    const circumference = 2 * Math.PI * radius;
    // Set initial state (full circle)
    circle.style.strokeDashoffset = `${circumference}`;
    
    this.updateFloatingTimerDisplay();
    
    // Start countdown
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
    }
    
    this.timerInterval = setInterval(() => {
      if (this.timerSeconds > 0) {
        this.timerSeconds--;
        this.updateFloatingTimerDisplay();
        
        // Add pulsing animation when < 10 seconds
        if (this.timerSeconds <= 10) {
          widget.classList.add('pulsing');
        }
      } else {
        this.stopFloatingTimer();
        alert('⏰ Temps d\'infusion terminé !');
      }
    }, 1000);
  }

  updateFloatingTimerDisplay() {
    const minutes = Math.floor(this.timerSeconds / 60);
    const seconds = this.timerSeconds % 60;
    document.getElementById('timer-widget-display').textContent = 
      `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    
    // Update circular progress
    const circle = document.getElementById('timer-circle');
    const radius = 63;
    const circumference = 2 * Math.PI * radius;
    const progress = ((this.timerTotalSeconds - this.timerSeconds) / this.timerTotalSeconds);
    
    // Update offset to show progress
    circle.style.strokeDashoffset = circumference * (1 - progress);
  }

  closeTimer() {
    this.stopFloatingTimer();
    const widget = document.getElementById('timer-widget');
    widget.classList.add('hidden');
    widget.classList.remove('pulsing');
    document.getElementById('timer-fab').classList.remove('hidden');
  }

  stopFloatingTimer() {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
      this.timerInterval = null;
    }
  }

  handleDeleteTea() {
    if (!this.currentTeaId) return;
    
    if (confirm('Êtes-vous sûr de vouloir supprimer ce thé ?')) {
      this.store.deleteTea(this.currentTeaId);
      this.showView('collection');
      this.renderTeas();
    }
  }

  handleEditTea() {
    if (!this.currentTeaId) return;
    
    const tea = this.store.getAllTeas().find(t => t.id === this.currentTeaId);
    if (!tea) return;
    
    // Passer en mode édition
    this.editingTeaId = this.currentTeaId;
    
    // Pré-remplir le formulaire
    document.getElementById('tea-name').value = tea.name || '';
    document.getElementById('tea-brand').value = tea.brand || '';
    document.getElementById('tea-origin').value = tea.origin || '';
    document.getElementById('tea-quantity').value = tea.quantity || '';
    document.getElementById('tea-time').value = tea.time || '';
    document.getElementById('tea-infusions').value = tea.infusions || '';
    document.getElementById('tea-description').value = tea.description || '';
    document.getElementById('tea-url').value = tea.url || '';
    document.getElementById('tea-image-url').value = tea.imageUrl || '';
    const wishlistCheckbox = document.getElementById('tea-wishlist');
    if (wishlistCheckbox) {
      wishlistCheckbox.checked = !!tea.isWishlist;
    }
    this.temperature = tea.temperature || '85-90°C';
    
    // Afficher l'aperçu de l'image si elle existe
    if (tea.imageUrl) {
      this.handleImagePreview(tea.imageUrl);
    }
    
    // Sélectionner le type de thé
    this.selectedTeaType = tea.type || 'Green';
    document.querySelectorAll('#tea-type-buttons button').forEach(btn => {
      btn.classList.remove('active');
      if (btn.textContent === this.selectedTeaType) {
        btn.classList.add('active');
      }
    });
    
    // Sélectionner la méthode
    this.selectedMethod = tea.method || 'Gongfu';
    document.querySelectorAll('#tea-method-buttons button').forEach(btn => {
      btn.classList.remove('active');
      if (btn.textContent === this.selectedMethod) {
        btn.classList.add('active');
      }
    });
    
    // Sélectionner le stock
    this.selectedStock = tea.inStock;
    document.querySelectorAll('#stock-buttons button').forEach(btn => {
      btn.classList.remove('active');
      if ((btn.textContent === 'In Stock' && tea.inStock) || 
          (btn.textContent === 'Out of Stock' && !tea.inStock)) {
        btn.classList.add('active');
      }
    });
    
    // Changer le titre du formulaire
    document.querySelector('#add-tea-view header h1').textContent = 'Edit Tea';
    
    // Aller à la vue d'ajout (qui servira aussi d'édition)
    this.showView('add-tea');
  }

  renderMap() {
    // Map is now SVG-based, regions are clickable
  }

  showRegionDetails(regionName) {
    const teas = this.store.getAllTeas();
    const detailsEl = document.getElementById('region-details');
    const nameEl = document.getElementById('region-name');
    const listEl = document.getElementById('region-teas-list');
    
    // Filter teas by origin
    const regionTeas = teas.filter(tea => {
      if (tea.isWishlist) return false;
      if (!tea.origin) return false;
      // Normalize comparison (case insensitive, handle variations)
      const origin = tea.origin.toLowerCase();
      const region = regionName.toLowerCase();
      return origin.includes(region) || region.includes(origin);
    });

    nameEl.textContent = regionName;
    
    if (regionTeas.length === 0) {
      listEl.innerHTML = `<p style="color: #666; text-align: center; padding: 20px;">Aucun thé de ${regionName} dans votre collection</p>`;
    } else {
      listEl.innerHTML = regionTeas.map(tea => `
        <div class="tea-item" onclick="app.showTeaDetail(${tea.id})">
          <h4>${tea.name}</h4>
          <p>${tea.type} - ${tea.brand || ''}</p>
        </div>
      `).join('');
    }
    
    detailsEl.classList.remove('hidden');
    
    // Highlight selected region
    document.querySelectorAll('.region').forEach(r => r.classList.remove('active'));
    const selectedRegion = document.querySelector(`[data-region="${regionName}"]`);
    if (selectedRegion) {
      selectedRegion.classList.add('active');
    }
  }

  renderTeas() {
    const teaList = document.getElementById('tea-list');
    let teas = this.store.getAllTeas();

    // Exclure les thés de wishlist
    teas = teas.filter(tea => !tea.isWishlist);

    // Filtrer par type
    if (this.selectedType !== 'All') {
      teas = teas.filter(tea => tea.type === this.selectedType);
    }

    // Filtrer par recherche
    if (this.searchTerm) {
      const searchLower = this.searchTerm.toLowerCase();
      teas = teas.filter(tea => 
        tea.name.toLowerCase().includes(searchLower) ||
        tea.brand.toLowerCase().includes(searchLower)
      );
    }

    // Filtrer out of stock
    if (!this.showOutOfStock) {
      teas = teas.filter(tea => tea.inStock);
    }

    // Mettre à jour le compteur
    document.getElementById('tea-count').textContent = `${teas.length} teas`;

    // Rendre les cartes
    if (teas.length === 0) {
      teaList.innerHTML = '<div class="empty-state"><p>No teas found</p></div>';
      return;
    }

    teaList.innerHTML = teas.map(tea => this.renderTeaCard(tea)).join('');
  }

  renderWishlist() {
    const wishlistList = document.getElementById('wishlist-list');
    let teas = this.store.getAllTeas();

    // Ne garder que les thés de wishlist
    teas = teas.filter(tea => tea.isWishlist);

    // Filtrer par type
    if (this.wishlistSelectedType !== 'All') {
      teas = teas.filter(tea => tea.type === this.wishlistSelectedType);
    }

    // Filtrer par recherche
    if (this.wishlistSearchTerm) {
      const searchLower = this.wishlistSearchTerm.toLowerCase();
      teas = teas.filter(tea => 
        tea.name.toLowerCase().includes(searchLower) ||
        (tea.brand && tea.brand.toLowerCase().includes(searchLower))
      );
    }

    // Mettre à jour le compteur
    document.getElementById('wishlist-count').textContent = `${teas.length} teas`;

    // Rendre les cartes
    if (teas.length === 0) {
      wishlistList.innerHTML = '<div class="empty-state"><p>✨ No teas in your wishlist yet</p></div>';
      return;
    }

    wishlistList.innerHTML = teas.map(tea => this.renderWishlistCard(tea)).join('');
  }

  renderWishlistCard(tea) {
    const imageHtml = tea.imageUrl 
      ? `<img src="${tea.imageUrl}" alt="${tea.name}" onerror="this.parentElement.innerHTML='<div class=\\'placeholder-image\\'><svg width=\\'40\\' height=\\'40\\' viewBox=\\'0 0 24 24\\' fill=\\'none\\' stroke=\\'currentColor\\' stroke-width=\\'1.5\\'><path d=\\'M3 12h18M3 12v8a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-8M3 12l2-8h14l2 8M9 6v6M15 6v6\\'></path></svg></div>'">`
      : `<div class="placeholder-image">
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
            <path d="M3 12h18M3 12v8a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-8M3 12l2-8h14l2 8M9 6v6M15 6v6"></path>
          </svg>
        </div>`;

    const urlButton = tea.url 
      ? `<a href="${tea.url}" target="_blank" class="wishlist-url-btn" onclick="event.stopPropagation()" title="View product page">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
            <polyline points="15 3 21 3 21 9"></polyline>
            <line x1="10" y1="14" x2="21" y2="3"></line>
          </svg>
        </a>`
      : '';
    const urlText = tea.url
      ? `<a href="${tea.url}" target="_blank" class="wishlist-url-text" onclick="event.stopPropagation()">${tea.url}</a>`
      : '<span class="wishlist-url-text muted">No URL saved</span>';

    return `
      <div class="tea-card wishlist-card" data-tea-id="${tea.id}">
        <div class="wishlist-badge">✨ Wishlist</div>
        <div class="tea-image">
          ${imageHtml}
        </div>
        <div class="tea-info">
          <h3>${tea.name}</h3>
          <p class="tea-type">${tea.type}</p>
          ${tea.brand ? `<p class="tea-brand">🏪 ${tea.brand}</p>` : ''}
          <div class="wishlist-url-row">
            ${urlButton}
            ${urlText}
          </div>
        </div>
      </div>
    `;
  }

  renderTeaCard(tea) {
    const imageHtml = tea.imageUrl 
      ? `<img src="${tea.imageUrl}" alt="${tea.name}" onerror="this.parentElement.innerHTML='<div class=\\'placeholder-image\\'><svg width=\\'40\\' height=\\'40\\' viewBox=\\'0 0 24 24\\' fill=\\'none\\' stroke=\\'currentColor\\' stroke-width=\\'1.5\\'><path d=\\'M3 12h18M3 12v8a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-8M3 12l2-8h14l2 8M9 6v6M15 6v6\\'></path></svg></div>'">`
      : `<div class="placeholder-image">
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
            <path d="M3 12h18M3 12v8a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-8M3 12l2-8h14l2 8M9 6v6M15 6v6"></path>
          </svg>
        </div>`;

    return `
      <div class="tea-card ${!tea.inStock ? 'out-of-stock' : ''}" data-tea-id="${tea.id}">
        ${!tea.inStock ? '<div class="out-of-stock-overlay"><span>Out of Stock</span></div>' : ''}
        <div class="tea-image">
          ${imageHtml}
        </div>
        <div class="tea-info">
          <h3>${tea.name}</h3>
          <p class="tea-type">${tea.type}</p>
          <p class="tea-brand">${tea.brand || ''}</p>
          <div class="tea-details">
            <span>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M14 4v10.54a4 4 0 1 1-4 0V4a2 2 0 0 1 2-2h0a2 2 0 0 1 2 2z"></path>
              </svg>
              ${tea.temperature}
            </span>
            <span>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="10"></circle>
                <polyline points="12 6 12 12 16 14"></polyline>
              </svg>
              ${tea.time}
            </span>
            <span>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M3 12h18M3 12v8a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-8M3 12l2-8h14l2 8M9 6v6M15 6v6"></path>
              </svg>
              ${tea.method}
            </span>
          </div>
        </div>
      </div>
    `;
  }

  handleAddTea() {
    // Priorité : image manuelle > image scrapée
    const manualImageUrl = document.getElementById('tea-image-url')?.value || null;
    const isWishlist = document.getElementById('tea-wishlist')?.checked || false;
    
    // Normaliser l'origine
    const rawOrigin = document.getElementById('tea-origin').value;
    const normalizedOrigin = normalizeOrigin(rawOrigin);
    
    const tea = {
      name: document.getElementById('tea-name').value,
      brand: document.getElementById('tea-brand').value,
      origin: normalizedOrigin,
      type: this.selectedTeaType,
      temperature: this.temperature,
      quantity: document.getElementById('tea-quantity').value,
      time: document.getElementById('tea-time').value,
      infusions: document.getElementById('tea-infusions').value,
      method: this.selectedMethod,
      inStock: this.selectedStock,
      isWishlist,
      description: document.getElementById('tea-description').value,
      url: this.scrapedUrl || document.getElementById('tea-url')?.value || null,
      imageUrl: manualImageUrl || this.scrapedImageUrl || null
    };

    if (this.editingTeaId) {
      // Mode édition
      tea.id = this.editingTeaId;
      this.store.updateTea(this.editingTeaId, tea);
      this.editingTeaId = null;
      // Restaurer le titre
      document.querySelector('#add-tea-view header h1').textContent = 'Add New Tea';
    } else {
      // Mode ajout
      this.store.addTea(tea);
    }
    
    this.resetForm();
    this.scrapedUrl = null;
    this.scrapedImageUrl = null;
    this.showView('collection');
    this.renderTeas();
  }

  resetForm() {
    document.getElementById('add-tea-form').reset();
    this.selectedTeaType = 'Green';
    this.selectedMethod = 'Gongfu';
    this.selectedStock = true;
    this.temperature = '85-90°C';
    this.editingTeaId = null;
    this.scrapedUrl = null;
    this.scrapedImageUrl = null;
    document.getElementById('temperature-display').textContent = this.temperature;
    const wishlistCheckbox = document.getElementById('tea-wishlist');
    if (wishlistCheckbox) {
      wishlistCheckbox.checked = false;
    }
    
    // Réinitialiser les champs
    if (document.getElementById('tea-origin')) {
      document.getElementById('tea-origin').value = '';
    }
    
    // Réinitialiser le titre
    document.querySelector('#add-tea-view header h1').textContent = 'Add New Tea';
    
    // Réinitialiser l'aperçu d'image
    this.removeImagePreview();
    
    // Réinitialiser les boutons
    document.querySelectorAll('.type-btn').forEach(btn => {
      btn.classList.remove('active');
      if (btn.dataset.type === 'Green') btn.classList.add('active');
    });
    document.querySelectorAll('.method-btn').forEach(btn => {
      btn.classList.remove('active');
      if (btn.dataset.method === 'Gongfu') btn.classList.add('active');
    });
    document.querySelectorAll('.stock-btn').forEach(btn => {
      btn.classList.remove('active');
      if (btn.dataset.stock === 'true') btn.classList.add('active');
    });
  }

  handleImagePreview(imageUrl) {
    const preview = document.getElementById('image-preview');
    const previewImg = document.getElementById('preview-img');
    
    if (imageUrl && imageUrl.trim()) {
      previewImg.src = imageUrl;
      preview.style.display = 'block';
      
      // Gérer les erreurs de chargement d'image
      previewImg.onerror = () => {
        preview.style.display = 'none';
        console.warn('Impossible de charger l\'image:', imageUrl);
      };
    } else {
      preview.style.display = 'none';
    }
  }

  removeImagePreview() {
    const preview = document.getElementById('image-preview');
    const imageInput = document.getElementById('tea-image-url');
    const previewImg = document.getElementById('preview-img');
    
    if (preview) preview.style.display = 'none';
    if (imageInput) imageInput.value = '';
    if (previewImg) previewImg.src = '';
  }

  changeTemperature(direction) {
    const temps = ['75-80°C', '80-85°C', '85-90°C', '90-95°C', '95°C', '100°C'];
    const currentIndex = temps.indexOf(this.temperature);
    let newIndex = currentIndex + direction;
    
    if (newIndex < 0) newIndex = 0;
    if (newIndex >= temps.length) newIndex = temps.length - 1;
    
    this.temperature = temps[newIndex];
    document.getElementById('temperature-display').textContent = this.temperature;
  }

  async handleScrapeInfo() {
    const url = document.getElementById('tea-url').value.trim();
    if (!url) {
      alert('Please enter a URL first');
      return;
    }

    const scrapeBtn = document.getElementById('scrape-info-btn');
    const originalText = scrapeBtn.innerHTML;
    scrapeBtn.disabled = true;
    scrapeBtn.innerHTML = '<span>Scraping...</span>';

    try {
      // Note: Le scraping direct depuis le navigateur est limité par CORS
      // Cette fonction utilise un proxy CORS public (allorigins.win)
      // Pour une production, vous devriez utiliser votre propre backend

      const proxyAttempts = [
        {
          name: 'allorigins-json',
          fetchUrl: `https://api.allorigins.win/get?url=${encodeURIComponent(url)}`,
          parse: async (res) => {
            const data = await res.json();
            return data?.contents || '';
          }
        },
        {
          name: 'allorigins-raw',
          fetchUrl: `https://api.allorigins.win/raw?url=${encodeURIComponent(url)}`,
          parse: async (res) => res.text()
        }
      ];

      let html = '';
      let lastError = null;

      for (const attempt of proxyAttempts) {
        try {
          const response = await fetch(attempt.fetchUrl);
          if (!response.ok) {
            throw new Error(`${attempt.name} status ${response.status}`);
          }
          const text = await attempt.parse(response);
          if (text && text.length > 200) {
            html = text;
            break;
          }
        } catch (err) {
          lastError = err;
        }
      }

      if (!html) {
        throw new Error(lastError?.message || 'Proxy fetch failed');
      }

      if (html) {
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');
        
        // Extraction du titre avec fonction améliorée
        const title = this.extractProductTitle(doc, url);
        
        // Extraction de la description
        const description = this.extractProductDescription(doc);
        
        // Récupérer tout le texte de la page pour chercher les patterns
        const pageText = doc.body?.textContent || '';
        const fullText = (title + ' ' + description + ' ' + pageText).toLowerCase();
        
        // Extraction de la marque depuis l'URL (priorité à la base de données)
        let brand = this.extractBrandFromUrl(url);
        
        // Si pas trouvé dans l'URL, chercher dans la page
        if (!brand) {
          brand = this.extractBrandFromPage(doc, fullText);
        }
        
        // Si une marque a été trouvée, vérifier si elle existe dans la base et la mapper
        if (brand) {
          const mappedBrand = findShopByNameOrUrl(brand);
          if (mappedBrand) {
            brand = mappedBrand.name;
            console.log('✅ Marque mappée:', brand);
          } else {
            console.warn('⚠️ Marque non trouvée dans la base:', brand, '- Ajoutez-la dans la gestion des boutiques pour un nom formaté');
          }
        }
        
        // Extraction de l'image du produit
        const imageUrl = this.extractProductImage(doc, url, title);
        
        // Extraction de la température
        const scrapedTemp = this.extractTemperature(fullText, doc);
        
        // Mapper vers la température prédéfinie la plus proche
        const temperature = scrapedTemp ? this.mapToClosestTemperature(scrapedTemp) : null;
        
        // Extraction du temps d'infusion
        const infusionTime = this.extractInfusionTime(fullText, doc);
        
        // Remplir les champs du formulaire
        if (title && !document.getElementById('tea-name').value) {
          document.getElementById('tea-name').value = title;
        }
        
        if (brand && !document.getElementById('tea-brand').value) {
          document.getElementById('tea-brand').value = brand;
        }
        
        if (description && !document.getElementById('tea-description').value) {
          document.getElementById('tea-description').value = description;
        }
        
        if (temperature) {
          this.temperature = temperature;
          document.getElementById('temperature-display').textContent = temperature;
        }
        
        if (infusionTime && !document.getElementById('tea-time').value) {
          document.getElementById('tea-time').value = infusionTime;
        }

        // Sauvegarder l'URL et l'image pour utilisation ultérieure
        if (url) {
          this.scrapedUrl = url;
        }
        if (imageUrl) {
          this.scrapedImageUrl = imageUrl;
          // Remplir le champ image URL et afficher l'aperçu
          document.getElementById('tea-image-url').value = imageUrl;
          this.handleImagePreview(imageUrl);
          console.log('Image trouvée:', imageUrl);
        }
        
        // Détecter automatiquement la catégorie de thé depuis le titre
        const detectedCategory = this.detectTeaCategory(title + ' ' + description);
        if (detectedCategory) {
          const typeBtn = document.querySelector(`.type-btn[data-type="${detectedCategory}"]`);
          if (typeBtn) {
            document.querySelectorAll('.type-btn').forEach(b => b.classList.remove('active'));
            typeBtn.classList.add('active');
            this.selectedTeaType = typeBtn.dataset.type;
            console.log('Catégorie détectée:', detectedCategory);
          }
        }
        
        const foundItems = [];
        if (title) foundItems.push('Nom');
        if (brand) foundItems.push('Marque');
        if (temperature) foundItems.push('Température');
        if (infusionTime) foundItems.push('Temps d\'infusion');
        if (description) foundItems.push('Description');
        if (imageUrl) foundItems.push('Image');
        
        // Vérifier si la marque est bien mappée
        let alertMessage = `✅ Information scrapée avec succès!\n\nTrouvé: ${foundItems.join(', ')}\n\n`;
        
        if (brand) {
          const isMapped = findShopByNameOrUrl(brand);
          if (!isMapped) {
            alertMessage += `⚠️ Note: La marque "${brand}" n'est pas dans votre base de boutiques.\nPour un nom formaté, ajoutez-la via le lien 🏪 en haut à droite.\n\n`;
          }
        }
        
        alertMessage += 'Veuillez vérifier et compléter le formulaire.';
        alert(alertMessage);
      }
    } catch (error) {
      console.error('Scraping error:', error);
      const isFileProtocol = window.location.protocol === 'file:';
      const hint = isFileProtocol
        ? '\n\nAstuce: ouvrez le projet via un serveur local (ex: `python3 -m http.server` dans le dossier) puis allez sur http://localhost:8000/tea-collection/index.html'
        : '';
      alert(`Could not scrape information from this URL. Please enter details manually.\n\nNote: Some websites block scraping for security reasons.${hint}`);
    } finally {
      scrapeBtn.disabled = false;
      scrapeBtn.innerHTML = originalText;
    }
  }

  extractBrandFromUrl(url) {
    try {
      const urlObj = new URL(url);
      const hostname = urlObj.hostname;
      
      console.log('🏪 Extraction marque depuis URL:', hostname);
      
      // Enlever www. si présent
      let domain = hostname.replace(/^www\./, '');
      
      // D'abord, chercher le domaine complet dans la base de données
      const foundShop = findShopByNameOrUrl(domain);
      if (foundShop) {
        console.log('✅ Boutique trouvée (domaine complet):', foundShop.name);
        return foundShop.name;
      }
      
      // Si pas trouvé, extraire le nom de domaine principal
      const parts = domain.split('.');
      if (parts.length >= 2) {
        // Prendre l'avant-dernière partie (ex: "teashop" de "teashop.com")
        const brandName = parts[parts.length - 2];
        
        // Chercher dans la base de données avec juste le nom
        const foundShopByName = findShopByNameOrUrl(brandName);
        if (foundShopByName) {
          console.log('✅ Boutique trouvée (nom de domaine):', foundShopByName.name);
          return foundShopByName.name;
        }
        
        // Si pas trouvé, retourner le nom brut (sera mappé plus tard si possible)
        console.log('⚠️ Boutique non mappée, nom brut:', brandName);
        return brandName;
      }
      
      return null;
    } catch (e) {
      console.error('❌ Erreur extraction marque URL:', e);
      return null;
    }
  }

  extractBrandFromPage(doc, fullText) {
    // Chercher dans les meta tags
    const brandMeta = doc.querySelector('meta[property="product:brand"], meta[name="brand"], [itemprop="brand"]');
    if (brandMeta) {
      const brand = brandMeta.getAttribute('content') || brandMeta.textContent?.trim();
      if (brand) {
        // Vérifier dans la base de données
        const foundShop = findShopByNameOrUrl(brand);
        if (foundShop) {
          return foundShop.name;
        }
        return brand;
      }
    }
    
    // Chercher dans les classes communes
    const brandSelectors = [
      '.brand', '.product-brand', '.tea-brand', '.manufacturer',
      '[data-brand]', '[itemprop="brand"]'
    ];
    
    for (const selector of brandSelectors) {
      const element = doc.querySelector(selector);
      if (element) {
        const brand = element.textContent?.trim() || element.getAttribute('data-brand');
        if (brand && brand.length < 50) { // Éviter les textes trop longs
          // Vérifier dans la base de données
          const foundShop = findShopByNameOrUrl(brand);
          if (foundShop) {
            return foundShop.name;
          }
          return brand;
        }
      }
    }
    
    // Chercher dans le texte de la page
    const textLower = fullText.toLowerCase();
    for (const shop of this.store.getAllShops()) {
      for (const variation of shop.variations) {
        if (textLower.includes(variation.toLowerCase())) {
          return shop.name;
        }
      }
    }
    
    return null;
  }

  extractTemperature(text, doc) {
    // Patterns pour trouver la température
    const tempPatterns = [
      /(\d{2,3})\s*[-–—]\s*(\d{2,3})\s*°?\s*c/gi,  // 75-80°C, 75-80 C
      /(\d{2,3})\s*°?\s*c/gi,                      // 85°C, 85 C
      /température[:\s]+(\d{2,3})\s*[-–—]?\s*(\d{2,3})?\s*°?\s*c/gi,
      /temperature[:\s]+(\d{2,3})\s*[-–—]?\s*(\d{2,3})?\s*°?\s*c/gi,
      /brewing[:\s]+temp[^\d]*(\d{2,3})\s*[-–—]?\s*(\d{2,3})?\s*°?\s*c/gi,
      /infusion[:\s]+(\d{2,3})\s*[-–—]?\s*(\d{2,3})?\s*°?\s*c/gi
    ];
    
    for (const pattern of tempPatterns) {
      const match = text.match(pattern);
      if (match) {
        const fullMatch = match[0];
        // Extraire les nombres
        const numbers = fullMatch.match(/\d{2,3}/g);
        if (numbers) {
          if (numbers.length === 2) {
            return `${numbers[0]}-${numbers[1]}°C`;
          } else if (numbers.length === 1) {
            return `${numbers[0]}°C`;
          }
        }
      }
    }
    
    // Chercher dans des éléments spécifiques
    const tempSelectors = [
      '.temperature', '.temp', '.brewing-temp', '.infusion-temp',
      '[data-temperature]', '[itemprop="temperature"]'
    ];
    
    for (const selector of tempSelectors) {
      const element = doc.querySelector(selector);
      if (element) {
        const tempText = element.textContent || element.getAttribute('data-temperature');
        const match = tempText.match(/(\d{2,3})\s*[-–—]?\s*(\d{2,3})?\s*°?\s*c/gi);
        if (match) {
          const numbers = match[0].match(/\d{2,3}/g);
          if (numbers) {
            if (numbers.length === 2) {
              return `${numbers[0]}-${numbers[1]}°C`;
            } else if (numbers.length === 1) {
              return `${numbers[0]}°C`;
            }
          }
        }
      }
    }
    
    return null;
  }

  mapToClosestTemperature(scrapedTemp) {
    // Options de température prédéfinies dans l'application
    const predefinedTemps = [
      '75-80°C',
      '80-85°C',
      '85-90°C',
      '90-95°C',
      '95°C',
      '100°C'
    ];

    if (!scrapedTemp) return '85-90°C'; // Valeur par défaut

    // Parser la température scrapée
    const numbers = scrapedTemp.match(/\d{2,3}/g);
    if (!numbers) return '85-90°C';

    let targetTemp;
    if (numbers.length === 2) {
      // Plage : prendre la moyenne
      targetTemp = (parseInt(numbers[0]) + parseInt(numbers[1])) / 2;
    } else {
      // Valeur unique
      targetTemp = parseInt(numbers[0]);
    }

    // Trouver l'option la plus proche
    let closestOption = predefinedTemps[0];
    let minDifference = Infinity;

    for (const option of predefinedTemps) {
      const optionNumbers = option.match(/\d{2,3}/g);
      let optionTemp;

      if (optionNumbers.length === 2) {
        // Plage : prendre la moyenne
        optionTemp = (parseInt(optionNumbers[0]) + parseInt(optionNumbers[1])) / 2;
      } else {
        // Valeur unique
        optionTemp = parseInt(optionNumbers[0]);
      }

      const difference = Math.abs(targetTemp - optionTemp);
      if (difference < minDifference) {
        minDifference = difference;
        closestOption = option;
      }
    }

    return closestOption;
  }

  extractProductTitle(doc, pageUrl) {
    let rawTitle = '';
    
    // Stratégie 1: Meta tags (plus fiables)
    const ogTitle = doc.querySelector('meta[property="og:title"]')?.getAttribute('content');
    if (ogTitle) {
      rawTitle = ogTitle;
    } else {
      const twitterTitle = doc.querySelector('meta[name="twitter:title"]')?.getAttribute('content');
      if (twitterTitle) {
        rawTitle = twitterTitle;
      } else {
        // Stratégie 2: Schema.org structured data
        const schemaName = doc.querySelector('[itemprop="name"]')?.textContent?.trim();
        if (schemaName && schemaName.length > 3) {
          rawTitle = schemaName;
        } else {
          // Stratégie 3: Sélecteurs spécifiques e-commerce
          const selectors = [
            'h1.product-title',
            'h1.product__title',
            'h1.product-name',
            '.product-title h1',
            '.product__title',
            '[data-product-title]',
            '.ProductMeta__Title',
            '.product-single__title',
            'h1[class*="product"]',
            'h1[class*="Product"]'
          ];

          for (const selector of selectors) {
            const element = doc.querySelector(selector);
            if (element) {
              const title = element.textContent?.trim();
              if (title && title.length > 3) {
                rawTitle = title;
                break;
              }
            }
          }

          // Stratégie 4: Premier h1 de la page
          if (!rawTitle) {
            const h1 = doc.querySelector('h1');
            if (h1) {
              const title = h1.textContent?.trim();
              if (title && title.length > 3 && !title.toLowerCase().includes('menu') && !title.toLowerCase().includes('navigation')) {
                rawTitle = title;
              }
            }
          }

          // Stratégie 5: Title tag (dernier recours)
          if (!rawTitle) {
            const pageTitle = doc.querySelector('title')?.textContent;
            if (pageTitle) {
              rawTitle = pageTitle;
            }
          }
        }
      }
    }

    if (!rawTitle) {
      console.warn('Aucun titre trouvé pour:', pageUrl);
      return '';
    }

    // Nettoyer le titre : enlever le nom de la boutique (après – ou | ou dans certains cas " - ")
    let cleanTitle = rawTitle;
    
    // Séparer sur tiret long (–) ou pipe (|) qui séparent généralement le nom de la boutique
    if (cleanTitle.includes('–')) {
      cleanTitle = cleanTitle.split('–')[0].trim();
    } else if (cleanTitle.includes('|')) {
      cleanTitle = cleanTitle.split('|')[0].trim();
    } else {
      // Si le titre se termine par " - NomDeBoutique", on le coupe
      // Mais on garde les tirets au milieu du nom (comme "OOLONG TEA - Milky")
      const parts = cleanTitle.split(' - ');
      if (parts.length > 2) {
        // Garder tout sauf la dernière partie (probablement le nom de la boutique)
        cleanTitle = parts.slice(0, -1).join(' - ').trim();
      }
    }

    // Enlever les mentions de catégorie de thé du titre
    cleanTitle = this.removeCategoryFromTitle(cleanTitle);

    console.log('Titre final nettoyé:', cleanTitle);
    return cleanTitle;
  }

  removeCategoryFromTitle(title) {
    // Liste des patterns de catégories à enlever
    const categoryPatterns = [
      // Oolong
      /^oolong\s+tea\s*[-:]?\s*/i,
      /^oolong\s*[-:]?\s*/i,
      /^wu\s*long\s+tea\s*[-:]?\s*/i,
      /^wu\s*long\s*[-:]?\s*/i,
      /^wulong\s+tea\s*[-:]?\s*/i,
      /^wulong\s*[-:]?\s*/i,
      
      // Black
      /^black\s+tea\s*[-:]?\s*/i,
      /^black\s*[-:]?\s*/i,
      /^thé\s+noir\s*[-:]?\s*/i,
      /^noir\s*[-:]?\s*/i,
      
      // Green
      /^green\s+tea\s*[-:]?\s*/i,
      /^green\s*[-:]?\s*/i,
      /^thé\s+vert\s*[-:]?\s*/i,
      /^vert\s*[-:]?\s*/i,
      
      // White
      /^white\s+tea\s*[-:]?\s*/i,
      /^white\s*[-:]?\s*/i,
      /^thé\s+blanc\s*[-:]?\s*/i,
      /^blanc\s*[-:]?\s*/i,
      
      // Herbal
      /^herbal\s+tea\s*[-:]?\s*/i,
      /^herbal\s*[-:]?\s*/i,
      /^infusion\s*[-:]?\s*/i,
      /^tisane\s*[-:]?\s*/i,
      /^rooibos\s*[-:]?\s*/i,
      
      // Générique "TEA" au début
      /^tea\s*[-:]?\s*/i,
      /^thé\s*[-:]?\s*/i
    ];

    let cleanedTitle = title;
    
    // Essayer chaque pattern
    for (const pattern of categoryPatterns) {
      if (pattern.test(cleanedTitle)) {
        cleanedTitle = cleanedTitle.replace(pattern, '').trim();
        break; // On arrête dès qu'on trouve un match
      }
    }

    // Si le titre commence maintenant par "-" ou ":", on l'enlève
    cleanedTitle = cleanedTitle.replace(/^[-:]\s*/, '').trim();

    return cleanedTitle;
  }

  detectTeaCategory(title) {
    // Détecter la catégorie de thé dans le titre
    const titleLower = title.toLowerCase();
    
    const categories = {
      'oolong': ['oolong', 'wu long', 'wulong'],
      'black': ['black tea', 'thé noir', 'noir', 'black'],
      'green': ['green tea', 'thé vert', 'vert', 'green'],
      'white': ['white tea', 'thé blanc', 'blanc', 'white'],
      'herbal': ['herbal', 'infusion', 'tisane', 'rooibos']
    };

    for (const [type, keywords] of Object.entries(categories)) {
      for (const keyword of keywords) {
        if (titleLower.includes(keyword)) {
          return type.charAt(0).toUpperCase() + type.slice(1);
        }
      }
    }

    return null;
  }

  extractProductDescription(doc) {
    // Stratégie 1: Meta description
    const metaDesc = doc.querySelector('meta[name="description"]')?.getAttribute('content');
    if (metaDesc && metaDesc.length > 20) {
      return metaDesc.trim();
    }

    const ogDesc = doc.querySelector('meta[property="og:description"]')?.getAttribute('content');
    if (ogDesc && ogDesc.length > 20) {
      return ogDesc.trim();
    }

    // Stratégie 2: Schema.org
    const schemaDesc = doc.querySelector('[itemprop="description"]')?.textContent?.trim();
    if (schemaDesc && schemaDesc.length > 20) {
      return schemaDesc;
    }

    // Stratégie 3: Sélecteurs communs de description produit
    const selectors = [
      '.product-description',
      '.product__description',
      '.product-single__description',
      '[data-product-description]',
      '.ProductMeta__Description',
      '.description',
      '.product-details',
      '.rte'
    ];

    for (const selector of selectors) {
      const element = doc.querySelector(selector);
      if (element) {
        const desc = element.textContent?.trim();
        if (desc && desc.length > 20) {
          // Limiter à 500 caractères
          return desc.substring(0, 500);
        }
      }
    }

    return '';
  }

  extractProductImage(doc, pageUrl, productTitle) {
    console.log('🖼️ Début extraction image pour:', productTitle);
    
    try {
      const urlObj = new URL(pageUrl);
      const pathname = urlObj.pathname;
      const pathParts = pathname.split('/').filter(p => p);
      const productSlug = pathParts[pathParts.length - 1] || '';
      
      // Normaliser le slug et le titre pour la comparaison
      const normalizeString = (str) => {
        return str.toLowerCase()
          .replace(/[àáâãäå]/g, 'a')
          .replace(/[èéêë]/g, 'e')
          .replace(/[ìíîï]/g, 'i')
          .replace(/[òóôõö]/g, 'o')
          .replace(/[ùúûü]/g, 'u')
          .replace(/[^a-z0-9]/g, '');
      };
      
      const normalizedSlug = normalizeString(productSlug);
      const normalizedTitle = normalizeString(productTitle || '');
      
      console.log('Slug:', productSlug, '| Titre normalisé:', normalizedTitle);
      
      // 1. Fallback rapide : og:image (le plus fiable)
      const ogImage = doc.querySelector('meta[property="og:image"]');
      if (ogImage) {
        let imageUrl = ogImage.getAttribute('content');
        if (imageUrl) {
          imageUrl = this.makeAbsoluteUrl(imageUrl, urlObj);
          console.log('✅ Image trouvée via og:image:', imageUrl);
          return imageUrl;
        }
      }

      // 2. Schema.org JSON-LD
      const jsonLdScripts = doc.querySelectorAll('script[type="application/ld+json"]');
      for (const script of jsonLdScripts) {
        try {
          const data = JSON.parse(script.textContent);
          if (data.image) {
            let imageUrl = Array.isArray(data.image) ? data.image[0] : data.image;
            if (typeof imageUrl === 'object' && imageUrl.url) imageUrl = imageUrl.url;
            if (imageUrl) {
              imageUrl = this.makeAbsoluteUrl(imageUrl, urlObj);
              console.log('✅ Image trouvée via JSON-LD:', imageUrl);
              return imageUrl;
            }
          }
        } catch (e) {
          // Ignorer les erreurs de parsing JSON
        }
      }
      
      // 3. Trouver toutes les images
      const allImages = Array.from(doc.querySelectorAll('img'));
      console.log(`🔍 ${allImages.length} images trouvées sur la page`);
      
      let bestImage = null;
      let bestScore = 0;
      let bestImageData = null;
      
      for (const img of allImages) {
        let score = 0;
        
        // Récupérer tous les attributs possibles d'images
        const src = img.getAttribute('src') || '';
        const dataSrc = img.getAttribute('data-src') || '';
        const dataSrcset = img.getAttribute('data-srcset') || '';
        const srcset = img.getAttribute('srcset') || '';
        const dataLazySrc = img.getAttribute('data-lazy-src') || '';
        const dataOriginal = img.getAttribute('data-original') || '';
        
        const alt = (img.getAttribute('alt') || '').toLowerCase();
        const id = (img.getAttribute('id') || '').toLowerCase();
        const className = (img.getAttribute('class') || '').toLowerCase();
        
        // Choisir la meilleure source d'image
        let imageSource = dataSrc || dataLazySrc || dataOriginal || src || dataSrcset.split(',')[0]?.split(' ')[0] || srcset.split(',')[0]?.split(' ')[0] || '';
        imageSource = imageSource.trim();
        
        if (!imageSource) continue;
        
        // Ignorer les images de données (base64, svg inline)
        if (imageSource.startsWith('data:')) continue;
        
        // Ignorer les petites images
        const width = parseInt(img.getAttribute('width') || '0');
        const height = parseInt(img.getAttribute('height') || '0');
        if ((width > 0 && width < 100) || (height > 0 && height < 100)) continue;
        
        // Scoring
        if (className.includes('product') || className.includes('tea') || className.includes('main')) score += 30;
        if (id.includes('product') || id.includes('tea') || id.includes('main')) score += 30;
        
        const normalizedSrc = normalizeString(imageSource);
        if (normalizedSlug && normalizedSrc.includes(normalizedSlug)) score += 50;
        
        const normalizedAlt = normalizeString(alt);
        if (normalizedTitle && normalizedTitle.length > 2 && normalizedAlt.includes(normalizedTitle)) score += 40;
        if (normalizedSlug && normalizedSlug.length > 2 && normalizedAlt.includes(normalizedSlug)) score += 35;
        
        if (img.hasAttribute('itemprop') && img.getAttribute('itemprop') === 'image') score += 40;
        if (className.includes('featured') || className.includes('hero') || className.includes('main-image')) score += 25;
        if (imageSource.includes('product') || imageSource.includes('tea')) score += 20;
        
        // Pénalités
        if (imageSource.includes('logo') || imageSource.includes('icon') || imageSource.includes('avatar') || imageSource.includes('thumb')) score -= 30;
        if (className.includes('thumbnail') && !className.includes('product')) score -= 10;
        
        // Garder la meilleure
        if (score > bestScore) {
          bestScore = score;
          bestImage = img;
          bestImageData = {
            url: imageSource,
            score: score,
            className: className,
            alt: alt
          };
        }
      }
      
      if (bestImage && bestImageData) {
        let imageUrl = this.makeAbsoluteUrl(bestImageData.url, urlObj);
        console.log(`✅ Image trouvée avec scoring (score: ${bestScore}):`, imageUrl);
        console.log('   Détails:', { class: bestImageData.className, alt: bestImageData.alt });
        return imageUrl;
      }
      
      console.warn('❌ Aucune image trouvée pour:', productTitle);
    } catch (e) {
      console.error('❌ Erreur lors de l\'extraction de l\'image:', e);
    }
    
    return null;
  }

  makeAbsoluteUrl(imageUrl, urlObj) {
    if (!imageUrl) return null;
    
    if (imageUrl.startsWith('//')) {
      return 'https:' + imageUrl;
    } else if (imageUrl.startsWith('/')) {
      return urlObj.origin + imageUrl;
    } else if (!imageUrl.startsWith('http')) {
      try {
        return new URL(imageUrl, urlObj.origin).href;
      } catch (e) {
        return imageUrl;
      }
    }
    return imageUrl;
  }

  extractInfusionTime(text, doc) {
    // Patterns pour trouver le temps d'infusion
    const timePatterns = [
      /(\d{1,2})\s*[-–—]\s*(\d{1,2})\s*min(?:ute)?s?/gi,  // 2-3 min, 2-3 minutes
      /(\d{1,2})\s*min(?:ute)?s?/gi,                      // 3 min, 3 minutes
      /steep(?:ing)?[:\s]+(\d{1,2})\s*[-–—]?\s*(\d{1,2})?\s*min/gi,
      /infusion[:\s]+(\d{1,2})\s*[-–—]?\s*(\d{1,2})?\s*min/gi,
      /brewing[:\s]+time[:\s]+(\d{1,2})\s*[-–—]?\s*(\d{1,2})?\s*min/gi,
      /(\d{1,2})\s*[-–—]\s*(\d{1,2})\s*min(?:ute)?s?\s*infusion/gi
    ];
    
    for (const pattern of timePatterns) {
      const match = text.match(pattern);
      if (match) {
        const fullMatch = match[0];
        // Extraire les nombres
        const numbers = fullMatch.match(/\d{1,2}/g);
        if (numbers) {
          if (numbers.length === 2) {
            return `${numbers[0]}-${numbers[1]} min`;
          } else if (numbers.length === 1) {
            return `${numbers[0]} min`;
          }
        }
      }
    }
    
    // Chercher dans des éléments spécifiques
    const timeSelectors = [
      '.infusion-time', '.steeping-time', '.brewing-time', '.time',
      '[data-time]', '[itemprop="time"]', '.duration'
    ];
    
    for (const selector of timeSelectors) {
      const element = doc.querySelector(selector);
      if (element) {
        const timeText = element.textContent || element.getAttribute('data-time');
        const match = timeText.match(/(\d{1,2})\s*[-–—]?\s*(\d{1,2})?\s*min/gi);
        if (match) {
          const numbers = match[0].match(/\d{1,2}/g);
          if (numbers) {
            if (numbers.length === 2) {
              return `${numbers[0]}-${numbers[1]} min`;
            } else if (numbers.length === 1) {
              return `${numbers[0]} min`;
            }
          }
        }
      }
    }
    
    return null;
  }

  // Export data to JSON file
  exportData() {
    try {
      // Ensure teas array exists
      const teas = this.store?.getAllTeas?.() || [];
      const shops = this.store?.getAllShops?.() || [];
      
      const data = {
        teas: teas,
        shops: shops,
        exportDate: new Date().toISOString(),
        version: '1.0'
      };

      const dataStr = JSON.stringify(data, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(dataBlob);
      
      const link = document.createElement('a');
      link.href = url;
      link.download = `sereni-tea-backup-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      alert(`✅ Données exportées avec succès !\n${teas.length} thé(s) sauvegardé(s).`);
    } catch (error) {
      alert(`❌ Erreur lors de l'export :\n${error.message}`);
      console.error('Export error:', error);
    }
  }

  // Import data from JSON file
  importData(file) {
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target.result);
        this.applyImportedData(data, 'fichier local');
      } catch (error) {
        alert(`❌ Erreur lors de l'import :\n${error.message}`);
        console.error('Import error:', error);
      }
    };

    reader.readAsText(file);
    
    // Reset file input
    document.getElementById('import-file').value = '';
  }

  async checkUrlImport() {
    const params = new URLSearchParams(window.location.search);
    const importUrl = params.get('importUrl') || DEFAULT_IMPORT_URL;
    if (!importUrl) return;

    try {
      const data = await this.fetchImportJson(importUrl);
      this.applyImportedData(
        data,
        `URL: ${importUrl}`,
        AUTO_IMPORT_SKIP_CONFIRM && !params.get('importUrl')
      );
    } catch (error) {
      alert(`❌ Erreur lors de l'import depuis l'URL :\n${error.message}\n\nAstuce: fournissez un lien direct vers le fichier .json (téléchargement direct).`);
      console.error('Import URL error:', error);
    }
  }

  async fetchImportJson(importUrl) {
    const tried = new Set();
    const tryFetch = async (url) => {
      if (!url || tried.has(url)) return { json: null, text: '' };
      tried.add(url);
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
      const text = await response.text();
      const trimmed = text.trim();
      if (trimmed.startsWith('{') || trimmed.startsWith('[')) {
        return { json: JSON.parse(trimmed), text };
      }
      return { json: null, text };
    };

    const proxyUrl = (url) => `https://api.allorigins.win/raw?url=${encodeURIComponent(url)}`;
    const attempts = [importUrl, proxyUrl(importUrl)];

    for (const url of attempts) {
      try {
        const result = await tryFetch(url);
        if (result.json) return result.json;
        if (result.text) {
          const doc = new DOMParser().parseFromString(result.text, 'text/html');
          const link = Array.from(doc.querySelectorAll('a[href]'))
            .map(a => a.getAttribute('href'))
            .find(href => href && href.toLowerCase().includes('.json'));
          if (link) {
            const absolute = new URL(link, importUrl).href;
            const direct = await tryFetch(absolute);
            if (direct.json) return direct.json;
            const proxied = await tryFetch(proxyUrl(absolute));
            if (proxied.json) return proxied.json;
          }
        }
      } catch (err) {
        // Try next attempt
      }
    }

    throw new Error('Impossible de récupérer un JSON valide depuis ce lien');
  }

  applyImportedData(data, sourceLabel = 'import', skipConfirm = false) {
    // Validate data structure
    if (!data.teas || !Array.isArray(data.teas)) {
      throw new Error('Format de fichier invalide');
    }

    const currentCount = this.store?.getAllTeas?.().length || 0;
    const confirmMsg = `Voulez-vous importer ${data.teas.length} thé(s) depuis ${sourceLabel} ?\n\n` +
      `⚠️ Attention : Cela va remplacer vos données actuelles (${currentCount} thés).`;

    if (!skipConfirm && !confirm(confirmMsg)) return;

    // Import teas
    this.store.teas = data.teas;
    this.store.saveTeas();

    // Import shops if present
    if (data.shops && Array.isArray(data.shops)) {
      this.store.shops = data.shops;
      this.store.saveShops();
    }

    // Refresh display
    this.renderTeas();
    this.updateTeaCount?.();

    const importedCount = this.store?.getAllTeas?.().length || data.teas.length;
    alert(`✅ Import réussi !\n${importedCount} thés importés.`);
  }

}

// Démarrer l'application quand le DOM est prêt
let app;
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    app = new TeaApp();
  });
} else {
  app = new TeaApp();
}
