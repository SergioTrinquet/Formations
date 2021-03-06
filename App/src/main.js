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

import firebaseConfig from './firebase.config.js'

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
    store.commit('SET_LOADING', true);
    // Check si un user est déjà connecté lors de l'arrivée sur le site, 
    // et authentification de celui-ci si c'est le cas
    firebase.auth().onAuthStateChanged((user) => {
      if(user) { 
        console.log("main.js => user", user.uid); //TEST 
        store.dispatch('setCurrentUser', user.uid);
      }
      else { 
        console.warn("Pas de user"); //TEST
        store.commit('SET_LOADING', false);
      }
    });
  }
}).$mount('#app')
