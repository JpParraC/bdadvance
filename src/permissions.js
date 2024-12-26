// permissions.js

export const hasPermission = (user, permission) => {
    if (!user || !user.permissions) return false;
    return user.permissions.includes(permission);
  };
  
  export const hasRole = (user, role) => {
    if (!user || !user.role) return false;
    return user.role === role;
  };
  
  // Ejemplo: roles que heredan permisos
  const rolePermissions = {
    superadmin: ["manage_clients", "manage_reservations", "view_rooms", "view_dashboard"],
    reader: ["view_all"],
    receptionist: ["manage_clients", "view_all"],
  };
  
  // Obtener permisos desde un rol
  export const getPermissionsFromRole = (role) => {
    return rolePermissions[role] || [];
  };
  