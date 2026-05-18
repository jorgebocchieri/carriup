-- Drop tables if they exist (for development)
DROP TABLE IF EXISTS searches CASCADE;
DROP TABLE IF EXISTS lists CASCADE;
DROP TABLE IF EXISTS prices CASCADE;
DROP TABLE IF EXISTS products CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- Users table
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_users_email ON users(email);

-- Products table
CREATE TABLE products (
  id SERIAL PRIMARY KEY,
  product_id VARCHAR(100) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  category VARCHAR(100) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_products_name ON products(LOWER(name));
CREATE INDEX idx_products_product_id ON products(product_id);

-- Prices table
CREATE TABLE prices (
  id SERIAL PRIMARY KEY,
  product_id VARCHAR(100) NOT NULL REFERENCES products(product_id),
  supermarket VARCHAR(50) NOT NULL,
  price INTEGER NOT NULL,
  brand VARCHAR(255) NOT NULL,
  date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_prices_product_id ON prices(product_id);
CREATE INDEX idx_prices_supermarket ON prices(supermarket);
CREATE INDEX idx_prices_date ON prices(date);

-- Lists table
CREATE TABLE lists (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  items JSONB DEFAULT '[]',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_lists_user_id ON lists(user_id);

-- Searches table
CREATE TABLE searches (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  products TEXT[] NOT NULL,
  best_supermarket VARCHAR(50),
  savings INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_searches_user_id ON searches(user_id);

-- ==================
-- SEED DATA
-- ==================

-- Insert test user (password: test123456 hashed with bcrypt cost 10)
INSERT INTO users (name, email, password_hash) VALUES
('Test User', 'test@example.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcg7b3XeKeUxWdeS86E36jXtPlS');

-- Insert products (25 total)
INSERT INTO products (product_id, name, category) VALUES
('leche', 'Leche', 'Lácteos'),
('queso', 'Queso', 'Lácteos'),
('yogur', 'Yogur', 'Lácteos'),
('mantequilla', 'Mantequilla', 'Lácteos'),
('pan_integral', 'Pan Integral', 'Panadería'),
('huevos', 'Huevos', 'Proteínas'),
('jambon', 'Jamón', 'Proteínas'),
('pollo', 'Pechuga de Pollo', 'Proteínas'),
('carne', 'Carne Molida', 'Proteínas'),
('salmon', 'Salmón', 'Proteínas'),
('arroz', 'Arroz', 'Granos'),
('harina', 'Harina', 'Granos'),
('aceite', 'Aceite', 'Condimentos'),
('azucar', 'Azúcar', 'Condimentos'),
('papas', 'Papas', 'Verduras'),
('zanahorias', 'Zanahorias', 'Verduras'),
('tomates', 'Tomates', 'Verduras'),
('lechuga', 'Lechuga', 'Verduras'),
('cebolla', 'Cebolla', 'Verduras'),
('manzanas', 'Manzanas', 'Frutas'),
('platanos', 'Plátanos', 'Frutas'),
('naranjas', 'Naranjas', 'Frutas'),
('fresas', 'Fresas', 'Frutas'),
('uvas', 'Uvas', 'Frutas'),
('cafe', 'Café', 'Bebidas');

-- Insert prices (4 supermarkets × 25 products = 100 rows)
INSERT INTO prices (product_id, supermarket, price, brand) VALUES
('leche', 'lider', 1290, 'Colun'),
('leche', 'jumbo', 1320, 'Surlat'),
('leche', 'santa-isabel', 1250, 'Marca Blanca'),
('leche', 'unimarc', 1350, 'Colun Premium'),
('queso', 'lider', 3990, 'Colun'),
('queso', 'jumbo', 4290, 'Loncoleche'),
('queso', 'santa-isabel', 3490, 'Marca Blanca'),
('queso', 'unimarc', 4590, 'Colun Premium'),
('yogur', 'lider', 1990, 'Colun'),
('yogur', 'jumbo', 2190, 'Yoplait'),
('yogur', 'santa-isabel', 1690, 'Marca Blanca'),
('yogur', 'unimarc', 2290, 'Activia'),
('mantequilla', 'lider', 2490, 'Colun'),
('mantequilla', 'jumbo', 2690, 'Loncoleche'),
('mantequilla', 'santa-isabel', 2190, 'Marca Blanca'),
('mantequilla', 'unimarc', 2890, 'Colun Premium'),
('pan_integral', 'lider', 2490, 'Bimbo'),
('pan_integral', 'jumbo', 2290, 'Artesanal'),
('pan_integral', 'santa-isabel', 1990, 'Marca Blanca'),
('pan_integral', 'unimarc', 2650, 'Premium'),
('huevos', 'lider', 3990, 'Orgánicos'),
('huevos', 'jumbo', 3490, 'Granja'),
('huevos', 'santa-isabel', 2990, 'Marca Blanca'),
('huevos', 'unimarc', 4290, 'Premium'),
('jambon', 'lider', 2890, 'Cicatriz'),
('jambon', 'jumbo', 3190, 'España'),
('jambon', 'santa-isabel', 2490, 'Marca Blanca'),
('jambon', 'unimarc', 3490, 'Premium'),
('pollo', 'lider', 4990, 'Crianza Feliz'),
('pollo', 'jumbo', 5290, 'Patagonia'),
('pollo', 'santa-isabel', 4490, 'Marca Blanca'),
('pollo', 'unimarc', 5690, 'Premium'),
('carne', 'lider', 6990, 'Angus'),
('carne', 'jumbo', 7290, 'Wagyu'),
('carne', 'santa-isabel', 5990, 'Marca Blanca'),
('carne', 'unimarc', 7690, 'Premium'),
('salmon', 'lider', 8990, 'Norwegian'),
('salmon', 'jumbo', 9490, 'Frío Austral'),
('salmon', 'santa-isabel', 7990, 'Marca Blanca'),
('salmon', 'unimarc', 10290, 'Premium'),
('arroz', 'lider', 1590, 'Maravilla'),
('arroz', 'jumbo', 1490, 'Continente'),
('arroz', 'santa-isabel', 1290, 'Marca Blanca'),
('arroz', 'unimarc', 1790, 'Gourmet'),
('harina', 'lider', 1290, 'Selecta'),
('harina', 'jumbo', 1390, 'Purísima'),
('harina', 'santa-isabel', 1090, 'Marca Blanca'),
('harina', 'unimarc', 1450, 'Selecta Premium'),
('aceite', 'lider', 4290, 'Oliva Extra'),
('aceite', 'jumbo', 4090, 'Girasol'),
('aceite', 'santa-isabel', 3490, 'Marca Blanca'),
('aceite', 'unimarc', 4890, 'Premium'),
('azucar', 'lider', 890, 'Iansa'),
('azucar', 'jumbo', 920, 'Iansa Premium'),
('azucar', 'santa-isabel', 799, 'Marca Blanca'),
('azucar', 'unimarc', 950, 'Iansa Orgánica'),
('papas', 'lider', 1290, 'Valdivia'),
('papas', 'jumbo', 1390, 'Maule'),
('papas', 'santa-isabel', 990, 'Marca Blanca'),
('papas', 'unimarc', 1490, 'Premium'),
('zanahorias', 'lider', 890, 'Valle Central'),
('zanahorias', 'jumbo', 990, 'Maule'),
('zanahorias', 'santa-isabel', 690, 'Marca Blanca'),
('zanahorias', 'unimarc', 1090, 'Premium'),
('tomates', 'lider', 1590, 'Valle Central'),
('tomates', 'jumbo', 1790, 'Organicópolis'),
('tomates', 'santa-isabel', 1290, 'Marca Blanca'),
('tomates', 'unimarc', 1990, 'Premium Orgánico'),
('lechuga', 'lider', 1290, 'Valle Central'),
('lechuga', 'jumbo', 1490, 'Hidropónica'),
('lechuga', 'santa-isabel', 990, 'Marca Blanca'),
('lechuga', 'unimarc', 1690, 'Premium Orgánica'),
('cebolla', 'lider', 690, 'Valle Central'),
('cebolla', 'jumbo', 790, 'Acopiadora'),
('cebolla', 'santa-isabel', 490, 'Marca Blanca'),
('cebolla', 'unimarc', 890, 'Premium'),
('manzanas', 'lider', 1890, 'Fuji'),
('manzanas', 'jumbo', 2090, 'Gala Importada'),
('manzanas', 'santa-isabel', 1490, 'Granny Smith'),
('manzanas', 'unimarc', 2290, 'Pink Lady Premium'),
('platanos', 'lider', 890, 'Ecuador'),
('platanos', 'jumbo', 1090, 'Cavendish'),
('platanos', 'santa-isabel', 690, 'Local'),
('platanos', 'unimarc', 1190, 'Premium Importado'),
('naranjas', 'lider', 1490, 'Valencia'),
('naranjas', 'jumbo', 1690, 'Navel Importada'),
('naranjas', 'santa-isabel', 1190, 'Local'),
('naranjas', 'unimarc', 1890, 'Premium'),
('fresas', 'lider', 2490, 'Orgánicas'),
('fresas', 'jumbo', 2790, 'Importadas'),
('fresas', 'santa-isabel', 1990, 'Local'),
('fresas', 'unimarc', 3090, 'Premium Orgánicas'),
('uvas', 'lider', 3490, 'Italia'),
('uvas', 'jumbo', 3790, 'Negra Importada'),
('uvas', 'santa-isabel', 2990, 'Local'),
('uvas', 'unimarc', 4190, 'Premium Importadas'),
('cafe', 'lider', 3990, 'Nescafé'),
('cafe', 'jumbo', 4290, 'Illy'),
('cafe', 'santa-isabel', 2990, 'Marca Blanca'),
('cafe', 'unimarc', 4590, 'Lavazza');
