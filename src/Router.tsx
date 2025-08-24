import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import App from './App';
import { Intro } from './components/Intro';
import { HomePage } from './pages/Home.page';

export const basePath = '/music-school'

const router = createBrowserRouter([
  {
    path: basePath,
    Component: App,
    children: [
      {
        index: true,
        Component: Intro,
      },
      {
        path: 'visualize',
        Component: HomePage,
      },
    ],
  },
]);

export function Router() {
  return <RouterProvider router={router} />;
}
