var userID;
var db = firebase.firestore();
var currentUserRef;

function logout() {
  firebase.auth().signOut().catch(function(error) {
    var errorCode = error.code;
    var errorMessage = error.message;
    console.log(error);
  }).then(function() {
    window.location = 'login.html';
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
    if (!user) {
      window.location = 'index.html';
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

function addMoney() {
  var nameOnCard = document.getElementById('nameOnCard').value;
  var cardNumber = document.getElementById('cardNumber').value;
  var expiryMonth = document.getElementById('expiryMonth').value;
  var expiryYear = document.getElementById('expiryYear').value;
  var cvv = document.getElementById('cvv').value;
  var addAmount = document.getElementById('addAmount').value;
  if (cardNumber == "" || addAmount == "") {
    alert("Please enter all values!");
  }
  var creditAmtResult = 0.00;

  //check if sender has sufficient balance to send money
  currentUserRef.get().then(function(doc) {
    if (doc.exists) {
      var currentUserWallet = doc.data().wallet;
      var currentUserEmail = doc.data().email;
      var currentUserFirstname = doc.data().firstname;
      var currentUserLastname = doc.data().lastname;
      var currentUserPassword = doc.data().password;
      var currentUserRefferedCount = doc.data().refferedCount;
      var currentUserRewardDollar = doc.data().rewardDollar;
      //dbUserWalletMoney = doc.data().wallet;

      creditAmtResult = parseFloat(currentUserWallet) + parseFloat(addAmount);

      if (parseFloat(creditAmtResult) > 0) {

        //Credit amount to the current user's Wallet
        db.collection("Users").doc(doc.id).set({
          email: currentUserEmail,
          firstname: currentUserFirstname,
          lastname: currentUserLastname,
          password: currentUserPassword,
          refferedCount: parseFloat(currentUserRefferedCount),
          rewardDollar: parseFloat(currentUserRewardDollar),
          wallet: parseFloat(creditAmtResult)
        });

        //Add credit card details to the CardDetails Table
        db.collection("CardDetails").doc().set({
          addAmount: addAmount,
          cardNumber: parseInt(cardNumber),
          cvv: parseInt(cvv),
          expiryMonth: expiryMonth,
          expiryYear: parseInt(expiryYear),
          nameOnCard: nameOnCard,
          userID: userID
        }).then(function() {
          alert("Successfully added Money to your Wallet! ");
          window.location = 'userdashboard.html';
        });

      } else {

        alert("Please enter amount greater than $0.00");
      }


    } else {
      alert("Something went wrong!! Try to login again ");
    }

  }).catch(function(error) {
    console.log("Error getting document:", error);
  });

}
