# Login setup using email and google authendication
Using plain JavaScript and HTML, CSS simple authendication system setup.
Login screen using email and google authenticator with google firebase

# How to run
1. check out the repo
2. Setup firebase project
3. Change the firebase.js configuration (Check below)
4. Open with VSTS
5. Run with live server (Live Server - VSTS extension)
 
# Setup firebase
1. create a account in google firebase
2. Go to console (https://console.firebase.google.com/)
3. Add project, add name for the project and create
4. Click -> Authentication -> Get Started
5. Go to 'Sign-in method' tab
6. Enable Email/Password and Enable Google
7. Click settings -> Authorized domains -> Add the local running domain (example: 127.0.0.1)
8.  Click -> Project Overview -> Settings
9.  Click -> Web (</> icon) -> Give name for web App (hosting is optional not required) and register app
10.  Select -> Use a <script> tag and copy the code without script tag (<script ) past into firebase.js
