<script>
    import FiltreProfilParticipant from '@/components/participants/ListeFormationsFiltre';
    import OptionProfilAdmin from '@/components/administrateur/ListeFormationsOption';

    import { mapState, mapGetters } from 'vuex';

    export default {
        components: {
            OptionProfilAdmin,
            FiltreProfilParticipant
        },
 
        data() {
            return {
                sortSelect: "",
                sortDirection: "",
                listeFiltres: []
            }
        },

        computed: {
            ...mapState([
                'sortItemsList',
                'filtersList',
                'sortingParameters',
                'dateRangeText'
            ]),
            ...mapGetters({
                currentUser: 'getCurrentUser',
                selectedDateRange: 'getSelectedDateRange',
                selectedCities: 'getSelectedCities',
                pastEvents: 'getPastEvents',
                mesFormations: 'getMesFormations'
            })
        },

        watch: {
            
            // Affectation des variables de classement aux variables locales
            sortingParameters(val) {
                this.sortSelect = val.type;
                this.sortDirection = val.direction;
            },

            // Pour afficher ou non icone sur bt filtre 'Dates' en fonction de l'activation du filtre
            selectedDateRange(val) {
                const idx = this.listeFiltres.findIndex(f => f.libelle == 'dates');
                this.listeFiltres[idx].selected = (val.length > 0) ? true : false;
            },
            // Pour afficher ou non icone sur bt filtre 'Villes' en fonction de l'activation du filtre
            selectedCities(val) {
                const idx = this.listeFiltres.findIndex(f => f.libelle == 'villes');
                this.listeFiltres[idx].selected = (val.length > 0) ? true : false;
            }
            
        },

        methods: {
            // Quand clic sur type de filtre : Pour ouverture modal du filtre 'dates' ou 'villes'
            filterBy(idx) {
                const button = this.listeFiltres[idx];
                if(button.libelle == "dates") {
                    this.$store.commit('SET_DISPLAY_MODAL_DATEPICKER', true);
                } else {
                    this.$store.commit('SET_DISPLAY_MODAL_LIST_OF_CITIES', true);
                }
            },
        },

        mounted() {
            this.listeFiltres = this.filtersList;
            this.sortSelect = this.sortingParameters.type;
            this.sortDirection = this.sortingParameters.direction;
        }



    }
</script>