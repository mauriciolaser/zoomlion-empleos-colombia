<?php
// /empleos/admin/index.php

session_start();

// 1. CORS / preflight
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS, GET');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

// 2. Leer acción
$action = $_GET['action'] ?? '';

// 3. Si viene un POST, forzar que action sea “crear”
//    De lo contrario, devolver error JSON
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    if ($action !== 'crear') {
        http_response_code(400);
        echo json_encode(['error' => 'Acción no válida en POST'], JSON_UNESCAPED_UNICODE);
        exit;
    }

    // Procesar creación de empleo
    // Incluir el archivo que contiene sólo la lógica de INSERT (sin headers CORS adicionales)
    require_once __DIR__ . '/acciones/crear-empleo.php';
    exit;
}

// 4. Petición GET: panel de administración
if (!isset($_SESSION['admin_logged_in']) || $_SESSION['admin_logged_in'] !== true) {
    header('Location: ../login.php');
    exit;
}

switch ($action) {
    case 'listar':
        // Incluir script que imprime HTML o JSON con la lista de empleos
        require_once __DIR__ . '/acciones/listar.php';
        break;

    default:
        // Página principal del panel
        ?>
        <!DOCTYPE html>
        <html lang="es">
        <head>
          <meta charset="UTF-8">
          <title>Panel de Administración</title>
        </head>
        <body>
          <h2>Panel de Administración</h2>
          <ul>
            <li><a href="index.php?action=listar">Ver procesos</a></li>
            <!-- El front-end React hará POST a index.php?action=crear -->
          </ul>
        </body>
        </html>
        <?php
        break;
}
