import React from 'react'
import CIcon from '@coreui/icons-react'
import {
  cilBell,
  cilBriefcase,
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
  cilPeople,
  cilPuzzle,
  cilRoom,
  cilSpeedometer,
  cilStar,
  cilTask,
  cilUser,
  cilUserFollow,
  cilUserPlus,
  cilWallpaper,
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
    name: 'Rooms', 
    to: '/room', 
    icon: <CIcon icon={cilRoom} customClassName="nav-icon" />,
   
  },
  {
    component: CNavItem,
    name: 'Staff', 
    to: '/staff', 
    icon: <CIcon icon={cilBriefcase} customClassName="nav-icon" />,
   
  },
  {
    component: CNavItem,
    name: 'Task', 
    to: '/task', 
    icon: <CIcon icon={cilTask} customClassName="nav-icon" />,
   
  }
 
];

export default _nav
