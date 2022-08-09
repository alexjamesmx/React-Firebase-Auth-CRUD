import React, {useState} from "react";
import {
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import {auth} from "../firebase/firebase";
import {useNavigate} from "react-router-dom";
import AuthProvider from "../components/authProvider";
import style from './loginView.module.css'
export default function LoginView() {
  const navigate = useNavigate();
  // State
  // 0 inicializando
  // 1 loading
  // 2 login completo
  // 3 login sin registro
  // 4 no hay nadie logueado
  // 5 existeusername
  // 6 nuevo username, click para continuar
  // 7 username no existe
  const [state, setState] = useState(0);


  async function handleOnClick() {
    const googleProvider = new GoogleAuthProvider();
    await signInWithGoogle(googleProvider);

    async function signInWithGoogle(googleProvider) {
      try {
        const res = await signInWithPopup(auth, googleProvider);
        console.log(res);
      } catch (error) {
        console.log(error);
      }
    }
  }

  function handleUserLoggedIn(user) {
    navigate('/dashboard')
  }
  function handleUserNotRegistered(user) {
    console.log('aaaa')
    navigate('/choose-username')
  }
  function handleUserNotLoggedIn() {
    setState(4)
  }

 

  if (state === 4) {
    return (
      <div className={style.LoginView}>
        <div>
          <h1>Link tree</h1>
        </div>
        <button className={style.provider} onClick={handleOnClick}>Login with Google</button>
      </div>
    );
  }

  if (state === 5) {
    return (
      <div className={style.LoginView}>
        <button onClick={handleOnClick}>Login with Google</button>
      </div>
    );
  }
  return (
    <AuthProvider 
      onUserLoggedIn={handleUserLoggedIn}
      onUserNotRegistered={handleUserNotRegistered}
      onUserNotLoggedIn={handleUserNotLoggedIn}>
      <div>Loading...</div>
    </AuthProvider>
  );
}
