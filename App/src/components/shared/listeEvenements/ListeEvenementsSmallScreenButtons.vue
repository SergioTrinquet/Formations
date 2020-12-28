<template>
    <div class="flex-wrapper justify-center">

        <v-overlay :value="displayModalTypeClassements" opacity="0.75">
        
            <div class="modal">
                <div class="header primaire">Classement</div>
                <v-icon class="close" @click="displayModalTypeClassements = false">fas fa-times</v-icon>   
                <div class="orderButtons">
                    <button :class="['primaire', (sortDirection == 'asc' ? '' : 'lighter')]" @click="sortDirection = 'asc'">Par ordre<br />croissant</button>
                    <button :class="['primaire', (sortDirection == 'desc' ? '' : 'lighter')]" @click="sortDirection = 'desc'">Par ordre<br />décroissant</button>
                </div>
                sortDirection => {{ sortDirection }} <!-- TEST -->
                <div v-for="(item, i) in sortItemsList" :key="i"  class="radioButtons">
                    <label><input type="radio" :value="item.sortType" v-model="sortSelect" />{{ item.libelle }}</label>
                </div>
                sortSelect => {{ sortSelect }} <!-- TEST -->
                sortingParameters => {{ sortingParameters }} <!-- TEST -->
                <v-btn class="bt_green modalSmallDevice" depressed @click="sortBy">Valider</v-btn>
            </div>

        </v-overlay>


        <div class="flex-item">
            <v-btn class="bt primaireLighter first" depressed @click="displayModalTypeClassements = true">Classement</v-btn>
        </div>
        <div class="flex-item">
            <div class="overlay" :class="{display: displayTypeFilters}"></div>
            <v-btn class="bt primaireLighter" depressed @click="displayTypeFilters = !displayTypeFilters">Filtres</v-btn>
            <v-card class="blocListeFiltres primaireLighter" :class="{display: displayTypeFilters}">
                <ul>
                    <li v-for="(filtre, i) in listeFiltres" :key="filtre" 
                        @click="filterBy(i)"
                    >
                        {{ filtre.libelle }}
                    </li>
                </ul>
            </v-card>
        </div>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                displayModalTypeClassements: false,
                displayTypeFilters: false,

                displayModalDatePickers: false,
                displayModalListeVilles: false,

                // Existe aussi dans le 'ListeEvenementsSortAndFilters', donc à metter dans les 2 cas dans le state du Vuex 
                // et l'appeler ensuite dans un Computed
                sortItemsList: [
                    { libelle: 'date', sortType: 'date' },
                    { libelle: 'intitulé', sortType: 'titre' },
                    { libelle: 'nbr de participants', sortType: 'NbParticipants' }
                ],
                sortSelect: "date",
                sortDirection: "asc",

                listeFiltres: [
                { libelle: 'dates', selected: false },
                { libelle: 'villes', selected: false }
            ],
            }
        },

        computed: {
            currentUser() {
                return this.$store.getters.currentUser;
            },

            // Récupération des valeurs de classement (ordre et type)
            sortingParameters() {
                return this.$store.state.sortingParameters;
            }
        },

        watch: {
            // Affectation des variables de classement aux variables locales
            sortingParameters(val) {
                this.sortSelect = val.type;
                this.sortDirection = val.direction;
            }
        },

        methods: {
            // Quand clic sur type de filtre : Pour ouverture modal du filtre 'dates' ou 'villes'
            filterBy(idx) {
                const chip = this.listeFiltres[idx];
                if(chip.libelle == "dates") {
                    this.displayModalDatePickers = true
                } else {
                    this.displayModalListeVilles = true
                }
            },

            // Affectation nvelles valeurs à la variable 'sortingParameters' dans le state du Vuex afin de partager ces données aux autres composants qui en ont besoin
            sortBy() {
                this.$store.commit('setSortingParameters', { type: this.sortSelect, direction: this.sortDirection });
                this.displayModalTypeClassements = false;
            },
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
        top: 10px;
        left: 10px;
        width: calc(100vw - 20px);
        height: calc(100vh - 20px);
        z-index: 5;
        box-sizing: border-box;
        padding: 5px;
        display: flex;
        flex-direction: column;
    }
    .header {
        color: #fff;
        font-size: 1.5em;
        padding: 10px 15px;
    }
    .v-icon.close {
        font-size: 1.5em;
        margin: 15px;
        align-self: flex-end;
        position: fixed;
    }

    .orderButtons {
        display: flex;
        justify-content: center;
        margin-top: auto;
    }
    .orderButtons button {
        padding: 10px;
        color: #fff;
        font-size: 1em;
        line-height: 0.9em;
        width: 40%;
    }
    .orderButtons button:first-child {
        border-radius: 4px 0 0 4px;
        box-shadow: -1px 0 0 #fff inset;
    }
    .orderButtons button:last-child {
        border-radius: 0 4px 4px 0;
    }
    .orderButtons .lighter { 
        opacity: 0.75;
    }

    .modalSmallDevice {
        margin-top: auto; 
        padding: 25px 20px !important;
        font-size: 1.2em;
        border-radius: 0;
    }

    .radioButtons {
        font-size: 1.2em; 
        text-align: center;
    }
    .radioButtons label {
        width: 100%;
        display: inline-block;
        border-bottom: dotted 1px #4e4e4e;
        padding: 10px;
    }
    .radioButtons input[type="radio"] {
        margin-right: 10px;
    }

    .blocListeFiltres {
        display: none;
        color: #fff;
        border-radius: 0 !important;
    }
    .blocListeFiltres.display {
        display: block;
    }

    .blocListeFiltres ul {
        list-style: none;
        padding: 0;
    }
    .blocListeFiltres li {
        text-align: center;
        padding: 15px 20px;
        font-size: 1.1em;
        cursor: pointer;
    }
    .blocListeFiltres li:hover {
        background-color: #6576ce;
    }
    .blocListeFiltres li:first-child {
        border-top: dotted 1px #fff;
        border-bottom: dotted 1px #fff; 
    }

    .overlay {
        position: fixed; 
        width:100%; 
        height:0%; 
        top:0; 
        left:0; 
        background-color: rgba(0,0,0,0.75); 
        display:none;
    }
    .overlay.display {
        display:block !important;
        height: 100% !important;
    }
</style>