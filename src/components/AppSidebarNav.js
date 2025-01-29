import React from 'react';
import PropTypes from 'prop-types';
import { CNavItem, CNavLink, CSidebarNav, CBadge } from '@coreui/react';
import SimpleBar from 'simplebar-react';
import 'simplebar-react/dist/simplebar.min.css';
import { NavLink } from 'react-router-dom';

export const AppSidebarNav = ({ items }) => {
  // Generar enlaces de navegación
  const navLink = (name, icon, badge, indent = false) => {
    return (
      <>
        {icon ? icon : indent && <span className="nav-icon"><span className="nav-icon-bullet"></span></span>}
        {name && name}
        {badge && (
          <CBadge color={badge.color} className="ms-auto">
            {badge.text}
          </CBadge>
        )}
      </>
    );
  };

  // Renderizar un item de navegación
  const navItem = (item, index, indent = false) => {
    const { component, name, badge, icon, to, href, ...rest } = item;
    const Component = component || CNavItem;

    // Filtrar propiedades no deseadas para evitar warnings
    const filteredProps = { ...rest };
    delete filteredProps.visible;

    return (
      <Component key={index}>
        {to || href ? (
          <CNavLink
            {...(to ? { as: NavLink, to } : { href })}
            {...filteredProps}
          >
            {navLink(name, icon, badge, indent)}
          </CNavLink>
        ) : (
          navLink(name, icon, badge, indent)
        )}
      </Component>
    );
  };

  // Renderizar un grupo de navegación
  const navGroup = (item, index) => {
    const { component, name, icon, items, to, ...rest } = item;
    const Component = component || 'div';

    // Filtrar propiedades no deseadas
    const filteredProps = { ...rest };
    delete filteredProps.visible;

    return (
      <Component compact key={index} toggler={navLink(name, icon)} {...filteredProps}>
        {items?.map((childItem, childIndex) =>
          childItem.items ? navGroup(childItem, childIndex) : navItem(childItem, childIndex, true),
        )}
      </Component>
    );
  };

  return (
    <CSidebarNav as={SimpleBar}>
      {items &&
        items.map((item, index) =>
          item.items ? navGroup(item, index) : navItem(item, index),
        )}
    </CSidebarNav>
  );
};

AppSidebarNav.propTypes = {
  items: PropTypes.arrayOf(PropTypes.object).isRequired,
};
