import http from 'http';
import url from 'url';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = 3001;
const DB_FILE = path.join(__dirname, 'database.json');

function getDatabase() {
  try {
    if (fs.existsSync(DB_FILE)) {
      const data = fs.readFileSync(DB_FILE, 'utf8');
      return JSON.parse(data);
    }
  } catch (error) {
    console.error('Error reading database:', error);
  }
  return getDefaultDatabase();
}

function saveDatabase(data) {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf8');
  } catch (error) {
    console.error('Error saving database:', error);
  }
}

function getDefaultDatabase() {
  return {
    users: [
      { id: '1', email: 'test@example.com', password: 'test123456', name: 'Test User' }
    ],
    products: [
      { id: 'leche', name: 'Leche', category: 'Lácteos' },
      { id: 'pan_integral', name: 'Pan Integral', category: 'Panadería' },
      { id: 'huevos', name: 'Huevos', category: 'Proteínas' },
      { id: 'arroz', name: 'Arroz', category: 'Granos' },
      { id: 'aceite', name: 'Aceite', category: 'Condimentos' },
      { id: 'cafe', name: 'Café', category: 'Bebidas' },
      { id: 'azucar', name: 'Azúcar', category: 'Condimentos' },
      { id: 'harina', name: 'Harina', category: 'Granos' },
      { id: 'queso', name: 'Queso', category: 'Lácteos' },
      { id: 'yogur', name: 'Yogur', category: 'Lácteos' },
      { id: 'mantequilla', name: 'Mantequilla', category: 'Lácteos' },
      { id: 'jambon', name: 'Jamón', category: 'Proteínas' },
      { id: 'pollo', name: 'Pechuga de Pollo', category: 'Proteínas' },
      { id: 'carne', name: 'Carne Molida', category: 'Proteínas' },
      { id: 'salmon', name: 'Salmón', category: 'Proteínas' },
      { id: 'papas', name: 'Papas', category: 'Verduras' },
      { id: 'zanahorias', name: 'Zanahorias', category: 'Verduras' },
      { id: 'tomates', name: 'Tomates', category: 'Verduras' },
      { id: 'lechuga', name: 'Lechuga', category: 'Verduras' },
      { id: 'cebolla', name: 'Cebolla', category: 'Verduras' },
      { id: 'manzanas', name: 'Manzanas', category: 'Frutas' },
      { id: 'platanos', name: 'Plátanos', category: 'Frutas' },
      { id: 'naranjas', name: 'Naranjas', category: 'Frutas' },
      { id: 'fresas', name: 'Fresas', category: 'Frutas' },
      { id: 'uvas', name: 'Uvas', category: 'Frutas' }
    ],
    prices: {
      'leche': [
        { supermarket: 'lider', price: 1290, brand: 'Colun', date: new Date().toISOString() },
        { supermarket: 'jumbo', price: 1320, brand: 'Surlat', date: new Date().toISOString() },
        { supermarket: 'santa-isabel', price: 1250, brand: 'Marca Blanca', date: new Date().toISOString() },
        { supermarket: 'unimarc', price: 1350, brand: 'Colun Premium', date: new Date().toISOString() }
      ],
      'pan_integral': [
        { supermarket: 'lider', price: 2490, brand: 'Bimbo', date: new Date().toISOString() },
        { supermarket: 'jumbo', price: 2290, brand: 'Artesanal', date: new Date().toISOString() },
        { supermarket: 'santa-isabel', price: 1990, brand: 'Marca Blanca', date: new Date().toISOString() },
        { supermarket: 'unimarc', price: 2650, brand: 'Premium', date: new Date().toISOString() }
      ],
      'huevos': [
        { supermarket: 'lider', price: 3990, brand: 'Orgánicos', date: new Date().toISOString() },
        { supermarket: 'jumbo', price: 3490, brand: 'Granja', date: new Date().toISOString() },
        { supermarket: 'santa-isabel', price: 2990, brand: 'Marca Blanca', date: new Date().toISOString() },
        { supermarket: 'unimarc', price: 4290, brand: 'Premium', date: new Date().toISOString() }
      ],
      'arroz': [
        { supermarket: 'lider', price: 1590, brand: 'Maravilla', date: new Date().toISOString() },
        { supermarket: 'jumbo', price: 1490, brand: 'Continente', date: new Date().toISOString() },
        { supermarket: 'santa-isabel', price: 1290, brand: 'Marca Blanca', date: new Date().toISOString() },
        { supermarket: 'unimarc', price: 1790, brand: 'Gourmet', date: new Date().toISOString() }
      ],
      'aceite': [
        { supermarket: 'lider', price: 4290, brand: 'Oliva Extra', date: new Date().toISOString() },
        { supermarket: 'jumbo', price: 4090, brand: 'Girasol', date: new Date().toISOString() },
        { supermarket: 'santa-isabel', price: 3490, brand: 'Marca Blanca', date: new Date().toISOString() },
        { supermarket: 'unimarc', price: 4890, brand: 'Premium', date: new Date().toISOString() }
      ],
      'cafe': [
        { supermarket: 'lider', price: 3990, brand: 'Nescafé', date: new Date().toISOString() },
        { supermarket: 'jumbo', price: 4290, brand: 'Illy', date: new Date().toISOString() },
        { supermarket: 'santa-isabel', price: 2990, brand: 'Marca Blanca', date: new Date().toISOString() },
        { supermarket: 'unimarc', price: 4590, brand: 'Lavazza', date: new Date().toISOString() }
      ],
      'azucar': [
        { supermarket: 'lider', price: 890, brand: 'Iansa', date: new Date().toISOString() },
        { supermarket: 'jumbo', price: 920, brand: 'Iansa Premium', date: new Date().toISOString() },
        { supermarket: 'santa-isabel', price: 799, brand: 'Marca Blanca', date: new Date().toISOString() },
        { supermarket: 'unimarc', price: 950, brand: 'Iansa Orgánica', date: new Date().toISOString() }
      ],
      'harina': [
        { supermarket: 'lider', price: 1290, brand: 'Selecta', date: new Date().toISOString() },
        { supermarket: 'jumbo', price: 1390, brand: 'Purísima', date: new Date().toISOString() },
        { supermarket: 'santa-isabel', price: 1090, brand: 'Marca Blanca', date: new Date().toISOString() },
        { supermarket: 'unimarc', price: 1450, brand: 'Selecta Premium', date: new Date().toISOString() }
      ],
      'queso': [
        { supermarket: 'lider', price: 3990, brand: 'Colun', date: new Date().toISOString() },
        { supermarket: 'jumbo', price: 4290, brand: 'Loncoleche', date: new Date().toISOString() },
        { supermarket: 'santa-isabel', price: 3490, brand: 'Marca Blanca', date: new Date().toISOString() },
        { supermarket: 'unimarc', price: 4590, brand: 'Colun Premium', date: new Date().toISOString() }
      ],
      'yogur': [
        { supermarket: 'lider', price: 1990, brand: 'Colun', date: new Date().toISOString() },
        { supermarket: 'jumbo', price: 2190, brand: 'Yoplait', date: new Date().toISOString() },
        { supermarket: 'santa-isabel', price: 1690, brand: 'Marca Blanca', date: new Date().toISOString() },
        { supermarket: 'unimarc', price: 2290, brand: 'Activia', date: new Date().toISOString() }
      ],
      'mantequilla': [
        { supermarket: 'lider', price: 2490, brand: 'Colun', date: new Date().toISOString() },
        { supermarket: 'jumbo', price: 2690, brand: 'Loncoleche', date: new Date().toISOString() },
        { supermarket: 'santa-isabel', price: 2190, brand: 'Marca Blanca', date: new Date().toISOString() },
        { supermarket: 'unimarc', price: 2890, brand: 'Colun Premium', date: new Date().toISOString() }
      ],
      'jambon': [
        { supermarket: 'lider', price: 2890, brand: 'Cicatriz', date: new Date().toISOString() },
        { supermarket: 'jumbo', price: 3190, brand: 'España', date: new Date().toISOString() },
        { supermarket: 'santa-isabel', price: 2490, brand: 'Marca Blanca', date: new Date().toISOString() },
        { supermarket: 'unimarc', price: 3490, brand: 'Premium', date: new Date().toISOString() }
      ],
      'pollo': [
        { supermarket: 'lider', price: 4990, brand: 'Crianza Feliz', date: new Date().toISOString() },
        { supermarket: 'jumbo', price: 5290, brand: 'Patagonia', date: new Date().toISOString() },
        { supermarket: 'santa-isabel', price: 4490, brand: 'Marca Blanca', date: new Date().toISOString() },
        { supermarket: 'unimarc', price: 5690, brand: 'Premium', date: new Date().toISOString() }
      ],
      'carne': [
        { supermarket: 'lider', price: 6990, brand: 'Angus', date: new Date().toISOString() },
        { supermarket: 'jumbo', price: 7290, brand: 'Wagyu', date: new Date().toISOString() },
        { supermarket: 'santa-isabel', price: 5990, brand: 'Marca Blanca', date: new Date().toISOString() },
        { supermarket: 'unimarc', price: 7690, brand: 'Premium', date: new Date().toISOString() }
      ],
      'salmon': [
        { supermarket: 'lider', price: 8990, brand: 'Norwegian', date: new Date().toISOString() },
        { supermarket: 'jumbo', price: 9490, brand: 'Frío Austral', date: new Date().toISOString() },
        { supermarket: 'santa-isabel', price: 7990, brand: 'Marca Blanca', date: new Date().toISOString() },
        { supermarket: 'unimarc', price: 10290, brand: 'Premium', date: new Date().toISOString() }
      ],
      'papas': [
        { supermarket: 'lider', price: 1290, brand: 'Valdivia', date: new Date().toISOString() },
        { supermarket: 'jumbo', price: 1390, brand: 'Maule', date: new Date().toISOString() },
        { supermarket: 'santa-isabel', price: 990, brand: 'Marca Blanca', date: new Date().toISOString() },
        { supermarket: 'unimarc', price: 1490, brand: 'Premium', date: new Date().toISOString() }
      ],
      'zanahorias': [
        { supermarket: 'lider', price: 890, brand: 'Valle Central', date: new Date().toISOString() },
        { supermarket: 'jumbo', price: 990, brand: 'Maule', date: new Date().toISOString() },
        { supermarket: 'santa-isabel', price: 690, brand: 'Marca Blanca', date: new Date().toISOString() },
        { supermarket: 'unimarc', price: 1090, brand: 'Premium', date: new Date().toISOString() }
      ],
      'tomates': [
        { supermarket: 'lider', price: 1590, brand: 'Valle Central', date: new Date().toISOString() },
        { supermarket: 'jumbo', price: 1790, brand: 'Organicópolis', date: new Date().toISOString() },
        { supermarket: 'santa-isabel', price: 1290, brand: 'Marca Blanca', date: new Date().toISOString() },
        { supermarket: 'unimarc', price: 1990, brand: 'Premium Orgánico', date: new Date().toISOString() }
      ],
      'lechuga': [
        { supermarket: 'lider', price: 1290, brand: 'Valle Central', date: new Date().toISOString() },
        { supermarket: 'jumbo', price: 1490, brand: 'Hidropónica', date: new Date().toISOString() },
        { supermarket: 'santa-isabel', price: 990, brand: 'Marca Blanca', date: new Date().toISOString() },
        { supermarket: 'unimarc', price: 1690, brand: 'Premium Orgánica', date: new Date().toISOString() }
      ],
      'cebolla': [
        { supermarket: 'lider', price: 690, brand: 'Valle Central', date: new Date().toISOString() },
        { supermarket: 'jumbo', price: 790, brand: 'Acopiadora', date: new Date().toISOString() },
        { supermarket: 'santa-isabel', price: 490, brand: 'Marca Blanca', date: new Date().toISOString() },
        { supermarket: 'unimarc', price: 890, brand: 'Premium', date: new Date().toISOString() }
      ],
      'manzanas': [
        { supermarket: 'lider', price: 1890, brand: 'Fuji', date: new Date().toISOString() },
        { supermarket: 'jumbo', price: 2090, brand: 'Gala Importada', date: new Date().toISOString() },
        { supermarket: 'santa-isabel', price: 1490, brand: 'Granny Smith', date: new Date().toISOString() },
        { supermarket: 'unimarc', price: 2290, brand: 'Pink Lady Premium', date: new Date().toISOString() }
      ],
      'platanos': [
        { supermarket: 'lider', price: 890, brand: 'Ecuador', date: new Date().toISOString() },
        { supermarket: 'jumbo', price: 1090, brand: 'Cavendish', date: new Date().toISOString() },
        { supermarket: 'santa-isabel', price: 690, brand: 'Local', date: new Date().toISOString() },
        { supermarket: 'unimarc', price: 1190, brand: 'Premium Importado', date: new Date().toISOString() }
      ],
      'naranjas': [
        { supermarket: 'lider', price: 1490, brand: 'Valencia', date: new Date().toISOString() },
        { supermarket: 'jumbo', price: 1690, brand: 'Navel Importada', date: new Date().toISOString() },
        { supermarket: 'santa-isabel', price: 1190, brand: 'Local', date: new Date().toISOString() },
        { supermarket: 'unimarc', price: 1890, brand: 'Premium', date: new Date().toISOString() }
      ],
      'fresas': [
        { supermarket: 'lider', price: 2490, brand: 'Orgánicas', date: new Date().toISOString() },
        { supermarket: 'jumbo', price: 2790, brand: 'Importadas', date: new Date().toISOString() },
        { supermarket: 'santa-isabel', price: 1990, brand: 'Local', date: new Date().toISOString() },
        { supermarket: 'unimarc', price: 3090, brand: 'Premium Orgánicas', date: new Date().toISOString() }
      ],
      'uvas': [
        { supermarket: 'lider', price: 3490, brand: 'Italia', date: new Date().toISOString() },
        { supermarket: 'jumbo', price: 3790, brand: 'Negra Importada', date: new Date().toISOString() },
        { supermarket: 'santa-isabel', price: 2990, brand: 'Local', date: new Date().toISOString() },
        { supermarket: 'unimarc', price: 4190, brand: 'Premium Importadas', date: new Date().toISOString() }
      ]
    },
    searches: []
  };
}

