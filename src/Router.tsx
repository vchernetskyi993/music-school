import { createHashRouter, Navigate, RouterProvider } from 'react-router-dom';
import App from './App';
import { Intervals } from './pages/Intervals.page';
import { Intro } from './pages/Intro.page';
import { Notes } from './pages/Notes.page';
import { Visualizer } from './pages/Visualizer.page';

const router = createHashRouter([
  {
    Component: App,
    errorElement: <Navigate to="intro" />,
    children: [
      {
        index: true,
        element: <Navigate to="intro" />,
      },
      {
        path: 'intro',
        Component: Intro,
      },
      {
        path: 'visualize',
        Component: Visualizer,
      },
      {
        path: 'notes/:tab',
        Component: Notes,
      },
      {
        path: 'intervals',
        Component: Intervals,
      },
    ],
  },
]);

export function Router() {
  return <RouterProvider router={router} />;
}
