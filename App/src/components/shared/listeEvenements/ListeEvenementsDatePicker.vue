<template>

    <!-- Calendrier sélection dates -->
    <v-overlay opacity="0.75">
        <!-- TEST --><!-- dateRange: {{ dateRange }} <br/> --><!-- selectedDateRange: {{ selectedDateRange }} --> <!-- | previousDateRange: {{ previousDateRange }} -->
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
            :min="initDatesFilter.min"
            :max="initDatesFilter.max"
            :allowed-dates="allButWeekends"
            :title-date-format="formatAffichageTitleDatepicker"
        >
            <v-spacer></v-spacer>
            <v-btn text color="primaire" @click="cancelDatePicker">Annuler</v-btn>
            <v-btn text color="primaire" @click="validationDatePicker">OK</v-btn>
        </v-date-picker>
    </v-overlay>

</template>

<script>
    import datePickersAllowedDates from '@/mixins/datePickerAllowedDates';
    import formatageDate from '@/mixins/formatageDate';
    import currentDate from '@/mixins/currentDate';
    import dateToInt from '@/mixins/dateToInt';

    export default {
        mixins: [
            datePickersAllowedDates,
            formatageDate,
            currentDate,
            dateToInt,
        ],

        data() {
            return {
                dateRange: [],
                previousDateRange: []
            }
        },

        computed: {
            // Recup. valeurs dates de filtrage de la var. ds le Vuex
            selectedDateRange() {   //console.log("COMPOSANT datePicker : Je suis ds le COMPUTED de 'selectedDateRange'", this.$store.state.selectedFilters.dates); //TEST
                return this.$store.getters.selectedDateRange;
            },

            // Récup. des paramètres d'initialisation du filtre 'dates'
            initDatesFilter() {
                return {
                    min: this.$store.state.paramsFiltersEvenements.minDate, 
                    max: this.$store.state.paramsFiltersEvenements.maxDate
                }
            },

            // Pour affichage au dessus du date picker : Donne la tranche de dates pendant lesquelles il y a des formations programmées
            initDateRangeText() {
                let txt = "";
                if(typeof this.initDatesFilter.min != 'undefined') {
                    if(this.initDatesFilter.min == this.initDatesFilter.max) {
                        txt = `Seule date sélectionnable : ${this.formatDate(this.initDatesFilter.min)}`;
                    } else {
                        txt = `Entre le ${this.formatDate(this.initDatesFilter.min)} et le ${this.formatDate(this.initDatesFilter.max)}`;
                    }
                }
                return txt;
            },

            // Pour attribut du date picker : Sensé sélectionner le mois quand ouverture du date picker, mais bug
            pickerDate() {
                //return "2021-05-03";
                const minDate = this.initDatesFilter.min;
                const currentDate = this.getCurrentDate();
                
                if(currentDate < this.dateToInteger(minDate)) {
                    return minDate.substring(0, minDate.lastIndexOf("-"));
                } else {
                    return [currentDate.slice(0, 4), "-", currentDate.slice(4, 6)].join('');
                }
            },

            // Affiche la sélection de(s) date(s) dans le datePicker
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
            }
        },

        methods: {
            formatAffichageTitleDatepicker(val) {
                console.log(val); //TEST
                return this.dateRangeText;
            }, 
            // Quand validation des dates dans le date picker (pour filtre 'dates')
            validationDatePicker() {
                // Affectation dans variable qui regroupe tous les filtres des nouvelles valeurs 'dates'
                this.$store.commit('setSelectedFilters', { 'dates': this.dateRange });
                this.closeDatePicker();
                this.previousDateRange = this.dateRange; // Pour gérer cas qd clic 'Annuler' sur Date picker : Permet l'affichage de la précédente période si modif sans enregistrer, puis annulation
                this.$store.commit('setDateRangeText', this.dateRangeText); // Pour partager texte dates avec autre composant "ListeEvenementsSortAndFilters"
            },
            // Qd click sur bouton 'Annuler' dans datePicker
            cancelDatePicker() {
                this.dateRange = this.previousDateRange;
                this.closeDatePicker();
            },
            // Fermeture datePicker
            closeDatePicker() {
                this.$store.commit('setDisplayModalDatePicker', false);
            },
            // Classement par ordre chrono. des dates sélectionnées
            sortByDate(array) {
                return array.sort((a, b) => {
                    return this.dateToInteger(a) - this.dateToInteger(b);
                });
            }
        },

        // A l'arrivée sur le composant, récupération des dates potentiellement déjà sélectionnées avant et stockées dans le Vuex
        async mounted() {
            this.dateRange = this.selectedDateRange;
        }

    }
</script>

<style>
    .initDatesText {
        font-size: 17px;
        text-align: center;
        margin: 0 0 4px 0;
    }
    .v-date-picker-title__date {
        font-size: 18px;
    }
</style>