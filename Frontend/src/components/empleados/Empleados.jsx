import React, { useState, useEffect } from "react";
import EmpleadoCard from "../empleadocard/EmpleadoCard";
import "./Empleados.css";
const Empleados = () => {
  const [empleados, setEmpleados] = useState([]);

  // Suponiendo que hay una función fetchData que obtiene los empleados
  const fetchData = async () => {
    // Llamar a la API o servicio para obtener los datos de los empleados
    try {
      const data = await fetch("URL_DEL_ENDPOINT_PARA_OBTENER_EMPLEADOS");
      const empleadosData = await data.json();
      setEmpleados(empleadosData); // Actualizar el estado con los datos obtenidos
    } catch (error) {
      console.error("Error al obtener los empleados:", error);
    }
  };

  useEffect(() => {
    fetchData(); // Llamar a fetchData al cargar el componente o cuando cambie alguna dependencia
  }, []); // El segundo parámetro vacío garantiza que se ejecute solo una vez

  return (
    <div className="empleados">
      <h1>Empleados</h1>
      <div className="grid-container">
        {empleados.map((empleado, index) => (
          <EmpleadoCard
            key={index}
            nombre={empleado.nombre}
            foto={empleado.foto}
            informacionAdicional={empleado.informacionAdicional}
          />
        ))}
      </div>
    </div>
  );
};

export default Empleados;
