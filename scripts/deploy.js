// scripts/deploy.js (ESM — Windows compatible)

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import FtpDeploy from 'ftp-deploy';

const ftpDeploy = new FtpDeploy();

// --- Resolver __dirname en ESM ---
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// --- Cargar configuración local ---
const configPath = path.join(__dirname, 'deploy-config.json');
if (!fs.existsSync(configPath)) {
  console.error('❌ No se encontró deploy-config.json. Añádelo al .gitignore y configúralo.');
  process.exit(1);
}
const localConfig = JSON.parse(fs.readFileSync(configPath, 'utf-8'));

// --- Constantes ---
const BUILD_DIR_NAME = 'dist';                // Nombre del directorio de salida
const PROJECT_ROOT   = process.cwd();         // Raíz del proyecto

// 1) Generar el sitemap en public/
console.log("🗺️  Generando sitemap (en public/)...");
try {
  execSync('node scripts/sitemap-generator.js', { stdio: 'inherit', cwd: PROJECT_ROOT });
  console.log("✔️  Sitemap generado en public/sitemap.xml.");
} catch (err) {
  console.warn("⚠️  Falló la generación del sitemap. Se continúa con el deploy.\n", err.message);
}


// 2) Build de Vite
console.log(`🔨 Construyendo la aplicación con Vite (salida en ${BUILD_DIR_NAME}/)...`);
try {
  execSync('npm run build', { stdio: 'inherit', cwd: PROJECT_ROOT });
  console.log("✔️  Build completado.");
} catch (err) {
  console.error("❌ Error durante el build:", err);
  process.exit(1);
}

// 3) Verificar copia de sitemap a dist/
console.log(`📄 Verificando copia de sitemap.xml a ${BUILD_DIR_NAME}/...`);
const srcSitemap = path.resolve(PROJECT_ROOT, 'public', 'sitemap.xml');
const dstSitemap = path.resolve(PROJECT_ROOT, BUILD_DIR_NAME, 'sitemap.xml');
if (fs.existsSync(srcSitemap)) {
  fs.copyFileSync(srcSitemap, dstSitemap);
  console.log(`✔️  sitemap.xml copiado a ${BUILD_DIR_NAME}/`);
} else {
  console.warn("⚠️  No se encontró sitemap.xml en public/. Se asume que Vite ya lo copió.");
}

// 4) Deploy vía FTP
console.log("🚀 Iniciando deploy FTP...");
const ftpConfig = {
  user:        localConfig.FTP_USER,
  password:    localConfig.FTP_PASSWORD,
  host:        localConfig.FTP_HOST,
  port:        localConfig.FTP_PORT || 21,
  localRoot:   BUILD_DIR_NAME,      // <-- ¡Solo 'dist', no ruta absoluta!
  remoteRoot:  "/public_html/empleos.zoomlion.com.pe",
  include:     ["*", "**/*"],
  deleteRemote:false,
  forcePasv:   true
};

ftpDeploy.deploy(ftpConfig)
  .then(() => console.log("✔️  Deploy FTP completado exitosamente!"))
  .catch(err => {
    console.error("❌ Error en el deploy FTP:", err);
    process.exit(1);
  });
