import { generatePath, useMatch, useNavigate } from 'react-router-dom';
import { AppShell, NavLink } from '@mantine/core';

type ME = React.MouseEvent<HTMLAnchorElement, MouseEvent>;
type Link = { to: string; label: string; params?: { [key: string]: string } };

export const pages: { [key: string]: Link } = {
  intro: { to: '/intro', label: 'Introduction' },
  visualize: { to: '/visualize', label: 'Visualize Note' },
  studyNotes: { to: '/notes/:tab', params: { tab: 'spn' }, label: 'Study Notes' },
};

const links = [pages.intro, pages.visualize, pages.studyNotes];

export function NavBar({ toggle }: { toggle: () => void }) {
  const navigate = useNavigate();
  const navigateAction = (link: Link) => (event: ME) => {
    event.preventDefault();
    navigate(generatePath(link.to, link.params));
    toggle();
  };

  return (
    <AppShell.Navbar p="md">
      {links.map((link) => (
        <NavLink
          href={generatePath(link.to, link.params)}
          label={link.label}
          variant="subtle"
          active={!!useMatch(link.to)}
          onClick={navigateAction(link)}
        />
      ))}
    </AppShell.Navbar>
  );
}
