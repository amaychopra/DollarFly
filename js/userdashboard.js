var userID;

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
    } else if(user.uid=="7fRTWEZz5hdJEG7jeA2LuiNawDD3"){
      window.location='adminHome.html'
    } 
    else {
      userID = user.uid;
      var db = firebase.firestore();
      var userRef = db.collection("Users").doc(userID);
      userRef.get().then(function(doc) {
        if (doc.exists) {
          var refferedTotal = 7;
          var refferedCount = doc.data().refferedCount;
          var progress = 100 * refferedCount / refferedTotal;
          var progressPercent = (Math.floor(progress).toString() + "%");
          document.getElementById('username').innerHTML = doc.data().firstname;
          document.getElementById('username-mobile').innerHTML = doc.data().firstname;
          document.getElementById('wallet-balance').innerHTML = doc.data().wallet;
          document.getElementById('wallet-balance-mobile').innerHTML = doc.data().wallet;
          document.getElementById('rewardDollar').innerHTML = doc.data().rewardDollar;
          document.getElementById('rewardDollarMobile').innerHTML = doc.data().rewardDollar;
          
          if (progress != 0) {
            document.getElementById('rewardProgress').setAttribute("style", "width:" + progressPercent);
          }
          document.getElementById('rewardProgressPercent').innerHTML = progressPercent;
          document.getElementById('refferedCount').innerHTML = refferedCount;

        } else {
          alert("Something went wrong!! Try to login again ");
        }

      }).catch(function(error) {
        console.log("Error getting document:", error);
      });
      db.collection("Activities").orderBy("Date", "desc").get().then(function(querySnapshot) {
        var x = 1;
        querySnapshot.forEach(function(doc) {
          var sender = doc.data().Sender;
          var receiver = doc.data().Receiver;
          var amount = doc.data().Amount;
          var date = doc.data().Date;
          var d = date.toDate();
          var dateformat = moment(d).format("MMM Do ");
          if (x === 6)
            return;
          if (sender == userID) {
            $("#noActivity").addClass("d-none");
            $("#activityLink").removeClass("disabled");
            $("#activity" + x).removeClass("d-none");
            var receiverName = doc.data().ReceiverName;
            document.getElementById('name' + x).innerHTML = receiverName;
            document.getElementById('date' + x).innerHTML = dateformat;
            document.getElementById('amount' + x).innerHTML = "- $" + amount;
            x++;
          } else if (receiver == userID) {
            $("#noActivity").addClass("d-none");
            $("#activityLink").removeClass("disabled");
            $("#activity" + x).removeClass("d-none");
            var senderName = doc.data().SenderName;
            document.getElementById("name" + x).innerHTML = senderName;
            document.getElementById('date' + x).innerHTML = dateformat;
            document.getElementById('amount' + x).innerHTML = "$" + amount;
            x++;
          }
        });
      });
    }
  });

  var greeting;
  var time = new Date().getHours();
  time = 19;
  if (time < 10) {
    greeting = "Good morning";
  } else if (time < 20) {
    greeting = "Good day";
  } else {
    greeting = "Good evening";
  }
  document.getElementById('greetingMessage').innerHTML = greeting;
  //document.getElementById('greetingMessage-mobile').innerHTML = greeting;

}
window.onload = function() {
  initApp();
}
