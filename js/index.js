var userID;
var loggedIn=false;

function logout() {

  firebase.auth().signOut().catch(function(error) {
    var errorCode = error.code;
    var errorMessage = error.message;
    console.log(error);
  }).then(function() {
    window.location = 'index.html';
  });
}


function initApp() {
  
  firebase.auth().onAuthStateChanged(function(user) {


   if (user) {
     loggedIn=true;
     //$("#signedIn").removeClass("d-none");
     //$("#signedOut").addClass("d-none");
     $("#signedInList").removeClass("d-none");
     $("#signedOutList").addClass("d-none");
      document.getElementById("logOutBtn").addEventListener('click', signout => {
        firebase.auth().signOut().catch(function(error) {
          var errorCode = error.code;
          var errorMessage = error.message;
          console.log(error);
        })
      });
      userID = user.uid;
      console.log("UserID is", userID);
    }else{
      $("#signedInList").addClass("d-none");
      $("#signedOutList").removeClass("d-none");
    }
  });

}
window.onload = function() {
  
  initApp();
  
}
