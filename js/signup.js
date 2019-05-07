function initApp() {
    document.getElementById("signUpBtn").addEventListener('click', singup=>{
        var firstname = document.getElementById('firstname').value;
        var lastname = document.getElementById('lastname').value;
        var contactnumber = document.getElementById('contactnumber').value;
        var email = document.getElementById('email').value;
        var password = document.getElementById('password').value;
        var auth= firebase.auth();
        auth.createUserWithEmailAndPassword(email, password).catch(function (error) {
            var errorCode = error.code;
            console.log(`GOT ERROR: ` + errorCode)
            if (errorCode == 'auth/weak-password') return // password to weak. Minimal 6 characters
            if (errorCode == 'auth/email-already-in-use') return // Return a email already in use error
        }).then(function () {
            var userUid = auth.currentUser.uid;
            var db = firebase.firestore();
            db.collection('Users').doc(userUid).set({
                firstname: firstname,
                lastname: lastname,
                email:email,
                password: password,
                wallet:0.00,
                refferedCount:0,
                rewardDollar:0
            }).then(function () {
                window.location='userdashboard.html';
            });
        });
    });
}
window.onload = function() {
    initApp();
}