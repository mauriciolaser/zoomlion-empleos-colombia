// scripts/sitemap-generator.js (ESM)

import 'dotenv/config';                     // 1️⃣ carga .env en process.env
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { SitemapStream, streamToPromise } from 'sitemap';
import routes from './sitemapRoutes.js';     // tu array de rutas

// Resolver __dirname en ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname  = path.dirname(__filename);

// 2️⃣ Determinar siteUrl: .env primero, si no, deploy-config.json
let siteUrl = process.env.VITE_APP_URL;

if (!siteUrl) {
  const cfgPath = path.resolve(__dirname, 'deploy-config.json');
  try {
    const raw = fs.readFileSync(cfgPath, 'utf-8');
    const cfg = JSON.parse(raw);
    siteUrl = cfg.VITE_APP_URL;
  } catch (err) {
    console.error('❌ No se pudo leer deploy-config.json o no contiene VITE_APP_URL:', err);
    process.exit(1);
  }
}

if (!siteUrl) {
  console.error('❌ No se ha definido VITE_APP_URL ni en .env ni en deploy-config.json');
  process.exit(1);
}

// 3️⃣ Generar el sitemap
const sitemapStream = new SitemapStream({ hostname: siteUrl });
routes.forEach(route => sitemapStream.write({ url: route }));
sitemapStream.end();

streamToPromise(sitemapStream)
  .then(buffer => {
    const xml = buffer.toString();
    const outDir = path.resolve(__dirname, '..', 'public');
    fs.mkdirSync(outDir, { recursive: true });       // asegúrate de que public/ exista
    const outFile = path.join(outDir, 'sitemap.xml');
    fs.writeFileSync(outFile, xml);
    console.log('✔️  Sitemap generado en:', outFile);
  })
  .catch(err => {
    console.error('❌ Error al generar el sitemap:', err);
    process.exit(1);
  });
