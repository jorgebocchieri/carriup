import Fastify from 'fastify';
import cors from '@fastify/cors';
import helmet from '@fastify/helmet';
import { Pool } from 'pg';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { z } from 'zod';
import dotenv from 'dotenv';

dotenv.config();

const app = Fastify({ logger: true });
const PORT = process.env.PORT || 3001;
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_NAME || 'carriup',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

pool.on('error', (err) => console.error('Pool error:', err));

// ==================
// IN-MEMORY MOCK DATA
// ==================

const mockProducts = [
  { id: 'leche', name: 'Leche', category: 'Lácteos' },
  { id: 'queso', name: 'Queso', category: 'Lácteos' },
  { id: 'yogur', name: 'Yogur', category: 'Lácteos' },
  { id: 'mantequilla', name: 'Mantequilla', category: 'Lácteos' },
  { id: 'pan_integral', name: 'Pan Integral', category: 'Panadería' },
  { id: 'huevos', name: 'Huevos', category: 'Proteínas' },
  { id: 'jambon', name: 'Jamón', category: 'Proteínas' },
  { id: 'pollo', name: 'Pollo', category: 'Proteínas' },
  { id: 'carne', name: 'Carne', category: 'Proteínas' },
  { id: 'salmon', name: 'Salmón', category: 'Proteínas' },
  { id: 'arroz', name: 'Arroz', category: 'Granos' },
  { id: 'harina', name: 'Harina', category: 'Granos' },
  { id: 'aceite', name: 'Aceite', category: 'Condimentos' },
  { id: 'azucar', name: 'Azúcar', category: 'Condimentos' },
  { id: 'papas', name: 'Papas', category: 'Verduras' },
  { id: 'zanahorias', name: 'Zanahorias', category: 'Verduras' },
  { id: 'tomates', name: 'Tomates', category: 'Verduras' },
  { id: 'lechuga', name: 'Lechuga', category: 'Verduras' },
  { id: 'cebolla', name: 'Cebolla', category: 'Verduras' },
  { id: 'manzanas', name: 'Manzanas', category: 'Frutas' },
  { id: 'platanos', name: 'Plátanos', category: 'Frutas' },
  { id: 'naranjas', name: 'Naranjas', category: 'Frutas' },
  { id: 'fresas', name: 'Fresas', category: 'Frutas' },
  { id: 'uvas', name: 'Uvas', category: 'Frutas' },
  { id: 'cafe', name: 'Café', category: 'Bebidas' },
  { id: 'fideos', name: 'Fideos', category: 'Pasta' },
];

