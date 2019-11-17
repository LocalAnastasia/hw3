import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';

// THIS IS USED TO INITIALIZE THE firebase OBJECT
// PUT YOUR FIREBASE PROJECT CONFIG STUFF HERE
var firebaseConfig = {
  apiKey: "AIzaSyBfoIpDf5YgXZ4gbXJ8tdmqcBt7bDtVTnk",
  authDomain: "homework3-ad4f5.firebaseapp.com",
  databaseURL: "https://homework3-ad4f5.firebaseio.com",
  projectId: "homework3-ad4f5",
  storageBucket: "homework3-ad4f5.appspot.com",
  messagingSenderId: "800774273673",
  appId: "1:800774273673:web:34fe14b151ed7f2b716458",
  measurementId: "G-EX8ZKS6DL3"
};
firebase.initializeApp(firebaseConfig);

// NOW THE firebase OBJECT CAN BE CONNECTED TO THE STORE
export default firebase;