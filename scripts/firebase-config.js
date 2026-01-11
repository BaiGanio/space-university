const firebaseConfig = {
  apiKey: "AIzaSyA9oZaSIeUKeFJw-hieB3kN4b-J4xnSd_I",
  authDomain: "space-university-d04e9.firebaseapp.com",
  databaseURL: "https://space-university-d04e9-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "space-university-d04e9",
  storageBucket: "space-university-d04e9.firebasestorage.app",
  messagingSenderId: "623940058530",
  appId: "1:623940058530:web:70fe0e7ed1c8df0ca706fb",
  measurementId: "G-JK7DJ4KF82"
};

firebase.initializeApp(firebaseConfig);
// Global references 
const auth = firebase.auth(); 
const db = firebase.firestore();