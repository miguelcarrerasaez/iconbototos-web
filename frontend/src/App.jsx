import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Tienda from './pages/Tienda';
import Login from './pages/Login';

function App() {
  return (
    // BrowserRouter envuelve la aplicación permitiendo la navegación
    <BrowserRouter>
      <Routes>
        {/* Si la ruta es "/" muestra la Tienda */}
        <Route path="/" element={<Tienda />} />
        
        {/* Si la ruta es "/login" muestra el formulario */}
        <Route path="/login" element={<Login />} />
        
        {/* Dejamos preparada la ruta del panel de administración */}
        <Route path="/admin" element={<h1 style={{textAlign: 'center', marginTop: '50px'}}>Panel Admin en construcción... 🚧</h1>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;