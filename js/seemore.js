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
    } else {
      userID = user.uid;
      console.log("UserID is", userID);
      var db = firebase.firestore();
      db.collection("Activities").orderBy("Date", "desc").get().then(function(querySnapshot) {
        var table = document.getElementById("dtBasicExample").getElementsByTagName("tbody")[0];
        querySnapshot.forEach(function(doc) {
          var sender = doc.data().Sender;
          var receiver = doc.data().Receiver;
          var amount = doc.data().Amount;
          var date = doc.data().Date;
          var d = date.toDate();
          var dateformat = moment(d).format("MMM Do ");
          if (sender == userID || receiver == userID) {
            var receiverName = doc.data().ReceiverName;
            var senderName = doc.data().SenderName;
            console.log(senderName, ", ", dateformat, ", ", amount);
            var row = table.insertRow(-1);
            var senderNameCell = row.insertCell(0);
            var receiverNameCell = row.insertCell(1);
            var amountCell = row.insertCell(2);
            var DateCell = row.insertCell(3);
            senderNameCell.innerHTML = senderName;
            receiverNameCell.innerHTML = receiverName;
            if (sender == userID)
              amountCell.innerHTML = "- $" + amount;
            else
              amountCell.innerHTML = "$" + amount;
            DateCell.innerHTML = dateformat;
          }
        });
      }).then(function() {
        $('#dtBasicExample').DataTable({
          "pagingType": "simple" // "simple" option for 'Previous' and 'Next' buttons only
        });
      });
    }
  });
}
window.onload = function() {
  initApp();
}
