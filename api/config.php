<?php
ini_set('display_errors',0);
ini_set('log_errors',1);
ini_set('error_log',__DIR__.'/logs/api_errors.log');
error_reporting(E_ALL);

/* autoload Composer */
$autoload = __DIR__ . '/../vendor/autoload.php';
if (file_exists($autoload)) {
    require_once $autoload;
} else {
    error_log('API AUTOLOAD WARNING: '.$autoload.' no encontrado');
}

use Dotenv\Dotenv;
use Dotenv\Exception\InvalidPathException;

/* 1. Intenta cargar .env de producción */
$prodDir = '/home/zoomlioncolombia/credenciales.empleos.zoomlion.com.co';
if (is_readable("$prodDir/.env")) {
    try { Dotenv::createMutable($prodDir)->load(); }
    catch (InvalidPathException $e) { error_log($e->getMessage()); }
}

/* 2. Si no se cargó nada, busca .env local dentro del proyecto */
if (!isset($_ENV['DB_HOST'])) {
    $localDir = dirname(__DIR__);              // raíz del repo
    if (is_readable("$localDir/.env")) {
        try { Dotenv::createMutable($localDir)->load(); }
        catch (InvalidPathException $e) { error_log($e->getMessage()); }
    }
}

/* 3. Valores por defecto para XAMPP si siguen faltando */
$dbHost = $_ENV['DB_HOST']     ?? 'localhost';
$dbUser = $_ENV['DB_USER']     ?? 'root';
$dbPass = $_ENV['DB_PASSWORD'] ?? '';
$dbName = $_ENV['DB_NAME']     ?? 'zoomlioncolombia_empleos';

define('DB_HOST', $dbHost);
define('DB_USER', $dbUser);
define('DB_PASSWORD', $dbPass);
define('DB_NAME', $dbName);

define('UPLOADS_PATH', __DIR__.'/uploads/');
define('UPLOADS_URL',  '/uploads/');

function obtenerConexionMain() {
    $mysqli = new mysqli(DB_HOST, DB_USER, DB_PASSWORD, DB_NAME);
    if ($mysqli->connect_errno) {
        error_log('API BD CONNECT ERROR: '.$mysqli->connect_error);
        http_response_code(500);
        header('Content-Type: application/json; charset=utf-8');
        echo json_encode(['error'=>'Error de conexión a base de datos.'], JSON_UNESCAPED_UNICODE);
        exit;
    }
    $mysqli->set_charset('utf8');
    return $mysqli;
}