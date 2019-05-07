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
      var db = firebase.firestore();

      db.collection("Activities").get().then(function(querySnapshot) {
        var table = document.getElementById("dtBasicExample").getElementsByTagName("tbody")[0];
        querySnapshot.forEach(function(doc) {
          var senderName = doc.data().SenderName;
          var receiverName = doc.data().ReceiverName;
          var date = doc.data().Date;
          var amount = doc.data().Amount;
          if (typeof senderName !== 'undefined') {
            var dateformat = moment(date.toDate()).format("MM-DD-YYYY");
            var row = table.insertRow(-1);
            var senderNameCell = row.insertCell(0);
            var receiverNameCell = row.insertCell(1);
            var amountCell = row.insertCell(2);
            var DateCell = row.insertCell(3);

            senderNameCell.innerHTML = senderName;
            receiverNameCell.innerHTML = receiverName;
            amountCell.innerHTML = amount;
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


function filterTransactions() {
  var table = document.getElementById("dtBasicExample");
  var sD = new Date(document.getElementById("startDate").value);
  var eD = new Date(document.getElementById("endDate").value);
  console.log("Start Date-> ", sD);
  console.log("End Date-> ", eD);
  $('#dtBasicExample').DataTable().destroy()
  for (var i = 1, row; row = table.rows[i]; i++) {
    var curDate = new Date(row.cells[3].innerHTML);
    console.log("Current Date-> ", new Date(curDate));
    if (curDate < sD || curDate > eD) {
      console.log("outside range ", i);
      table.deleteRow(i);
    }
  }

  $('#dtBasicExample').DataTable({
    "pagingType": "simple" // "simple" option for 'Previous' and 'Next' buttons only
  });
  return false;
}
