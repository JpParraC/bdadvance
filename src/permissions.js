// permissions.js

// Verificar si un usuario tiene un permiso específico
export const hasPermission = (user, requiredPermission) => {
  if (!user) {
    return false;
  }

  // Asegúrate de que los permisos estén disponibles en el usuario
  const userPermissions = user.permissions || [];

  return userPermissions.includes(requiredPermission);
};

// Verificar si un usuario tiene un rol específico
export const hasRole = (user, role) => {
  if (!user || !user.role) return false;
  return user.role === role;
};

// Obtener los permisos asociados a un rol, si es necesario llamar al backend para obtenerlos
export const getPermissionsFromRole = async (role_id) => {
  try {
    // Aquí llamamos al backend para obtener los permisos según el rol
    const response = await axios.get(`http://localhost:3001/roles/${role_id}/permissions`);
    return response.data.permissions || [];
  } catch (error) {
    console.error("Error fetching role permissions:", error);
    return [];
  }
};
