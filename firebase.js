import firebase from "firebase";
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDjKZKFPtg4WpJPsQ4skmW5FDsWWbo4hHw",
  authDomain: "maxchat-92517.firebaseapp.com",
  projectId: "maxchat-92517",
  storageBucket: "maxchat-92517.appspot.com",
  messagingSenderId: "45710374139",
  appId: "1:45710374139:web:bc0f60b0cf5c1c4304ec5e",
  measurementId: "G-YL1Y61Z6G6"
};
// We do check the app if its already initialized in SSR or not to prevent multiple initializations
const app = !firebase.apps.length ? firebase.initializeApp(firebaseConfig) : firebase.app();
const db = firebase.firestore();
const auth = app.auth();
const provider = new firebase.auth.GoogleAuthProvider();
export { db, auth, provider };