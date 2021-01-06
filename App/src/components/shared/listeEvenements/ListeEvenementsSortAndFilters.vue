<template>

    <!-- Marge gauche -->
    <div class="blocsMargeWrapper">

        <div id="sortAndFiltersEvents" class="d-flex flex-column">
            <div class="bloc">
                <div>Classement</div>
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

            <div class="bloc" v-if="profileSpecificFilter.component != ''">
                <component 
                    :is="profileSpecificFilter.component" 
                    v-bind="profileSpecificFilter.properties" 
                    @emitFilterValue="execProfileSpecificFilter()"
                ></component>
            </div>

            <div class="bloc">
                <div>Filtres</div>
                <span 
                    v-for="(button, i) in filterButtons" :key="i"
                    @click="filterBy(i)" 
                    :class="'vChipSort background ' + (button.selected ? 'selected' : '')"
                >
                    {{ button.libelle }}<v-icon right v-show="button.selected">fas fa-check</v-icon>
                </span>
            </div>

        </div>


        <div id="myFilters" v-if="'dates' in filtersSelection && filtersSelection.dates.length > 0 || 
            selectionVilles.length > 0 || 
            pastEvents || 
            mesFormations"
        >    
            <div>Mes filtres</div>
            <span v-if="'dates' in filtersSelection && filtersSelection.dates.length > 0" class="primaireLight fakeChip">
                {{ dateRangeText }} <v-icon @click="deleteDatesFromFilter">fas fa-times-circle</v-icon>
            </span>
            <span v-for="ville in selectionVilles" :key="ville" class="primaireLight fakeChip mr-2" >
                {{ ville }} <v-icon @click="deleteCityFromFilter(ville)">fas fa-times-circle</v-icon>
            </span>
            <span v-if="pastEvents || mesFormations" class="primaireLight fakeChip">
                {{ profileSpecificFilter.properties.label }} <v-icon @click="deleteProfileSpecificFilter">fas fa-times-circle</v-icon>
            </span>
            <v-btn @click="deleteAllFilters" class="deleteFiltersBt bt_green" x-small>Supprimer tous mes filtres</v-btn>
        </div>

        <!-- TEST --><!-- <span style="display: inline-block; background-color: green; color: #ffffff; margin: 20px 0; width: 240px; font-size: 15px; line-height: 18px;">selectedFilters => {{ selectedFilters }}</span> -->
        <!-- TEST --><span style="display: inline-block; background-color: green; color: #ffffff; margin: 20px 0; width: 240px; font-size: 15px; line-height: 18px;">Computed filtersSelection => {{ filtersSelection }}</span>

    </div>

</template>

<script>
import formatageDate from '@/mixins/formatageDate';
import currentDate from '@/mixins/currentDate';
import dateToInt from '@/mixins/dateToInt';
import deleteItemFromArray from '@/mixins/deleteItemFromArray';
import filterParticipant from '@/components/participants/ListeEvenementsFilter';
import filterAdmin from '@/components/administrateur/ListeEvenementsFilter';