const mockPrices = [
  // Leche varieties
  { product_id: 'leche', brand: 'Colun', variety: 'Entera 1L', price: 1890, supermarket: 'lider' },
  { product_id: 'leche', brand: 'Colun', variety: 'Descremada 1L', price: 1790, supermarket: 'lider' },
  { product_id: 'leche', brand: 'Surlat', variety: 'Entera 1L', price: 1650, supermarket: 'jumbo' },
  { product_id: 'leche', brand: 'Surlat', variety: 'Descremada 1L', price: 1550, supermarket: 'jumbo' },
  { product_id: 'leche', brand: 'Marca Blanca', variety: 'Entera 1L', price: 1490, supermarket: 'santa-isabel' },
  { product_id: 'leche', brand: 'Marca Blanca', variety: 'Deslactosada 1L', price: 2190, supermarket: 'santa-isabel' },
  { product_id: 'leche', brand: 'Colun Premium', variety: 'Entera 1L', price: 2490, supermarket: 'unimarc' },
  { product_id: 'leche', brand: 'Colun Premium', variety: 'Orgánica 1L', price: 3290, supermarket: 'unimarc' },

  // Fideos varieties
  { product_id: 'fideos', brand: 'Lucchetti', variety: 'Tallarines', price: 890, supermarket: 'lider' },
  { product_id: 'fideos', brand: 'Lucchetti', variety: 'Espirales', price: 890, supermarket: 'lider' },
  { product_id: 'fideos', brand: 'Lucchetti', variety: 'Penne', price: 890, supermarket: 'lider' },
  { product_id: 'fideos', brand: 'Barilla', variety: 'Tallarines', price: 1290, supermarket: 'jumbo' },
  { product_id: 'fideos', brand: 'Barilla', variety: 'Espirales', price: 1290, supermarket: 'jumbo' },
  { product_id: 'fideos', brand: 'Barilla', variety: 'Fusilli', price: 1290, supermarket: 'jumbo' },
  { product_id: 'fideos', brand: 'Marca Blanca', variety: 'Tallarines', price: 790, supermarket: 'santa-isabel' },
  { product_id: 'fideos', brand: 'Marca Blanca', variety: 'Penne', price: 790, supermarket: 'santa-isabel' },
  { product_id: 'fideos', brand: 'Banza', variety: 'Garbanzos Tallarines', price: 2290, supermarket: 'unimarc' },

  // Café varieties
  { product_id: 'cafe', brand: 'Nescafé', variety: 'Clásico 100g', price: 2890, supermarket: 'lider' },
  { product_id: 'cafe', brand: 'Nescafé', variety: 'Gold 100g', price: 3490, supermarket: 'lider' },
  { product_id: 'cafe', brand: 'Lavazza', variety: 'Clásico 250g', price: 4290, supermarket: 'jumbo' },
  { product_id: 'cafe', brand: 'Lavazza', variety: 'Crema 250g', price: 4490, supermarket: 'jumbo' },
  { product_id: 'cafe', brand: 'Marcilla', variety: 'Molido 250g', price: 3190, supermarket: 'santa-isabel' },
  { product_id: 'cafe', brand: 'Marcilla', variety: 'Grano 250g', price: 3390, supermarket: 'santa-isabel' },
  { product_id: 'cafe', brand: 'illy', variety: 'Clásico 250g', price: 5890, supermarket: 'unimarc' },
  { product_id: 'cafe', brand: 'illy', variety: 'Intenso 250g', price: 5990, supermarket: 'unimarc' },

  // Pollo varieties
  { product_id: 'pollo', brand: 'Las Tres Pías', variety: 'Pechuga kg', price: 7990, supermarket: 'lider' },
  { product_id: 'pollo', brand: 'Las Tres Pías', variety: 'Muslo kg', price: 5990, supermarket: 'lider' },
  { product_id: 'pollo', brand: 'Agrosuper', variety: 'Pechuga kg', price: 8490, supermarket: 'jumbo' },
  { product_id: 'pollo', brand: 'Agrosuper', variety: 'Entero kg', price: 6490, supermarket: 'jumbo' },
  { product_id: 'pollo', brand: 'Local', variety: 'Pechuga kg', price: 7490, supermarket: 'santa-isabel' },
  { product_id: 'pollo', brand: 'Local', variety: 'Muslo kg', price: 5490, supermarket: 'santa-isabel' },
  { product_id: 'pollo', brand: 'Premium', variety: 'Pechuga Orgánica kg', price: 11990, supermarket: 'unimarc' },
  { product_id: 'pollo', brand: 'Premium', variety: 'Muslo Orgánico kg', price: 8990, supermarket: 'unimarc' },

  // Queso varieties
  { product_id: 'queso', brand: 'Colun', variety: 'Cremoso 350g', price: 3290, supermarket: 'lider' },
  { product_id: 'queso', brand: 'Colun', variety: 'Azul 200g', price: 4890, supermarket: 'lider' },
  { product_id: 'queso', brand: 'Surlat', variety: 'Fundido 450g', price: 3590, supermarket: 'jumbo' },
  { product_id: 'queso', brand: 'Surlat', variety: 'Pradera 400g', price: 4190, supermarket: 'jumbo' },
  { product_id: 'queso', brand: 'Marca Blanca', variety: 'Dambo 350g', price: 2890, supermarket: 'santa-isabel' },
  { product_id: 'queso', brand: 'Marca Blanca', variety: 'Laminado 200g', price: 1990, supermarket: 'santa-isabel' },
  { product_id: 'queso', brand: 'Parmesano', variety: 'Rallado 200g', price: 5990, supermarket: 'unimarc' },
  { product_id: 'queso', brand: 'Parmesano', variety: 'Bloque 250g', price: 6490, supermarket: 'unimarc' },
];

// ==================
// PLUGINS & MIDDLEWARE
// ==================

await app.register(cors, { origin: true });
await app.register(helmet);