function parseBody(req, callback) {
  let body = '';
  req.on('data', chunk => {
    body += chunk.toString();
  });
  req.on('end', () => {
    try {
      callback(body ? JSON.parse(body) : {});
    } catch (error) {
      callback({});
    }
  });
}

function sendJSON(res, statusCode, data) {
  res.writeHead(statusCode, { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' });
  res.end(JSON.stringify(data));
}

function sendError(res, statusCode, message) {
  sendJSON(res, statusCode, { success: false, error: message });
}

function sendSuccess(res, data = {}) {
  sendJSON(res, 200, { success: true, ...data });
}

function handleLogin(req, res, body) {
  const { email, password } = body;

  if (!email || !password) {
    return sendError(res, 400, 'Email y contraseña requeridos');
  }

  const db = getDatabase();
  const user = db.users.find(u => u.email === email && u.password === password);

  if (!user) {
    return sendError(res, 401, 'Email o contraseña incorrectos');
  }

  const token = Buffer.from(`${user.id}:${Date.now()}`).toString('base64');

  sendSuccess(res, {
    user: { id: user.id, email: user.email, name: user.name },
    token: token
  });
}

function handleSignup(req, res, body) {
  const { fullName, email, password } = body;

  if (!fullName || !email || !password) {
    return sendError(res, 400, 'Nombre, email y contraseña requeridos');
  }

  if (password.length < 8) {
    return sendError(res, 400, 'Contraseña debe tener al menos 8 caracteres');
  }

  const db = getDatabase();
  const existingUser = db.users.find(u => u.email === email);

  if (existingUser) {
    return sendError(res, 409, 'Email ya registrado');
  }

  const newUser = {
    id: `user_${Date.now()}`,
    email: email,
    password: password,
    name: fullName
  };

  db.users.push(newUser);
  saveDatabase(db);

  sendSuccess(res, {
    user: { id: newUser.id, email: newUser.email, name: newUser.name },
    message: 'Usuario registrado exitosamente'
  });
}

function handleComparePrices(req, res, queryParams) {
  const productsParam = queryParams.products || '';
  const productNames = productsParam.split(',').map(p => p.trim().toLowerCase());

  if (productNames.length === 0 || !productNames[0]) {
    return sendError(res, 400, 'Parámetro products requerido');
  }

  const db = getDatabase();

  const results = {};
  const supermarkets = ['lider', 'jumbo', 'santa-isabel', 'unimarc'];

  supermarkets.forEach(supermarket => {
    results[supermarket] = {
      supermarket: supermarket,
      items: [],
      total: 0
    };
  });

  let productsFound = 0;

  productNames.forEach(productName => {
    const productKey = Object.keys(db.prices).find(key =>
      key.toLowerCase().includes(productName) || productName.includes(key.toLowerCase())
    );

    if (productKey && db.prices[productKey]) {
      productsFound++;
      db.prices[productKey].forEach(priceData => {
        results[priceData.supermarket].items.push({
          name: productName,
          price: priceData.price,
          brand: priceData.brand
        });
        results[priceData.supermarket].total += priceData.price;
      });
    } else {
      supermarkets.forEach(supermarket => {
        const randomPrice = Math.floor(Math.random() * 5000) + 1000;
        results[supermarket].items.push({
          name: productName,
          price: randomPrice,
          brand: 'Disponible'
        });
        results[supermarket].total += randomPrice;
      });
      productsFound++;
    }
  });

  const resultsArray = Object.values(results);
  const minTotal = Math.min(...resultsArray.map(r => r.total));
  const maxTotal = Math.max(...resultsArray.map(r => r.total));
  const bestSupermarket = resultsArray.find(r => r.total === minTotal);
  const savings = maxTotal - minTotal;

  const db2 = getDatabase();
  db2.searches.push({
    id: `search_${Date.now()}`,
    products: productNames,
    results: resultsArray,
    bestSupermarket: bestSupermarket.supermarket,
    savings: savings,
    date: new Date().toISOString()
  });
  saveDatabase(db2);

  sendSuccess(res, {
    products: productNames,
    productsFound: productsFound,
    results: resultsArray,
    bestSupermarket: bestSupermarket.supermarket,
    minTotal: minTotal,
    maxTotal: maxTotal,
    savings: savings
  });
}

function handleSearchProducts(req, res, queryParams) {
  const query = (queryParams.query || '').toLowerCase();

  if (!query) {
    return sendError(res, 400, 'Parámetro query requerido');
  }

  const db = getDatabase();
  const results = db.products.filter(p =>
    p.name.toLowerCase().includes(query) || p.id.toLowerCase().includes(query)
  );

  sendSuccess(res, { products: results });
}

function handleProductDetails(req, res, queryParams) {
  const productId = (queryParams.id || '').toLowerCase();

  if (!productId) {
    return sendError(res, 400, 'Parámetro id requerido');
  }

  const db = getDatabase();
  const product = db.products.find(p => p.id === productId);

  if (!product) {
    return sendError(res, 404, 'Producto no encontrado');
  }

  const prices = db.prices[productId] || [];
  const brands = [...new Set(prices.map(p => p.brand))];
  const varieties = prices.map(p => ({
    brand: p.brand,
    price: p.price,
    supermarket: p.supermarket
  }));

  sendSuccess(res, {
    product: product,
    brands: brands,
    varieties: varieties
  });
}

function handleHealth(req, res) {
  sendSuccess(res, {
    status: 'ok',
    message: 'Carriup API is running',
    timestamp: new Date().toISOString()
  });
}

const server = http.createServer((req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }

  const parsedUrl = url.parse(req.url, true);
  const pathname = parsedUrl.pathname;
  const queryParams = parsedUrl.query;

  console.log(`${req.method} ${pathname}`);

  if (req.method === 'POST' && pathname === '/api/auth/login') {
    parseBody(req, (body) => handleLogin(req, res, body));
  } else if (req.method === 'POST' && pathname === '/api/auth/signup') {
    parseBody(req, (body) => handleSignup(req, res, body));
  } else if (req.method === 'GET' && pathname === '/api/prices/compare') {
    handleComparePrices(req, res, queryParams);
  } else if (req.method === 'GET' && pathname === '/api/products/search') {
    handleSearchProducts(req, res, queryParams);
  } else if (req.method === 'GET' && pathname === '/api/products/details') {
    handleProductDetails(req, res, queryParams);
  } else if (req.method === 'GET' && pathname === '/api/health') {
    handleHealth(req, res);
  } else {
    sendError(res, 404, 'Ruta no encontrada');
  }
});

server.listen(PORT, () => {
  console.log(`
╔════════════════════════════════════════════════════╗
║                                                    ║
║  ✅ Carriup API Server is running                  ║
║                                                    ║
║  Port: ${PORT}                                        ║
║  URL: http://localhost:${PORT}                    ║
║                                                    ║
║  Endpoints:                                        ║
║  POST   /api/auth/login                            ║
║  POST   /api/auth/signup                           ║
║  GET    /api/prices/compare?products=leche,...    ║
║  GET    /api/products/search?query=leche          ║
║  GET    /api/health                                ║
║                                                    ║
╚════════════════════════════════════════════════════╝
  `);
});
