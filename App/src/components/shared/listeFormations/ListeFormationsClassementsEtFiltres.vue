<template>

    <!-- Marge gauche -->
    <div class="leftMarginWrapper">

        <div id="sortAndFiltersEvents" class="d-flex flex-column">
            <div class="bloc">
                <div class="marginLegend">Classement</div>
                <div class="d-flex align-stretch" id="selectSort">
                    <select v-model="sortSelect" @change="sortBy" class="background">
                        <option v-for="(item, i) in sortItemsList" :key="i" 
                            :value="item.sortType"
                        >{{ item.libelle }}</option>
                    </select>
                    <v-icon :class="['up', 'primaire', (sortDirection == 'asc' ? '' : 'lighter')]" @click="sortDirection = 'asc'">fas fa-arrow-up</v-icon>
                    <v-icon :class="['down', 'primaire', (sortDirection == 'desc' ? '' : 'lighter')]" @click="sortDirection = 'desc'">fas fa-arrow-down</v-icon>
                </div> 
            </div>

            
            <div class="bloc" v-if="currentUser.role == 'Admin'">
                <OptionProfilAdmin/>
            </div>

            <div class="bloc" id="btFiltres">
                <div class="marginLegend">Filtres</div>

                <FiltreProfilParticipant v-if="currentUser.role == 'Participant'">
                    <template v-slot:iconLeft>
                        <v-icon left v-show="mesFormations">fas fa-check</v-icon>
                    </template>
                </FiltreProfilParticipant>

                <button 
                    v-for="(filtre, i) in listeFiltres" :key="i"
                    @click="filterBy(i)" 
                    :class="(filtre.selected ? 'selected primaire' : 'primaireLight')"
                >
                    <v-icon left v-show="filtre.selected">fas fa-check</v-icon>{{ filtre.libelle }}
                </button>
                
            </div>

        </div>


        <div id="myFilters" class="background" v-if="'dates' in filtersSelection && filtersSelection.dates.length > 0 || 
            selectedCities.length > 0 || 
            mesFormations"
        >    
            <span v-if="'dates' in filtersSelection && filtersSelection.dates.length > 0" class="primaireLight fakeChip">
                {{ dateRangeText }} <v-icon @click="deleteDatesFromFilter">fas fa-times-circle</v-icon>
            </span>
            <span v-for="ville in selectedCities" :key="ville" class="primaireLight fakeChip mr-2" >
                {{ ville }} <v-icon @click="deleteCityFromFilter(ville)">fas fa-times-circle</v-icon>
            </span>
            <span v-if="mesFormations" class="primaireLight fakeChip">
                mes formations <v-icon @click="deleteMyTrainingsFilter">fas fa-times-circle</v-icon>
            </span>
            <a @click="deleteAllFilters" class="linkDeleteFilters">Supprimer tous mes filtres</a>
        </div>

        <!-- TEST -->
        <!-- <span style="display: inline-block; background-color: green; color: #ffffff; margin: 20px 0; 
        width: 210px; font-size: 15px; line-height: 18px;">Computed filtersSelection => {{ filtersSelection }}</span> -->

    </div>

</template>

<script>
import { mapState } from 'vuex';

import formatageDate from '@/mixins/formatageDate';
import currentDate from '@/mixins/currentDate';
import dateToInt from '@/mixins/dateToInt';

import classementsEtFiltres from '@/mixins/classementsEtFiltres';

