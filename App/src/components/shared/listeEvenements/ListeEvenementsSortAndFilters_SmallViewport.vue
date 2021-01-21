<template>
    <div class="flex-wrapper justify-center">

        <v-overlay :value="displayModalTypeClassements" opacity="0.75">
            <div class="modal">
                <div class="header primaire">CLASSEMENT</div>
                <v-icon class="close" @click="displayModalTypeClassements = false">fas fa-times</v-icon>   
                <!-- TEST : A VIRER !!!-->
                <!-- <div style="position: absolute; margin-top:100px;">
                    <div>sortDirection => {{ sortDirection }}</div>
                    <div>
                        sortSelect => {{ sortSelect }}
                        sortingParameters => {{ sortingParameters }}
                    </div>
                </div> -->
                <!-- FIN TEST : A VIRER !!!-->
                <div class="directionOrderButtons">
                    <button :class="['primaire', (sortDirection == 'asc' ? '' : 'lighter')]" @click="sortDirection = 'asc'"><v-icon v-if="sortDirection == 'asc'">fas fa-check-circle</v-icon>Par ordre<br />croissant</button>
                    <button :class="['primaire', (sortDirection == 'desc' ? '' : 'lighter')]" @click="sortDirection = 'desc'"><v-icon v-if="sortDirection == 'desc'">fas fa-check-circle</v-icon>Par ordre<br />décroissant</button>
                </div>
                <div v-for="item in sortItemsList" :key="item.sortType" class="typeOrderButtons">
                    <button :class="(sortSelect == item.sortType ? 'primaire' : 'primaireLight')" :value="item.sortType" @click="getTypeOrder" >
                        <v-icon v-if="sortSelect == item.sortType">fas fa-check-circle</v-icon>
                        {{ item.libelle }}
                    </button>
                </div>
                <v-btn class="bt_green modalSmallDevice" depressed @click="sortBy">Valider</v-btn>
            </div>
        </v-overlay>


        <v-overlay :value="displayModalTypeFilters" opacity="0.75">
            <div class="modal">
                <div class="header primaire">FILTRES</div>
                <v-icon class="close" @click="displayModalTypeFilters = false">fas fa-times</v-icon>   
                <!-- <div>listeFiltres: {{ listeFiltres }}</div> --><!-- TEST -->
                <!-- <div>indicateurNbFiltres: {{ indicateurNbFiltres }}</div> --><!-- TEST -->

                <div class="blocFilterButtons">
                    <div class="chbxOldTrainingsWrapper" v-if="currentUser.role == 'Admin'">
                        <app-displayOldTrainings></app-displayOldTrainings>
                    </div>
                    <div class="typeFilterButtons" v-if="currentUser.role == 'Participant'">
                        <app-participantFilter>
                            <template v-slot:iconRight>
                                <v-icon v-if="mesFormations">fas fa-times-circle</v-icon>
                            </template>
                        </app-participantFilter>
                    </div>
                    <div v-for="(filtre, i) in listeFiltres" :key="i" class="typeFilterButtons">
                        <v-icon v-if="filtre.selected == true" @click="deleteFilter(filtre.libelle)">fas fa-times-circle</v-icon>
                        <button :class="(filtre.selected == true? 'primaire' : 'primaireLight')" @click="filterBy(i)" >
                            par {{ filtre.libelle }}
                        </button>
                        <div v-if="filtre.libelle == 'dates'" class="txtSelection">{{ dateRangeText }}</div>
                        <div v-if="filtre.libelle == 'villes'" class="txtSelection">{{ selectedCities.join(", ") }}</div>
                    </div>  
                </div>
            </div>
        </v-overlay>


        <div class="flex-item">
            <v-btn class="bt primaireLighter first" depressed @click="displayModalTypeClassements = true">
                Classement
            </v-btn>
        </div>

        <div class="flex-item">
            <v-btn class="bt primaireLighter" depressed @click="displayModalTypeFilters = true">
                Filtres
                <span class="indicateurNbFiltres" v-if="indicateurNbFiltres > 0">{{ indicateurNbFiltres }}</span>
            </v-btn>
        </div>

    </div>
</template>

