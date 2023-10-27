import React, { useState, useEffect, useRef } from 'react';
import { Navigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const AuthenticationGuard = ({ children }) => {
  const userIsLoggedIn = localStorage.getItem('authToken') !== null;
  const notificationShownRef = useRef(false);

  useEffect(() => {
    return () => {
           if (!userIsLoggedIn && !notificationShownRef.current) {
        toast.error('Debes iniciar sesión para acceder a esta página', {
          position: 'top-right',
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });

        notificationShownRef.current = true;
      }
    };
  }, [userIsLoggedIn]);

  if (userIsLoggedIn) {
    return children;
  } else {
    return <Navigate to="/login" />;
  }
};

export default AuthenticationGuard;
