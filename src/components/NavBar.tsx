import { useMatch, useNavigate } from 'react-router-dom';
import { AppShell, NavLink } from '@mantine/core';

type ME = React.MouseEvent<HTMLAnchorElement, MouseEvent>;
type Link = { to: string; label: string };

export const pages: { [key: string]: Link } = {
  intro: { to: '/', label: 'Introduction' },
  visualize: { to: '/visualize', label: 'Visualize Note' },
  studyNotes: { to: '/notes', label: 'Study Notes' },
};

const links = [pages.intro, pages.visualize, pages.studyNotes];

export function NavBar({ toggle }: { toggle: () => void }) {
  const navigate = useNavigate();
  const navigateAction = (route: string) => (event: ME) => {
    event.preventDefault();
    navigate(route);
    toggle();
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
