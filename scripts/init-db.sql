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
  variety VARCHAR(255),
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
('cafe', 'Café', 'Bebidas'),
('fideos', 'Fideos', 'Pasta');

-- Insert prices with varieties
INSERT INTO prices (product_id, supermarket, price, brand, variety) VALUES
-- Leche
('leche', 'lider', 1890, 'Colun', 'Entera 1L'),
('leche', 'lider', 1790, 'Colun', 'Descremada 1L'),
('leche', 'jumbo', 1650, 'Surlat', 'Entera 1L'),
('leche', 'jumbo', 1550, 'Surlat', 'Descremada 1L'),
('leche', 'santa-isabel', 1490, 'Marca Blanca', 'Entera 1L'),
('leche', 'santa-isabel', 2190, 'Marca Blanca', 'Deslactosada 1L'),
('leche', 'unimarc', 2490, 'Colun Premium', 'Entera 1L'),
('leche', 'unimarc', 3290, 'Colun Premium', 'Orgánica 1L'),
-- Queso
('queso', 'lider', 3290, 'Colun', 'Cremoso 350g'),
('queso', 'lider', 4890, 'Colun', 'Azul 200g'),
('queso', 'jumbo', 3590, 'Surlat', 'Fundido 450g'),
('queso', 'jumbo', 4190, 'Surlat', 'Pradera 400g'),
('queso', 'santa-isabel', 2890, 'Marca Blanca', 'Dambo 350g'),
('queso', 'santa-isabel', 1990, 'Marca Blanca', 'Laminado 200g'),
('queso', 'unimarc', 5990, 'Parmesano', 'Rallado 200g'),
('queso', 'unimarc', 6490, 'Parmesano', 'Bloque 250g'),
-- Yogur
('yogur', 'lider', 1290, 'Colun', 'Natural 180g'),
('yogur', 'lider', 1490, 'Colun', 'Frutado 180g'),
('yogur', 'jumbo', 1590, 'Yoplait', 'Natural 200g'),
('yogur', 'jumbo', 1790, 'Yoplait', 'Griego 150g'),
('yogur', 'santa-isabel', 990, 'Marca Blanca', 'Natural 180g'),
('yogur', 'santa-isabel', 1190, 'Marca Blanca', 'Frutado 180g'),
('yogur', 'unimarc', 1990, 'Activia', 'Natural 170g'),
('yogur', 'unimarc', 2190, 'Activia', 'Con cereales 170g'),
-- Mantequilla
('mantequilla', 'lider', 2490, 'Colun', 'Con sal 250g'),
('mantequilla', 'lider', 2690, 'Colun', 'Sin sal 250g'),
('mantequilla', 'jumbo', 2890, 'Loncoleche', 'Con sal 250g'),
('mantequilla', 'jumbo', 3190, 'Loncoleche', 'Light 250g'),
('mantequilla', 'santa-isabel', 2190, 'Marca Blanca', 'Con sal 250g'),
('mantequilla', 'unimarc', 3490, 'Colun Premium', 'Orgánica 250g'),
-- Pan Integral
('pan_integral', 'lider', 2490, 'Bimbo', 'Molde 550g'),
('pan_integral', 'lider', 2890, 'Bimbo', 'Semilla 500g'),
('pan_integral', 'jumbo', 2290, 'Artesanal', 'Centeno 400g'),
('pan_integral', 'jumbo', 2590, 'Artesanal', 'Avena 400g'),
('pan_integral', 'santa-isabel', 1990, 'Marca Blanca', 'Molde 500g'),
('pan_integral', 'unimarc', 2650, 'Premium', 'Semillas 450g'),
-- Huevos
('huevos', 'lider', 3990, 'Sopraval', 'Camperos 12u'),
('huevos', 'lider', 2690, 'Sopraval', 'Blancos 12u'),
('huevos', 'jumbo', 3490, 'Granja Llanquihue', 'Camperos 12u'),
('huevos', 'jumbo', 4290, 'Granja Llanquihue', 'Orgánicos 12u'),
('huevos', 'santa-isabel', 2990, 'Marca Blanca', 'Blancos 12u'),
('huevos', 'unimarc', 4690, 'Premium', 'Omega3 12u'),
-- Jamón
('jambon', 'lider', 2890, 'San Jorge', 'Cocido 200g'),
('jambon', 'lider', 3490, 'San Jorge', 'Serrano 150g'),
('jambon', 'jumbo', 3190, 'España', 'Ibérico 150g'),
('jambon', 'jumbo', 2690, 'España', 'Cocido 200g'),
('jambon', 'santa-isabel', 2490, 'Marca Blanca', 'Cocido 200g'),
('jambon', 'unimarc', 3890, 'Premium', 'Serrano 150g'),
-- Pollo
('pollo', 'lider', 7990, 'Las Tres Pías', 'Pechuga kg'),
('pollo', 'lider', 5990, 'Las Tres Pías', 'Muslo kg'),
('pollo', 'jumbo', 8490, 'Agrosuper', 'Pechuga kg'),
('pollo', 'jumbo', 6490, 'Agrosuper', 'Entero kg'),
('pollo', 'santa-isabel', 7490, 'Local', 'Pechuga kg'),
('pollo', 'santa-isabel', 5490, 'Local', 'Muslo kg'),
('pollo', 'unimarc', 11990, 'Premium', 'Pechuga Orgánica kg'),
('pollo', 'unimarc', 8990, 'Premium', 'Muslo Orgánico kg'),
-- Carne
('carne', 'lider', 6990, 'Angus', 'Molida 500g'),
('carne', 'lider', 8490, 'Angus', 'Asado kg'),
('carne', 'jumbo', 7290, 'Wagyu', 'Molida 500g'),
('carne', 'jumbo', 12990, 'Wagyu', 'Lomo kg'),
('carne', 'santa-isabel', 5990, 'Local', 'Molida 500g'),
('carne', 'santa-isabel', 7490, 'Local', 'Asado kg'),
('carne', 'unimarc', 9990, 'Premium', 'Molida Orgánica 500g'),
-- Salmón
('salmon', 'lider', 8990, 'Norwegian', 'Filete kg'),
('salmon', 'jumbo', 9490, 'Frío Austral', 'Filete kg'),
('salmon', 'jumbo', 7990, 'Frío Austral', 'Trozo kg'),
('salmon', 'santa-isabel', 7990, 'Local', 'Filete kg'),
('salmon', 'unimarc', 10290, 'Premium', 'Filete Orgánico kg'),
-- Arroz
('arroz', 'lider', 1590, 'Maravilla', 'Grano largo 1kg'),
('arroz', 'lider', 1890, 'Maravilla', 'Integral 1kg'),
('arroz', 'jumbo', 1490, 'Continente', 'Grano largo 1kg'),
('arroz', 'jumbo', 1790, 'Continente', 'Sushi 500g'),
('arroz', 'santa-isabel', 1290, 'Marca Blanca', 'Grano largo 1kg'),
('arroz', 'unimarc', 1990, 'Gourmet', 'Integral 1kg'),
-- Harina
('harina', 'lider', 1290, 'Selecta', 'Sin polvos 1kg'),
('harina', 'lider', 1490, 'Selecta', 'Con polvos 1kg'),
('harina', 'jumbo', 1390, 'Purísima', 'Sin polvos 1kg'),
('harina', 'santa-isabel', 1090, 'Marca Blanca', 'Sin polvos 1kg'),
('harina', 'unimarc', 1650, 'Selecta Premium', 'Integral 1kg'),
-- Aceite
('aceite', 'lider', 4290, 'Oliva Extra', 'Virgen extra 500ml'),
('aceite', 'lider', 2490, 'Oliva Extra', 'Girasol 1L'),
('aceite', 'jumbo', 4090, 'Borges', 'Oliva virgen 500ml'),
('aceite', 'jumbo', 5490, 'Borges', 'Oliva extra premium 750ml'),
('aceite', 'santa-isabel', 3490, 'Marca Blanca', 'Girasol 1L'),
('aceite', 'unimarc', 6890, 'Premium', 'Oliva orgánico 500ml'),
-- Azúcar
('azucar', 'lider', 890, 'Iansa', 'Granulada 1kg'),
('azucar', 'lider', 1190, 'Iansa', 'Flor 500g'),
('azucar', 'jumbo', 920, 'Iansa', 'Granulada 1kg'),
('azucar', 'jumbo', 1490, 'Iansa', 'Rubia 1kg'),
('azucar', 'santa-isabel', 799, 'Marca Blanca', 'Granulada 1kg'),
('azucar', 'unimarc', 1690, 'Iansa', 'Orgánica 500g'),
-- Papas
('papas', 'lider', 1290, 'Valdivia', 'Bolsa 1kg'),
('papas', 'jumbo', 1390, 'Maule', 'Bolsa 1kg'),
('papas', 'santa-isabel', 990, 'Marca Blanca', 'Bolsa 1kg'),
('papas', 'unimarc', 1690, 'Premium', 'Baby papas 500g'),
-- Zanahorias
('zanahorias', 'lider', 890, 'Valle Central', 'Bolsa 500g'),
('zanahorias', 'jumbo', 990, 'Maule', 'Bolsa 500g'),
('zanahorias', 'santa-isabel', 690, 'Marca Blanca', 'Bolsa 500g'),
('zanahorias', 'unimarc', 1290, 'Premium', 'Baby zanahorias 300g'),
-- Tomates
('tomates', 'lider', 1590, 'Valle Central', 'Manzano kg'),
('tomates', 'jumbo', 1790, 'Organicópolis', 'Cherry 300g'),
('tomates', 'jumbo', 2190, 'Organicópolis', 'Orgánicos kg'),
('tomates', 'santa-isabel', 1290, 'Local', 'Manzano kg'),
('tomates', 'unimarc', 2490, 'Premium', 'Orgánicos kg'),
-- Lechuga
('lechuga', 'lider', 1290, 'Valle Central', 'Española unidad'),
('lechuga', 'jumbo', 1490, 'Hidropónica', 'Romana unidad'),
('lechuga', 'jumbo', 1890, 'Hidropónica', 'Mix ensalada 200g'),
('lechuga', 'santa-isabel', 990, 'Local', 'Española unidad'),
('lechuga', 'unimarc', 1990, 'Premium', 'Orgánica unidad'),
-- Cebolla
('cebolla', 'lider', 690, 'Valle Central', 'Bolsa 1kg'),
('cebolla', 'jumbo', 790, 'Acopiadora', 'Bolsa 1kg'),
('cebolla', 'santa-isabel', 490, 'Local', 'Bolsa 1kg'),
('cebolla', 'unimarc', 990, 'Premium', 'Morada bolsa 500g'),
-- Manzanas
('manzanas', 'lider', 1890, 'Fuji', 'Bolsa 1kg'),
('manzanas', 'lider', 2290, 'Fuji', 'Granny Smith bolsa 1kg'),
('manzanas', 'jumbo', 2090, 'Importada', 'Gala bolsa 1kg'),
('manzanas', 'santa-isabel', 1490, 'Local', 'Granny Smith bolsa 1kg'),
('manzanas', 'unimarc', 2490, 'Premium', 'Pink Lady bolsa 1kg'),
-- Plátanos
('platanos', 'lider', 890, 'Ecuador', 'Racimo kg'),
('platanos', 'jumbo', 1090, 'Cavendish', 'Racimo kg'),
('platanos', 'santa-isabel', 690, 'Local', 'Racimo kg'),
('platanos', 'unimarc', 1290, 'Premium', 'Orgánico kg'),
-- Naranjas
('naranjas', 'lider', 1490, 'Valencia', 'Malla 1.5kg'),
('naranjas', 'jumbo', 1690, 'Navel', 'Malla 1.5kg'),
('naranjas', 'santa-isabel', 1190, 'Local', 'Malla 1.5kg'),
('naranjas', 'unimarc', 1990, 'Premium', 'Jugo malla 2kg'),
-- Fresas
('fresas', 'lider', 2490, 'Nacional', 'Bandeja 250g'),
('fresas', 'jumbo', 2790, 'Premium', 'Bandeja 300g'),
('fresas', 'santa-isabel', 1990, 'Local', 'Bandeja 250g'),
('fresas', 'unimarc', 3490, 'Orgánica', 'Bandeja 250g'),
-- Uvas
('uvas', 'lider', 3490, 'Italia', 'Bolsa 1kg'),
('uvas', 'lider', 3890, 'Red Globe', 'Bolsa 1kg'),
('uvas', 'jumbo', 3790, 'Thompson', 'Bolsa 1kg'),
('uvas', 'santa-isabel', 2990, 'Local', 'Bolsa 1kg'),
('uvas', 'unimarc', 4490, 'Premium', 'Sin semilla bolsa 1kg'),
-- Café
('cafe', 'lider', 2890, 'Nescafé', 'Clásico 100g'),
('cafe', 'lider', 3490, 'Nescafé', 'Gold 100g'),
('cafe', 'jumbo', 4290, 'Lavazza', 'Clásico 250g'),
('cafe', 'jumbo', 4490, 'Lavazza', 'Crema 250g'),
('cafe', 'santa-isabel', 3190, 'Marcilla', 'Molido 250g'),
('cafe', 'unimarc', 5890, 'illy', 'Clásico 250g'),
('cafe', 'unimarc', 5990, 'illy', 'Intenso 250g'),
-- Fideos
('fideos', 'lider', 890, 'Lucchetti', 'Tallarines 400g'),
('fideos', 'lider', 890, 'Lucchetti', 'Espirales 400g'),
('fideos', 'jumbo', 1290, 'Barilla', 'Tallarines 500g'),
('fideos', 'jumbo', 1290, 'Barilla', 'Fusilli 500g'),
('fideos', 'santa-isabel', 790, 'Marca Blanca', 'Tallarines 400g'),
('fideos', 'unimarc', 2290, 'Banza', 'Garbanzos 250g');
