import React from 'react';
import ReactDOM from 'react-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import Main from './components/main';
import * as firebase from 'firebase';

var config = {
  apiKey: 'AIzaSyD0aQiPumNqa0CiEIesLifYnkWHjMlPHiQ',
  authDomain: 'myapp1116.firebaseapp.com',
  databaseURL: 'https://myapp1116.firebaseio.com',
  projectId: 'myapp1116',
  storageBucket: 'gs://myapp1116.appspot.com',
  messagingSenderId: '163605876535'
};
firebase.initializeApp(config);

//const app = document.getElementById('app');
ReactDOM.render(<Main />, document.getElementById('root'));
