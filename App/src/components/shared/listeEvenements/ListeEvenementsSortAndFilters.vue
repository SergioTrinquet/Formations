<template>
    <div v-if="paramsFiltersLoaded == true">
        <!-- Calendrier sélection dates -->
        <v-overlay :value="displayModalDatePickers" opacity="0.75">  
            <div class="initDatesText">{{ initDateRangeText }}</div>
            <v-date-picker 
                v-model="dateRange" 
                elevation="15"
                range
                scrollable 
                light
                color="primaire"
                first-day-of-week="1"
                :show-current="pickerDate"
                :min="dataFilters.dates.min"
                :max="dataFilters.dates.max"
                :allowed-dates="allButWeekends"
                :title-date-format="formatAffichageTitleDatepicker"
            >
                <v-spacer></v-spacer>
                <v-btn text color="primaire" @click="cancelDatePicker">Annuler</v-btn>
                <v-btn text color="primaire" @click="emitDateRange">OK</v-btn>
            </v-date-picker>
        </v-overlay>


        <!-- Encart filtre villes -->
        <app-itemsSelectionModal 
            :modalDisplay="displayModalListeVilles"
            @onCloseModal="closeModal($event)"
            modalWidth="100vw" 
            modalHeight="50vh"
            cssClass="col-10 offset-1 col-sm-8 offset-sm-2 col-md-6 offset-md-3"
            @onSendItems="sendItems($event)"
            defaultTextNoItems="- Aucune ville sélectionnée -"
            :listItems="dataFilters.villes"
            :nbMaxItems="nbMaxVilles"
            :textError="'Pas plus de ' + nbMaxVilles + ' villes svp'"
            :selectedItems="selectionVilles"
        ></app-itemsSelectionModal>


        <!-- Marge gauche -->
        <div class="blocsMargeWrapper">

            <div id="sortAndFiltersEvents" class="d-flex flex-column">
                <div class="bloc">
                    <div>Classer par</div>
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

                <div class="bloc">
                    <component 
                        :is="profileSpecificFilter.component" 
                        v-bind="profileSpecificFilter.properties" 
                        @emitFilterValue="execProfileSpecificFilter($event)"
                    ></component>
                </div>

                <div class="bloc">
                    <div>Filtrer par</div>
                    <span 
                        v-for="(chip, i) in filter_chips" :key="i"
                        @click="filterBy(i)" 
                        :class="'vChipSort background ' + (chip.selected ? 'selected' : '')"
                    >
                        {{ chip.libelle }}<v-icon right v-show="chip.selected">fas fa-check</v-icon>
                    </span>
                </div>

            </div>


            <div id="myFilters" v-if="dateRange.length > 0 || selectionVilles.length > 0 || pastEvents || mesFormations">    
                <div>Mes filtres</div>
                <span v-if="dateRange.length > 0" class="primaireLight fakeChip">
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

            <!-- TEST --><span style="display: inline-block; background-color: green; color: #ffffff; margin: 20px 0; width: 240px; font-size: 15px; line-height: 18px;">selectedFilters => {{ selectedFilters }}</span>
            

        </div>
        <!-- FIN Marge gauche -->

    </div>
</template>

<script>
import datePickersAllowedDates from '@/mixins/datePickerAllowedDates';
import formatageDate from '@/mixins/formatageDate';
import currentDate from '@/mixins/currentDate';
import dateToInt from '@/mixins/dateToInt';
import deleteItemFromArray from '@/mixins/deleteItemFromArray';

import itemsSelectionModal from '@/components/shared/listeEvenements/ListeEvenementsItemsSelectionModal';
import filterParticipant from '@/components/participants/ListeEvenementsFilter';
import filterAdmin from '@/components/administrateur/ListeEvenementsFilter';

