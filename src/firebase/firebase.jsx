import {initializeApp} from "firebase/app";
import {getAuth} from "firebase/auth";
import {
  getStorage,
  ref,
  uploadBytes,
  getDownloadURL,
} from "firebase/storage";
import {
  getFirestore,
  collection,
  addDoc,
  getDoc,
  getDocs,
  doc,
  query,
  where,
  setDoc,
  deleteDoc,
} from "firebase/firestore";

const firebaseConfig = {
  apiKey: process.env.REACT_APP_API_KEY,
  authDomain: process.env.REACT_APP_AUTHDOMAIN,
  projectId: process.env.REACT_APP_PROJECTID,
  storageBucket: process.env.REACT_APP_STORAGEBUCKET,
  messagingSenderId: process.env.REACT_APP_MESSAGINGSENDERID,
  appId: process.env.REACT_APP_APPID,
  measurementId: process.env.REACT_APP_MEASUREMENTIDN,
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
const db = getFirestore(app);
export const storage = getStorage(app);

export async function userExists(uid) {
  const docRef = doc(db, "users", uid);
  const res = await getDoc(docRef);
  return res.exists();
}

// export async function existsUsername(username, uid) {
//   const users = [];
 
  
//   const docRef = doc(db, "users", uid ? uid : username);

//   const docSnap = await getDoc(docRef);
//   const data  = docSnap.data();
//   console.log(docSnap)
//   users.push(data)

//     return users.username === username ? users[0].uid : null

// }
export async function existsUsername(username) {
  const users = [];
  // const docsRef = collection(db, "users");
  const q = query(collection(db,'users'), where('username','==',username))

  const querySnapshot = await getDocs(q);
  querySnapshot.forEach((doc)=>{
    users.push(doc.data())
  })
    return users.length > 0 ? users[0].uid : null
}

export async function registerNewUser(user) {
  try {
    const collectionRef = collection(db, "users");
    const docRef = doc(collectionRef, user.uid);
    await setDoc(docRef, user);
  } catch (error) {}
}

export async function updateUser(user) {
  try {
    const collectionRef = collection(db, "users");
    const docRef = doc(collectionRef, user.uid);
    await setDoc(docRef, user);
  } catch (error) {}
}

export async function getUserInfo(uid) {
  try {
    const docRef = doc(db, "users", uid);
    const document = await getDoc(docRef);
    return document.data();
  } catch (error) {
     console.error(error)
  }
}


export async function insertNewLink(link){
try {
  const docRef = collection(db,'links');
  const res = await addDoc(docRef, link)

  return res;
} catch (error) {
  console.log(error)
}
}

export async function getLinks(uid){

  const links = []; 
  try {
   
  const collectionRef = collection(db, 'links');
  const q = query(collectionRef, where('uid','==',uid))
const querySnapshot = await getDocs(q)

querySnapshot.forEach(doc=>{
  const link = {...doc.data()}
  link.docId = doc.id 
  links.push(link)

})

return links 
  } catch (error) {
    console.error(error)
  }  
}

export async function updateLink(docId,link){
  try {
    const docRef = doc(db, 'links', docId)
    const res = await setDoc(docRef, link);
    return res ;
  } catch (error) {
    console.error(error)
  }
}

export async function deleteLink(docId){
  try {
    
    const docRef = doc(db,'links', docId)
    const res = await deleteDoc(docRef)
    return res;
  } catch (error) {
    console.error(error)
  }
}

export async function setUserProfilePhoto(uid,file){
 
  try {
    const imageRef = ref(storage, `images/${uid}`);
    const resUpload = await uploadBytes(imageRef, file);
    return resUpload; 
  } catch (error) {
    console.erro(error)
  }
}

export async function getProfilePhotoUrl(profilePicture){
  try {
    const imageRef = ref(storage, profilePicture); 
    const url = await getDownloadURL(imageRef)
    return url

  } catch (error) {
    console.error(error)
  }
}

export async function getUserPublicProfileInfo(uid){
  const profileInfo = await getUserInfo(uid);
  const linksInfo = await getLinks(uid);
  return {
    profileInfo,
    linksInfo,
  }
}

export async function logout(){
  await auth.signOut()
}