export default {
    mixins: [
        formatageDate,
        currentDate,
        dateToInt,
        deleteItemFromArray
    ],

    data() {
        return {
            sortItemsList: [
                { libelle: 'date', sortType: 'date' },
                { libelle: 'intitulé', sortType: 'titre' },
                { libelle: 'nbr de participants', sortType: 'NbParticipants' }
            ],
            sortSelect: "date",
            sortDirection: 'asc',

            filterButtons: [
                { libelle: 'dates', selected: false },
                { libelle: 'villes', selected: false }
            ],

            dateRange: [],
        }
    },

    computed: {
        currentUser() {
            return this.$store.getters.currentUser;
        },

        // Récupération des valeurs de classement (ordre et type)
        sortingParameters() {
            return this.$store.state.sortingParameters;
        },
        filtersSelection() { console.warn(">>>>>> COMPUTED filtersSelection", this.$store.state.selectedFilters); //TEST
            return this.$store.state.selectedFilters;
        },
        selectionVilles() {
            let villes = this.filtersSelection.villes;
            return typeof villes == 'undefined' ? [] : villes;
        },
        pastEvents() {
            let pastEvents = this.filtersSelection.pastEvents;
            return typeof pastEvents == 'undefined' ? false : pastEvents;
        },
        mesFormations() {
            let mesFormations = this.filtersSelection.mesFormations;
            return (typeof mesFormations == 'undefined') ? false : mesFormations;
        },
        dateRangeText() {   console.log("COMPUTED dateRangeText", this.$store.state.dateRangeText); //TEST
            return this.$store.state.dateRangeText;
        },

        // A VIRER A TERME !! (04/01/2021)
        // Computed pour les paramètres d'initialisation des filtres 'dates' et 'villes'
        dataFilters() {
            let paramsFiltersEvenements = this.$store.state.paramsFiltersEvenements;
            return {
                villes: paramsFiltersEvenements.villes.map(v => v.toUpperCase()), 
                dates: {
                    min: paramsFiltersEvenements.minDate, 
                    max: paramsFiltersEvenements.maxDate
                }
            }
        },

        // VOUE A DISPARAITRE AU PROFIT VAR 'slectedFilters' DANS VUEX
        // Computed qui regroupe tous les filtres sélectionnés
        /* selectedFilters() {
            let filters = {};

            // Quand personne loguée est un Administrateur
            if(this.pastEvents) {
                filters.pastEvents = true;
            } else {
                if("pastEvents" in filters) { delete filters.pastEvents; } // Vérification si key 'pastEvents' existe : Si oui, suppression de l'objet 'filters'
            }

            // Quand personne loguée est un Participant
            if(this.mesFormations) {
                filters.mesFormations = true;
            } else {
                if("mesFormations" in filters) { delete filters.mesFormations; } // Vérification si key 'mesFormations' existe : Si oui, suppression de l'objet 'filters'
            }

            // Peu importe le profil de la personne loguée
            if(this.dateRange.length > 0) {
                filters.dates = this.dateRange;
            }
            if(this.selectionVilles.length > 0) {
                filters.villes = this.selectionVilles;
            }

            return filters;
        }, */

        // Computed pour avertir quand un evenement est supprimé afin de recupérer les nvx paramètres des filtres
        flagEventDeleted() {
            return this.$store.state.flagEventDeleted;
        },

        // Computed pour afficher le bon composant 'filtre' selon le profil utilisateur 
        profileSpecificFilter() {
            const role = this.currentUser.role;
            return role == 'Participant' ? { component: filterParticipant, properties: { mesFormations: this.mesFormations, label: "Mes formations uniquement" } } :
                role == 'Admin' ? { component: filterAdmin, properties: { pastEvents: this.pastEvents, label: "Anciennes formations" } } :
                { component: '', properties: {}};
        }

    },

    watch: {
        // Affectation des variables de classement aux variables locales
        sortingParameters(val) {
            this.sortSelect = val.type;
            this.sortDirection = val.direction;
        },

        // Déclenché à chaque changement de valeur de la variable qui conditionne sens de classement
        sortDirection() {
            this.sortBy();
        },

        // A VIRER A TERME !!!!!!!!! : Code à transférer ds les composants concernés (04/01/2021)
        // Déclenché qd clic sur 'Anciennes formations'
        dataFilters(val, oldVal) {
            console.warn("WATCH => dataFilters", val, oldVal); //TEST

            if(Object.keys(oldVal).length > 0 && oldVal.constructor === Object) { // Check si oldVal n'est pas un objet vide (cas à l'arrivée ds la page)
 
                // Actions sur les chips qd cas de figure ou après désélection de 'formations passées', les filtres sélectionnés doivent être corrigés
                // Si 'formations passées' est désactivé...
                if(this.pastEvents == false) {
                    let alertMsg = "";
                    // Filtre 'dates'
                    if(this.dateRange.length > 0) { // Si l'utilisateur a sélectionné une ou des dates dans les filtres...
                        this.dateRange.forEach((d, i) => {
                            if(this.dateToInteger(d) < this.getCurrentDate()) {
                                console.log("La " + i + "eme date "  + d + " est < à date du jour !!!"); // TEST
                                alert("La " + i + "eme date "  + d + " est < à date du jour !!!"); //TEST
                            }
                        });
                        // - Si juste 1 date
                        // Si date 0 < date du jour => On supprime la date 0 (equivaut à suppression du filtre 'dates')
                        // - Si 2 dates
                        // Si date 0 < date du jour ET date 1 > date du jour => On échange date 0 par date du jour ou date de la 1ere formation après date du jour
                        // Si date 0 < date du jour ET date 1 < date du jour => On supprime les 2 dates (equivaut à suppression du filtre 'dates')
                        
                        // donc :
                        
                        const currentDate = this.getCurrentDate();
                        if(this.dateRange.length == 1 && (this.dateToInteger(this.dateRange[0]) < currentDate) || 
                        this.dateRange.length == 2 && (this.dateToInteger(this.dateRange[0]) < currentDate) && (this.dateToInteger(this.dateRange[1]) < currentDate)) {
                           this.dateRange = [];
                           alertMsg = "La suppression de l'affichage des formations passées est incompatible avec la sélection des dates que vous avez entrées pour filtrer les données : Le filtre 'date' est supprimé !";
                        }
                        if(this.dateRange.length == 2 && (this.dateToInteger(this.dateRange[0]) < currentDate) && (this.dateToInteger(this.dateRange[1]) > currentDate)) {
                            this.dateRange[0] = [currentDate.slice(0, 4), "-", currentDate.slice(4, 6), "-", currentDate.slice(6, 8)].join('');
                            alertMsg = "La suppression de l'affichage des formations passées est incompatible avec la sélection des dates que vous avez entrées pour filtrer les données : Le filtre 'date' est modifié, la plage de dates antérieure à aujourd'hui est supprimée !";
                        }
                        console.warn("this.dateRange => ", this.dateRange); //TEST
                    }

                    // Filtre 'villes'
                    if(this.selectionVilles.length > 0) { // Si l'utilisateur a sélectionné une ou plusieurs villes dans les filtres...
                        // Ici comparaison des villes entre oldVal et val pour voir différence et 
                        // isoler les intrus pour les exclure
                        if(oldVal.villes.length > val.villes.length) {
                            // On isole la/les ville(s) qui n'accueillent plus de formations suite au bt 'formations passées' désactivée
                            let villesToDelete = oldVal.villes.filter(v => val.villes.indexOf(v) === -1);
                            //console.log("villesToDelete : ", villesToDelete); //TEST
                            this.selectionVilles = this.selectionVilles.filter(v => villesToDelete.indexOf(v) === -1);
                            //console.log("Villes qui restent dans 'selectionVilles': ", this.selectionVilles); //TEST
                            alertMsg += `\nLa suppression de l'affichage des formations passées est incompatible avec certaines villes sélectionnées pour filtrer les données : le(s) filtre(s) ${villesToDelete.join(", ")} a/ont été supprimé(s) !`
                        }
                    }

                    if(alertMsg !== "") { alert(alertMsg); }
                }
                
                this.loadEventsWithSelectedFilters(); // Exec requete Firestore d'affichage des formations avec les filtres
            }
        },

        flagEventDeleted(val) {
            if(val) {
                this.updateParamsFilters(); // Pour recharger les paramètres des filtres après chaque suppression de formation
                this.$store.commit('setFlagEventDeleted', false);
            }
        }

    },

    methods: {
        // Affectation nvelles valeurs à la variable 'sortingParameters' dans le state du Vuex afin de partager ces données aux autres composants qui en ont besoin
        sortBy() {
            this.$store.commit('setSortingParameters', { type: this.sortSelect, direction: this.sortDirection });
        },

        // Quand clic sur type de filtre : Pour ouverture modal du filtre 'dates' ou 'villes'
        filterBy(idx) {
            const button = this.filterButtons[idx];
            if(button.libelle == "dates") {
                this.$store.commit('setDisplayModalDatePicker', true);
            } else {
                this.$store.commit('setDisplayModalCitiesList', true);
            }
        },

        // Juste pour profil Administrateur : Quand clic sur switch 'formations passées' => Appel action ds le Vuex pour récupérer les paramètres à jour pour les filtres date et villes
        async updateParamsFilters() {
            if(this.pastEvents) {
                await this.$store.dispatch('paramsFiltreEvenements', { includePastTrainings: true });
            } else {
                await this.$store.dispatch('paramsFiltreEvenements');
            }
        },


        deleteDatesFromFilter() {
            this.$store.commit('setSelectedFilters', { 'dateRange': [] }); // Réinitialisation des dates saisies dans var. dans Vuex regroupant les valeurs des filtres
            this.$store.commit('setInitDatePickerDates', true); // Réinitialisation des dates dans le datePicker 
        },
        deleteCityFromFilter(ville) {  console.log("COMPOSANT Sort And Filters : Je suis ds 'deleteCityFromFilter'"); //TEST
            const newSelectionVilles = this.deleteItemFromArray(this.selectionVilles, ville); // Suppression de la ville passée en paramètre du tableau 'this.selectionVilles'
            this.$store.commit('setSelectedFilters', { 'villes': newSelectionVilles }); // Envoi mise à jour de la liste des villes dans var. dans Vuex regroupant les valeurs des filtres
        },
        deleteProfileSpecificFilter() {
            const role = this.currentUser.role;
            if(role == 'Participant') {
                this.$store.commit('setSelectedFilters', { 'mesFormations': false }); // Retrait option affichage des anciennes formations
            } else if(role == 'Admin') {
                this.$store.commit('setSelectedFilters', { 'pastEvents': false }); // Retrait option affichage des anciennes formations
                this.execProfileSpecificFilter(); // VRAIMENT UTILE ????
            }
            
        },
        
        // VRAIMENT UTILE ????
        // Récupération des valeurs du filtre du composant enfant et exec method appropriée
        execProfileSpecificFilter() {  //console.log("Dans 'execProfileSpecificFilter'"); //TEST
            this.updateParamsFilters();
        },
        
        // Qd clic bouton 'Supprimer tous les filtres'
        deleteAllFilters() {
            this.$store.commit('setSelectedFilters', { 'dateRange': [], 'villes': [] }); // Réinitialisation des dates saisies et du filtre des villes dans var. dans Vuex regroupant les filtres la valeur des filtres

            const role = this.currentUser.role;
            if(role == 'Participant' || role == 'Admin') {
                this.deleteProfileSpecificFilter(); // Selon type de profil logué (Administrateur ou Participant) Suppression du filtre des formations passées (visible seulement qd profil Administrateur) ou suppression du filtre les formations ou l'on est inscrit (visible seulement qd profil Participant)
            }
        },

        // A VIRER A TERME CAR DEJA DS COMPOSANT 'ListeEvenements.vue' !!!!!
        async loadEventsWithSelectedFilters() {
            //await this.$store.dispatch('loadEvenements', { dates: ["2020-03-15"], villes: ["Nice", "Brest"] }); //TEST
            await this.$store.dispatch('loadEvenements', this.filtersSelection); // Appel requete avec filtres sélectionnés
            this.$store.commit('setInitPagination', true);
        }
    }

}
</script>

