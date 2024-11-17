import React from 'react';
import {
  CAvatar,
  CDropdown,
  CDropdownDivider,
  CDropdownItem,
  CDropdownMenu,
  CDropdownToggle,
} from '@coreui/react';
import { cilAccountLogout, cilSettings } from '@coreui/icons';
import CIcon from '@coreui/icons-react';
import avatar8 from './../../assets/images/avatars/8.jpg';
import { useNavigate } from 'react-router-dom';

const AppHeaderDropdown = () => {
  const navigate = useNavigate();

  // Función para cerrar sesión
  const handleLogout = () => {
    // Limpiar el localStorage
    localStorage.clear();

  // Forzar el tema a 'light'
  document.body.classList.remove('dark-theme');
  document.body.classList.add('light-theme');
  
  // Establecer el tema en localStorage
  localStorage.setItem('theme', 'light');
  
  // Redirigir al login
  navigate('/login', { replace: true });

  };

  return (
    <CDropdown variant="nav-item">
      <CDropdownToggle placement="bottom-end" className="py-0 pe-0" caret={false}>
        <CAvatar src={avatar8} size="md" />
      </CDropdownToggle>
      <CDropdownMenu className="pt-0" placement="bottom-end">
        {/* Opción de Settings */}
        <CDropdownItem href="/settings">
          <CIcon icon={cilSettings} className="me-2" />
          Settings
        </CDropdownItem>
        <CDropdownDivider />
        {/* Botón de cerrar sesión */}
        <CDropdownItem onClick={handleLogout}>
          <CIcon icon={cilAccountLogout} className="me-2" />
          Logout
        </CDropdownItem>
      </CDropdownMenu>
    </CDropdown>
  );
};

export default AppHeaderDropdown;
