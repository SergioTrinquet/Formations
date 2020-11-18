<template>

  <v-app>

    <app-loading :loading="loading"></app-loading><!-- Loader général -->
    <app-errorMsg :message="msgError"></app-errorMsg><!-- Encart d'erreur général -->

    <!-- Menu marge gauche -->
    <v-navigation-drawer 
      class="d-sm"
      v-model="sideNav"
      dark
      app
      floating
      disable-resize-watcher
    >
      <v-list>
        <v-list-item-group>
        <v-subheader>Fermer<v-icon class="pl-2" v-on:click="sideNav = false">close</v-icon></v-subheader>
        <v-list-item>
          <v-list-item-content>
            <v-list-item-title>AAA</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-divider></v-divider>
        <v-list-item>AAA</v-list-item>
        <v-divider></v-divider>
        <v-list-item>AAA</v-list-item>
        <v-divider></v-divider>
         </v-list-item-group>
      </v-list>

      <!-- <v-icon>fas fa-lock</v-icon> -->
      <div class="verticalMenu">
        <div>
          <v-icon class="pr-2" v-on:click="sideNav = false">close</v-icon>
        </div>
        <div><a href="">BBB</a></div>
        <div><a href="">BBB</a></div>
      </div>

    </v-navigation-drawer>

    <!-- 1ere ligne Header -->
    <v-system-bar 
      height="30" 
      app 
      fixed 
      color="primaireDark" 
      class="infosUser"
    >
      <div v-show="currentUser.role !== null">Bienvenue {{ currentUser.firstName + " " + currentUser.lastName | capitalizeOnEveryWords }}</div>
      <v-spacer></v-spacer>
      <div class="userType">type utilisateur : {{ (currentUser.role == null) ? "pas identifié" : currentUser.role }}</div> 
    </v-system-bar>


    <v-app-bar  
      style="margin-top:30px"
      app
      color="primaire"
      dark
      elevate-on-scroll
      class="over"
    >
      
      <!-- <div class="d-flex align-center">
        <v-img
          class="shrink mr-2"
          src="https://cdn.vuetifyjs.com/images/logos/vuetify-logo-dark.png"
          transition="scale-transition"
          width="40"
        />
      </div> -->

      <!-- Icone menu -->
      <div class="d-sm-none">
        <v-icon class="mr-1" v-on:click="sideNav = !sideNav">menu</v-icon>
        <v-divider
          class="mx-4"
          vertical
        ></v-divider>
      </div>

      <router-link 
        tag="div" 
        :to="direction" 
        class="white--text title" 
        style="cursor: pointer;"
      >
        Formations
      </router-link>

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
        <span><v-icon class="mr-2">{{ item.icon }}</v-icon>{{ item.intitule }}</span>
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
    menu() { console.log(" App : On est dans le computed 'menu'"); //TEST
      //return this.$store.getters.menu; // Version Originale
      // V2
      return this.$store.getters.menu.filter(m => m.visible == true);
    },
    currentUser() {
      return this.$store.getters.currentUser;
    },
    direction() {
        return (this.currentUser.role == "Participant" ? "events" : "/");
    }

    // TEST
    ,FF_currentUser() {
      return this.$store.getters.FF_currentUser;
    }
    // FIN TEST

  },

  watch: {
    currentUser(val) { console.warn("watch : currentUser => ", val); //TEST
      // Si déconnexion donc plus de valeur dans currentUser => Redirection vers pg d'accueil
      if(val.role == null) {
        this.$router.push({ name: 'accueil' });
      }

      // Si personne loguée est un Participant, il n'a qu'une page donc redirection vers celle-ci 
      if(val.role == 'Participant') {
        this.$router.push({ name: 'events' });
      }
    }
  },

  methods: {
    signOut() {
      this.$store.dispatch('signOut');
    },

    CallStateFF_currentUser() { this.$store.dispatch('FF_currentUser'); } // TEST
  }

}
</script>

<style scoped>
  .verticalMenu > div:first-child {
    text-align: right;
  }
  .verticalMenu > div > a {
    padding: 10px 20px;
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

  .menuLabels span {
    font-size: 16px;
    letter-spacing: 0.06em;
  }

  /* .over {
    z-index: 10000 !important;
  } */

  .infosUser {
    padding-left: 16px;
    padding-right: 16px;
    /* z-index: 10001; */
  }
  .infosUser > div {
    color: #ffffff;
    font-size: 13px;
  }
</style>
