import Vue from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify'
import router from './router' // Même chose que 'router/index.js' car quand index, pas besoin de le mettre
import store from './store' // Même chose que 'store/index.js' car quand index, pas besoin de le mettre
import errorMsgComponent from './components/shared/base/AppError'
import modalComponent from './components/shared/base/AppModal'
import loadingComponent from './components/shared/base/AppLoader'

import './assets/css/global.css' // Import css maison

import * as firebase from 'firebase/app'
import 'firebase/auth'

// Your web app's Firebase configuration
var firebaseConfig = {
  apiKey: "AIzaSyBeLqa3-gl7Z_FXePhGcmf1QZK589qnZg8",
  authDomain: "formations-vue-vuetify.firebaseapp.com",
  databaseURL: "https://formations-vue-vuetify.firebaseio.com",
  projectId: "formations-vue-vuetify",
  storageBucket: "formations-vue-vuetify.appspot.com",
  messagingSenderId: "400310845056",
  appId: "1:400310845056:web:f1a82411ab76945852f065"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

Vue.config.productionTip = false

Vue.component('app-errorMsg', errorMsgComponent);
Vue.component('app-modal', modalComponent);
Vue.component('app-loading', loadingComponent);

new Vue({
  vuetify,
  router,
  store,
  render: h => h(App),
  created() {
    store.commit('setLoading', true);
    // Check si un user est déjà connecté lors de l'arrivée sur le site, 
    // et authentification de celui-ci si c'est le cas
    firebase.auth().onAuthStateChanged((user) => {
      if(user) { 
        console.log("main.js => user", user.uid); //TEST 
        store.dispatch('setCurrentUser', user.uid);
      }
      else { 
        console.warn("Pas de user"); //TEST
        store.commit('setLoading', false);
      }
    });
  }
}).$mount('#app')
