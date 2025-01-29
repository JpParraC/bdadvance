import React from 'react'
import CIcon from '@coreui/icons-react'
import {
  cilSpeedometer,
  cilControl,
  cilGroup,
  cilDescription,
  cilMoney,
  cilCalendar,
  cilRoom,
  cilBriefcase,
  cilTask,
  cilUser,
} from '@coreui/icons'
import { CNavItem } from '@coreui/react'
import { useAuth } from '../src/contexts/authcontext';  // Asegúrate de que tienes un contexto de autenticación
import { hasPermission, hasRole } from './permissions';  // Importa las funciones de permisos

const NavItems = () => {
  const { user } = useAuth(); // Obtener el usuario desde el contexto de autenticación

  // Definir los items de navegación
  const items = [
    {
      component: CNavItem,
      name: 'Dashboard',
      to: '/dashboard',
      icon: <CIcon icon={cilSpeedometer} customClassName="nav-icon" />,
      badge: {
        color: 'info',
        text: 'NEW',
      },
      visible: hasPermission(user, 'view_dashboard'),
    },
    {
      component: CNavItem,
      name: 'My Profile',
      to: '/myprofile',
      icon: <CIcon icon={cilUser} customClassName="nav-icon" />,
      
      visible: hasPermission(user, 'view_profile'),
    },
    {
      component: CNavItem,
      name: 'Add Administrator',
      to: '/adm',
      icon: <CIcon icon={cilControl} customClassName="nav-icon" />,
      visible: hasPermission(user, 'manage_admins') && hasRole(user, 1), // Solo administradores
    },
    {
      component: CNavItem,
      name: 'Clients',
      to: '/clients',
      icon: <CIcon icon={cilGroup} customClassName="nav-icon" />,
      visible: hasPermission(user, 'manage_clients'),
    },
    {
      component: CNavItem,
      name: 'Reservations',
      to: '/reservation',
      icon: <CIcon icon={cilDescription} customClassName="nav-icon" />,
      visible: hasPermission(user, 'manage_reservations'),
    },
    {
      component: CNavItem,
      name: 'Invoice & Pay',
      to: '/invoice',
      icon: <CIcon icon={cilMoney} customClassName="nav-icon" />,
      visible: hasPermission(user, 'view_invoice'),
    },
    {
      component: CNavItem,
      name: 'Calendar Rooms',
      to: '/calendar',
      icon: <CIcon icon={cilCalendar} customClassName="nav-icon" />,
      visible: hasPermission(user, 'view_calendar'),
    },
    {
      component: CNavItem,
      name: 'Rooms',
      to: '/room',
      icon: <CIcon icon={cilRoom} customClassName="nav-icon" />,
      visible: hasPermission(user, 'view_rooms'),
    },
    {
      component: CNavItem,
      name: 'Staff',
      to: '/staff',
      icon: <CIcon icon={cilBriefcase} customClassName="nav-icon" />,
      visible: hasPermission(user, 'view_staff'),
    },
    {
      component: CNavItem,
      name: 'Task',
      to: '/task',
      icon: <CIcon icon={cilTask} customClassName="nav-icon" />,
      visible: hasPermission(user, 'manage_tasks'),
    },
  ];

  // Filtrar los items para que solo se muestren los que tienen "visible" como true
  return items.filter(item => item.visible);
};

export default NavItems;
