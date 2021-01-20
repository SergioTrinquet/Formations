<template>

    <!-- Encart filtre villes -->
    <app-itemsSelectionModal 
        @onCloseModal="closeModal()" 
        cssClass="modalCitiesSize   col-xs-12 col-sm-8 offset-sm-2 col-md-6 offset-md-3"
        @onSendItems="sendItems($event)"
        defaultTextNoItems="- Aucune ville sélectionnée -"
        :listItems="listeVillesComplete"
        :nbMaxItems="nbMaxVilles"
        :textError="'Pas plus de ' + nbMaxVilles + ' villes svp'"
        :selectedItems="selectedCities"
    ></app-itemsSelectionModal>

</template>

<script>
    import itemsSelectionModal from '@/components/shared/listeEvenements/ListeEvenementsItemsSelectionModal';

    export default {
        components: { 
            'app-itemsSelectionModal': itemsSelectionModal
        },

        data() {
            return {
                nbMaxVilles: 3
            }
        },

        computed: {
            // Pour alimenter la liste des villes proposées ds le modal
            listeVillesComplete() {
                return this.$store.state.paramsFiltersEvenements.villes.map(v => v.toUpperCase());
            },
            selectedCities() { //console.log("COMPOSANT Liste des Villes : Je suis ds le COMPUTED de 'selectedCities'", this.$store.state.selectedFilters.villes); //TEST
                let villes = this.$store.state.selectedFilters.villes;
                return typeof villes == 'undefined' ? [] : villes;
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
            }

        }

    }
</script>

<style>
    .modalCitiesSize { 
        height: 50vh;
        width: 100vw;
    }
    @media screen and (max-width: 600px) {
        .modalCitiesSize { 
            position: fixed !important;
            top: 20px;
            left: 20px;
            height: calc(100vh - 40px); 
            width: calc(100vw - 40px);
        }
    }
</style>