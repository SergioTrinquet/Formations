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
            width="100vw" 
            cssClass="col-10 offset-1 col-sm-8 offset-sm-2 col-md-6 offset-md-3"
            header="Ajouter un animateur"
            transition="scale"
        >
            <!-- Ici, v-if seulement utile pour différer chargement du fichier 'CreationAnimateur.js' que qd click pour faire apparaitre le modal (car ce composant est asynchrone), sinon pas utile -->
            <CreationAnimateur 
              v-if="displayModalAddAnimateur" 
              @eventClose="displayModalAddAnimateur = !displayModalAddAnimateur"
            />
        </app-modal>


        <!-- Modal final avec redirection vers liste des formations -->
        <app-modal :display="displayModalRecordedEvent">
            <div class="wrapper">
                <div>nouvelle formation enregistré</div>
                <v-btn @click="endCreationNewEvent" depressed>Fermer</v-btn>
            </div>
        </app-modal>


        <!-- Encart de saisie pour nouvelle formation -->
        <transition name="fadeInFromBottom" appear>
          <v-card 
              tile
              elevation="2"
              class="my-5"
          >
              <v-toolbar flat dense color="primaireLight" dark>{{ titre }}</v-toolbar>

              <FormulaireFormation 
                  :evenement="evenement" 
                  @eventResultValidation="resultValidation($event)"
              >
                  <div class="col-10 offset-1 my-6">
                      <InputsFormation
                          :evenement="evenement"
                          @eventDisplayModalAddAnimateur="displayModalAddAnimateur = true"
                      />
                  </div>
              </FormulaireFormation>

          </v-card>
        </transition>

      </v-col>
    </v-row>
  </v-container>
</template>

<script>  
  import FormulaireFormation from '@/components/administrateur/FormulaireFormation';
  import InputsFormation from '@/components/administrateur/InputsFormation';
  const CreationAnimateur = () => import(/*webpackChunkName: "CreationAnimateur"*/ '@/components/administrateur/CreationAnimateur')

  export default {
    components: {
      FormulaireFormation,
      InputsFormation,
      CreationAnimateur
    },

    data() {
      return {
        titre: "Nouvelle formation",
        displayModalAddAnimateur: false,
        evenement: {
          titre: '',
          description: '',
          date: null,
          heure: null,
          adresse: '',
          CP: '',
          ville: '',
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
            this.$store.commit('SET_DISPLAY_MODAL_EVENT_RECORDED', false);
            this.$router.push({ name: 'events_list' });
        }
    }

  }
</script>

<style scoped>
    .wrapper {
        padding: 25px;
    }
</style>