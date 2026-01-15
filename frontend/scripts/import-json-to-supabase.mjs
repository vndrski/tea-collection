import fs from 'node:fs/promises';
import path from 'node:path';
import { createClient } from '@supabase/supabase-js';

const [,, jsonPath] = process.argv;

if (!jsonPath) {
  console.error('Usage: node scripts/import-json-to-supabase.mjs /path/to/backup.json');
  process.exit(1);
}

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceRoleKey) {
  console.error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY env vars.');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);

const fileContents = await fs.readFile(path.resolve(jsonPath), 'utf-8');
const data = JSON.parse(fileContents);

const shops = Array.isArray(data.shops) ? data.shops : [];
const teas = Array.isArray(data.teas) ? data.teas : [];

const mappedShops = shops
  .filter((shop) => shop && shop.name)
  .map((shop) => ({
    name: shop.name,
    website: shop.website || null
  }));

const mappedTeas = teas
  .filter((tea) => tea && tea.name)
  .map((tea) => ({
    name: tea.name,
    type: tea.type || null,
    brand: tea.brand || null,
    temperature: tea.temperature || null,
    quantity: tea.quantity || null,
    time: tea.time || null,
    infusions: tea.infusions || null,
    method: tea.method || null,
    description: tea.description || null,
    origin: tea.origin || null,
    url: tea.url || null,
    image_url: tea.imageUrl || tea.image_url || null,
    in_stock: tea.inStock !== undefined ? tea.inStock : tea.in_stock ?? true,
    is_wishlist: tea.isWishlist !== undefined ? tea.isWishlist : tea.is_wishlist ?? false
  }));

if (mappedShops.length) {
  const { error } = await supabase.from('shops').insert(mappedShops);
  if (error) {
    console.error('Error inserting shops:', error.message);
    process.exit(1);
  }
  console.log(`Inserted ${mappedShops.length} shops.`);
}

if (mappedTeas.length) {
  const { error } = await supabase.from('teas').insert(mappedTeas);
  if (error) {
    console.error('Error inserting teas:', error.message);
    process.exit(1);
  }
  console.log(`Inserted ${mappedTeas.length} teas.`);
}

console.log('Import complete.');
