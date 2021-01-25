<template>

  <v-app>

    <app-loading :loading="loading"></app-loading><!-- Loader général -->
    <app-errorMsg :message="msgError"></app-errorMsg><!-- Encart d'erreur général -->


    <!-- Menu marge gauche -->
    <v-navigation-drawer 
      v-if="displayMenu"
      class="d-sm"
      v-model="sideNav"
      dark
      app
      floating
      disable-resize-watcher
    >
      <div class="verticalMenu">
        <div>
          <v-icon class="mr-2" v-on:click="sideNav = false">close</v-icon>
        </div>

        <div
          v-for="(item, i) in menu"
          v-bind:key="i" 
        >
          <router-link
            :to="{ name: item.routeName }"
          ><v-icon class="mr-2">{{ item.btMenu.icon }}</v-icon>{{ item.btMenu.intitule }}</router-link>
        </div>
      </div>
    </v-navigation-drawer>

    <!-- 1ere ligne Header -->
    <v-system-bar 
      height="30" 
      app 
      color="primaireDark" 
      class="infosUser"
    >
      <div v-show="currentUser.role !== null">Bienvenue {{ currentUser.firstName + " " + currentUser.lastName | capitalizeOnEveryWords }}</div>
      <v-spacer></v-spacer>
      <div>type utilisateur : {{ (currentUser.role == null) ? "pas identifié" : currentUser.role }}</div> 
    </v-system-bar>


    <v-app-bar  
      style="margin-top:30px"
      app
      color="primaire"
      dark
      elevate-on-scroll
    >
      
      <!-- Icone menu -->
      <div class="d-sm-none" v-if="displayMenu">
        <v-icon 
          class="mr-1" 
          v-on:click="sideNav = !sideNav"
        >menu</v-icon>
        <v-divider
          class="mx-2"
          vertical
        ></v-divider>
      </div>

      <div class="white--text title">Formations</div>

      <v-spacer></v-spacer>

      <!-- Boutons de navigation -->
      <v-btn 
        color="primaire" 
        depressed 
        class="menuLabels text-lowercase ms-2 d-none d-sm-flex"
        v-for="(item, i) in menu"
        v-bind:key="i"
        :to="{ name: item.routeName }"
      >
        <span><v-icon class="mr-2">{{ item.btMenu.icon }}</v-icon>{{ item.btMenu.intitule }}</span>
      </v-btn>

      <v-divider 
        vertical 
        class="mx-4"
        v-show="currentUser.role !== null"
      ></v-divider>

      <!-- Icone de déconnexion -->
      <v-tooltip bottom content-class="tooltip">
        <template v-slot:activator="{ on }">
          <v-icon 
            v-show="currentUser.role !== null" 
            @click="signOut"
            v-on="on"
          >exit_to_app</v-icon>
        </template>
        <span>Se déconnecter</span>
      </v-tooltip>

    </v-app-bar>

    <!-- Contenu page -->
    <v-content class="background">    

      <!-- JUSTE POUR TEST --><div style="position: fixed; top 90px;">{{ "FF_currentUser => " + FF_currentUser }}<button v-on:click="CallStateFF_currentUser" style="background-color:red; color: #fff;">Appel FF_currentUser</button></div>
      
      <!-- Modal de bienvenue pour nouveaux inscrits et nouveaux connectés -->
      <app-modal :display="displayModalWelcome">
        <div class="mx-10 my-5">
          <div class="modalTxt">{{ texteModalWelcome }}<br />{{ currentUser.firstName + " " + currentUser.lastName }}</div>
          <v-btn @click="closeModalWelcome" depressed>Fermer</v-btn>
        </div>
      </app-modal>

      <router-view></router-view>
    </v-content>
  </v-app>
</template>

<script>
import capitalizeOnEveryWords from '@/filters/capitalizeOnEveryWords.js'

