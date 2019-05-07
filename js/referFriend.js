var userID;
var db = firebase.firestore();
var currentUserRef;
var isLogout=false;

function logout() {
  isLogout=true;
  firebase.auth().signOut().catch(function(error) {
    var errorCode = error.code;
    var errorMessage = error.message;
    console.log(error);
  }).then(function() {
    window.location = 'index.html';
  });
}


function initApp() {
  document.getElementById("logOutBtn").addEventListener('click', signout => {
    firebase.auth().signOut().catch(function(error) {
      var errorCode = error.code;
      var errorMessage = error.message;
      console.log(error);
    })
  });
  firebase.auth().onAuthStateChanged(function(user) {
    var auth = firebase.auth();
    if (!user && !isLogout ) {
      window.location = 'login.html';
    } else {
      userID = user.uid;
      console.log("UserID is", userID);
      currentUserRef = db.collection("Users").doc(userID);
    }
  });

}
window.onload = function() {
  initApp();
}

function referFriend() {
  var emailReceipient = document.getElementById('referRecepient').value;
  var i;
  var randomReward;

  //Update current users wallet balance
  currentUserRef.get().then(function(doc) {
    if (doc.exists) {
      var currentUserWallet = doc.data().wallet;
      var currentUserEmail = doc.data().email;
      var currentUserFirstname = doc.data().firstname;
      var currentUserLastname = doc.data().lastname;
      var currentUserPassword = doc.data().password;
      var currentUserRefferedCount = doc.data().refferedCount;
      var currentUserRewardDollar = doc.data().rewardDollar;



      if (currentUserRefferedCount < 8) {

        //Generate a random reward for the refferal
        for (i = 0; i < 10; i++) {
          randomReward = 10 * (Math.floor((Math.random() * 10) + 1));
          if (randomReward > 10 & randomReward < 60) {
            alert("You've earned $" + randomReward + " Congratulations!!");
            break;
          } else {
            randomReward = 10 * (Math.floor((Math.random() * 10) + 1));
          }
        }

        var walletAfterReward = parseFloat(currentUserWallet) + parseFloat(randomReward);
        var rewardDollarAfterReward = parseFloat(currentUserRewardDollar) + parseFloat(randomReward);
        var referredCountAfterReward = parseFloat(currentUserRefferedCount) + 1;

        //Update current users record to reflect the referral award awarded
        db.collection("Users").doc(doc.id).set({
          email: currentUserEmail,
          firstname: currentUserFirstname,
          lastname: currentUserLastname,
          password: currentUserPassword,
          refferedCount: parseFloat(referredCountAfterReward),
          rewardDollar: parseFloat(rewardDollarAfterReward),
          wallet: parseFloat(walletAfterReward)
        });

        //Update Activites transactions collection to reflect the reward award transaction
        var dateTime = new Date();
        db.collection("Activities").doc().set({
          Amount: randomReward,
          Date: dateTime,
          Receiver: doc.id,
          ReceiverName: currentUserFirstname,
          Sender: "DollarFly",
          SenderName: "DollarFly",
          Memo: "Referral Reward"
        }).then(function() {
          alert("Successfully referred! ");
          window.location = 'userdashboard.html';
        });
      } else {
        alert("Sorry, You've reached the maximum referral limit :(")
      }
    } else {
      alert("Something went wrong!! Try to login again ");
    }

  }).catch(function(error) {
    console.log("Error getting document:", error);
  });


}
