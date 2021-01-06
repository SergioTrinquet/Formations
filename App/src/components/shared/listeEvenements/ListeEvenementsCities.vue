<template>

    <!-- Encart filtre villes -->
    <app-itemsSelectionModal 
        :modalDisplay="displayModalListeVilles"
        @onCloseModal="closeModal()"
        modalWidth="100vw" 
        modalHeight="50vh"
        cssClass="col-10 offset-1 col-sm-8 offset-sm-2 col-md-6 offset-md-3"
        @onSendItems="sendItems($event)"
        defaultTextNoItems="- Aucune ville sélectionnée -"
        :listItems="listeVillesComplete"
        :nbMaxItems="nbMaxVilles"
        :textError="'Pas plus de ' + nbMaxVilles + ' villes svp'"
        :selectedItems="villesSelection"
    ></app-itemsSelectionModal>

</template>

<script>
    import itemsSelectionModal from '@/components/shared/listeEvenements/ListeEvenementsItemsSelectionModal';

    export default {
        props: {
            // Pour apparition ou non du date picker qd click sur menu 'dates'
            displayCL: {
                type: Boolean,
                required: true
            }
        },
        
        components: { 
            'app-itemsSelectionModal': itemsSelectionModal
        },

        data() {
            return {
                displayModalListeVilles: false,
                nbMaxVilles: 3
            }
        },

        computed: {
            // Computed pour les paramètres d'initialisation des filtres 'dates' et 'villes'
            /* dataFilters() {
                let paramsFiltersEvenements = this.$store.state.paramsFiltersEvenements;
                return {
                    villes: paramsFiltersEvenements.villes.map(v => v.toUpperCase()), 
                    //dates: {
                    //  min: paramsFiltersEvenements.minDate, 
                    //  max: paramsFiltersEvenements.maxDate
                    //}
                }
            }, */
            // Pour alimenter la liste des villes proposées ds le modal
            listeVillesComplete() {
                return this.$store.state.paramsFiltersEvenements.villes.map(v => v.toUpperCase());
            },

            // Ajouté le 05/01/2021
            villesSelection() { console.log("COMPOSANT Liste des Villes : Je suis ds le COMPUTED de 'villesSelection'", this.$store.state.selectedFilters.villes); //TEST
                let villes = this.$store.state.selectedFilters.villes;
                return typeof villes == 'undefined' ? [] : villes;
            },
            // FIN Ajout le 05/01/2021
        },

        watch: {
            // Affectation dans une variable locale de la valeur de la prop qui permet l'affichage ou non du date picker
            displayCL(val) {
                this.displayModalListeVilles = val;
            }
        },

        methods: {
            // Appelé qd clic ajout d'une ville dans modal filtre 'villes'
            sendItems(selectionVilles) {  //console.log("COMPOSANT Liste des Villes : Je suis ds 'sendItems'"); //TEST
                // Affectation dans variable du state ds Vuex qui regroupe ttes les valeurs des filtres de la sélection des villes
                this.$store.commit('setSelectedFilters', { 'villes': selectionVilles });
            },
            closeModal() {
                this.$store.commit('setDisplayModalCitiesList', false);
            },


            // A CENTRALISER QUELQUE PART DANS UN COMPOSANT PARENT CAR SE TROUVE DANS PLUSIEURS COMPOSANTS
            /* async loadEventsWithSelectedFilters() {
                await this.$store.dispatch('loadEvenements', this.filtersSelection); // Appel requete avec filtres sélectionnés
                this.$store.commit('setInitPagination', true); // Retour 1ere page 
            } */
        }


    }
</script>

<style>

</style>