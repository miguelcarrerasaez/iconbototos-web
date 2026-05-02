import React from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Catalogo from './components/Catalogo'; // <-- Importamos el componente
import Footer from './components/Footer';

function App() {
  return (
    <div>
      <Navbar />
      <Hero />
      
      {/* Reemplazamos el mensaje de "En construcción" por nuestro componente real */}
      <Catalogo /> 

      <Footer />
    </div>
  );
}

export default App;