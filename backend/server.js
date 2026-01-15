import express from "express";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

// Base de données en mémoire (pour commencer)
let teas = [
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
    description: "Spring 2025. Lishan. Sweet aroma, fruit and floral taste profile.",
    imageUrl: null
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
    description: "Classic Earl Grey with bergamot",
    imageUrl: null
  }
];

let nextId = 3;

// GET toutes les thés
app.get("/api/teas", (req, res) => {
  const { type, search, showOutOfStock } = req.query;
  
  let filtered = [...teas];
  
  // Filtrer par type
  if (type && type !== "All") {
    filtered = filtered.filter(tea => tea.type === type);
  }
  
  // Recherche
  if (search) {
    const searchLower = search.toLowerCase();
    filtered = filtered.filter(tea => 
      tea.name.toLowerCase().includes(searchLower) ||
      tea.brand.toLowerCase().includes(searchLower)
    );
  }
  
  // Filtrer les out of stock
  if (showOutOfStock !== "true") {
    filtered = filtered.filter(tea => tea.inStock);
  }
  
  res.json(filtered);
});

// GET un thé par ID
app.get("/api/teas/:id", (req, res) => {
  const tea = teas.find(t => t.id === parseInt(req.params.id));
  if (!tea) {
    return res.status(404).json({ error: "Tea not found" });
  }
  res.json(tea);
});

// POST créer un nouveau thé
app.post("/api/teas", (req, res) => {
  const newTea = {
    id: nextId++,
    name: req.body.name || "",
    type: req.body.type || "Green",
    brand: req.body.brand || "",
    temperature: req.body.temperature || "",
    time: req.body.time || "",
    method: req.body.method || "Western",
    quantity: req.body.quantity || "",
    infusions: req.body.infusions || "",
    inStock: req.body.inStock !== undefined ? req.body.inStock : true,
    description: req.body.description || "",
    imageUrl: req.body.imageUrl || null
  };
  
  teas.push(newTea);
  res.status(201).json(newTea);
});

// PUT mettre à jour un thé
app.put("/api/teas/:id", (req, res) => {
  const index = teas.findIndex(t => t.id === parseInt(req.params.id));
  if (index === -1) {
    return res.status(404).json({ error: "Tea not found" });
  }
  
  teas[index] = { ...teas[index], ...req.body };
  res.json(teas[index]);
});

// DELETE supprimer un thé
app.delete("/api/teas/:id", (req, res) => {
  const index = teas.findIndex(t => t.id === parseInt(req.params.id));
  if (index === -1) {
    return res.status(404).json({ error: "Tea not found" });
  }
  
  teas.splice(index, 1);
  res.json({ message: "Tea deleted" });
});

// GET les types de thés disponibles
app.get("/api/tea-types", (req, res) => {
  const types = ["All", "Oolong", "Black", "Green", "White", "Herbal"];
  res.json(types);
});

const PORT = process.env.PORT || 3002;
app.listen(PORT, () => {
  console.log(`Tea Collection API running on http://localhost:${PORT}`);
});
