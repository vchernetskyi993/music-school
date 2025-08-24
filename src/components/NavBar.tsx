import { useState } from 'react';
import { useMatch, useNavigate } from 'react-router-dom';
import { AppShell, NavLink } from '@mantine/core';

type ME = React.MouseEvent<HTMLAnchorElement, MouseEvent>;

export const pages = {
  intro: { to: '/', label: 'Introduction' },
  visualize: { to: '/visualize', label: 'Visualize Note' },
};

const links = [pages.intro, pages.visualize];

export function NavBar() {
  const navigate = useNavigate();
  const navigateAction = (route: string) => (event: ME) => {
    event.preventDefault();
    navigate(route);
  };

  return (
    <AppShell.Navbar p="md">
      {links.map((link) => (
        <NavLink
          href={link.to}
          label={link.label}
          variant="subtle"
          active={!!useMatch(link.to)}
          onClick={navigateAction(link.to)}
        />
      ))}
    </AppShell.Navbar>
  );
}
