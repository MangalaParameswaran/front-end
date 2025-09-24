import './App.css'
import { Navigate, Route, Routes } from 'react-router-dom'
import { lazy, Suspense, useEffect, useState } from 'react';
import { ToastContainer } from 'react-toastify';
import  PrivateRoute from './utils/protectedRoutes'
const LoginPage = lazy(() => import('./pages/LoginPage'));
const RegisterPage = lazy(() => import('./pages/RegisterPage'));
const WeatherPage = lazy(() => import('./pages/WeatherPage'));


function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(
    !!sessionStorage.getItem('authToken')
  );

  return (
    <>
    <Suspense fallback={<div className='text-center mt-4'>Loading ...</div>} >
      <Routes>
        {/* Private route defined */}
        <Route path='/' element={
          <PrivateRoute>
          <WeatherPage setIsAuthenticated = {setIsAuthenticated} />
          </PrivateRoute>
          } />

          {/* Publish routes */}
        <Route path='/login' element={ isAuthenticated ? <Navigate to={'/'}/> : <LoginPage setIsAuthenticated = {setIsAuthenticated} />} />
        <Route path="/register" element={<RegisterPage />} />
      </Routes>
      </Suspense>
      <ToastContainer/>
    </>
  )
}

export default App
