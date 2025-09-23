import './App.css'
import { Navigate, Route, Routes } from 'react-router-dom'
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import WeatherPage from './pages/WeatherPage';
import { useEffect, useState } from 'react';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(
    !!sessionStorage.getItem('authToken')
  );

  // useEffect(() => {
  //   // runs whenever sessionStorage changes (login/logout)
  //   const checkAuth = () => {
  //     setIsAuthenticated(!!sessionStorage.getItem('authToken'));
  //   };
  //   // run once on mount
  //   checkAuth();
  // }, []);
  

  return (
    <>
      <Routes>
        <Route path='/' element={isAuthenticated ? <WeatherPage setIsAuthenticated = {setIsAuthenticated} /> : <Navigate to={'/login'} />} />
        <Route path='/login' element={ isAuthenticated ? <Navigate to={'/'}/> : <LoginPage setIsAuthenticated = {setIsAuthenticated} />} />
        <Route path="/register" element={<RegisterPage />} />
      </Routes>
    </>
  )
}

export default App
