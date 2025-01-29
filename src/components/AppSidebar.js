import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { CSidebar, CSidebarBrand, CSidebarHeader, CSidebarFooter, CSidebarToggler } from '@coreui/react';
import NavItems from '../_nav.js'; 
import { AppSidebarNav } from './AppSidebarNav';
import logo from '../assets/images/avatars/logo.png'; 

const AppSidebar = () => {
  const dispatch = useDispatch();
  const unfoldable = useSelector((state) => !!state.sidebarUnfoldable); // Asegurar booleano
  const sidebarShow = useSelector((state) => !!state.sidebarShow); // Asegurar booleano

  return (
    <CSidebar
      className="border-end"
      colorScheme="light" // Forzar el modo claro
      style={{ backgroundColor: '#b4d3ff' }} // Fondo claro opcional
      position="fixed"
      unfoldable={unfoldable}
      visible={sidebarShow}
      onVisibleChange={(visible) => {
        dispatch({ type: 'set', sidebarShow: visible });
      }}
    >
      <CSidebarHeader className="border-bottom">
        <CSidebarBrand to="/">
          <img src={logo} alt="Cadena Hotelera" style={{ width: '100%', height: 'auto' }} />
        </CSidebarBrand>
      </CSidebarHeader>

      {/* Navegación de la barra lateral */}
      <AppSidebarNav items={NavItems()} />

      <CSidebarFooter className="border-top d-none d-lg-flex">
        <CSidebarToggler
          onClick={() => dispatch({ type: 'set', sidebarUnfoldable: !unfoldable })}
        />
      </CSidebarFooter>
    </CSidebar>
  );
};

export default React.memo(AppSidebar);
