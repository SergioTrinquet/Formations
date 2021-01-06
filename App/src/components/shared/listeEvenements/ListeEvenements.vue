<template>
    <v-container fluid class="pa-0">

        <!-- Modal pour modification d'un évènement (exclusivement avec profil administrateur) -->
        <app-modifEvenement 
            :displayModalChangeEvent="displayModalChangeEvent"
            :theEvent="eventToModify" 
            @eventClose="displayModalChangeEvent = !displayModalChangeEvent"
        ></app-modifEvenement>

        <!-- Modal Filtre date : Ajouté le 31/12/2020 -->
        <app-datePicker  
            v-if="paramsFiltersLoaded == true"
            :displayDP="displayModalDatePicker"
        ></app-datePicker>

        <!-- Modal Filtre villes : Ajouté le 04/01/2021 -->
        <app-listOfCities 
            v-if="paramsFiltersLoaded == true"
            :displayCL="displayModalCitiesList"
        ></app-listOfCities>

        <!-- Subheader -->
        <app-header 
            v-if="eventsLoaded == true"
        ></app-header>


        <v-row>
            <v-col cols="2" class="pa-0 hidden-xs-only margeTriEtFiltres">
            
                <!-- Marge filtres -->
                <app-sortAndFilters  v-if="paramsFiltersLoaded == true"></app-sortAndFilters>

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
import header from '@/components/shared/listeEvenements/ListeEvenementsHeader';
import sortAndFilters from '@/components/shared/listeEvenements/ListeEvenementsSortAndFilters';
import encartsFormations from '@/components/shared/listeEvenements/ListeEvenementsCards';
import datePicker from '@/components/shared/listeEvenements/ListeEvenementsDatePicker';
import listOfCities from '@/components/shared/listeEvenements/ListeEvenementsCities';
import modifEvenement from '@/components/administrateur/ListeEvenementModification';


export default {

    components: { 
        'app-header': header,
        'app-sortAndFilters': sortAndFilters,
        'app-modifEvenement': modifEvenement,
        'app-encartsFormations': encartsFormations,
        'app-datePicker': datePicker, // Ajouté le 31/12/2020
        'app-listOfCities': listOfCities // Ajouté le 04/01/2021
    },


    data() {
        return {
            displayModalChangeEvent: false,
            eventsLoaded: false,

            paramsFiltersLoaded: false // Ajouté le 04/01/2021
        }
    },


    computed: {
        eventToModify() {
            return this.$store.state.eventToModify;
        }

        // Ajouté le 31/12/2020
        , displayModalDatePicker() {
            return this.$store.state.displayModalDatePicker;
        },
        displayModalCitiesList() {
            return this.$store.state.displayModalCitiesList;
        },
        // Ajouté le 04/01/2021
        filtersSelection() { console.warn(">>>>>> COMPUTED filtersSelection dans ''", this.$store.state.selectedFilters); //TEST
            return this.$store.state.selectedFilters;
        },

    },
    watch: {
        eventToModify() {
            this.displayModalChangeEvent = true; // Pour faire apparaitre le modal de modification d'une formation
        }

        // Ajouté le 04/01/2021
        , filtersSelection(val) { 
            console.log("YYYYYYYYYY", val); this.loadEventsWithSelectedFilters() 
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




    // Ajouté le 04/01/2021
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
        min-width: 250px;
    }
</style>