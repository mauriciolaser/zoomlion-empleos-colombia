<?php
// /empleos/admin/acciones/listar.php

// Esta página solo se muestra tras validación de sesión en index.php

require_once __DIR__ . '/../../api/config.php';
$mysqli = obtenerConexion();

$result = $mysqli->query("SELECT id, titulo, empresa, ubicacion, fecha_publicacion, fecha_cierre FROM empleos ORDER BY fecha_publicacion DESC");

?>
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <title>Listar Empleos</title>
</head>
<body>
  <h2>Listado de Empleos</h2>
  <table border="1" cellpadding="5" cellspacing="0">
    <thead>
      <tr>
        <th>ID</th>
        <th>Título</th>
        <th>Empresa</th>
        <th>Ubicación</th>
        <th>Publicación</th>
        <th>Cierre</th>
      </tr>
    </thead>
    <tbody>
      <?php while ($row = $result->fetch_assoc()): ?>
        <tr>
          <td><?php echo htmlspecialchars($row['id']); ?></td>
          <td><?php echo htmlspecialchars($row['titulo']); ?></td>
          <td><?php echo htmlspecialchars($row['empresa']); ?></td>
          <td><?php echo htmlspecialchars($row['ubicacion']); ?></td>
          <td><?php echo htmlspecialchars($row['fecha_publicacion']); ?></td>
          <td><?php echo htmlspecialchars($row['fecha_cierre']); ?></td>
        </tr>
      <?php endwhile; ?>
    </tbody>
  </table>
  <p><a href="index.php">Volver al panel</a></p>
</body>
</html>
<?php
exit;
