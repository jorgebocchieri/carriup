import Fastify from 'fastify';
import cors from '@fastify/cors';
import helmet from '@fastify/helmet';
import { Pool } from 'pg';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { z } from 'zod';
import dotenv from 'dotenv';
import Anthropic from '@anthropic-ai/sdk';

dotenv.config();

const app = Fastify({ logger: true });
const PORT = process.env.PORT || 3001;
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';
const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const pool = new Pool(
  process.env.DATABASE_URL
    ? {
        connectionString: process.env.DATABASE_URL,
        ssl: { rejectUnauthorized: false },
        max: 20,
        idleTimeoutMillis: 30000,
        connectionTimeoutMillis: 5000,
      }
    : {
        host: process.env.DB_HOST || 'localhost',
        port: process.env.DB_PORT || 5432,
        database: process.env.DB_NAME || 'carriup',
        user: process.env.DB_USER || 'postgres',
        password: process.env.DB_PASSWORD || 'postgres',
        max: 20,
        idleTimeoutMillis: 30000,
        connectionTimeoutMillis: 2000,
      }
);

pool.on('error', (err) => console.error('Pool error:', err));


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

    const result = await pool.query(
      `SELECT product_id AS id, name, category
       FROM products
       WHERE LOWER(name) LIKE $1 OR product_id LIKE $1
       LIMIT 10`,
      [`%${query.toLowerCase()}%`]
    );

    reply.send({ success: true, products: result.rows });
  } catch (err) {
    console.error(err);
    reply.status(500).send({ error: 'Error en búsqueda' });
  }
});