<script>
    import participantFilter from '@/components/participants/ListeEvenementsFilter';
    import displayOldTrainings from '@/components/administrateur/ListeEvenementsOption';

    export default {
        components: {
            'app-displayOldTrainings': displayOldTrainings,
            'app-participantFilter': participantFilter
        },

        data() {
            return {
                displayModalTypeClassements: false,
                displayModalTypeFilters: false,
                sortSelect: "",
                sortDirection: "",
                listeFiltres: []
            }
        },

        computed: {
            currentUser() {
                return this.$store.getters.currentUser;
            },

            sortItemsList() {
                return this.$store.state.sortItemsList;
            },
            filtersList() {
                return this.$store.state.filtersList;
            },

            // Récupération des valeurs de classement (ordre et type)
            sortingParameters() {
                return this.$store.state.sortingParameters;
            },

            /* selectedFilters() { console.log("selectedFilters", this.$store.state.selectedFilters); //TEST
                return this.$store.state.selectedFilters;
            }  */
            // Récupération des dates sélectionnées dans le datepicker (s'il y en a)
            selectedDateRange() {   //console.log("COMPUTED de 'selectedDateRange'", this.$store.state.selectedFilters.dates); //TEST
                let dates = this.$store.state.selectedFilters.dates;
                return typeof dates == 'undefined' ? [] : dates;
            },
            // Récupération des villes sélectionnées (s'il y en a)
            selectedCities() {      //console.log("COMPUTED de 'selectedCities'", this.$store.state.selectedFilters.villes); //TEST
                let villes = this.$store.state.selectedFilters.villes;
                return typeof villes == 'undefined' ? [] : villes;
            },
            pastEvents() {
                let pastEvents = this.$store.state.selectedFilters.pastEvents;
                return typeof pastEvents == 'undefined' ? false : pastEvents;
            },
            mesFormations() {
                let mesFormations = this.$store.state.selectedFilters.mesFormations;
                return (typeof mesFormations == 'undefined') ? false : mesFormations;
            },

            // Pour avoir sélection de(s) date(s) sous forme de texte
            dateRangeText() { console.log("COMPUTED dateRangeText", this.$store.state.dateRangeText); //TEST
                return this.$store.state.dateRangeText;
            },

            // Pour afficher nb de filtres
            indicateurNbFiltres() {
                let nbFiltresActifs = 0;
                if(this.selectedDateRange.length > 0) { nbFiltresActifs++ }
                if(this.selectedCities.length > 0) { nbFiltresActifs++ }
                if(this.pastEvents) { nbFiltresActifs++ }
                if(this.mesFormations) { nbFiltresActifs++ }
                return nbFiltresActifs;
            }
        },

        watch: {
            // Affectation des variables de classement aux variables locales
            sortingParameters(val) { console.warn("WATCH de sortingParameters", val); //TEST
                this.sortSelect = val.type;
                this.sortDirection = val.direction;
            },

            /* selectedFilters(val) {
                //console.log("WATCH de selectedFilters", val); //TEST
                if("dates" in val) {
                    // FAIRE APPARAITRE Rond avec coche sur filtre 'dates' et rond avec incrementation sur intitulé bt 'Filtres'
                }
            } */
            // Pour afficher icone de suppression du filtre 'dates' + pour comptage nb de filtres actifs
            selectedDateRange(val) {
                const idx = this.listeFiltres.findIndex(f => f.libelle == 'dates');
                this.listeFiltres[idx].selected = (val.length > 0 ? true : false);
            },
            // Pour afficher croix de suppression du filtre 'villes'
            selectedCities(val) {
                const idx = this.listeFiltres.findIndex(f => f.libelle == 'villes');
                this.listeFiltres[idx].selected = (val.length > 0 ? true : false);
            }

        },

        methods: {
            // Quand clic sur type de filtre : Pour ouverture modal du filtre 'dates' ou 'villes'
            filterBy(idx) {
                const button = this.listeFiltres[idx];
                if(button.libelle == "dates") {
                    this.$store.commit('setDisplayModalDatePicker', true);
                } else {
                    this.$store.commit('setDisplayModalCitiesList', true);
                }
            },

            // Affectation nvelles valeurs à la variable 'sortingParameters' dans le state du Vuex afin de partager ces données aux autres composants qui en ont besoin
            sortBy() {
                this.$store.commit('setSortingParameters', { type: this.sortSelect, direction: this.sortDirection });
                this.displayModalTypeClassements = false;
            },

            
            deleteFilter(libelleFiltre) {
                let payload = {};
                payload[libelleFiltre] = [];
                   //console.log(libelleFiltre, "payload =>", payload); //TEST
                // Affectation dans variable du state ds Vuex qui regroupe ttes les valeurs des filtres
                this.$store.commit('setSelectedFilters', payload);

                if(libelleFiltre == 'dates') {
                    this.$store.commit('setDateRangeText', ""); // Retrait texte date
                }
            }

            , getTypeOrder(e) {
                this.sortSelect = e.target.value;
            }
        },

        
            
        mounted() {    
            // Affectation des variables locales avec valeurs venant du Vuex
            this.listeFiltres = this.filtersList;
            this.sortSelect = this.sortingParameters.type;
            this.sortDirection = this.sortingParameters.direction;

            /* // Quand click en dehors du menu, le fait disparaitre ainsi que l'overlay
            window.addEventListener('click', (e) => {
                if(e.target.classList.contains("overlay")) {
                    this.displayTypeFilters = false;
                }
            }) */
        }
    }
