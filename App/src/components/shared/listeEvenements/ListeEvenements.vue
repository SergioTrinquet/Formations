<template>
    <v-container fluid class="pa-0">

        <!-- Modal pour modification d'un évènement (exclusivement avec profil administrateur) -->
        <app-modifEvenement 
            v-if="displayModalChangeEvent"
            @eventClose="displayModalChangeEvent = !displayModalChangeEvent"
            :theEvent="eventToModify" 
        ></app-modifEvenement>

        <!-- Modal Filtre date -->
        <app-datePicker v-if="paramsFiltersLoaded && displayModalDatePicker"></app-datePicker>

        <!-- Modal Filtre villes -->
        <app-listOfCities v-if="paramsFiltersLoaded && displayModalCitiesList"></app-listOfCities>

        <!-- Subheader -->
        <app-header v-if="eventsLoaded"></app-header>


        <v-row>
            <v-col cols="2" class="pa-0 hidden-xs-only margeTriEtFiltres">
            
                <!-- Marge filtres -->
                <!-- <app-marginSortAndFilters  v-if="paramsFiltersLoaded && loadComponent"></app-marginSortAndFilters> -->
                <app-marginSortAndFilters  v-if="paramsFiltersLoaded"></app-marginSortAndFilters>


            </v-col>
            <v-col class="pa-0">
                <v-row class="ma-0">

                    <v-col class="col-12 offset-0 col-sm-10 offset-sm-1 col-lg-8 offset-lg-2"> 
                        
                        <!-- <div style="background-color: yellow; position: fixed; z-index: 10; top: 50%; left: 50%;">loadComponent: {{ loadComponent }}</div> -->
                        
                        <!-- Encarts descriptifs des formations -->
                        <app-encartsFormations :eventsLoaded="eventsLoaded"></app-encartsFormations>
                
                    </v-col>
                    
                </v-row>
            </v-col>
        </v-row>
        
    </v-container>
</template>

<script>
import header from '@/components/shared/listeEvenements/ListeEvenementsHeader';
import encartsFormations from '@/components/shared/listeEvenements/ListeEvenementsCards';

// Le composants suivants ne seront pas chargés directement mais scindés de 'app.js' et chargés 
// de manière asynchrone après coup en tache de fond (lazy loading + code splitting)
const marginSortAndFilters = () => import(/* webpackChunkName: "marginSortAndFilters" */ '@/components/shared/listeEvenements/ListeEvenementsSortAndFilters')
const datePicker = () => import(/* webpackChunkName: "datePicker" */ '@/components/shared/listeEvenements/ListeEvenementsDatePicker')
const listOfCities = () => import(/* webpackChunkName: "ListeEvenementsCities" */ '@/components/shared/listeEvenements/ListeEvenementsCities')
const modifEvenement = () => import(/* webpackChunkName: "ListeEvenementModification" */ '@/components/administrateur/ListeEvenementModification')

/* TEST */
//import loaderComponent from '@/components/shared/base/TEST_loader'
//const marginSortAndFilters = () => ({
//    component: import(/* webpackChunkName: "marginSortAndFilters" */ '@/components/shared/listeEvenements/ListeEvenementsSortAndFilters'),
//    loading: loaderComponent
//})


export default {

    components: { 
        'app-header': header,
        'app-marginSortAndFilters': marginSortAndFilters,
        'app-modifEvenement': modifEvenement,
        'app-encartsFormations': encartsFormations,
        'app-datePicker': datePicker,
        'app-listOfCities': listOfCities
    },

    data() {
        return {
            displayModalChangeEvent: false,
            eventsLoaded: false,
            paramsFiltersLoaded: false // Ajouté le 04/01/2021
        }
    },

    computed: {
        eventToModify() {       console.warn(">>>>>> COMPUTED eventToModify", this.$store.state.eventToModify); //TEST
            return this.$store.state.eventToModify;
        },
        displayModalDatePicker() {
            return this.$store.state.displayModalDatePicker;
        },
        displayModalCitiesList() {
            return this.$store.state.displayModalCitiesList;
        },
        // Ajouté le 04/01/2021
        filtersSelection() {    console.warn(">>>>>> COMPUTED filtersSelection dans ''", this.$store.state.selectedFilters); //TEST
            return this.$store.state.selectedFilters;
        },

        /* // Ajouté le 18/01/2021 : Pour loader ou non le composant 'marge des classement et filtres' en fonction de l taille de l'écran ///////////////////
        loadComponent() {    //console.log("Je suis dans 'loadComponent'"); //TEST
            let screenSize = this.$vuetify.breakpoint.name; // Pour connaitre dans quel catégorie de dimension se trouve le Viewport
            return (screenSize !== 'xs') ? true : false;
        }
        ///////////////////// */
    },
    watch: {
        eventToModify() {
            this.displayModalChangeEvent = true; // Pour faire apparaitre le modal de modification d'une formation
        },

        // Ajouté le 04/01/2021
        filtersSelection() { 
            this.loadEventsWithSelectedFilters() 
        }
    },


    // Ajouté le 04/01/2021
    methods: {
        async loadEventsWithSelectedFilters() {
            await this.$store.dispatch('loadEvenements', this.filtersSelection); // Appel requete avec filtres sélectionnés
            this.$store.commit('setInitPagination', true); // Retour 1ere page 
        }
    },
    // FIN Ajouté le 04/01/2021


    async mounted() {
        await this.$store.dispatch('paramsFiltreEvenements'); // Récupération des données necessaires au paramétrage des filtres
        this.paramsFiltersLoaded = true;

        // Ajouté le 05/01/2021
        await this.$store.dispatch('loadEvenements', this.filtersSelection); // Récupération des données pour les formations avec en paramètre les valeurs du/des filtres sélectionnés (qd il y en a)        
        this.eventsLoaded = true;
    }  

}
</script>

<style scoped>
    .margeTriEtFiltres {
        background-color: #ffffff;
        min-width: 240px;
        min-height: calc(100vh - 86px);
    }
</style>