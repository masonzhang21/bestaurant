
import firebase from "firebase/app";
import "firebase/database";

const config = {
    apiKey: "AIzaSyBFWLRxFsPsgPYZtXOMPQvvFGXbpeQnLYQ",
    authDomain: "consensus-9226f.firebaseapp.com",
    databaseURL: "https://consensus-9226f.firebaseio.com",
    projectId: "consensus-9226f",
    storageBucket: "consensus-9226f.appspot.com",
    messagingSenderId: "630219181152",
    appId: "1:630219181152:web:97eeb26073fc11fef3c705",
    measurementId: "G-2VZRHSCF26"
  };
  firebase.initializeApp(config);

  const database = firebase.database();

  export default database;