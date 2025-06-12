<?php
// api/config.php

// 1. Autoload de Composer
require_once __DIR__ . '/../vendor/autoload.php';

// 2. Carga de .env desde la carpeta de credenciales
$dotenv = Dotenv\Dotenv::createImmutable('/home/zoomlionpe/credenciales.empleos.zoomlion.pe');
$dotenv->load();

// 3. Definición de constantes desde variables de entorno
define('DB_HOST',     getenv('DB_HOST'));
define('DB_USER',     getenv('DB_USER'));
define('DB_PASSWORD', getenv('DB_PASSWORD'));
define('DB_NAME',     getenv('DB_NAME'));

// 4. Función para obtener la conexión
function obtenerConexion() {
    $mysqli = new mysqli(DB_HOST, DB_USER, DB_PASSWORD, DB_NAME);
    if ($mysqli->connect_errno) {
        http_response_code(500);
        echo json_encode([
            'error' => 'Error de conexión a BD: ' . $mysqli->connect_error
        ], JSON_UNESCAPED_UNICODE);
        exit;
    }
    $mysqli->set_charset('utf8');
    return $mysqli;
}
