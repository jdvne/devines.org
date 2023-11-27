import React from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';

import Home from './pages/Home.jsx';
// import Wedding from '.pages/Wedding.jsx'

const router = createBrowserRouter([
  {
    basename: '/devines.org',
    path: '/',
    element: <Home />
  },
  {
    path: '/wedding',
    element: <></> // <Wedding />
  }
], {
  basename: '/devines.org'
});

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
)
