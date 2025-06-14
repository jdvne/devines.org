import React from 'react';
import './styles/global.css';
import ReactDOM from 'react-dom/client';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';

import { Home } from './pages/Home.jsx';
import { Wedding } from './pages/Wedding.jsx';
import { Thoughts } from './pages/Thoughts.jsx';
import { Thought } from './pages/Thought.jsx';
import Contact from './pages/Contact.jsx';
import { Recipe } from './pages/Recipe.jsx';
import { Cookbook } from './pages/Cookbook.jsx';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Home />
  },
  {
    path: '/contact',
    element: <Contact />
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
