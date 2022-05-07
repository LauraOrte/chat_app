import React, { createContext, useCallback, useState } from 'react';
import { fetchConToken, fetchSinToken } from '../helpers/fetch';

export const AuthContext = createContext();

const initialState = {
    uid: null,
    checking: true,
    logged: false,
    name: null,
    email: null,

};



export const AuthProvider = ({ children }) => {

    const [auth, setAuth]= useState(initialState)

    const login = async (email, password ) => {

      const resp = await fetchSinToken('login', { email, password }, 'POST');
      
      //autenticación válida, guardar token el el localStorage( de 24h)
      if ( resp.ok ){
        localStorage.setItem('token', resp.token);
        const { usuario } = resp;
        
        setAuth({
          uid: usuario.uid,
          checking: false,
          logged: true,
          name: usuario.nombre,
          email: usuario.email,

        })
      }
    

    return resp.ok;
    }

    const register = async(nombre, email, password) =>{
      const resp = await fetchSinToken('login/new', { nombre, email, password }, 'POST');
      
      //autenticación válida, guardar token el el localStorage(de 24h)
      if ( resp.ok ){
        localStorage.setItem('token', resp.token);
        const { usuario } = resp;
        
        setAuth({
          uid: usuario.uid,
          checking: false,
          logged: true,
          name: usuario.nombre,
          email: usuario.email,

        })
       
        return true;
      }
    
    return resp.msg;

    }

    const verificaToken = useCallback( async() =>{

      //leer el token en el localStorage y si existe(ir al backend, al renew y regresar nuevo token)
      //validación rapida si existe el token
      const token = localStorage.getItem('token');
      // si el token no existe
      if ( !token ){
       setAuth({ uid: null,
          checking: false,
          logged: false,
          name: null,
          email: null,
        })

        return false;

      }
      // si existe, es váido en mi backend todavia?
      const resp = await fetchConToken('login/renew');
      if ( resp.ok ){
        localStorage.setItem('token', resp.token);
        const { usuario } = resp;
        
        setAuth({
          uid: usuario.uid,
          checking: false,
          logged: true,
          name: usuario.nombre,
          email: usuario.email,

        })
        console.log('Autenticado!');
        return true;

      } else {
        setAuth({
          uid: null,
          checking: false,
          logged: false,
          name: null,
          email: null,

        })
        return false;

      }
      
       

    }, [])

    const logout = () =>{
      //para Salir
      localStorage.removeItem('token');
      setAuth({
        checking: false,
        logged: false,
   
      })

    }

  return (
    <AuthContext.Provider value={{
        auth,
        login,
        register,
        verificaToken,
        logout,
    }}>
        { children }
    </AuthContext.Provider>
  )
}
