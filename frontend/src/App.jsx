import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Tienda from './pages/Tienda';
import Login from './pages/Login';
import Admin from './pages/Admin'; // <-- 1. Importamos la nueva página

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Tienda />} />
        <Route path="/login" element={<Login />} />
        
        {/* 2. Reemplazamos el <h1> por el componente real */}
        <Route path="/admin" element={<Admin />} /> 
      </Routes>
    </BrowserRouter>
  );
}

export default App;