// JWT Auth middleware
const verifyJWT = async (req, reply) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    if (!token) throw new Error('No token');
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
  } catch (err) {
    return reply.status(401).send({ error: 'Unauthorized' });
  }
};

// ==================
// VALIDATION SCHEMAS
// ==================

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

const signupSchema = z.object({
  fullName: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(8),
});

// ==================
// AUTH ENDPOINTS
// ==================

app.post('/api/auth/login', async (req, reply) => {
  try {
    const { email, password } = loginSchema.parse(req.body);

    const result = await pool.query('SELECT id, name, email, password_hash FROM users WHERE email = $1', [email]);
    const user = result.rows[0];

    if (!user || !(await bcrypt.compare(password, user.password_hash))) {
      return reply.status(401).send({ success: false, error: 'Email o contraseña incorrectos' });
    }

    const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '24h' });

    reply.send({
      success: true,
      user: { id: user.id, email: user.email, name: user.name },
      token,
    });
  } catch (err) {
    console.error(err);
    reply.status(400).send({ success: false, error: 'Error en login' });
  }
});

app.post('/api/auth/signup', async (req, reply) => {
  try {
    const { fullName, email, password } = signupSchema.parse(req.body);

    const existing = await pool.query('SELECT id FROM users WHERE email = $1', [email]);
    if (existing.rows.length > 0) {
      return reply.status(409).send({ success: false, error: 'Email ya registrado' });
    }

    const password_hash = await bcrypt.hash(password, 10);
    const result = await pool.query(
      'INSERT INTO users (name, email, password_hash) VALUES ($1, $2, $3) RETURNING id, name, email',
      [fullName, email, password_hash]
    );

    const user = result.rows[0];
    reply.send({
      success: true,
      user: { id: user.id, email: user.email, name: user.name },
      message: 'Usuario registrado exitosamente',
    });
  } catch (err) {
    console.error(err);
    reply.status(400).send({ success: false, error: 'Error en registro' });
  }
});

// ==================
// PRODUCT ENDPOINTS
// ==================

app.get('/api/products/search', async (req, reply) => {
  try {
    const { query } = req.query;
    if (!query) return reply.status(400).send({ error: 'query requerido' });

    const lowerQuery = query.toLowerCase();
    const results = mockProducts.filter(
      (p) => p.name.toLowerCase().includes(lowerQuery) || p.id.toLowerCase().includes(lowerQuery)
    );

    reply.send({ success: true, products: results });
  } catch (err) {
    console.error(err);
    reply.status(500).send({ error: 'Error en búsqueda' });
  }
});

app.get('/api/products/details', async (req, reply) => {
  try {
    const { id } = req.query;
    if (!id) return reply.status(400).send({ error: 'id requerido' });

    const product = mockProducts.find((p) => p.id === id.toLowerCase());

    if (!product) {
      return reply.status(404).send({ error: 'Producto no encontrado' });
    }

    const varieties = mockPrices.filter((p) => p.product_id === id.toLowerCase());
    const brands = [...new Set(varieties.map((v) => v.brand))];

    reply.send({
      success: true,
      product,
      brands,
      varieties,
    });
  } catch (err) {
    console.error(err);
    reply.status(500).send({ error: 'Error obteniendo detalles' });
  }
});

// ==================
// PRICE ENDPOINTS
// ==================

app.get('/api/prices/compare', async (req, reply) => {
  try {
    const { products } = req.query;
    if (!products) return reply.status(400).send({ error: 'products requerido' });

    const productIds = products.split(',').map((p) => p.trim().toLowerCase());

    const pricesBySuper = {};
    const supermarkets = ['lider', 'jumbo', 'santa-isabel', 'unimarc'];

    supermarkets.forEach((sm) => {
      pricesBySuper[sm] = { supermarket: sm, items: [], total: 0 };
    });

    // Find prices for each product
    productIds.forEach((productId) => {
      const productVarieties = mockPrices.filter((p) => p.product_id === productId);

      supermarkets.forEach((sm) => {
        // Get cheapest variety for this product in this supermarket
        const varietiesInSuper = productVarieties.filter((p) => p.supermarket === sm);
        if (varietiesInSuper.length > 0) {
          const cheapest = varietiesInSuper.reduce((min, v) => (v.price < min.price ? v : min));
          pricesBySuper[sm].items.push({
            name: productId,
            price: cheapest.price,
            brand: cheapest.brand,
            variety: cheapest.variety,
          });
          pricesBySuper[sm].total += cheapest.price;
        }
      });
    });

    const results = Object.values(pricesBySuper);
    const minTotal = Math.min(...results.map((r) => r.total || Infinity));
    const maxTotal = Math.max(...results.map((r) => r.total || 0));
    const bestSupermarket = results.find((r) => r.total === minTotal);

    reply.send({
      success: true,
      products: productIds,
      productsFound: productIds.length,
      results,
      bestSupermarket: bestSupermarket.supermarket,
      minTotal,
      maxTotal,
      savings: maxTotal - minTotal,
    });
  } catch (err) {
    console.error(err);
    reply.status(500).send({ error: 'Error comparando precios' });
  }
});