app.get('/api/products/details', async (req, reply) => {
  try {
    const { id } = req.query;
    if (!id) return reply.status(400).send({ error: 'id requerido' });

    const productResult = await pool.query(
      'SELECT product_id AS id, name, category FROM products WHERE product_id = $1',
      [id.toLowerCase()]
    );

    if (productResult.rows.length === 0) {
      return reply.status(404).send({ error: 'Producto no encontrado' });
    }

    const varietiesResult = await pool.query(
      'SELECT product_id, brand, variety, price, supermarket FROM prices WHERE product_id = $1 ORDER BY price ASC',
      [id.toLowerCase()]
    );

    const brands = [...new Set(varietiesResult.rows.map((v) => v.brand))];

    reply.send({
      success: true,
      product: productResult.rows[0],
      brands,
      varieties: varietiesResult.rows,
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
    const supermarkets = ['lider', 'jumbo', 'santa-isabel', 'unimarc'];

    // Get cheapest price per product per supermarket in one query
    const result = await pool.query(
      `SELECT DISTINCT ON (product_id, supermarket)
         product_id, supermarket, price, brand, variety
       FROM prices
       WHERE product_id = ANY($1)
       ORDER BY product_id, supermarket, price ASC`,
      [productIds]
    );

    const pricesBySuper = {};
    supermarkets.forEach((sm) => {
      pricesBySuper[sm] = { supermarket: sm, items: [], total: 0 };
    });

    result.rows.forEach((row) => {
      if (pricesBySuper[row.supermarket]) {
        pricesBySuper[row.supermarket].items.push({
          name: row.product_id,
          price: row.price,
          brand: row.brand,
          variety: row.variety,
        });
        pricesBySuper[row.supermarket].total += row.price;
      }
    });

    const results = Object.values(pricesBySuper);
    const withItems = results.filter((r) => r.total > 0);
    const minTotal = withItems.length ? Math.min(...withItems.map((r) => r.total)) : 0;
    const maxTotal = withItems.length ? Math.max(...withItems.map((r) => r.total)) : 0;
    const bestSupermarket = results.find((r) => r.total === minTotal && minTotal > 0);

    reply.send({
      success: true,
      products: productIds,
      productsFound: productIds.length,
      results,
      bestSupermarket: bestSupermarket?.supermarket || null,
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
// AI ENDPOINT
// ==================

app.post('/api/ai/generate-list', async (req, reply) => {
  try {
    const { text } = req.body;
    if (!text) return reply.status(400).send({ error: 'text requerido' });

    const productsResult = await pool.query(
      'SELECT product_id, name, category FROM products ORDER BY name'
    );

    // Usar Claude si hay API key, sino usar modo demo por palabras clave
    if (process.env.ANTHROPIC_API_KEY) {
      const catalog = productsResult.rows
        .map(p => `${p.product_id}: ${p.name} (${p.category})`)
        .join('\n');

      const message = await anthropic.messages.create({
        model: 'claude-sonnet-4-6',
        max_tokens: 512,
        system: `Eres un asistente de compras para supermercados chilenos.
Tu tarea es seleccionar productos de un catálogo según lo que pide el usuario.
Responde SOLO con un JSON válido: {"products": ["id1", "id2", ...], "explanation": "texto breve"}
Usa solo los product_id exactos del catálogo. Máximo 10 productos.`,
        messages: [
          {
            role: 'user',
            content: `Catálogo disponible:\n${catalog}\n\nEl usuario necesita: "${text}"\n\nSelecciona los productos más relevantes.`,
          },
        ],
      });

      const raw = message.content[0].text.trim();
      const jsonMatch = raw.match(/\{[\s\S]*\}/);
      if (!jsonMatch) throw new Error('Respuesta inválida de Claude');
      const parsed = JSON.parse(jsonMatch[0]);
      const validIds = productsResult.rows.map(p => p.product_id);
      const validProducts = (parsed.products || []).filter(id => validIds.includes(id));
      const productDetails = productsResult.rows
        .filter(p => validProducts.includes(p.product_id))
        .map(p => ({ id: p.product_id, name: p.name, category: p.category }));

      return reply.send({
        success: true,
        products: productDetails,
        explanation: parsed.explanation || '',
        mode: 'ai',
      });
    }

    // Modo demo: matching por palabras clave
    const lower = text.toLowerCase();
    const keywords = {
      desayuno: ['leche', 'pan_integral', 'huevos', 'mantequilla', 'cafe', 'yogur'],
      almuerzo: ['arroz', 'pollo', 'tomates', 'lechuga', 'cebolla', 'aceite'],
      cena: ['fideos', 'carne', 'tomates', 'cebolla', 'aceite'],
      vegano: ['arroz', 'fideos', 'tomates', 'lechuga', 'zanahorias', 'manzanas', 'platanos', 'aceite', 'azucar', 'cebolla'],
      vegetariano: ['huevos', 'queso', 'yogur', 'tomates', 'lechuga', 'zanahorias', 'arroz', 'fideos'],
      semana: ['leche', 'huevos', 'pan_integral', 'arroz', 'fideos', 'pollo', 'tomates', 'cebolla', 'aceite', 'azucar'],
      pasta: ['fideos', 'tomates', 'cebolla', 'aceite', 'queso'],
      ensalada: ['lechuga', 'tomates', 'zanahorias', 'cebolla', 'aceite'],
      frutas: ['manzanas', 'platanos', 'naranjas', 'fresas', 'uvas'],
      proteina: ['pollo', 'carne', 'salmon', 'huevos', 'queso'],
    };

    let matchedIds = new Set();
    for (const [keyword, ids] of Object.entries(keywords)) {
      if (lower.includes(keyword)) ids.forEach(id => matchedIds.add(id));
    }

    // Si no matcheó nada, buscar por palabras individuales
    if (matchedIds.size === 0) {
      productsResult.rows.forEach(p => {
        if (lower.includes(p.name.toLowerCase()) || lower.includes(p.product_id)) {
          matchedIds.add(p.product_id);
        }
      });
    }

    const productDetails = productsResult.rows
      .filter(p => matchedIds.has(p.product_id))
      .map(p => ({ id: p.product_id, name: p.name, category: p.category }));

    reply.send({
      success: true,
      products: productDetails,
      explanation: '(Modo demo — agrega ANTHROPIC_API_KEY para IA real)',
      mode: 'demo',
    });
  } catch (err) {
    console.error('AI error:', err);
    reply.status(500).send({ error: 'Error generando lista' });
  }
});

// ==================
// HEALTH ENDPOINT
// ==================

app.get('/api/health', async (req, reply) => {
  let dbStatus = 'disconnected';
  try {
    await pool.query('SELECT 1');
    dbStatus = 'connected';
  } catch (_) {
    dbStatus = 'disconnected';
  }
  reply.send({
    success: true,
    status: 'ok',
    message: 'Carriup API is running',
    timestamp: new Date().toISOString(),
    database: dbStatus,
  });
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
