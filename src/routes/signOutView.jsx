import AuthProvider from '../components/authProvider'
import { useNavigate } from "react-router-dom";
import { logout } from '../firebase/firebase';

export default function SignOutView(){
    const navigate = useNavigate();
    async function handleUserLoggedIn(user) {

        await logout()
        window.location.reload()
    }
    
      function handleUserNotRegistered(user) {
        navigate('/login')
      }
      function handleUserNotLoggedIn() {
        navigate('/login')
      }
    
    return   (
    <AuthProvider
    onUserLoggedIn={handleUserLoggedIn}
    onUserNotRegistered={handleUserNotRegistered}
    onUserNotLoggedIn={handleUserNotLoggedIn}
  >Loading...</AuthProvider>
    )
}