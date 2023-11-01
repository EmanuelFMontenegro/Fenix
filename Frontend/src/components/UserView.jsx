import React from 'react';

const UserView = () => {
  // Aquí defines el contenido o funcionalidades específicas para la vista de usuario común
  return (
    <div>
      <h2>Perfil de Usuario</h2>
      <p>Bienvenido al perfil de usuario.</p>
      {/* Agrega aquí las secciones, opciones de menú, o funcionalidades específicas para el usuario */}
      <div>
        {/* Por ejemplo, una sección para detección facial */}
        <h3>Detección Facial</h3>
        <button>Comenzar Detección</button>
        {/* Otras opciones para el usuario */}
      </div>
    </div>
  );
};

export default UserView;