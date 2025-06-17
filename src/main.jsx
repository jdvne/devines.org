import React from 'react';
import './styles/global.css';
import ReactDOM from 'react-dom/client';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';

import { Home } from './pages/Home.jsx';
import { Wedding } from './pages/wedding/Wedding.jsx';
import { Thoughts } from './pages/thoughts/Thoughts.jsx';
import { Thought } from './pages/thoughts/Thought.jsx';
import { Contact } from './pages/contact/Contact.jsx';
import { Recipe } from './pages/cookbook/Recipe.jsx';
import { Cookbook } from './pages/cookbook/Cookbook.jsx';
import { Coffee } from './pages/coffee/Coffee.jsx';

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
