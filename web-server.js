import http from 'http';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const WEB_PORT = 8080;

const server = http.createServer((req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }

  let filePath = path.join(__dirname, req.url === '/' ? 'index.html' : req.url);

  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
      // Si no encuentra el archivo, intenta con .html
      if (filePath.endsWith('.html')) {
        res.writeHead(404, { 'Content-Type': 'text/html' });
        res.end(`<h1>404 - Archivo no encontrado</h1><p>${req.url}</p>`);
      } else {
        filePath += '.html';
        fs.readFile(filePath, 'utf8', (err2, data2) => {
          if (err2) {
            res.writeHead(404, { 'Content-Type': 'text/html' });
            res.end(`<h1>404 - Archivo no encontrado</h1><p>${req.url}</p>`);
          } else {
            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.end(data2);
          }
        });
      }
      return;
    }

    const ext = path.extname(filePath);
    const contentTypes = {
      '.html': 'text/html',
      '.js': 'application/javascript',
      '.css': 'text/css',
      '.json': 'application/json'
    };

    const contentType = contentTypes[ext] || 'text/plain';
    res.writeHead(200, { 'Content-Type': contentType });
    res.end(data);
  });
});

server.listen(WEB_PORT, () => {
  console.log(`
╔════════════════════════════════════════════════════╗
║                                                    ║
║  🌐 Carriup Web Server is running                  ║
║                                                    ║
║  Web URL:  http://localhost:${WEB_PORT}              ║
║  API URL:  http://localhost:3001                  ║
║                                                    ║
║  📂 Páginas:                                       ║
║  • Login:  http://localhost:${WEB_PORT}/login_connected.html    ║
║  • Prices: http://localhost:${WEB_PORT}/price_comparison_connected.html ║
║                                                    ║
╚════════════════════════════════════════════════════╝
  `);
});
