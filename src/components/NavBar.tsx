import { useMatch, useNavigate } from 'react-router-dom';
import { AppShell, NavLink } from '@mantine/core';
import { basePath } from '@/Router';

type ME = React.MouseEvent<HTMLAnchorElement, MouseEvent>;

class Link {
  private readonly _to: string;
  readonly label: string;

  constructor(to: string, label: string) {
    this._to = to;
    this.label = label;
  }

  get to() {
    return `${basePath}${this._to}`;
  }
}

export const pages: { [key: string]: Link } = {
  intro: new Link('/', 'Introduction'),
  visualize: new Link('/visualize', 'Visualize Note'),
};

const links = [pages.intro, pages.visualize];

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