export default {
    mixins: [
        datePickersAllowedDates,
        formatageDate,
        currentDate,
        dateToInt,
        deleteItemFromArray
    ],

    components: { 
        'app-itemsSelectionModal': itemsSelectionModal
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

            filter_chips: [
                { libelle: 'dates', selected: false },
                { libelle: 'villes', selected: false }
            ],

            pastEvents: false,
            mesFormations: false,

            displayModalDatePickers: false,
            dateRange: [],
            previousDateRange: [],

            displayModalListeVilles: false,
            nbMaxVilles: 3,
            selectionVilles: [],

            paramsFiltersLoaded: false
        }
    },

    computed: {
        currentUser() {
            return this.$store.getters.currentUser;
        },

        // Pour affichage au dessus du date picker : Donne la tranche de dates pendant lesquelles il y a des formations programmées
        initDateRangeText() {
            let txt = "";
            if(typeof this.dataFilters.dates.min != 'undefined') {
                if(this.dataFilters.dates.min == this.dataFilters.dates.max) {
                    txt = `Seule date sélectionnable : ${this.formatDate(this.dataFilters.dates.min)}`;
                } else {
                    txt = `Entre le ${this.formatDate(this.dataFilters.dates.min)} et le ${this.formatDate(this.dataFilters.dates.max)}`;
                }
            }
            return txt;
        },

        // Pour attribut du date picker : Sensé sélectionné le mois quand ouvertutre du date picker, mais bug
        pickerDate() {
            //return "2021-05-03";
            const minDate = this.dataFilters.dates.min;
            const currentDate = this.getCurrentDate();
            
            if(currentDate < this.dateToInteger(minDate)) {
                return minDate.substring(0, minDate.lastIndexOf("-"));
            } else {
                return [currentDate.slice(0, 4), "-", currentDate.slice(4, 6)].join('');
            }
        },

        dateRangeText() {
            let titleDatePicker = "";
            if(this.dateRange.length == 0) {
                titleDatePicker = "";
            } else if(this.dateRange.length == 1) {
                titleDatePicker = this.formatDate(this.dateRange[0]);
            } else {
                this.sortByDate(this.dateRange); // Classement chronologique des dates
                titleDatePicker = `Du ${this.formatDate(this.dateRange[0])} au ${this.formatDate(this.dateRange[1])}`;
            }
            return titleDatePicker;
        },

        
        // Computed pour les paramètres d'initialisation des filtres 'dates' et 'villes'
        dataFilters() {
            if(!this.paramsFiltersLoaded) { // Si évènements pas encore chargés dans le life cycle hook 'mounted'... 
                return {}; 
            } else { //...Sinon si chargés...
                let paramsFiltersEvenements = this.$store.state.paramsFiltersEvenements;
                return {
                    villes: paramsFiltersEvenements.villes.map(v => v.toUpperCase()), 
                    dates: {
                        min: paramsFiltersEvenements.minDate, 
                        max: paramsFiltersEvenements.maxDate
                    }
                }
            }
        },

        // Computed qui regroupe tous les filtres sélectionnés
        selectedFilters() {
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
        },

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
        // Déclenché à chaque changement de valeur de la variable qui conditionne sens de classement
        sortDirection() {
            this.sortBy();
        },

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
                //console.log("WATCH pour 'flagEventDeleted'", val); //TEST
                this.updateParamsFilters(); // Pour recharger les paramètres des filtres après chaque suppression de formation
                this.$store.commit('setFlagEventDeleted', false);
            }
        }

    },

    methods: {
        // Récupération des valeurs du filtre du composant enfant et exec method appropriée
        execProfileSpecificFilter(e) {
            if(e.origin == "Participant") {
                this.mesFormations = e.mesFormations;
                this.loadEventsWithSelectedFilters();
            } else if(e.origin == "Administrateur") {
                this.pastEvents = e.pastEvents;
                this.updateParamsFilters();
            }
        },

        // Affectation nvelles valeurs à la variable 'sortingParameters' dans le state du Vuex afin de partager ces données aux autres composants qui en ont besoin
        sortBy() {
            this.$store.commit('setSortingParameters', { type: this.sortSelect, direction: this.sortDirection });
        },

        // Quand clic sur type de filtre : Pour ouverture modal du filtre 'dates' ou 'villes'
        filterBy(idx) {
            const chip = this.filter_chips[idx];
            if(chip.libelle == "dates") {
                this.displayModalDatePickers = true
            } else {
                this.displayModalListeVilles = true
            }
        },

        // Quand clic sur switch 'formations passées' => Appel action ds le Vuex pour récupérer les paramètres à jour pour les filtres date et villes
        async updateParamsFilters() {
            if(this.pastEvents) {
                await this.$store.dispatch('paramsFiltreEvenements', 'all');
            } else {
                await this.$store.dispatch('paramsFiltreEvenements');
            }
        },

        // Quand validation des dates dans le date picker (pour filtre 'dates')
        emitDateRange() {
            this.loadEventsWithSelectedFilters(); // Pour mettre à jour affichage évènements avec nouveaux filtres
            this.closeDatePicker();
            this.previousDateRange = this.dateRange; // Pour gérer cas qd clic 'Annuler' sur Date picker : Permet l'affichage de la précédente période si modif sans enregistrer, puis annulation
        },
        cancelDatePicker() {
            this.dateRange = this.previousDateRange;
            this.closeDatePicker();
        },
        // Fermeture datePicker
        closeDatePicker() {
            this.displayModalDatePickers = false; 
        },
        formatAffichageTitleDatepicker(val) {
            console.log(val); //TEST
            return this.dateRangeText;
        }, 
        sortByDate(array) {
            return array.sort((a, b) => {
                return this.dateToInteger(a) - this.dateToInteger(b);
            });
        },

        // Appelé qd clic ajout d'une ville dans modal filtre 'villes'
        sendItems(selectionVilles) {
            this.selectionVilles = selectionVilles;
            this.loadEventsWithSelectedFilters(); // Pour mettre à jour affichage évènements avec nouveaux filtres
        },
        closeModal(val) {
            this.displayModalListeVilles = val;
        },

        deleteDatesFromFilter() {
            this.dateRange = []; // Réinitialisation des dates saisies
            this.loadEventsWithSelectedFilters(); // Pour mettre à jour affichage évènements avec nouveaux filtres
        },
        deleteCityFromFilter(ville) {
            this.selectionVilles = this.deleteItemFromArray(this.selectionVilles, ville); // Suppression de la ville passée en paramètre du tableau 'this.selectionVilles'
            this.loadEventsWithSelectedFilters(); // Pour mettre à jour affichage évènements avec nouveaux filtres
        },
        deleteProfileSpecificFilter() {
            const role = this.currentUser.role;
            let obj = null;
            if(role == 'Participant') {
                obj = { origin: "Participant", mesFormations: false };
            } else if(role == 'Admin') {
                obj = { origin: "Administrateur", pastEvents: false };
            }
            this.execProfileSpecificFilter(obj);
        },
        
        // Qd clic bouton 'Supprimer tous les filtres'
        deleteAllFilters() {
            this.dateRange = []; // Suppression du filtre des dates : Réinitialisation des dates saisies
            this.selectionVilles = []; // Suppression du filtre des villes : Réinitialisation des villes saisies
            this.deleteProfileSpecificFilter(); // Selon type de profil logué (Administrateur ou Participant) Suppression du filtre des formations passées (visible seulement qd profil Administrateur) ou suppression du filtre les formations ou l'on est inscrit (visible seulement qd profil Participant)
        },

        async loadEventsWithSelectedFilters() {
            //await this.$store.dispatch('loadEvenements', { dates: ["2020-03-15"], villes: ["Nice", "Brest"] }); //TEST
            await this.$store.dispatch('loadEvenements', this.selectedFilters); // Appel requete avec filtres sélectionnés
            this.$emit('eventGoToFirstPage');
        }
    },

    async mounted() {
        await this.$store.dispatch('paramsFiltreEvenements'); // Récupération des données necessaires au paramétrage des filtres
        this.paramsFiltersLoaded = true;
    }  

}
</script>

<style scoped>
    .blocsMargeWrapper {
        position: fixed;
        left: 0;
        border: solid 2px green;
    }
    #sortAndFiltersEvents,
    #myFilters {
        background-color: #ffffff;
        width: 220px;
        margin: 25px 0 0 20px;
        box-shadow: 0 0 3px rgba(0,0,0,0.3);
        border-radius: 3px;
    }
    
    #myFilters,
    #sortAndFiltersEvents .bloc {
        padding: 15px 10px;
    }
    #sortAndFiltersEvents .bloc {
        border-bottom: dotted 1px #6d6d6d;
    }
    #sortAndFiltersEvents .bloc:last-child {
        border-bottom-width: 0;
    }
    #sortAndFiltersEvents .bloc { 
        color: #444444;
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