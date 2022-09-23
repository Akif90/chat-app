import firebase from 'firebase/compat/app';
import 'firebase/compat/database';

const config = {
  apiKey: 'AIzaSyDPjSNiTR5b2qGc7LN2rG30cWuTw2LWvGI',
  authDomain: 'chat-web-app-58910.firebaseapp.com',
  projectId: 'chat-web-app-58910',
  storageBucket: 'chat-web-app-58910.appspot.com',
  databaseURL:
    'https://chat-web-app-58910-default-rtdb.asia-southeast1.firebasedatabase.app',
  messagingSenderId: '243101179200',
  appId: '1:243101179200:web:0697a3dc9acc2b789faea5',
};

const app = firebase.initializeApp(config);
export const auth = app.auth();
export const database = app.database();
// interact with the database with this obj
