import { useNavigate } from "react-router-dom";
import { useRef, useState } from "react";
import AuthProvider from "../components/authProvider";
import DashboardWrapper from "../components/dashboardWrapper";
import { getProfilePhotoUrl, setUserProfilePhoto, updateUser } from "../firebase/firebase";
import style from './editProfileView.module.css'
export default function EditProfileView() {

const navigate = useNavigate();
    const [state, setState] = useState(0);
    const [currentUser, setCurrentUser] = useState([]);
    const [profleUrl, setProfleUrl] = useState(null)
    const fileRef = useRef(null)

     async function handleUserLoggedIn(user) {
        setCurrentUser(user)
        const url = await getProfilePhotoUrl(user.profilePicture)
        setProfleUrl(url)
        setState(2)
  
      }

      function handleUserNotRegistered(user) {
        navigate('/login')
      }
      function handleUserNotLoggedIn() {
        navigate('/login')
      }

      function handleOpenFilePicker(){
        if(fileRef.current){
          fileRef.current.click();
        }
      }
      function handleChangeFile(e){
        const files = e.target.files;
        const fileReader = new FileReader();
        if(fileReader && files && files.length > 0){
          fileReader.readAsArrayBuffer(files[0]);
          fileReader.onload = async function(){
            const imageData = fileReader.result;
            const res = await setUserProfilePhoto(currentUser.uid, imageData)
            if(res){
              const tmpUser= {...currentUser};
              tmpUser.profilePicture = res.metadata.fullPath;
              await updateUser(tmpUser);
              setCurrentUser({...tmpUser})

              const url = await getProfilePhotoUrl(currentUser.profilePicture);
              setProfleUrl(url);
            }
          } 

        }
      } 
      if(state !==2) {
        return (
          <AuthProvider 
          onUserLoggedIn={handleUserLoggedIn} 
          onUserNotLoggedIn={handleUserNotLoggedIn} 
          onUserNotRegistered={handleUserNotRegistered}>
          </AuthProvider>
        )
      }
  return (
    
      <DashboardWrapper>
        <div>
          <h2>Edit profile info {currentUser.display_name}</h2>
          <div className={style.profilePictureContainer}>
            <div>
              <img src={profleUrl} alt="" width={100}/>
            </div>
            <div>
              <button className="btn" onClick={handleOpenFilePicker}>Choose new profle picture</button>
              <input hidden ref={fileRef} type='file' onChange={handleChangeFile}></input>
            </div>
          </div>
        </div>
      </DashboardWrapper>
 
  );
}
