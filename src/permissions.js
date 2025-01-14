// Verificar si un usuario tiene un permiso específico
export const hasPermission = (user, requiredPermission) => {
  if (!user) {
    return false;
  }

  // Asegúrate de que los permisos estén disponibles en el usuario
  const userPermissions = user.permissions || []; // Permisos en el token

  return userPermissions.includes(requiredPermission);
};

// Verificar si un usuario tiene un rol específico
export const hasRole = (user, requiredRoleId) => {
  if (!user || !user.role_id) return false;
  return user.role_id === requiredRoleId;
};

// Nota: Como los permisos están en el token JWT, ya no necesitas llamar al backend para obtenerlos
