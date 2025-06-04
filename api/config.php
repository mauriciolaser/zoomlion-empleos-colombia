<?php
// api/config.php

// 1. Configuración MySQL
define('DB_HOST',     'localhost');
define('DB_USER',     'root');
define('DB_PASSWORD', '');                     // XAMPP: contraseña vacía
define('DB_NAME',     'zlcpanel_empleos_db');

// 2. Función para obtener la conexión
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

// 3. (Opcional) Parámetros extra, constantes, rutas, etc.
//    Por ejemplo, podrías definir una constante BASE_PATH o similar si lo necesitas.
