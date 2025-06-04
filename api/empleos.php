<?php
// empleos.php

// 0. Configuración CORS
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

// Responder inmediatamente a solicitudes OPTIONS
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// 1. Forzar que todas las respuestas sean JSON en UTF-8
header('Content-Type: application/json; charset=utf-8');

// 2. Parámetros de conexión MySQL
$host     = 'localhost';
$user     = 'root';
$password = '';             // En XAMPP, por defecto la contraseña de root suele estar en blanco
$dbname   = 'zlcpanel_empleos_db';

// 3. Conexión a la base de datos
$mysqli = new mysqli($host, $user, $password, $dbname);
if ($mysqli->connect_errno) {
    http_response_code(500);
    echo json_encode([
        'error' => 'Error de conexión a la base de datos: ' . $mysqli->connect_error
    ], JSON_UNESCAPED_UNICODE);
    exit;
}

// 4. Obtener método HTTP y URI
$method = $_SERVER['REQUEST_METHOD'];
$uri    = $_SERVER['REQUEST_URI'];

// Si viniese con parámetros, parseamos para obtener solo el path (no es estrictamente necesario aquí,
// pero lo dejamos para futura ampliación)
$parsedUrl = parse_url($uri);
$path      = $parsedUrl['path']; // Ej: "/api/empleos.php"

// 5. RUTEO: GET con id ⇢ detalle; GET sin id ⇢ listado; POST sin postulacion ⇢ crear empleo; POST con ?postulacion=1 ⇢ crear postulación

