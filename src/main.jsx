import React from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';

import { Home } from './pages/Home.jsx';
import { Wedding } from './pages/Wedding.jsx';
import { Thoughts } from './pages/Thoughts.jsx';
import { Thought } from './pages/Thought.jsx';
import { NotFound } from './pages/NotFound.jsx';

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
    path: '/thoughts',
    element: <Thoughts />
  },
  {
    path: '/thoughts/:slug',
    element: <Thought />
  },
  {
    path: '*',
    element: <NotFound />
  }
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
)
