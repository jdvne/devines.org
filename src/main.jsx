import React from 'react';
import './styles/global.css';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import { Coffee } from './pages/coffee/Coffee.jsx';
import { Cookbook } from './pages/cookbook/Cookbook.jsx';
import { Recipe } from './pages/cookbook/Recipe.jsx';
import { Home } from './pages/Home.jsx';
import { Slots } from './pages/slots/Slots.jsx';
import { Thought } from './pages/thoughts/Thought.jsx';
import { Thoughts } from './pages/thoughts/Thoughts.jsx';
import { Wedding } from './pages/wedding/Wedding.jsx';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Home />
  },
  {
    path: '/coffee',
    element: <Coffee />
  },
  {
    path: '/slots',
    element: <Slots />
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
    path: '/cookbook',
    element: <Cookbook />
  },
  {
    path: '/cookbook/:recipeName',
    element: <Recipe />
  }
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
)
