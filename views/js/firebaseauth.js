// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-auth.js";
import { getFirestore, setDoc, doc, getDoc, query, where, getDocs, collection } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyC0I9Y6ez8DMOXhxZlPQ3h7cWBb-hEulXQ",
    authDomain: "quiz-531fa.firebaseapp.com",
    databaseURL: "https://quiz-531fa-default-rtdb.firebaseio.com",
    projectId: "quiz-531fa",
    storageBucket: "quiz-531fa.appspot.com",
    messagingSenderId: "582965786537",
    appId: "1:582965786537:web:9ad07c6af076847295b6b8",
    measurementId: "G-JEYZTMY29M"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

function showMessage(message, divId) {
    var messageDiv = document.getElementById(divId);
    messageDiv.style.display = "block";
    messageDiv.innerHTML = message;
    messageDiv.style.opacity = 1;
    setTimeout(function () {
        messageDiv.style.opacity = 0;
    }, 5000);
}

async function checkUsernameUnique(username) {
    const db = getFirestore();
    const q = query(collection(db, "users"), where("username", "==", username));
    const querySnapshot = await getDocs(q);
    return querySnapshot.empty;
}

const signUp = document.getElementById('submitSignUp');
signUp.addEventListener('click', async (event) => {
    event.preventDefault();
    loader.style.display = 'block';
    signUpMessage.style.display = 'none';
    const email = document.getElementById('rEmail').value;
    const password = document.getElementById('rPassword').value;
    const firstName = document.getElementById('fName').value;
    const lastName = document.getElementById('lName').value;
    const phone = document.getElementById('phone').value;
    const bod = document.getElementById('bod').value;
    const gender = document.getElementById('gender').value;
    const city = document.getElementById('city').value;
    const country = document.getElementById('country').value;
    const instagram = document.getElementById('instagram').value;
    const github = document.getElementById('github').value;
    const linkedin = document.getElementById('linkedin').value;
    const username = document.getElementById('username').value;

    if (!await checkUsernameUnique(username)) {
        showMessage('Username already exists, please choose another.', 'signUpMessage');
        return;
    }

    const auth = getAuth();
    const db = getFirestore();

    createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            const user = userCredential.user;
            const userData = {
                email: email,
                firstName: firstName,
                lastName: lastName,
                password: password,
                phone: phone,
                bod: bod,
                gender: gender,
                city: city,
                country: country,
                instagram: instagram,
                github: github,
                linkedin: linkedin,
                username: username,
                totalPoints: "0",
                level: "0",
                achievement: "none",
                grank: "0"
            };
            showMessage('Account Created Successfully', 'signUpMessage');
            const docRef = doc(db, "users", user.uid);
            setDoc(docRef, userData)
                .then(() => {
                    window.location.href = 'login-register';
                })
                .catch((error) => {
                    console.error("error writing document", error);
                });
        })
        .catch((error) => {
            const errorCode = error.code;
            if (errorCode == 'auth/email-already-in-use') {
                showMessage('Email Address Already Exists !!!', 'signUpMessage');
            }
            else {
                showMessage('Unable to create User', 'signUpMessage');
            }
        })
});

const signIn = document.getElementById('submitSignIn');
signIn.addEventListener('click', (event) => {
    event.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const auth = getAuth();

    signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            showMessage('Login is successful', 'signInMessage');
            const user = userCredential.user;
            localStorage.setItem('loggedInUserId', user.uid);
            window.location.href = 'home';
        })
        .catch((error) => {
            const errorCode = error.code;
            if (errorCode === 'auth/invalid-credential') {
                showMessage('Incorrect Email or Password', 'signInMessage');
            }
            else {
                showMessage('Account does not Exist', 'signInMessage');
            }
        })
});
