import React, { useState } from 'react'
import { HomeLayout } from './components/HomeLayout'
import { Dashboard } from './components/Dashboard';
import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom'

// Router configuration
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
  }

]);

export function App() {
  return <RouterProvider router={router} />;
}
