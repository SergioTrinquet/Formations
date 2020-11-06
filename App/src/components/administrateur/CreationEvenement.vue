<template>
  <v-container fluid>
    <v-row>
      <v-col
        class="col-12 offset-0 
        col-sm-10 offset-sm-1  
        col-md-8 offset-md-2"
      >

        
        <!-- Modal de création d'animateurs -->
        <app-modal 
            :display="displayModalAddAnimateur" 
            :width="modalWidth" 
            cssClass="col-10 offset-1 col-sm-8 offset-sm-2 col-md-6 offset-md-3"
            header="Ajouter un animateur"
        >
            <app-creationAnimateur @eventClose="displayModalAddAnimateur = !displayModalAddAnimateur"></app-creationAnimateur>
        </app-modal>


        <!-- Modal final avec redirection vers liste des évènements -->
        <app-modal :display="displayModalRecordedEvent">
            <div class="wrapper">
                <div>Nouvel évènement enregistré</div>
                <v-btn @click="endCreationNewEvent" depressed>Fermer</v-btn>
            </div>
        </app-modal>


        <!-- Encart de saisie pour nouvelle formation -->
        <v-card 
            tile
            elevation="2"
            class="my-10"
        >
            <v-toolbar flat dense color="secondaire" dark>{{ titre }}</v-toolbar>

            <app-formEvenement 
                :evenement="evenement" 
                @eventResultValidation="resultValidation($event)"
            >
                <div class="col-10 offset-1 my-6">
                    <app-inputsEvenement
                        :evenement="evenement"
                        @eventDisplayModalAddAnimateur="displayModalAddAnimateur = true"
                    ></app-inputsEvenement>
                </div>
            </app-formEvenement>

        </v-card>

      </v-col>
    </v-row>
  </v-container>
</template>

<script>  
  import FormEvenement from '@/components/administrateur/FormEvenement';
  import inputsEvenement from '@/components/administrateur/InputsEvenement';
  import creationAnimateur from '@/components/administrateur/CreationAnimateur';

  export default {
    components: {
      'app-formEvenement': FormEvenement,
      'app-inputsEvenement': inputsEvenement,
      'app-creationAnimateur': creationAnimateur
    },

    data() {
      return {
        titre: "Création d'évènement",
        displayModalAddAnimateur: false,
        modalWidth: "100vw",

        evenement: {
          titre: '',
          description: '',
          date: null,
          heure: null,
          adresse: '',
          CP: '',
          ville: '',
          image: '', // optionnel : Le garde-t-on ?
          coordonnees: {
            x: null,
            y: null
          },
          animateurs: [], //id de(s) (l')animateur(s)
        },

      }
    },

    computed: {
      displayModalRecordedEvent() {
        return this.$store.state.displayModalRecordedEvent;
      }
    },

    methods: {
        resultValidation(ev) {
            this.$store.dispatch('addEvenement', ev);
        },
        endCreationNewEvent() {
            this.$store.commit('setDisplayModalRecordedEvent', false);
            this.$router.push({ name: 'events_list' });
        }
    }


    /* computed: {
      currentUser() { return this.$store.getters.currentUser.role; }
    },
    mounted() {
      if(this.currentUser !== 'Admin') {
        alert("Vous n'avez pas les droits d'accès à cette page.\nVous allez être redirigé vers la page d'accueil."); 
        this.$router.push({ name: 'accueil' }); // Redirection vers la page d'accueil
      }
    } */


  }
</script>

<style scoped>
    .wrapper {
        padding: 25px;
    }
</style>