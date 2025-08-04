import React from 'react'
import { HomeLayout } from './components/HomeLayout'
import { Dashboard } from './components/Dashboard'
import { NotFound } from './components/NotFound' // Import your NotFound component
import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom'

const router = createBrowserRouter([
  {
    path: "/",
    element: <HomeLayout />
  },
  {
    path: "/dashboard",
    element: <Dashboard />
  },
  {
    path: "/auth/callback",
    element: <Navigate to="/dashboard" replace />
  },
  {
    path: "*",
    element: <NotFound /> 
  }
])

export function App() {
  return <RouterProvider router={router} />
}
