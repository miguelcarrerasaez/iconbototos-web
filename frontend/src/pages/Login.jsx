import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Toaster, toast } from 'sonner';

// Detectamos si estamos en local o en producción de forma automática
const BACKEND_URL = window.location.hostname === "127.0.0.1" || window.location.hostname === "localhost"
    ? "http://127.0.0.1:5000"                
    : "https://iconbototos-api.onrender.com"; 

export default function Login() {
  const [usuario, setUsuario] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const manejarLogin = async (e) => {
    e.preventDefault();
    
    try {
      // 1. Le enviamos a Python el usuario y contraseña (usando la URL dinámica)
      const respuesta = await fetch(`${BACKEND_URL}/api/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ usuario: usuario, password: password })
      });

      if (respuesta.ok) {
        const data = await respuesta.json();
        // 2. Guardamos la llave con el nombre EXACTO que busca el panel de Admin
        localStorage.setItem('token', data.token); 
        
        toast.success('¡Bienvenida! Ingresando al panel...');
        setTimeout(() => navigate('/admin'), 1500);
      } else {
        toast.error('Credenciales incorrectas ❌');
      }
    } catch (error) {
      toast.error('Error al conectar con el servidor');
    }
  };

  return (
    <div style={{ height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor: '#f5f5f5' }}>
      <Toaster richColors position="top-center" />
      
      <form onSubmit={manejarLogin} style={{ backgroundColor: 'white', padding: '40px', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', width: '100%', maxWidth: '350px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
        
        <div style={{ textAlign: 'center', marginBottom: '10px' }}>
          <h2 style={{ margin: 0, letterSpacing: '2px' }}>ICONBOTOTOS</h2>
          <p style={{ color: '#666', margin: '5px 0 0 0' }}>Acceso Administrativo</p>
        </div>

        <input 
          type="text" 
          placeholder="Usuario" 
          value={usuario}
          onChange={(e) => setUsuario(e.target.value)}
          style={{ padding: '12px', border: '1px solid #ccc', borderRadius: '4px', fontSize: '1rem' }}
        />
        
        <input 
          type="password" 
          placeholder="Contraseña" 
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{ padding: '12px', border: '1px solid #ccc', borderRadius: '4px', fontSize: '1rem' }}
        />
        
        <button type="submit" style={{ padding: '12px', backgroundColor: 'black', color: 'white', border: 'none', borderRadius: '4px', fontSize: '1rem', fontWeight: 'bold', cursor: 'pointer' }}>
          Ingresar
        </button>
        
        <button type="button" onClick={() => navigate('/')} style={{ background: 'none', border: 'none', color: '#666', cursor: 'pointer', textDecoration: 'underline' }}>
          Volver a la tienda
        </button>
      </form>
    </div>
  );
}