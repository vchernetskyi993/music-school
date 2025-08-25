import { createHashRouter, RouterProvider } from 'react-router-dom';
import App from './App';
import { Intro } from './components/Intro';
import { Notes } from './components/Notes';
import { Visualizer } from './components/Visualizer';

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
