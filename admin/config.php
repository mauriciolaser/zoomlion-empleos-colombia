<?php
// admin/config.php

// 1) Logging (producción)
ini_set('display_errors',   0);
ini_set('log_errors',       1);
ini_set('error_log',        __DIR__ . '/logs/admin_errors.log');
error_reporting(E_ALL);

// 2) Autoload y Dotenv
require_once __DIR__ . '/../vendor/autoload.php';
use Dotenv\Dotenv;
use Dotenv\Exception\InvalidPathException;

// 3) Carga de .env FORZANDO overwrite
$dotenvDir = '/home/zoomlionpe/credenciales.empleos.zoomlion.com.pe';
$envFile   = "$dotenvDir/.env";
if (file_exists($envFile) && is_readable($envFile)) {
    try {
        // createMutable permite sobreescribir variables existentes
        Dotenv::createMutable($dotenvDir)->load();
    } catch (InvalidPathException $e) {
        error_log('ADMIN DOTENV WARNING: ' . $e->getMessage());
    }
} else {
    error_log("ADMIN DOTENV WARNING: .env no encontrado o no legible en '$envFile'");
}

// 4) Recoger variables de $_ENV
$dbHost = $_ENV['DB_HOST']     ?? null;
$dbUser = $_ENV['DB_USER']     ?? null;
$dbPass = $_ENV['DB_PASSWORD'] ?? '';
$dbName = $_ENV['DB_NAME']     ?? null;

// 5) Validar configuración
if (! $dbHost || ! $dbUser || ! $dbName) {
    error_log('ADMIN BD CONFIG ERROR: faltan DB_HOST, DB_USER o DB_NAME');
    http_response_code(500);
    header('Content-Type: application/json; charset=utf-8');
    echo json_encode(['error'=>'Error de configuración de base de datos.'], JSON_UNESCAPED_UNICODE);
    exit;
}

// 6) Definir constantes
define('DB_HOST',     $dbHost);
define('DB_USER',     $dbUser);
define('DB_PASSWORD', $dbPass);
define('DB_NAME',     $dbName);

/**  
 * Conexión mysqli para panel admin  
 */
function obtenerConexion() {
    $m = new mysqli(DB_HOST, DB_USER, DB_PASSWORD, DB_NAME);
    if ($m->connect_errno) {
        error_log(sprintf('ADMIN BD CONNECT ERROR [%s@%s/%s]: %s',
            DB_USER, DB_HOST, DB_NAME, $m->connect_error
        ));
        http_response_code(500);
        header('Content-Type: application/json; charset=utf-8');
        echo json_encode(['error'=>'Error de conexión a BD: '.$m->connect_error], JSON_UNESCAPED_UNICODE);
        exit;
    }
    $m->set_charset('utf8');
    return $m;
}
