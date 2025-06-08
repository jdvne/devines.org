import React from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';

import { Home } from './pages/Home.jsx';
import { Wedding } from './pages/Wedding.jsx';
import { Blog } from './pages/Blog.jsx';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Home />
  },
  {
    path: '/wedding',
    element: <Wedding />
  },
  {
    path: '/blog',
    element: <Blog />
  },
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
)
