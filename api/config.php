<?php
// api/config.php

ini_set('display_errors',   0);
ini_set('log_errors',       1);
ini_set('error_log',        __DIR__ . '/logs/api_errors.log');
error_reporting(E_ALL);

require_once __DIR__ . '/../vendor/autoload.php';
use Dotenv\Dotenv;
use Dotenv\Exception\InvalidPathException;

$dotenvDir = '/home/zoomlionpe/credenciales.empleos.zoomlion.com.pe';
$envFile   = "$dotenvDir/.env";
if (file_exists($envFile) && is_readable($envFile)) {
    try {
        Dotenv::createMutable($dotenvDir)->load();
    } catch (InvalidPathException $e) {
        error_log('API DOTENV WARNING: ' . $e->getMessage());
    }
} else {
    error_log("API DOTENV WARNING: .env no encontrado o no legible en '$envFile'");
}

// Variables desde $_ENV
$dbHost = $_ENV['DB_HOST']     ?? null;
$dbUser = $_ENV['DB_USER']     ?? null;
$dbPass = $_ENV['DB_PASSWORD'] ?? '';
$dbName = $_ENV['DB_NAME']     ?? null;

// Validar
if (! $dbHost || ! $dbUser || ! $dbName) {
    error_log('API BD CONFIG ERROR: faltan DB_HOST, DB_USER o DB_NAME');
    http_response_code(500);
    header('Content-Type: application/json; charset=utf-8');
    echo json_encode(['error'=>'Error de configuración de base de datos.'], JSON_UNESCAPED_UNICODE);
    exit;
}

define('DB_HOST',     $dbHost);
define('DB_USER',     $dbUser);
define('DB_PASSWORD', $dbPass);
define('DB_NAME',     $dbName);

function obtenerConexion() {
    $m = new mysqli(DB_HOST, DB_USER, DB_PASSWORD, DB_NAME);
    if ($m->connect_errno) {
        error_log(sprintf('API BD CONNECT ERROR [%s@%s/%s]: %s',
            DB_USER, DB_HOST, DB_NAME, $m->connect_error
        ));
        http_response_code(500);
        header('Content-Type: application/json; charset=utf-8');
        echo json_encode(['error'=>'Error de conexión a base de datos.'], JSON_UNESCAPED_UNICODE);
        exit;
    }
    $m->set_charset('utf8');
    return $m;
}