<style scoped>
    .blocsMargeWrapper {
        position: fixed;
        left: 0;
        /* border: solid 2px green; */
    }
    #sortAndFiltersEvents,
    #myFilters {
        background-color: #ffffff;
        width: 220px;
        /* margin: 25px 0 0 20px;
        box-shadow: 0 0 3px rgba(0,0,0,0.3);
        border-radius: 3px; */
        margin: 20px 10px 0;
    }
    
    #myFilters,
    #sortAndFiltersEvents .bloc {
        padding: 15px 10px;
    }
    #sortAndFiltersEvents .bloc {
        border-bottom: dotted 1px #6d6d6d;
        color: #444444;
    }
    #sortAndFiltersEvents .bloc:last-child {
        border-bottom-width: 0;
    }
    #sortAndFiltersEvents .bloc,
    .vChipSort {
        font-size: 14px;
    }
    .vChipSort { 
        display: inline-block;
        margin: 0 8px 6px 0; 
        border-radius: 4px;
        padding: 0 10px;
        cursor: pointer;
        color: #283593;
        transition: all 0.2s ease-in-out;
    }
    .vChipSort.background { border: solid 2px #283593 !important; }

    .vChipSort.selected i.fas,
    .vChipSort:hover i.fas {
        color: #ffffff;
    }
    .vChipSort.selected,
    .vChipSort:hover {
        background-color: #283593 !important;
        color: #ffffff;
    }

    .switch {
        margin: 0;
    }
    .bloc label { display: inline-block; }
    .v-input.switch {
        display:inline-block;
    }

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

    .deleteFiltersBt {
        font-weight: bold;
    }
</style>