export default {
  filters: { capitalizeOnEveryWords },

  data: () => ({
    sideNav: false
  }),

  computed: {
    msgError() {
      return this.$store.state.msgError;
    },
    loading() {
      return this.$store.state.loading;
    },
    menu() {
      return this.$store.getters.menu;
    },
    pageRedirection() {
      return this.$store.getters.pageRedirection;
    },
    currentUser() {   console.warn("computed : currentUser => ", this.$store.getters.currentUser); //TEST
      return this.$store.getters.currentUser;
    },

    // Affichage ou non menu hamburger avec navigation verticale
    displayMenu() {
      const rolesWithMenu = this.$store.state.pages
                              .filter(p => 'btMenu' in p)
                              .map(p => p.roles);
      let display = false;
      for(const roles of rolesWithMenu) {
        if(roles.includes(this.currentUser.role)) {
          display = true;
          break;
        }
      }
      return display;
    },

    displayModalSignIn() {
      return this.$store.state.displayModalSignIn;
    },
    displayModalSignUp() {
      return this.$store.state.displayModalSignUp;
    },
    displayModalWelcome() {     //console.log("displayModalSignIn =>", this.$store.state.displayModalSignIn, "displayModalSignUp =>", this.$store.state.displayModalSignUp, "displayModalWelcome => ", this.$store.state.displayModalSignIn || this.$store.state.displayModalSignUp); //TEST
      return this.displayModalSignIn || this.displayModalSignUp;
    },
    texteModalWelcome() {
      let txt = "";
      if(this.displayModalSignIn) {
        txt = "Heureux de vous retrouver"
      } else if(this.displayModalSignUp) {
        txt = "Bienvenue parmi nous"
      }
      return txt;
    },

    // TEST
    FF_currentUser() {
      return this.$store.getters.FF_currentUser;
    }
    // FIN TEST

  },

  watch: {
    currentUser(val, oldVal) {   
      console.error("(APP.VUE) WATCH : currentUser => ", "Ancien role => " + oldVal.role, "Nouveau role => " + val.role); //TEST
      
      // NOTE : Ne passe pas dans ce Watch qd pas logué/inscrit 
      // Si val == oldVal, pas de redirection, sinon redirection
      if(oldVal.role !== val.role) {
        console.error("Ancien role different de nv role : On redirige !!");
        this.redirection(val);
      }
    }

  },

  methods: {
    // Redirection vers la bonne page en fonction du profil de la personne loguée :
    // Si déconnexion ou bien pas encore logué => Redirection vers pg d'accueil,
    // Dans tous les autres cas (si utilisateur logué en tant que Participant, Animateur ou Administrateur) => Redirection vers pg de liste des formations
    redirection(currentUser) {    console.log(">>>>> Methode 'redirection' dans App.vue <<<<<"); //TEST
        let pr = null;
        pr = this.pageRedirection.find(pr => pr.roles.includes(currentUser.role));
        if(typeof pr !== "undefined" && pr.routeName !== '') {
          // Passe dans le 'catch' qd même route est pushé une 2eme fois de suite: 
          // Seul moyen d'éviter de soulever un log d'erreur est de faire un catch vide
          this.$router.push({ name: pr.routeName }).catch(() => {});
        }
    },

    signOut() {
      this.$store.dispatch('signOut');
    },

    closeModalWelcome() {
      if(this.displayModalSignIn) {
        this.$store.commit('setDisplayModalSignIn', false);
      } else if(this.displayModalSignUp) {
        this.$store.commit('setDisplayModalSignUp', false);
      }
    },

    CallStateFF_currentUser() { this.$store.dispatch('FF_currentUser'); } // TEST
  }

}
</script>

<style scoped>
  .verticalMenu > div:first-child {
    height: 50px;
    display: flex;
    justify-content: end;
  }
  .verticalMenu > div:first-child .v-icon:hover {
    transform: rotate(360deg);
    transform-origin: center;
  }
  .verticalMenu > div > a {
    padding: 16px 20px;
    display: block;
    color: #ffffff;
    text-decoration: none;
    background-color: rgba(255,255,255,0);
    transition: 0.2s all ease-in-out;
    box-shadow: 0 1px rgba(255,255,255,0.1);
  }
  .verticalMenu > div > a:hover {
    background-color: rgba(255,255,255,0.1);
  }
  .verticalMenu > div > a:first-child {
    box-shadow: 0 1px rgba(255,255,255,0.1), 0 -1px rgba(255,255,255,0.1);
  }

  .menuLabels span {
    font-size: 16px;
    letter-spacing: 0.06em;
  }

  .infosUser {
    padding-left: 16px;
    padding-right: 16px;
  }
  .infosUser > div {
    color: #ffffff;
    font-size: 13px;
    line-height: 11px;
  }

  .modalTxt {
    line-height: 20px;
  }
</style>
