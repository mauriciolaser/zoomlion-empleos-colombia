// scripts/generate-ssr-index.js (ESM)

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// --- Resolver __dirname en ESM ---
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// --- 1) Parsear argumento --outDir (p. ej. "--outDir dist") ---
const argv = process.argv.slice(2);
let outDir = 'dist'; // valor por defecto para Vite
for (let i = 0; i < argv.length; i++) {
  if (argv[i] === '--outDir' && argv[i + 1]) {
    outDir = argv[i + 1];
    i++;
  }
}

// --- 2) Rutas absolutas ---
const PROJECT_ROOT   = process.cwd();
const DIST_DIR       = path.resolve(PROJECT_ROOT, outDir);
const INDEX_PHP_PATH = path.join(DIST_DIR, 'index.php');

// Verificar que DIST_DIR exista
if (!fs.existsSync(DIST_DIR)) {
  console.error(`❌ Directorio de salida no encontrado: ${DIST_DIR}`);
  process.exit(1);
}

// --- 3) Contenido de index.php ---
const content = `<?php
// ${path.basename(outDir)}/index.php — generado por generate-ssr-index.js

// URL base de tu CMS
const CMS_API = 'https://cms.zoomlionlatam.com/api';

/** 1) Detectar crawlers */
function es_bot(): bool {
    $ua = \$_SERVER['HTTP_USER_AGENT'] ?? '';
    $bots = [
      'Googlebot','Bingbot','Slurp','DuckDuckBot','Baiduspider','Yandex',
      'facebookexternalhit','LinkedInBot','Twitterbot','TwitterBot','X-Seeker'
    ];
    foreach ($bots as $bot) {
        if (stripos($ua, \$bot) !== false) {
            return true;
        }
    }
    return false;
}

/** 2) Cliente sencillo al CMS con cURL y cache en memoria */
function cms_fetch(string \$url): array {
    static \$memcache = [];
    if (isset(\$memcache[\$url])) {
        return \$memcache[\$url];
    }
    \$ch = curl_init(\$url);
    curl_setopt_array(\$ch, [
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_TIMEOUT        => 5,
        CURLOPT_FOLLOWLOCATION => true,
    ]);
    \$raw = curl_exec(\$ch);
    curl_close(\$ch);
    \$decoded = \$raw ? json_decode(\$raw, true) : [];
    return \$memcache[\$url] = \$decoded;
}

// Ruta actual
\$uri = parse_url(\$_SERVER['REQUEST_URI'], PHP_URL_PATH);

// 3) SSR solo para bots en /noticias/slug o /productos/linea/slug
if (es_bot() &&
    (preg_match('#^/noticias/([^/]+)#', \$uri, \$mNoticias)
  || preg_match('#^/productos/[^/]+/([^/]+)#', \$uri, \$mModelos))
) {
    if (!empty(\$mNoticias)) {
        \$tipo = 'noticias';
        \$slug = \$mNoticias[1];
    } else {
        \$tipo = 'modelo';
        \$slug = \$mModelos[1];
    }

    // Cache ligero en disco
    \$cacheDir  = __DIR__ . '/ssr_cache';
    @mkdir(\$cacheDir, 0755, true);
    \$cacheKey  = md5(\$uri);
    \$cacheFile = "\$cacheDir/\$cacheKey.html";
    \$ttl       = 30 * 60; // 30 minutos

    if (file_exists(\$cacheFile) && time() - filemtime(\$cacheFile) < \$ttl) {
        echo file_get_contents(\$cacheFile);
        exit;
    }

    // 4) Llamada al CMS
    if (\$tipo === 'modelo') {
        \$endpoint = CMS_API . "/modelos?filters[slug][\\\$eq]={\$slug}&populate=*";
    } else {
        \$endpoint = CMS_API . "/noticias?filters[slug][\\\$eq]={\$slug}&populate=imagen,previsualizacion";
    }
    \$res   = cms_fetch(\$endpoint);
    \$entry = \$res['data'][0] ?? null;

    if (!\$entry) {
        // Fallback SPA (404)
        readfile(__DIR__ . '/index.html');
        exit;
    }
    \$item = \$entry['attributes'] ?? \$entry;

    // 5) Mapear campos para SEO
    if (\$tipo === 'modelo') {
        \$title       = \$item['nombre']      ?? 'Zoomlion Colombia';
        \$description = \$item['descripcion'] ?? '';
        \$keywords    = \$item['keywords']    ?? '';
        if (!empty(\$item['imagen_card']['url'])) {
            \$image = \$item['imagen_card']['url'];
        } elseif (!empty(\$item['imagen_card']['formats']['medium']['url'])) {
            \$image = \$item['imagen_card']['formats']['medium']['url'];
        } elseif (!empty(\$item['imagen_card']['formats']['small']['url'])) {
            \$image = \$item['imagen_card']['formats']['small']['url'];
        } else {
            \$image = '/images/default-banner.webp';
        }
    } else {
        \$title       = "Zoomlion | " . (\$item['titulo'] ?? '');
        \$description = \$item['bajada'] ?? '';
        \$preview     = \$item['previsualizacion'] ?? [];
        if (is_array(\$preview) && count(\$preview)) {
            \$p     = \$preview[0]['attributes'] ?? \$preview[0];
            \$image = \$p['formats']['large']['url'] ?? \$p['url'] ?? '';
        } else {
            \$img   = \$item['imagen']['attributes'] ?? \$item['imagen'] ?? [];
            \$image = \$img['formats']['large']['url'] ?? \$img['url'] ?? '';
        }
    }
    \$urlActual = 'https://' . \$_SERVER['HTTP_HOST'] . \$_SERVER['REQUEST_URI'];

    // 6) Generar HTML SSR
    ob_start();
    ?>
    <!DOCTYPE html>
    <html lang="es-PE">
    <head>
      <meta charset="utf-8">
      <title><?= htmlspecialchars(\$title) ?></title>
      <meta name="description" content="<?= htmlspecialchars(\$description) ?>">
      <?php if (\$tipo === 'modelo'): ?>
        <meta name="keywords" content="<?= htmlspecialchars(\$keywords) ?>">
      <?php endif ?>
      <!-- Favicon propio -->
      <link rel="icon" type="image/x-icon" href="/favicon.ico" />

      <!-- Open Graph -->
      <meta property="og:title"       content="<?= htmlspecialchars(\$title) ?>">
      <meta property="og:description" content="<?= htmlspecialchars(\$description) ?>">
      <?php if (!empty(\$image)): ?>
        <meta property="og:image"     content="<?= htmlspecialchars(\$image) ?>">
      <?php endif ?>
      <meta property="og:url"         content="<?= htmlspecialchars(\$urlActual) ?>">
      <meta property="og:type"        content="article">

      <!-- Twitter Cards -->
      <meta name="twitter:card"        content="summary_large_image">
      <meta name="twitter:title"       content="<?= htmlspecialchars(\$title) ?>">
      <meta name="twitter:description" content="<?= htmlspecialchars(\$description) ?>">
      <?php if (!empty(\$image)): ?>
        <meta name="twitter:image"     content="<?= htmlspecialchars(\$image) ?>">
      <?php endif ?>

      <!-- CSS de Vite (assets/*.css) -->
      <?php foreach (glob(__DIR__ . '/assets/*.css') as \$css):
        \$href = str_replace(__DIR__, '', \$css); ?>
        <link rel="stylesheet" href="<?= htmlspecialchars(\$href) ?>">
      <?php endforeach ?>
    </head>
    <body>
      <div id="root">
        <h1><?= htmlspecialchars(\$title) ?></h1>
        <p><?= htmlspecialchars(\$description) ?></p>
        <?php if (\$tipo === 'noticias' && !empty(\$item['contenido'])): ?>
          <div><?= \$item['contenido'] /* ya es HTML */ ?></div>
        <?php endif ?>
      </div>

      <!-- JS de Vite (assets/*.js) -->
      <?php foreach (glob(__DIR__ . '/assets/*.js') as \$js):
        \$src = str_replace(__DIR__, '', \$js); ?>
        <script src="<?= htmlspecialchars(\$src) ?>" defer></script>
      <?php endforeach ?>
    </body>
    </html>
    <?php
    \$html = ob_get_clean();
    file_put_contents(\$cacheFile, \$html);
    echo \$html;
    exit;
}

// 7) Fallback SPA
readfile(__DIR__ . '/index.html');
`;

// --- 4) Escribir el archivo ---
fs.writeFileSync(INDEX_PHP_PATH, content, 'utf8');
console.log(`✔️  index.php generado en ${INDEX_PHP_PATH}`);
