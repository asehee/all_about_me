import { createBrowserRouter, Navigate } from 'react-router-dom'
import Layout from '@/components/layout/Layout'
import Home from '@/features/home/Home'
import About from '@/features/about/About'
import Blog from '@/features/blog/Blog'
import Profile from '@/features/profile/Profile'
import Etc from '@/features/etc/Etc'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: 'about',
        element: <About />,
      },
      {
        path: 'blog',
        element: <Blog />,
      },
      {
        path: 'blog/:slug',
        element: <Blog />,
      },
      {
        path: 'profile',
        element: <Profile />,
      },
      {
        path: 'articles',
        element: <Blog />,
      },
      {
        path: 'articles/:slug',
        element: <Blog />,
      },
      {
        path: 'etc',
        element: <Etc />,
      },
      {
        path: 'etc/github',
        element: <Navigate to="/etc" replace />,
      },
    ],
  },
])