// 5.1. GET → Detalle de un empleo por ID
if ($method === 'GET' && isset($_GET['id']) && !isset($_GET['postulacion'])) {
    $id = intval($_GET['id']);

    $stmt = $mysqli->prepare("
        SELECT 
            id,
            titulo,
            descripcion,
            empresa,
            ubicacion,
            fecha_publicacion,
            fecha_cierre
        FROM empleos
        WHERE id = ?
    ");
    $stmt->bind_param('i', $id);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($empleo = $result->fetch_assoc()) {
        echo json_encode($empleo, JSON_UNESCAPED_UNICODE);
    } else {
        http_response_code(404);
        echo json_encode(['error' => 'Empleo no encontrado'], JSON_UNESCAPED_UNICODE);
    }

    $stmt->close();
    exit;
}

// 5.2. GET → Listado de todos los empleos
elseif ($method === 'GET' && !isset($_GET['id']) && !isset($_GET['postulacion'])) {
    $query = "
        SELECT 
            id,
            titulo,
            descripcion,
            empresa,
            ubicacion,
            fecha_publicacion,
            fecha_cierre
        FROM empleos
        ORDER BY fecha_publicacion DESC
    ";
    $result = $mysqli->query($query);

    $empleos = [];
    while ($row = $result->fetch_assoc()) {
        $empleos[] = $row;
    }
    echo json_encode($empleos, JSON_UNESCAPED_UNICODE);
    exit;
}

// 5.3. POST → Crear nuevo empleo
if ($method === 'POST' && !isset($_GET['postulacion'])) {
    // Esperamos JSON en el cuerpo con:
    // {
    //   "titulo": "...",
    //   "descripcion": "...",
    //   "empresa": "...",
    //   "ubicacion": "...",
    //   "fecha_publicacion": "YYYY-MM-DD",
    //   "fecha_cierre": "YYYY-MM-DD"  // opcional
    // }
    $data = json_decode(file_get_contents('php://input'), true);
    if (
        !isset($data['titulo']) ||
        !isset($data['descripcion']) ||
        !isset($data['empresa']) ||
        !isset($data['ubicacion']) ||
        !isset($data['fecha_publicacion'])
    ) {
        http_response_code(400);
        echo json_encode(['error' => 'Faltan campos obligatorios para crear un empleo.'], JSON_UNESCAPED_UNICODE);
        exit;
    }

    // Escapar valores para seguridad
    $titulo            = $mysqli->real_escape_string($data['titulo']);
    $descripcion       = $mysqli->real_escape_string($data['descripcion']);
    $empresa           = $mysqli->real_escape_string($data['empresa']);
    $ubicacion         = $mysqli->real_escape_string($data['ubicacion']);
    $fecha_publicacion = $mysqli->real_escape_string($data['fecha_publicacion']);

    // Manejar fecha_cierre opcional
    $fecha_cierre = null;
    if (isset($data['fecha_cierre']) && $data['fecha_cierre'] !== '') {
        $fecha_cierre = $mysqli->real_escape_string($data['fecha_cierre']);
    }

    $sql = "
        INSERT INTO empleos
            (titulo, descripcion, empresa, ubicacion, fecha_publicacion, fecha_cierre)
        VALUES
            (?, ?, ?, ?, ?, ?)
    ";
    $stmt = $mysqli->prepare($sql);
    $stmt->bind_param(
        'ssssss',
        $titulo,
        $descripcion,
        $empresa,
        $ubicacion,
        $fecha_publicacion,
        $fecha_cierre
    );

    if ($stmt->execute()) {
        http_response_code(201);
        echo json_encode([
            'message' => 'Empleo creado correctamente',
            'id'      => $stmt->insert_id
        ], JSON_UNESCAPED_UNICODE);
    } else {
        http_response_code(500);
        echo json_encode([
            'error' => 'No se pudo crear el empleo: ' . $stmt->error
        ], JSON_UNESCAPED_UNICODE);
    }
    $stmt->close();
    exit;
}

// 5.4. POST → Crear nueva postulación (multipart/form-data) con ?postulacion=1
if ($method === 'POST' && isset($_GET['postulacion'])) {
    // Campos esperados en formulario:
    // - usuario_id  (INT)
    // - empleo_id   (INT)
    // - archivo     (file) – CV
    // - mensaje     (texto opcional)
    if (!isset($_POST['usuario_id'], $_POST['empleo_id']) || !isset($_FILES['archivo'])) {
        http_response_code(400);
        echo json_encode(['error' => 'Faltan campos obligatorios para la postulación.'], JSON_UNESCAPED_UNICODE);
        exit;
    }

    $usuario_id = intval($_POST['usuario_id']);
    $empleo_id  = intval($_POST['empleo_id']);
    $mensaje    = isset($_POST['mensaje']) ? $mysqli->real_escape_string($_POST['mensaje']) : null;

    // Procesar archivo: guardarlo en /uploads/
    $uploadDir = __DIR__ . '/uploads/';
    if (!is_dir($uploadDir)) {
        mkdir($uploadDir, 0755, true);
    }

    $archivo    = $_FILES['archivo'];
    $tmpName    = $archivo['tmp_name'];
    $original   = basename($archivo['name']);
    $timestamp  = time();
    $destino    = $uploadDir . $timestamp . '_' . $original;

    if (!move_uploaded_file($tmpName, $destino)) {
        http_response_code(500);
        echo json_encode(['error' => 'Error al subir el archivo.'], JSON_UNESCAPED_UNICODE);
        exit;
    }

    // Guardar ruta relativa en la base de datos
    $rutaRelativa = 'uploads/' . basename($destino);

    $sql = "
        INSERT INTO postulaciones
            (usuario_id, empleo_id, archivo, mensaje)
        VALUES
            (?, ?, ?, ?)
    ";
    $stmt = $mysqli->prepare($sql);
    $stmt->bind_param(
        'iiss',
        $usuario_id,
        $empleo_id,
        $rutaRelativa,
        $mensaje
    );

    if ($stmt->execute()) {
        http_response_code(201);
        echo json_encode([
            'message' => 'Postulación registrada correctamente',
            'id'      => $stmt->insert_id
        ], JSON_UNESCAPED_UNICODE);
    } else {
        http_response_code(500);
        echo json_encode([
            'error' => 'No se pudo guardar la postulación: ' . $stmt->error
        ], JSON_UNESCAPED_UNICODE);
    }
    $stmt->close();
    exit;
}

// 6. Si ninguna ruta coincide, devolver 404
http_response_code(404);
echo json_encode(['error' => 'Ruta no encontrada o método no soportado'], JSON_UNESCAPED_UNICODE);
exit;
?>
