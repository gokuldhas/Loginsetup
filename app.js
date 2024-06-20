import { 
    getAuth, createUserWithEmailAndPassword, onAuthStateChanged, signOut, 
    signInWithEmailAndPassword, sendEmailVerification,
    sendPasswordResetEmail, GoogleAuthProvider, signInWithPopup
} from "https://www.gstatic.com/firebasejs/10.12.1/firebase-auth.js";

import { getFirestore, doc, setDoc, getDoc } from "https://www.gstatic.com/firebasejs/10.12.1/firebase-firestore.js";

import { getStorage, getDownloadURL, ref, uploadBytes } from "https://www.gstatic.com/firebasejs/10.12.1/firebase-storage.js";

const auth = getAuth();
const db = getFirestore();
const storage = getStorage();

let file = null;

const UI_image_FileInput = document.getElementById("image-file-input");
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
const UI_email_verification_logout = document.getElementById("email-verification-logout");

const UI_forgot_password_btn = document.getElementById("forgot-password-btn");
const UI_reset_password_form = document.getElementById("reset-password-form");
const UI_reset_password_btn = document.getElementById("reset-password-btn");
const UI_reset_password_email = document.getElementById("reset-password-email");
const UI_reset_msg = document.getElementById("reset-msg");

const UI_login_with_google_btn = document.getElementById("login-with-google-btn");
const UI_signup_user_name = document.getElementById("name");
const UI_signup_user_phone = document.getElementById("phone");

const UI_update_name = document.getElementById("update-name");
const UI_update_phone = document.getElementById("update-phone");
const UI_update_email = document.getElementById("update-email");
const UI_update_btn = document.getElementById("update-btn");
const UI_update_msg = document.getElementById("update-msg");
const UI_profile_picture_img = document.getElementById("profile-picture-img");
const UI_profile_update_img_input = document.getElementById("update-image-file-input");

onAuthStateChanged(auth, async (user) =>{
    if(user && user.emailVerified){
        UI_login_form.style.display = "none";
        UI_user_profile.style.display = "block";
        UI_emailverification_view.style.display = "none";
        UI_user_email.innerHTML = user.email;
        const docRef = doc(db, "users", user.uid);
        try {
            const docSnap = await getDoc(docRef);
            console.log(docSnap.data());
            UI_update_name.value = docSnap.data().name;
            UI_update_email.value = docSnap.data().email;
            UI_update_phone.value = docSnap.data().phone_number;
            
            const fileRef = ref(storage, `user_profile_image/${user.uid}/${user.uid}-profile-image`);
                const profiel_imag_url = await getDownloadURL(fileRef);
                console.log(profiel_imag_url);
            UI_profile_picture_img.src=profiel_imag_url;
        } catch (error) {
            console.log(error);
        }
    }
    else if(user){
        UI_login_form.style.display = "none";
        UI_user_profile.style.display = "none";
        UI_emailverification_view.style.display = "block";
        const fileRef = ref(storage, `user_profile_image/${user.uid}/${user.uid}-profile-image`);
        const profiel_imag_url = await getDownloadURL(fileRef);
        console.log(profiel_imag_url);
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
        
        //Default email verification
        await sendEmailVerification(userCredential.user);

        const docRef = doc(db, "users", userCredential.user.uid);
        await setDoc(docRef, {
            name: UI_signup_user_name.value,
            phone_number:UI_signup_user_phone.value,
            email:userCredential.user.email
        });
        
        //upload profile image
        uploadImage(userCredential.user.uid);
        
    }catch(error){
        console.log(error);
        UI_error_msg.innerHTML = formateErrorMsg(error.code,"register");
        UI_error_msg.classList.add("visible");
    }    
}

const logOutClicked = async () => {
    try{
        await signOut(auth);
        UI_update_msg.classList.add("hidden");
        UI_emailverification_view.style.display = "none";
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

const updateClicked = async (e) => {
    e.preventDefault();
    UI_main_view.classList.add("loading");
    const docRef = doc(db, "users", auth.currentUser.uid);
    try {
        await setDoc(docRef, {
            name: UI_update_name.value,
            phone_number:UI_update_phone.value,
            email:UI_update_email.value
        }, {merge:true});

        if(file!=null){
            uploadImage(auth.currentUser.uid);
        }

        UI_update_msg.classList.remove("hidden");
        UI_update_msg.innerHTML = "Updated successfully";
        UI_update_msg.classList.add("success");
        
    } catch (error) {
        console.log(error);
    }
    UI_main_view.classList.remove("loading");
}

const selectProfileImage = async (e) => {
    file = e.target.files[0];
}

const uploadImage = async (uid) => {
    if(file != null){
        const storageRef = ref(storage, `user_profile_image/${uid}/${uid}-profile-image`);
        try {
            await uploadBytes(storageRef, file)
        } catch (error) {
            console.log(error);
        }
    }
}

const updateImageFileChosen = (e) => {
    if(e.target.files[0]!=null){
        file = e.target.files[0];
        const reader = new FileReader();
        reader.readAsDataURL(e.target.files[0]);
        reader.onload = (e) => {
            console.log(e.target.result);
            UI_profile_picture_img.src = e.target.result;
        }
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
UI_update_btn.addEventListener("click",updateClicked);
UI_email_verification_logout.addEventListener("click", logOutClicked);
UI_image_FileInput.addEventListener("change", selectProfileImage);
UI_profile_update_img_input.addEventListener("change", updateImageFileChosen);

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