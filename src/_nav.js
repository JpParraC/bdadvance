import React from 'react'
import CIcon from '@coreui/icons-react'
import {
  cilBell,
  cilCalculator,
  cilCalendar,
  cilChartPie,
  cilControl,
  cilCursor,
  cilDescription,
  cilDrop,
  cilGroup,
  cilNotes,
  cilPencil,
  cilPuzzle,
  cilRoom,
  cilSpeedometer,
  cilStar,
  cilUser,
} from '@coreui/icons'
import { CNavGroup, CNavItem, CNavTitle } from '@coreui/react'

const _nav = [
  {
    component: CNavItem,
    name: 'Dashboard',
    to: '/dashboard',
    icon: <CIcon icon={cilSpeedometer} customClassName="nav-icon" />,
    badge: {
      color: 'info',
      text: 'NEW',
    },
  },
  {
    component: CNavItem,
    name: 'Add Admnistrator', // Nombre que aparecerá en el menú
    to: '/adm', // Ruta hacia la pantalla de clientes
    icon: <CIcon icon={cilControl} customClassName="nav-icon" />,
   
  },
  {
    component: CNavItem,
    name: 'Clients', // Nombre que aparecerá en el menú
    to: '/clients', // Ruta hacia la pantalla de clientes
    icon: <CIcon icon={cilGroup} customClassName="nav-icon" />,
   
  },
  {
    component: CNavItem,
    name: 'Calendar Rooms', // Nombre que aparecerá en el menú
    to: '/calendar', // Ruta hacia la pantalla de clientes
    icon: <CIcon icon={cilCalendar} customClassName="nav-icon" />,
   
  },
  {
    component: CNavItem,
    name: 'Rooms', // Nombre que aparecerá en el menú
    to: '/room', // Ruta hacia la pantalla de clientes
    icon: <CIcon icon={cilRoom} customClassName="nav-icon" />,
   
  },
  {
    component: CNavGroup,
    name: 'Pages',
    icon: <CIcon icon={cilStar} customClassName="nav-icon" />,
    items: [
      {
        component: CNavItem,
        name: 'Login',
        to: '/login',
      },
      {
        component: CNavItem,
        name: 'Register',
        to: '/register',
      },
      
    ],
  },
 
];

export default _nav