app.get('/api/prices/history', { onRequest: verifyJWT }, async (req, reply) => {
  try {
    const { product } = req.query;
    if (!product) return reply.status(400).send({ error: 'product requerido' });

    const result = await pool.query(
      'SELECT date, price, supermarket, brand FROM prices WHERE product_id = $1 ORDER BY date DESC LIMIT 30',
      [product]
    );

    reply.send({
      success: true,
      product,
      history: result.rows,
    });
  } catch (err) {
    console.error(err);
    reply.status(500).send({ error: 'Error obteniendo historial' });
  }
});

// ==================
// LISTS ENDPOINTS (AUTH REQUIRED)
// ==================

app.post('/api/lists', { onRequest: verifyJWT }, async (req, reply) => {
  try {
    const { name, items } = req.body;
    if (!name) return reply.status(400).send({ error: 'name requerido' });

    const result = await pool.query(
      'INSERT INTO lists (user_id, name, items) VALUES ($1, $2, $3) RETURNING id, name, items, created_at',
      [req.user.userId, name, JSON.stringify(items || [])]
    );

    reply.send({ success: true, list: result.rows[0] });
  } catch (err) {
    console.error(err);
    reply.status(500).send({ error: 'Error creando lista' });
  }
});

app.get('/api/lists', { onRequest: verifyJWT }, async (req, reply) => {
  try {
    const result = await pool.query('SELECT id, name, items, created_at FROM lists WHERE user_id = $1 ORDER BY created_at DESC', [
      req.user.userId,
    ]);

    reply.send({
      success: true,
      lists: result.rows.map((l) => ({
        ...l,
        items: typeof l.items === 'string' ? JSON.parse(l.items) : l.items,
      })),
    });
  } catch (err) {
    console.error(err);
    reply.status(500).send({ error: 'Error obteniendo listas' });
  }
});

// ==================
// HEALTH ENDPOINT
// ==================

app.get('/api/health', async (req, reply) => {
  try {
    const dbResult = await pool.query('SELECT 1');
    reply.send({
      success: true,
      status: 'ok',
      message: 'Carriup API is running',
      timestamp: new Date().toISOString(),
      database: dbResult.rows.length > 0 ? 'connected' : 'error',
    });
  } catch (err) {
    reply.status(500).send({
      success: false,
      status: 'error',
      message: 'Database connection failed',
    });
  }
});

// ==================
// START SERVER
// ==================

try {
  await app.listen({ port: PORT, host: '0.0.0.0' });
  console.log(`
╔════════════════════════════════════════════════════╗
║                                                    ║
║  ✅ Carriup Backend (Fastify) is running          ║
║                                                    ║
║  Port: ${PORT}                                        ║
║  URL: http://localhost:${PORT}                    ║
║                                                    ║
║  Endpoints:                                        ║
║  POST   /api/auth/login                            ║
║  POST   /api/auth/signup                           ║
║  GET    /api/products/search?query=                ║
║  GET    /api/products/details?id=                  ║
║  GET    /api/prices/compare?products=              ║
║  GET    /api/prices/history?product=  (auth)      ║
║  POST   /api/lists                     (auth)      ║
║  GET    /api/lists                     (auth)      ║
║                                                    ║
╚════════════════════════════════════════════════════╝
  `);
} catch (err) {
  console.error(err);
  process.exit(1);
}
