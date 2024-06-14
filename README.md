# Login setup using email and google authendication
Using plain JavaScript and HTML, CSS simple authendication system setup.
Login screen using email and google authenticator with google firebase

![image](https://github.com/gokuldhas/Loginsetup/assets/6180538/8a880cc0-2bcb-43ee-9188-1645ae0d3d26)   ![image](https://github.com/gokuldhas/Loginsetup/assets/6180538/af7bb81a-b418-486c-bbf1-117cf39da945) ![image](https://github.com/gokuldhas/Loginsetup/assets/6180538/331c6c7c-5b18-45b0-9126-2c5ab9afd6a8)


# Functionalities
* Login using email and password
* Login with google authendication
* Create new account
* Forget password
* Already login retain
* Login success and failure check

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

#### License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

#### Author
[Gokul Dhas Simson](https://www.linkedin.com/in/gokuldhas/)
