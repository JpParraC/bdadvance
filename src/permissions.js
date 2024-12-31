// permissions.js

// Objeto que define los permisos asignados a cada rol
const rolePermissions = {
  superadmin: ["manage_clients", "view_rooms", "view_dashboard","manage_admins", "view_staff" ,"manage_tasks", "view_invoice", "view_calendar","manage_reservations"],
  reader: ["view_all"],
  receptionist: ["manage_clients"],
};

export const hasPermission = (user, requiredPermission) => {
  if (!user) {
    return false;
  }

  // Combina permisos del usuario y los de su rol
  const rolePermissions = getPermissionsFromRole(user.role);
  const userPermissions = user.permissions || [];

  const allPermissions = [...new Set([...rolePermissions, ...userPermissions])];

  return allPermissions.includes(requiredPermission);
};


// Verificar si un usuario tiene un rol específico
export const hasRole = (user, role) => {
  if (!user || !user.role) return false;
  return user.role === role;
};

// Obtener los permisos asociados a un rol
export const getPermissionsFromRole = (role) => {
  return rolePermissions[role] || [];
};
