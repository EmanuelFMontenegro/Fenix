import React, { useState, useEffect } from 'react';
import EmpleadoCard from './EmpleadoCard';

const Empleados = () => {
  const [empleados, setEmpleados] = useState([]);

  const fetchData = async () => {
    try {
      const response = await fetch('/empleados');
      if (!response.ok) {
        throw new Error('Error al obtener los datos');
      }
      const data = await response.json();
      setEmpleados(data); 
    } catch (error) {
      console.error('Error al obtener los empleados:', error);
    }
  };

  useEffect(() => {
    fetchData(); 
  }, []); 

  return (
    <div className="empleados">
      <h1>Empleados</h1>
      <div className="grid-container">
        {empleados.map((empleado, index) => (
          <EmpleadoCard
            key={index}
            nombre={empleado.usuario_nombre}
            foto={empleado.foto} 
            informacionAdicional={empleado.informacionAdicional}
          />
        ))}
      </div>
    </div>
  );
};

export default Empleados;
