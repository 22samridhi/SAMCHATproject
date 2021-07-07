import firebase from "firebase/app";
import "firebase/auth";
export const auth = firebase.initializeApp({
    apiKey: "AIzaSyBlEHz59vxjbql28fQFLWYVFM3r0-uh71g",
    authDomain: "sam-s-chat.firebaseapp.com",
    projectId: "sam-s-chat",
    storageBucket: "sam-s-chat.appspot.com",
    messagingSenderId: "545471058373",
    appId: "1:545471058373:web:6a00749915ab137235fbac"
}).auth();