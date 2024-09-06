import { createBrowserRouter } from 'react-router-dom'

import { AppLayout } from './pages/_layouts/app'
import { AuthLayout } from './pages/_layouts/auth'
import Home from './pages/app/Home/home'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <AppLayout />,
    children: [{
      path: '/',
      element: <Home />,
    }],
  },
  {
    path: '/',
    element: <AuthLayout />,
    children: [
      {
        path: '/sign-in',
        element: <div>Login</div>,
      },
      {
        path: '/sign-up',
        element: <div>Sign UP</div>,
      },

    ],
  },
])
