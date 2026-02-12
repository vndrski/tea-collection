const TEA_KEY = 'serenitea.teas.v1';
const SHOP_KEY = 'serenitea.shops.v1';

const readJson = (key, fallback) => {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    const data = JSON.parse(raw);
    return Array.isArray(data) ? data : fallback;
  } catch {
    return fallback;
  }
};

const writeJson = (key, value) => {
  localStorage.setItem(key, JSON.stringify(value));
};

const buildId = () =>
  `local-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;

export const getLocalTeas = () => readJson(TEA_KEY, []);

export const setLocalTeas = (teas) => {
  writeJson(TEA_KEY, teas);
};

export const upsertLocalTea = (tea) => {
  const list = getLocalTeas();
  const hasId = Boolean(tea.id);
  const id = hasId ? tea.id : buildId();
  const now = new Date().toISOString();
  const next = hasId
    ? list.map((item) => (item.id === id ? { ...item, ...tea } : item))
    : [{ ...tea, id, createdAt: now }, ...list];
  setLocalTeas(next);
  return next.find((item) => item.id === id);
};

export const deleteLocalTea = (id) => {
  const next = getLocalTeas().filter((item) => item.id !== id);
  setLocalTeas(next);
  return next;
};

export const getLocalShops = () => readJson(SHOP_KEY, []);

export const setLocalShops = (shops) => {
  writeJson(SHOP_KEY, shops);
};

export const upsertLocalShop = (shop) => {
  const list = getLocalShops();
  const normalizedName = (shop.name || '').trim().toLowerCase();
  const normalizedWebsite = (shop.website || '').trim().toLowerCase();
  const existing = list.find(
    (item) =>
      item.name?.trim().toLowerCase() === normalizedName &&
      (item.website || '').trim().toLowerCase() === normalizedWebsite
  );
  if (existing) return existing;
  const id = buildId();
  const next = [{ ...shop, id, createdAt: new Date().toISOString() }, ...list];
  setLocalShops(next);
  return next[0];
};

export const seedLocalData = ({ teas = [], shops = [] } = {}) => {
  const currentTeas = getLocalTeas();
  if (!currentTeas.length && teas.length) {
    setLocalTeas(teas);
  }
  const currentShops = getLocalShops();
  if (!currentShops.length && shops.length) {
    setLocalShops(shops);
  }
};
