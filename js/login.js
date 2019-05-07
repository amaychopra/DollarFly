function initApp() {
  document.getElementById("logInBtn").addEventListener('click', login => {
    const email = document.getElementById("email").value;
    const pass = document.getElementById("password").value;
    firebase.auth().signInWithEmailAndPassword(email, pass).catch(function(error) {
      // Get error code and meeage
      var errorCode = error.code;
      var errorMessage = error.message;

      // If Invalid User (from firebase)
      if (errorCode === 'auth/wrong-password') {
        alert('The username and password doesnt match');
      } else {
        alert(errorMessage);
      }
      console.log(error);
    });
  });

  firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
      console.log("Attempted Sign in successful");
      var email = user.email;
      if(user.uid!="7fRTWEZz5hdJEG7jeA2LuiNawDD3"){
        window.location='userdashboard.html';
      }
      else
        window.location = 'adminHome.html';
    }
  });
}
window.onload = function() {
  initApp();
}
