<template>
    <v-container fluid class="pa-0">


        <!-- Modal pour modification d'un évènement -->
        <app-modifEvenement 
            :displayModalChangeEvent="displayModalChangeEvent"
            :theEvent="eventToModify" 
            @eventClose="displayModalChangeEvent = !displayModalChangeEvent"
        ></app-modifEvenement>


        <!-- Suheader -->
        <app-header 
            v-if="eventsLoaded == true" 
            :initPagination="initPagination"
        ></app-header>


        <!-- Lignes boutons Classement et filtres qui ne doit apparaitre que qd écran est en xs -->
        <v-row class="hidden-sm-and-up">
            <v-col style="background-color:pink; text-align: center;">
                <v-btn style="width: 100%;">Classement</v-btn>
            </v-col>
            <v-col style="background-color:blue; text-align: center;">
                <v-btn style="width: 100%;">Filtres</v-btn>
            </v-col>
        </v-row>


        <v-row>
            <v-col cols="2" class="hidden-xs-only pa-0" id="margeTriEtFiltres">
            
                <!-- Incrementation de 'initPagination' : Retour à la page du début quand nouveaux filtres ou retraits filtres -->
                <app-sortAndFilters 
                    @eventGoToFirstPage="initPagination++"    
                    :reloadParamsFilters="reloadParamsFilters"
                ></app-sortAndFilters>

            </v-col>
            <v-col class="pa-0">
                <v-row class="ma-0">

                    <v-col class="col-12 offset-0 col-sm-10 offset-sm-1 col-lg-8 offset-lg-2">

                        <!-- Encarts descriptifs des formations -->
                        <app-encartsFormations
                            @onChangeEvent="changeEvent($event)"
                            @onEventsLoaded="eventsLoaded = true"
                            @onEndDeleteEvent="reloadParamsFilters++"
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
import modifEvenement from '@/components/administrateur/ListeEvenementModification';
import encartsFormations from '@/components/administrateur/ListeEvenementsContenuPrincipal';

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
            initPagination: 0,
            reloadParamsFilters: 0,
            eventToModify: null
        }
    },

    methods: {
        changeEvent(e) {
            console.log("id de l'encart à modifier :", e.id_evenement, e); //TEST
            this.displayModalChangeEvent = true;
            this.eventToModify = e;
        }
    }

}
</script>

<style scoped>
    #margeTriEtFiltres {
        background-color: #ffffff;
        min-width: 250px;
    }
</style>