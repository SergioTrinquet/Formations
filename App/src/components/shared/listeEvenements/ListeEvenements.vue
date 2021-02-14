<template>
    <v-container fluid class="pa-0">

        <!-- Modal pour modification d'un évènement (exclusivement avec profil administrateur) -->
        <ModificationFormation 
            v-if="displayModalChangeEvent"
            @eventClose="displayModalChangeEvent = !displayModalChangeEvent"
            :theEvent="eventToModify" 
        />

        <!-- Modal Filtre date -->
        <FiltreDates v-if="paramsFiltersLoaded && displayModalDatePicker" />

        <!-- Modal Filtre villes -->
        <VillesFiltre v-if="paramsFiltersLoaded && displayModalListOfCities" />

        <!-- Subheader -->
        <InfosTopScreen v-if="eventsLoaded" />


        <v-row>
            <v-col cols="2" class="pa-0 hidden-xs-only margeTriEtFiltres">
            
                <!-- Marge classements et filtres -->
                <ClassementsEtFiltres  v-if="paramsFiltersLoaded" />

            </v-col>
            <v-col class="pa-0">
                <v-row class="ma-0">

                    <v-col class="col-12 offset-0 col-sm-10 offset-sm-1 col-lg-8 offset-lg-2"> 
                       
                        <!-- Encarts descriptifs des formations -->
                        <DescriptifFormation :eventsLoaded="eventsLoaded" />
                
                    </v-col>
                    
                </v-row>
            </v-col>
        </v-row>
        
    </v-container>
</template>

<script>
import { mapState } from 'vuex';

import InfosTopScreen from '@/components/shared/listeEvenements/ListeEvenementsHeader';
import DescriptifFormation from '@/components/shared/listeEvenements/ListeEvenementsCards';

// Le composants suivants ne seront pas chargés directement mais scindés de 'app.js' et chargés 
// de manière asynchrone après coup en tache de fond (lazy loading + code splitting)
const ClassementsEtFiltres = () => import(/* webpackChunkName: "ClassementsEtFiltres" */ '@/components/shared/listeEvenements/ListeEvenementsSortAndFilters')
const FiltreDates = () => import(/* webpackChunkName: "FiltreDates" */ '@/components/shared/listeEvenements/ListeEvenementsDatePicker')
const VillesFiltre = () => import(/* webpackChunkName: "VillesFiltre" */ '@/components/shared/listeEvenements/ListeEvenementsCities')
const ModificationFormation = () => import(/* webpackChunkName: "ModificationFormation" */ '@/components/administrateur/ListeEvenementModification')


export default {

    components: { 
        InfosTopScreen,
        ClassementsEtFiltres,
        ModificationFormation,
        DescriptifFormation,
        FiltreDates,
        VillesFiltre
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

        filtersSelection() { 
            this.loadEventsWithSelectedFilters();
        }
    },


    methods: {
        async loadEventsWithSelectedFilters() {
            await this.$store.dispatch('loadEvenements', this.filtersSelection); // Appel requete avec filtres sélectionnés
            this.$store.commit('SET_INIT_PAGINATION', true); // Retour 1ere page 
        }
    },


    async mounted() {
        await this.$store.dispatch('paramsFiltreEvenements'); // Récupération des données necessaires au paramétrage des filtres
        this.paramsFiltersLoaded = true;

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