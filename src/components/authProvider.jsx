
import React,{useEffect} from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import {auth, getUserInfo, registerNewUser, userExists} from '../firebase/firebase'
import { useNavigate } from 'react-router-dom';

export default function AuthProvider({
    children,
    onUserLoggedIn,
    onUserNotLoggedIn,
    onUserNotRegistered}){
    const navigate = useNavigate()
       

    useEffect(()=>{
      
        onAuthStateChanged(auth, async (user) => {
          if(user){ 
           
            const isRegistered = await userExists(user.uid)
            
            if(isRegistered){
              const userInfo = await getUserInfo(user.uid)
              if(userInfo.processCompleted){
                onUserLoggedIn(userInfo)
              }else{

                onUserNotRegistered(userInfo)
              }

              
              //TODO: redirect dashboard
            }else{
              //TODO: redirect choosename
              await registerNewUser({
                uid: user.uid,
                displayName: user.displayName,
                profilePicture: '',
                username: '',
                processCompleted: false
              })
              onUserNotRegistered(user)
            }
        }else{
            onUserNotLoggedIn();
        }  
        })
    },[navigate, onUserLoggedIn, onUserNotRegistered, onUserNotLoggedIn])


    return <div>{children}</div>
}