const firebase = require("firebase/app");
const {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
} = require("firebase/auth");

const apiKey = process.env.FIREBASE_API_KEY;
firebase.initializeApp({
  // apiKey: "AIzaSyBlRRglesmwrSkiSj-EKmcBOQ2o876TruI",
  apiKey,
});

const auth = getAuth();

exports.addUser = (email, password) =>
  createUserWithEmailAndPassword(auth, email, password);

exports.authenticate = (email, password) =>
  signInWithEmailAndPassword(auth, email, password);

exports.signOutUser = () => signOut(auth);
