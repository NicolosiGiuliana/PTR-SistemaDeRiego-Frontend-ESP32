import { initializeApp } from "firebase/app"
import { getAuth } from "firebase/auth"


// Your web app's Firebase configuration

const firebaseConfig = {
    apiKey: "AIzaSyAeE7mYJke8to857s5n75143OKUreuTv_w",
    authDomain: "sistemariegoptr.firebaseapp.com",
    projectId: "sistemariegoptr",
    storageBucket: "sistemariegoptr.firebasestorage.app",
    messagingSenderId: "759970982954",
    appId: "1:759970982954:web:c97837b1878ac19ce7a753"
};


const app = initializeApp(firebaseConfig)

export const auth = getAuth(app)