export default {
    mixins: [
        formatageDate,
        currentDate,
        dateToInt,
        classementsEtFiltres
    ],

    computed: {
        ...mapState({
            filtersSelection: 'selectedFilters',
            flagEventDeleted: 'flagEventDeleted'    // Computed pour avertir quand un evenement est supprimé afin de recupérer les nvx paramètres des filtres
        })
    },

    watch: {
        // Déclenché à chaque changement de valeur de la variable qui conditionne sens de classement
        sortDirection() {
            this.sortBy();
        },

        flagEventDeleted(val) {
            if(val) {
                this.updateParamsFilters(); // Pour recharger les paramètres des filtres après chaque suppression de formation
                this.$store.commit('SET_FLAG_EVENT_DELETED', false);
            }
        }
    },

    methods: {
        // Affectation nvelles valeurs à la variable 'sortingParameters' dans le state du Vuex afin de partager ces données aux autres composants qui en ont besoin
        sortBy() {
            this.$store.commit('SET_SORTING_PARAMETERS', { type: this.sortSelect, direction: this.sortDirection });
        },

        // Juste pour profil Administrateur : Quand clic sur checkbox 'formations passées' => Appel action ds le Vuex pour récupérer les paramètres à jour pour les filtres date et villes
        async updateParamsFilters() {
            if(this.pastEvents) {
                await this.$store.dispatch('paramsFiltreEvenements', { includePastTrainings: true });
            } else {
                await this.$store.dispatch('paramsFiltreEvenements');
            }
        },

        deleteDatesFromFilter() {
            this.$store.commit('SET_SELECTED_FILTERS', { 'dates': [] }); // Réinitialisation des dates saisies dans var. dans Vuex regroupant les valeurs des filtres
            this.$store.commit('SET_DATERANGE_TEXT', ""); // Retrait texte date
        },
        deleteCityFromFilter(ville) {
            const newSelectionVilles = this.selectedCities.filter(v => v != ville); // Suppression de la ville passée en paramètre du tableau 'this.selectedCities'
            this.$store.commit('SET_SELECTED_FILTERS', { 'villes': newSelectionVilles }); // Envoi mise à jour de la liste des villes dans var. dans Vuex regroupant les valeurs des filtres
        },
        deleteMyTrainingsFilter() {
            this.$store.commit('SET_SELECTED_FILTERS', { 'mesFormations': false }); // Retrait option affichage des anciennes formations
        },
        
        // Qd clic bouton 'Supprimer tous les filtres'
        deleteAllFilters() {
            // Si date(s) sélectionnée(s)
            if(this.selectedDateRange.length > 0) {
                this.$store.commit('SET_DATERANGE_TEXT', ""); // Retrait texte date
            }
            
            let filters = { 'dates': [], 'villes': [] };
            if(this.currentUser.role == 'Participant') {
                filters = Object.assign({}, filters, { 'mesFormations': false });
            }
            console.log("filters", filters); //TEST
            this.$store.commit('SET_SELECTED_FILTERS', filters); // Réinitialisation des dates saisies et du filtre des villes dans var. dans Vuex regroupant les filtres la valeur des filtres
        }
    }

}
</script>

<style scoped>
    .leftMarginWrapper {
        position: fixed;
        left: 0;
        margin-top: 50px;
    }
    #myFilters {
        text-align: center;
        margin: -5px 12px 0 12px;
        padding: 7px 5px;
        width: 205px;
    }
    #sortAndFiltersEvents {
        background-color: #ffffff;
        width: 210px;
        margin: 0 10px;
    }
    #sortAndFiltersEvents .bloc {
        border-bottom: dotted 1px #6d6d6d;
        color: #444444;
        padding: 15px 10px;
    }
    #sortAndFiltersEvents .bloc:last-child {
        border-bottom-width: 0;
    }
    #sortAndFiltersEvents .bloc {
        font-size: 14px;
    }
    #btFiltres button { 
        /* display: inline-block; */ display: block;
        margin: 0 8px 6px 0; 
        border-radius: 4px;
        padding: 2px 19px;
        cursor: pointer;
        transition: background-color 0.2s ease-in-out;
        color: #fff;
        font-size: 15px;

        width: 100%;
    }

    #btFiltres button.selected {
        position: relative;
        padding: 2px 12px 2px 8px;
    }

    #btFiltres button:hover {
        background-color: #283593 !important;
    }
    #btFiltres button.selected i.fas,
    #btFiltres button:hover i.fas {
        color: #ffffff;
        font-size: 11px;
        /* position: absolute;
        top: 5px;
        left: 5px; */
        left: 3px;
    }

    .bloc label { display: inline-block; }

    #selectSort select {
        background-color: #dadada;
        padding: 2px;
        border-radius: 4px 0 0 4px;
        border: solid 1px #444444;
        min-width: 140px;
    }
    #selectSort select,
    #selectSort select option {
        font-size: 14px;
        cursor: pointer;
    }
    #selectSort .fas {
        padding: 2px 5px;
        font-size: 13px;
        cursor: pointer;
        border: solid 1px #5f5f5f;
        background-color: #a1a1a1;
        color: #ffffff;
    }
    #selectSort .up {
        border-width: 1px 0;
    }
    #selectSort .down { 
        border-radius: 0 4px 4px 0;
        border-left-color: #dadadad5 !important;
        border-left-style: dotted !important;
    }
    #selectSort .lighter { 
        opacity: 0.75;
    }

    .initDatesText {
        font-size: 17px;
        text-align: center;
        margin: 0 0 4px 0;
    }

    #myFilters .fakeChip {
        display: inline-block;
        padding: 1px 5px 1px 10px;
        border-radius: 30px;
        letter-spacing: -0.01em;
        margin-bottom: 2px;
    }
    #myFilters .fakeChip,
    #myFilters .fas {
        color: #ffffff;
        font-size: 0.8rem;
    }
    #myFilters .fas {
        margin: auto auto auto 5px;
        cursor: pointer;
    }
    #myFilters .fas:hover {
        color: #ffffffc4;
    }

    .marginLegend {
        font-weight: bold;
        color: #535b7b;
        margin: 0 0 2px 0;
    }
    .linkDeleteFilters {
        display: block;
        text-decoration: underline;
        font-size: 0.9em;
    }
</style>