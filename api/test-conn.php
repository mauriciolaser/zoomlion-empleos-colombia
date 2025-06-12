<?php
// /home/zoomlionpe/empleos.zoomlion.com.pe/api/test-conn.php

header('Content-Type: application/json; charset=utf-8');
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

$result = [];

// 1) Comprobar .env
$dotenvDir = '/home/zoomlionpe/credenciales.empleos.zoomlion.com.pe';
$envFile   = "$dotenvDir/.env";
$result['envFile']   = $envFile;
$result['exists']    = file_exists($envFile);
$result['readable']  = is_readable($envFile);

// 2) Cargar Dotenv
require_once __DIR__ . '/../vendor/autoload.php';
use Dotenv\Dotenv;

try {
    Dotenv::createImmutable($dotenvDir)->load();
    $result['dotenv_loaded'] = true;
} catch (\Throwable $e) {
    $result['dotenv_loaded'] = false;
    $result['dotenv_error']  = $e->getMessage();
}

// 3) Leer variables
$result['DB_HOST'] = getenv('DB_HOST') ?: '';
$result['DB_USER'] = getenv('DB_USER') ?: '';
$result['DB_NAME'] = getenv('DB_NAME') ?: '';
$result['DB_PASS_length'] = strlen(getenv('DB_PASSWORD') ?: '');

// 4) Intentar conexión manual
$host = $result['DB_HOST'];
$user = $result['DB_USER'];
$pass = getenv('DB_PASSWORD') ?: '';
$name = $result['DB_NAME'];

@$mysqli = new mysqli($host, $user, $pass, $name);
if ($mysqli && !$
