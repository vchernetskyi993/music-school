import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import App from './App';
import { Intro } from './components/Intro';
import { HomePage } from './pages/Home.page';

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {
        index: true,
        element: <Intro />,
      },
      {
        path: '/visualize',
        element: <HomePage />,
      },
    ],
  },
]);

export function Router() {
  return <RouterProvider router={router} />;
}
