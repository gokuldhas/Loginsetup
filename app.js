import { 
    getAuth, createUserWithEmailAndPassword, onAuthStateChanged, signOut, signInWithEmailAndPassword, sendEmailVerification,
    sendPasswordResetEmail, GoogleAuthProvider, signInWithPopup
} from "https://www.gstatic.com/firebasejs/10.12.1/firebase-auth.js";

import { getFirestore, doc, setDoc  } from "https://gstatic.com/firebasejs/10.12.1/firebase-firestore.js";

const auth = getAuth();
const db = getFirestore();

const email = document.getElementById("email");
const password = document.getElementById("password");
const signUpBtn = document.getElementById("signup-btn");
const UI_error_msg = document.getElementById("error-msg");
const UI_signup_form = document.getElementById("signup-form");
const UI_user_profile = document.getElementById("user-profile");
const UI_user_email = document.getElementById("user-email");
const UI_main_view = document.getElementById("main-view");
const UI_logout_btn = document.getElementById("logout-btn");
const UI_login_form = document.getElementById("login-form");
const UI_login_email = document.getElementById("login-email");
const UI_login_password = document.getElementById("login-password");
const UI_login_btn = document.getElementById("login-btn");
const UI_need_an_account_btn = document.getElementById("need-an-account-btn");
const UI_have_an_account_btn = document.getElementById("have-an-account-btn");
const UI_emailverification_view = document.getElementById("email-verification");
const UI_verification_resend_btn = document.getElementById("verification-resend-btn");
const UI_forgot_password_btn = document.getElementById("forgot-password-btn");
const UI_reset_password_form = document.getElementById("reset-password-form");
const UI_reset_password_btn = document.getElementById("reset-password-btn");
const UI_reset_password_email = document.getElementById("reset-password-email");
const UI_reset_msg = document.getElementById("reset-msg");
const UI_login_with_google_btn = document.getElementById("login-with-google-btn");
const UI_signup_user_name = document.getElementById("name");
const UI_signup_user_phone = document.getElementById("phone");

onAuthStateChanged(auth, (user) =>{
    console.log(user);
    if(user && user.emailVerified){
        UI_login_form.style.display = "none";
        UI_user_profile.style.display = "block";
        UI_emailverification_view.style.display = "none";
        UI_user_email.innerHTML = user.email;
    }
    else if(user){
        UI_login_form.style.display = "none";
        UI_user_profile.style.display = "none";
        UI_emailverification_view.style.display = "block";
    }
    else{
        UI_login_form.style.display = "block";
        UI_user_profile.style.display = "none";
        UI_emailverification_view.display = "none";
    }
    UI_main_view.classList.remove("loading");
});

const singnUpClicked = async (e)=>{
    e.preventDefault();
    UI_error_msg.classList.remove("visible");
    try{
        const userCredential =  await createUserWithEmailAndPassword(auth, email.value, password.value);
        if(userCredential.user && userCredential.user.emailVerified){
            UI_login_form.style.display = "none";
            UI_signup_form.style.display ="none";
            UI_user_profile.style.display = "block";
            UI_emailverification_view.style.display = "none";
            UI_user_email.innerHTML = user.email;
        }
        else if(userCredential.user){
            UI_login_form.style.display = "none";
            UI_signup_form.style.display ="none";
            UI_user_profile.style.display = "none";
            UI_emailverification_view.style.display = "block";
        }
        UI_user_email.innerHTML = userCredential.user.email;
        await sendEmailVerification(userCredential.user);

        const docRef = doc(db, "users", userCredential.uid);
        await setDoc(docRef,{
            name: UI_signup_user_name.value,
            phone_number:UI_signup_user_phone.value,
            email:UI_user_email.value
        });
        
        console.log(userCredential);
    }catch(error){
        console.log(error);
        UI_error_msg.innerHTML = formateErrorMsg(error.code,"register");
        UI_error_msg.classList.add("visible");
    }    
}

const logOutClicked = async () => {
    try{
        await signOut(auth);
        email.value="";
        password.value="";
    }
    catch(error){
        console.log(error);
    }
}

const logInClicked = async (e) => {
    e.preventDefault();
    try {
        signInWithEmailAndPassword(auth,UI_login_email.value,UI_login_password.value);
    } catch (error) {
        console.log(error);
    }    
}

const needAccountClicked = () => {
    UI_login_form.style.display = "none";
    UI_signup_form.style.display ="block";
}

const loginPageClicked = () =>{
    UI_login_form.style.display = "block";
    UI_signup_form.style.display ="none";
}

const resendVerificationClicked = async () => {
    await sendEmailVerification(auth.currentUser);
}

const forgotPasswordClicked = () => {
    hideAll();
    UI_reset_password_form.style.display = "block";
}

const resetPasswordClicked = async (e) => {
    e.preventDefault();
    UI_reset_msg.classList.add("hidden");
    UI_reset_msg.classList.remove("error");
    UI_reset_msg.classList.remove("success");
    try {
        await sendPasswordResetEmail(auth, UI_reset_password_email.value);
        UI_reset_msg.innerHTML = `Reset link sent your email ${UI_reset_password_email.value}`;
        UI_reset_password_btn.classList.add("disabled");
        UI_reset_msg.classList.add("success");
        UI_reset_msg.classList.remove("hidden");
    } catch (error) {
        UI_reset_msg.innerHTML = "Provide valied email";
        UI_reset_msg.classList.add("error");
        UI_reset_msg.classList.remove("hidden");
        console.log(error);
    }    
}

const loginWithGoogleClicked = async (e) => {
    e.preventDefault();
    const googleProvider = new GoogleAuthProvider();
    try{
        await signInWithPopup(auth, googleProvider);
    } catch (error) {
        console.log(error.code);
    }
}

const hideAll = () => {
    UI_login_form.style.display = "none";
    UI_signup_form.style.display ="none";
    UI_user_profile.style.display ="none";
    UI_emailverification_view.style.display ="none";
    UI_reset_password_form.style.display ="none";
}

signUpBtn.addEventListener("click",singnUpClicked);
UI_logout_btn.addEventListener("click",logOutClicked);
UI_login_btn.addEventListener("click",logInClicked);
UI_need_an_account_btn.addEventListener("click",needAccountClicked);
UI_have_an_account_btn.addEventListener("click",loginPageClicked);
UI_verification_resend_btn.addEventListener("click",resendVerificationClicked);
UI_forgot_password_btn.addEventListener("click",forgotPasswordClicked);
UI_reset_password_btn.addEventListener("click",resetPasswordClicked);
UI_login_with_google_btn.addEventListener("click",loginWithGoogleClicked);

const formateErrorMsg=(error_code, mode)=>{
    if(mode==="register"){
        if(error_code==="auth/invalid-email" || error_code==="auth/missing-email" )
            return "Please enter valid email ID";
        else if(error_code==="auth/missing-password" || error_code==="auth/weak-password")
            return "Password must be minimum 6 letters";
        else if(error_code==="auth/email-already-in-use")
            return "This email already registered";
        else
            return error_code
    }
    if(mode==="login"){
        if(error_code==="auth/invalid-email" || error_code==="auth/missing-email" )
            return "Please enter valid email ID";
        else if(error_code==="auth/missing-password" || error_code==="auth/weak-password")
            return "Password must be minimum 6 letters";
        else if(error_code==="auth/email-already-in-use")
            return "This email already registered";
        else
            return error_code
    }
    
}