</script>

<style scoped>
    .flex-wrapper {
        display: flex;
    }
    .flex-item {
        flex-grow: 1;
        flex-basis: 0;
    }

    .bt {
        color: #fff;
        font-weight: bold;
        border-radius: 0;
        width: 100%;
    }
    .bt.first {
        box-shadow: -1px 0 0 rgba(255, 255, 255, 0.7) inset !important;
    }

    .modal {
        background-color: rgba(255, 255, 255, 0.9);
        color: #494949;
        position: fixed;
        top: 20px;
        left: 20px;
        width: calc(100vw - 40px);
        height: calc(100vh - 40px);
        z-index: 5;
        box-sizing: border-box;
        padding: 5px;
        display: flex;
        flex-direction: column;
    }
    .header {
        color: #fff;
        font-size: 1.2em;
        padding: 13px 15px;
    }
    .v-icon.close {
        font-size: 1.5em;
        margin: 15px;
        align-self: flex-end;
        position: fixed;
    }

    .directionOrderButtons {
        display: flex;
        justify-content: center;
        margin-top: auto;
        margin-bottom: 30px;
    }
    .directionOrderButtons button {
        padding: 11px;
        font-size: 1em;
        line-height: 0.9em;
        width: 40%;
    }
    .directionOrderButtons button:first-child {
        /* border-radius: 4px 0 0 4px; */
        border-radius: 50px 0 0 50px;
        box-shadow: -1px 0 0 #fff inset;
    }
    .directionOrderButtons button:last-child {
        /* border-radius: 0 4px 4px 0; */
        border-radius: 0 50px 50px 0;
    }
    .directionOrderButtons .lighter { 
        opacity: 0.75;
    }

    .blocFilterButtons {
        margin: auto 0;
        display: flex;
        justify-content: center;
        flex-direction: column;
    }
    .typeFilterButtons {
        position: relative;
    }

    .directionOrderButtons button,
    .typeFilterButtons button:not(.v-icon),
    .typeOrderButtons button {
        position: relative;
        color: #fff;
        transition: all 0.3s ease-in-out;
    }
    .directionOrderButtons button:hover,
    .typeFilterButtons button:not(.v-icon):hover,
    .typeOrderButtons button:hover {
        background-color: #3949ab !important;
    }
    
    .typeFilterButtons button:not(.v-icon),
    .typeOrderButtons button {
        display: block;
        padding: 12px;
        border-radius: 50px;
        width: 80%;
        font-size: 1.2em;
    }
    .typeFilterButtons button:not(.v-icon),
    .chbxOldTrainingsWrapper { 
        margin: 30px 10%;
    }
    .typeOrderButtons button {
        margin: 11px 10%;
    }
    .directionOrderButtons button i.v-icon,
    .typeOrderButtons button i.v-icon {
        position: absolute;
        font-size: 4vw;
        top: calc(50% - 2vw);
        left: 7%;
    }

    .typeFilterButtons button.v-icon,
    .typeFilterButtons button .v-icon {
        position: absolute;
        z-index: 1;
        right: 14%;
        top: 50%;
        transform: translate(0, -50%);
    }
    .typeFilterButtons button .v-icon {
        right: 4%;
        pointer-events: none;
    }

    .modalSmallDevice {
        margin-top: auto; 
        padding: 25px 20px !important;
        font-size: 1.2em;
        border-radius: 0;
    }

    .indicateurNbFiltres {
        border-radius: 50%;
        background-color: #fff;
        font-size: 11px;
        display: inline-block;
        font-weight: bold;
        color: #3949ab;
        margin: 0 0 0 7px;
        width: 18px;
    }

    .txtSelection {
        position: absolute;
        width: 80%;
        margin: -24px 0 0 10%;
        font-weight: bold;
        font-size: 0.9em;
        line-height: 0.9em;
        text-align: center;
        font-style: italic;
        color: #909090;
    }

    .chbxOldTrainingsWrapper {
        display: block;
        padding: 14px 14px 14px 20px;
        border-radius: 4px;
        border-radius: 50px;
        width: 80%;
        /* font-size: 1.2em; */   
        font-size: 4.2vw !important;
        justify-content: center;
        border: solid 3px #3949ab;
        color: #3949ab;

        position: relative;
    }
</style>