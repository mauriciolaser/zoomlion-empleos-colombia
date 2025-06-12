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

// 2. Delegar en el router central
require_once __DIR__ . '/admin.php';
