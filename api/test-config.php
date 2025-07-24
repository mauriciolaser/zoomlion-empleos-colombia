<?php
echo "=== DIAGNÓSTICO CONFIG.PHP ===\n";

$configPath = __DIR__ . '/config.php';
echo "Ruta de config.php: $configPath\n";
echo "¿Existe config.php? " . (file_exists($configPath) ? 'SÍ' : 'NO') . "\n";
echo "¿Es legible? " . (is_readable($configPath) ? 'SÍ' : 'NO') . "\n";

if (file_exists($configPath)) {
    echo "Tamaño del archivo: " . filesize($configPath) . " bytes\n";
    echo "\nIntentando incluir config.php...\n";
    
    try {
        require_once $configPath;
        echo "✅ config.php incluido exitosamente\n";
        
        echo "¿Función obtenerConexionMain existe? " . (function_exists('obtenerConexionMain') ? 'SÍ' : 'NO') . "\n";
        
        if (function_exists('obtenerConexionMain')) {
            echo "Intentando conectar a la base de datos...\n";
            try {
                $mysqli = obtenerConexionMain();
                echo "✅ Conexión a BD exitosa\n";
                echo "Host: " . DB_HOST . "\n";
                echo "Usuario: " . DB_USER . "\n";
                echo "Base de datos: " . DB_NAME . "\n";
                $mysqli->close();
            } catch (Exception $e) {
                echo "❌ Error conectando a BD: " . $e->getMessage() . "\n";
            }
        }
        
    } catch (Exception $e) {
        echo "❌ Error incluyendo config.php: " . $e->getMessage() . "\n";
    }
} else {
    echo "❌ config.php no encontrado\n";
    echo "Contenido del directorio actual:\n";
    $files = scandir(__DIR__);
    foreach ($files as $file) {
        if ($file !== '.' && $file !== '..') {
            echo "  - $file\n";
        }
    }
}
?>