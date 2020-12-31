<template>
    <v-container fluid class="pa-0">

        <!-- Modal pour modification d'un évènement (exclusivement avec profil administrateur) -->
        <app-modifEvenement 
            :displayModalChangeEvent="displayModalChangeEvent"
            :theEvent="eventToModify" 
            @eventClose="displayModalChangeEvent = !displayModalChangeEvent"
        ></app-modifEvenement>


        <!-- Subheader -->
        <app-header 
            v-if="eventsLoaded == true" 
            :initPagination="initPagination"
        ></app-header>


        <v-row>
            <v-col cols="2" class="pa-0 hidden-xs-only margeTriEtFiltres">
            
                <!-- Incrementation de 'initPagination' : Retour à la page du début quand nouveaux filtres ou retraits filtres -->
                <app-sortAndFilters 
                    @eventGoToFirstPage="initPagination++"
                ></app-sortAndFilters>

            </v-col>
            <v-col class="pa-0">
                <v-row class="ma-0">

                    <v-col class="col-12 offset-0 col-sm-10 offset-sm-1 col-lg-8 offset-lg-2">

                        <!-- Encarts descriptifs des formations -->
                        <app-encartsFormations
                            @onEventsLoaded="eventsLoaded = true"
                        ></app-encartsFormations>
                
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
import modifEvenement from '@/components/administrateur/ListeEvenementModification';


export default {

    components: { 
        'app-header': header,
        'app-sortAndFilters': sortAndFilters,
        'app-modifEvenement': modifEvenement,
        'app-encartsFormations': encartsFormations
    },

    data() {
        return {
            displayModalChangeEvent: false,
            eventsLoaded: false,
            initPagination: 0
        }
    },


    computed: {
        eventToModify() {
            return this.$store.state.eventToModify;
        }
    },
    watch: {
        eventToModify() {
            this.displayModalChangeEvent = true; // Pour faire apparaitre le modal de modification d'une formation
        }
    },

    /* // Ajouté le 28/12/2020
    async mounted() {
        await this.$store.dispatch('paramsFiltreEvenements'); // Récupération des données necessaires au paramétrage des filtres
        this.paramsFiltersLoaded = true;
    }   */

}
</script>

<style scoped>
    .margeTriEtFiltres {
        background-color: #ffffff;
        min-width: 250px;
    }
</style>