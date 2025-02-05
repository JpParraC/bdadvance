import React, { useState, useEffect } from 'react';
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
import avatarMan from './../../assets/images/avatars/avatarman.png';
import avatarWoman from './../../assets/images/avatars/avatarfemale.png'; // Asegúrate de tener una imagen para el avatar femenino
import { useNavigate } from 'react-router-dom';
import jwtDecode from "jwt-decode";

const AppHeaderDropdown = () => {
  const navigate = useNavigate();
  const [avatar, setAvatar] = useState(null); // Usar el estado para el avatar

  useEffect(() => {
    const storedGen = localStorage.getItem("gen");
    let gender = storedGen ? storedGen.toLowerCase() : "";

    if (!gender) {
      const token = localStorage.getItem("token");
      if (token) {
        const decodedToken = jwtDecode(token);
        gender = decodedToken.gen ? decodedToken.gen.toLowerCase() : "";
      }
    }

    // Asignar el avatar según el género
    if (gender === "m") {
      setAvatar(avatarMan);
    } else if (gender === "f") {
      setAvatar(avatarWoman);
    }
  }, []); // Este efecto solo se ejecutará una vez al cargar el componente

  // Función para cerrar sesión
  const handleLogout = () => {
    console.log("Logout llamado");
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
        <CAvatar src={avatar} size="md" />
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
