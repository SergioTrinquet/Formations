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
                <app-displayOldTrainings></app-displayOldTrainings>
            </div>

            <div class="bloc" id="btFiltres">
                <div class="marginLegend">Filtres</div>

                <!-- Ajouté le 11/01/2021 -->
                <app-participantFilter v-if="currentUser.role == 'Participant'">
                    <template v-slot:iconLeft>
                        <v-icon left v-show="mesFormations">fas fa-check</v-icon>
                    </template>
                </app-participantFilter>

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
                Mes formations <v-icon @click="deleteMyTrainingsFilter">fas fa-times-circle</v-icon>
            </span>
            <a @click="deleteAllFilters" class="linkDeleteFilters">Supprimer tous mes filtres</a>
        </div>

        <!-- TEST --><span style="display: inline-block; background-color: green; color: #ffffff; margin: 20px 0; 
        width: 210px; font-size: 15px; line-height: 18px;">Computed filtersSelection => {{ filtersSelection }}</span>

    </div>

</template>

<script>
import formatageDate from '@/mixins/formatageDate';
import currentDate from '@/mixins/currentDate';
import dateToInt from '@/mixins/dateToInt';
import deleteItemFromArray from '@/mixins/deleteItemFromArray';
import participantFilter from '@/components/participants/ListeEvenementsFilter';
import displayOldTrainings from '@/components/administrateur/ListeEvenementsFilter';

export default {
    mixins: [
        formatageDate,
        currentDate,
        dateToInt,
        deleteItemFromArray
    ],

    components: {
        'app-displayOldTrainings': displayOldTrainings,
        'app-participantFilter': participantFilter
    },

    data() {
        return {
            sortItemsList: [
                { libelle: 'date', sortType: 'date' },
                { libelle: 'intitulé', sortType: 'titre' },
                { libelle: 'nbr de participants', sortType: 'NbParticipants' }
            ],
            sortSelect: "date",
            sortDirection: 'asc',

            listeFiltres: [
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
        selectedDateRange() {   //console.log("COMPUTED de 'selectedDateRange'", this.$store.state.selectedFilters.dates); //TEST
            let dates = this.filtersSelection.dates;
            return typeof dates == 'undefined' ? [] : dates;
        },
        selectedCities() {
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

        // Computed pour avertir quand un evenement est supprimé afin de recupérer les nvx paramètres des filtres
        flagEventDeleted() {
            return this.$store.state.flagEventDeleted;
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
                    if(this.selectedCities.length > 0) { // Si l'utilisateur a sélectionné une ou plusieurs villes dans les filtres...
                        // Ici comparaison des villes entre oldVal et val pour voir différence et 
                        // isoler les intrus pour les exclure
                        if(oldVal.villes.length > val.villes.length) {
                            // On isole la/les ville(s) qui n'accueillent plus de formations suite au bt 'formations passées' désactivée
                            let villesToDelete = oldVal.villes.filter(v => val.villes.indexOf(v) === -1);
                            //console.log("villesToDelete : ", villesToDelete); //TEST
                            this.selectedCities = this.selectedCities.filter(v => villesToDelete.indexOf(v) === -1);
                            //console.log("Villes qui restent dans 'selectedCities': ", this.selectedCities); //TEST
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
        },
        
        // Pour afficher icone de suppression du filtre 'dates' + pour comptage nb de filtres actifs
        selectedDateRange(val) {
            const idx = this.listeFiltres.findIndex(f => f.libelle == 'dates');
            if(val.length > 0) {
                this.listeFiltres[idx].selected = true;
            } else {
                this.listeFiltres[idx].selected = false;
            }
        },
        // Pour afficher croix de suppression du filtre 'villes' + pour comptage nb de filtres actifs
        selectedCities(val) {
            const idx = this.listeFiltres.findIndex(f => f.libelle == 'villes');
            if(val.length > 0) {
                this.listeFiltres[idx].selected = true;
            } else {
                this.listeFiltres[idx].selected = false;
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
            const button = this.listeFiltres[idx];
            if(button.libelle == "dates") {
                this.$store.commit('setDisplayModalDatePicker', true);
            } else {
                this.$store.commit('setDisplayModalCitiesList', true);
            }
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
            this.$store.commit('setSelectedFilters', { 'dates': [] }); // Réinitialisation des dates saisies dans var. dans Vuex regroupant les valeurs des filtres
            this.$store.commit('setInitDatePickerDates', true); // Réinitialisation des dates dans le datePicker 
        },
        deleteCityFromFilter(ville) {  console.log("COMPOSANT Sort And Filters : Je suis ds 'deleteCityFromFilter'"); //TEST
            const newSelectionVilles = this.deleteItemFromArray(this.selectedCities, ville); // Suppression de la ville passée en paramètre du tableau 'this.selectedCities'
            this.$store.commit('setSelectedFilters', { 'villes': newSelectionVilles }); // Envoi mise à jour de la liste des villes dans var. dans Vuex regroupant les valeurs des filtres
        },
        deleteMyTrainingsFilter() {
            this.$store.commit('setSelectedFilters', { 'mesFormations': false }); // Retrait option affichage des anciennes formations
        },
        
        // Qd clic bouton 'Supprimer tous les filtres'
        deleteAllFilters() {
            let filters = { 'dates': [], 'villes': [] };
            if(this.currentUser.role == 'Participant') {
                filters = Object.assign({}, filters, { 'mesFormations': false });
            }
            console.log("filters", filters); //TEST
            this.$store.commit('setSelectedFilters', filters); // Réinitialisation des dates saisies et du filtre des villes dans var. dans Vuex regroupant les filtres la valeur des filtres
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
    .leftMarginWrapper {
        position: fixed;
        left: 0;
        margin-top: 50px;
        /* border: solid 2px green; */
    }
    #sortAndFiltersEvents {
        background-color: #ffffff;
        width: 210px;
    }
    #myFilters {
        margin:-10px 10px 0 10px;
        padding: 5px;
        width: 200px;
    }

    #sortAndFiltersEvents {
        margin: 10px 7px 0;
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
        display: inline-block;
        margin: 0 8px 6px 0; 
        border-radius: 4px;
        padding: 2px 19px;
        cursor: pointer;
        /* transition: all 0.2s ease-in-out; */
        transition: background-color 0.2s ease-in-out;
        color: #fff;
        font-size: 15px;
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