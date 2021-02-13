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
        <app-listOfCities v-if="paramsFiltersLoaded && displayModalListOfCities"></app-listOfCities>

        <!-- Subheader -->
        <app-header v-if="eventsLoaded"></app-header>


        <v-row>
            <v-col cols="2" class="pa-0 hidden-xs-only margeTriEtFiltres">
            
                <!-- Marge filtres -->
                <app-marginSortAndFilters  v-if="paramsFiltersLoaded"></app-marginSortAndFilters>

            </v-col>
            <v-col class="pa-0">
                <v-row class="ma-0">

                    <v-col class="col-12 offset-0 col-sm-10 offset-sm-1 col-lg-8 offset-lg-2"> 
                       
                        <!-- Encarts descriptifs des formations -->
                        <app-encartsFormations :eventsLoaded="eventsLoaded"></app-encartsFormations>
                
                    </v-col>
                    
                </v-row>
            </v-col>
        </v-row>
        
    </v-container>
</template>

<script>
import { mapState } from 'vuex';

import header from '@/components/shared/listeEvenements/ListeEvenementsHeader';
import encartsFormations from '@/components/shared/listeEvenements/ListeEvenementsCards';

// Le composants suivants ne seront pas chargés directement mais scindés de 'app.js' et chargés 
// de manière asynchrone après coup en tache de fond (lazy loading + code splitting)
const marginSortAndFilters = () => import(/* webpackChunkName: "marginSortAndFilters" */ '@/components/shared/listeEvenements/ListeEvenementsSortAndFilters')
const datePicker = () => import(/* webpackChunkName: "datePicker" */ '@/components/shared/listeEvenements/ListeEvenementsDatePicker')
const listOfCities = () => import(/* webpackChunkName: "ListeEvenementsCities" */ '@/components/shared/listeEvenements/ListeEvenementsCities')
const modifEvenement = () => import(/* webpackChunkName: "ListeEvenementModification" */ '@/components/administrateur/ListeEvenementModification')


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
        ...mapState({
            eventToModify: 'eventToModify',
            displayModalDatePicker: 'displayModalDatePicker',
            displayModalListOfCities: 'displayModalListOfCities',
            filtersSelection: 'selectedFilters'
        })
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
            this.$store.commit('SET_INIT_PAGINATION', true); // Retour 1ere page 
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