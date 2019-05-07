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

function sendMoney() {
  var emailReceipient = document.getElementById('sendTo').value;
  var sendAmount = document.getElementById('sendAmount').value;
  var memo = document.getElementById('memo').value;
  if (emailReceipient == "" || sendAmount == "") {
    alert("Send To and Amount values are Required!");
  }
  var debitedAmtResult = 0;

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

      debitedAmtResult = parseFloat(currentUserWallet) - parseFloat(sendAmount);
      if (parseFloat(debitedAmtResult) >= 0) {
        //If current user has sufficient funds in the wallet then debit the amount

        //if the receiver is a DollarFly member then credit the amt
        var receiverExists = false;
        var dbUserWallet;
        var dbUserEmail;
        var dbUserFirstname;
        var dbUserLastname;
        var dbUserPassword;
        var dbUserRefferedCount;
        var dbUserRewardDollar;
        var dbUserID;
        var dbReceiverID;
        db.collection("Users").get().then(function(usersData) {
          //Loop through all users to get the details of the receiver

          usersData.forEach(function(docDB) {
            dbUserEmail = docDB.data().email;

            if (emailReceipient != null && emailReceipient == dbUserEmail) {
              receiverExists = true;
              dbReceiverEmailID = docDB.data().email;
              dbUserWallet = docDB.data().wallet;
              dbUserFirstname = docDB.data().firstname;
              dbUserLastname = docDB.data().lastname;
              dbUserPassword = docDB.data().password;
              dbUserRefferedCount = docDB.data().refferedCount;
              dbUserRewardDollar = docDB.data().rewardDollar;
              dbUserID = docDB.id;

            }
          });

          if (receiverExists) {

            var addedAmt = parseFloat(dbUserWallet) + parseFloat(sendAmount);
            db.collection("Users").doc(dbUserID).set({
              email: dbReceiverEmailID,
              firstname: dbUserFirstname,
              lastname: dbUserLastname,
              password: dbUserPassword,
              refferedCount: dbUserRefferedCount,
              rewardDollar: dbUserRewardDollar,
              wallet: parseFloat(addedAmt)
            });

            //Update sender's record with debited wallet balance
            db.collection("Users").doc(doc.id).set({
              email: currentUserEmail,
              firstname: currentUserFirstname,
              lastname: currentUserLastname,
              password: currentUserPassword,
              refferedCount: currentUserRefferedCount,
              rewardDollar: currentUserRewardDollar,
              wallet: debitedAmtResult
            });

            var dateTime = new Date();
            db.collection("Activities").doc().set({
              Amount: sendAmount,
              Date: dateTime,
              Receiver: dbUserID,
              ReceiverName: dbUserFirstname,
              Sender: userID,
              SenderName: currentUserFirstname,
              Memo: memo
            }).then(function() {
              alert("Successfully sent Money to " + dbUserFirstname);
              window.location = 'userdashboard.html';
            });


          } else {
            alert("The receiver is not a member of DollarFly, Please refer your friend to DollarFly!");
          }

        });

      } else {

        alert("Insufficient Balance, Cannot Transfer!");
      }


    } else {
      alert("Something went wrong!! Try to login again ");
    }

  }).catch(function(error) {
    console.log("Error getting document:", error);
  });

}
