import { createHashRouter, RouterProvider } from 'react-router-dom';
import App from './App';
import { Intro } from './pages/Intro.page';
import { Notes } from './pages/Notes.page';
import { Visualizer } from './pages/Visualizer.page';

const router = createHashRouter([
  {
    Component: App,
    children: [
      {
        index: true,
        Component: Intro,
      },
      {
        path: 'visualize',
        Component: Visualizer,
      },
      {
        path: 'notes',
        Component: Notes,
      },
    ],
  },
]);

export function Router() {
  return <RouterProvider router={router} />;
}
