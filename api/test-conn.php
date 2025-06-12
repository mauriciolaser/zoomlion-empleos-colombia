<?php
require_once __DIR__ . '/config.php';
$conn = obtenerConexion();
echo json_encode(['status' => 'OK']);
