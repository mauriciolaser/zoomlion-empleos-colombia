<?php
// /home/zoomlionpe/empleos.zoomlion.com.pe/api/config.php

// 1) Autoload de Composer y uso de Dotenv
require_once __DIR__ . '/../vendor/autoload.php';

use Dotenv\Dotenv;
use Dotenv\Exception\InvalidPathException;

// 2) Ruta absoluta al directorio donde vive tu .env
$dotenvDir = '/home/zoomlionpe/credenciales.empleos.zoomlion.com.pe';
$envFile   = $dotenvDir . '/.env';

if (file_exists($envFile) && is_readable($envFile)) {
    try {
        $dotenv = Dotenv::createImmutable($dotenvDir);
        $dotenv->load();
    } catch (InvalidPathException $e) {
        error_log('DOTENV WARNING: ' . $e->getMessage());
    }
} else {
    error_log("DOTENV WARNING: fichero .env no encontrado o no legible en '$envFile'");
}

// 3) Recoger variables de entorno
$dbHost     = getenv('DB_HOST');
$dbUser     = getenv('DB_USER');
$dbPassword = getenv('DB_PASSWORD');
$dbName     = getenv('DB_NAME');

// 4) Validar que están todas las variables obligatorias
if (!$dbHost || !$dbUser || !$dbName) {
    error_log('BD CONFIG ERROR: faltan DB_HOST, DB_USER o DB_NAME en variables de entorno');
    http_response_code(500);
    header('Content-Type: application/json; charset=utf-8');
    echo json_encode(['error' => 'Error de configuración de base de datos.']);
    exit;
}

// 5) Definir constantes
define('DB_HOST',     $dbHost);
define('DB_USER',     $dbUser);
define('DB_PASSWORD', $dbPassword ?: '');
define('DB_NAME',     $dbName);

/**
 * Obtiene una conexión mysqli. En caso de error lo registra
 * y devuelve un mensaje genérico al cliente.
 *
 * @return \mysqli
 */
function obtenerConexion() {
    $mysqli = new mysqli(DB_HOST, DB_USER, DB_PASSWORD, DB_NAME);
    if ($mysqli->connect_errno) {
        error_log(sprintf(
            'BD CONNECT ERROR [%s@%s/%s]: %s',
            DB_USER, DB_HOST, DB_NAME, $mysqli->connect_error
        ));
        http_response_code(500);
        header('Content-Type: application/json; charset=utf-8');
        echo json_encode(['error' => 'Error de conexión a base de datos.']);
        exit;
    }
    $mysqli->set_charset('utf8');
    return $mysqli;
}
