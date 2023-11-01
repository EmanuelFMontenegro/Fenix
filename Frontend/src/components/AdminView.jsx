import React, { useEffect } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const AdminView = () => {
  useEffect(() => {
    toast.success('¡Estás en el perfil de administrador!', { autoClose: 3000 });
  }, []);

  return (
    <div>
      <h2>Perfil de Administrador</h2>
      <p>Bienvenido al perfil de administrador. Aquí puedes acceder a todas las funcionalidades.</p>
     
      <div>
      
      </div>
    </div>
  );
};

export default AdminView;
