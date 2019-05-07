//Code to setup dollarFly as a firebase project
//This code will connect to Firebase's firestore database
const config = {
  apiKey: "AIzaSyAD8_8-A7C9OlIviUCq2cyfTLIfoIn9bEY",
  authDomain: "dollarflyhosting.firebaseapp.com",
  databaseURL: "https://dollarflyhosting.firebaseio.com",
  projectId: "dollarflyhosting",
  storageBucket: "dollarflyhosting.appspot.com",
  messagingSenderId: "971910887722"
};
firebase.initializeApp(config);
