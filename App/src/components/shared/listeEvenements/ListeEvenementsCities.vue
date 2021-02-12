<template>

    <!-- Encart filtre villes -->
    <ItemsSelectionModal 
        @onCloseModal="closeModal" 
        cssClass="modalCitiesSize   col-xs-12 col-sm-8 offset-sm-2 col-md-6 offset-md-3"
        @onSendItems="sendItems($event)"
        defaultTextNoItems="- Aucune ville sélectionnée -"
        :listItems="listeVillesComplete"
        :nbMaxItems="nbMaxVilles"
        :textError="'Pas plus de ' + nbMaxVilles + ' villes svp'"
        :selectedItems="selectedCities"
    ></ItemsSelectionModal>

</template>

<script>
    import ItemsSelectionModal from '@/components/shared/listeEvenements/ListeEvenementsItemsSelectionModal';

    export default {
        components: { 
            ItemsSelectionModal
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
            selectedCities() {
                return this.$store.getters.selectedCities;
            },
        },

        methods: {
            // Appelé qd clic ajout d'une ville dans modal filtre 'villes'
            sendItems(selectionVilles) {
                // Affectation dans variable du state ds Vuex qui regroupe ttes les valeurs des filtres de la sélection des villes
                this.$store.commit('SET_SELECTED_FILTERS', { 'villes': selectionVilles });
            },
            closeModal() {
                this.$store.commit('SET_DISPLAY_MODAL_LIST_OF_CITIES', false);
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