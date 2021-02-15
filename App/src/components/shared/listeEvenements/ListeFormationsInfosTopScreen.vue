<template>
    <div class="wrapSubHeader">

        <!-- Lignes boutons Classement et filtres qui ne doit apparaitre que qd écran est en xs -->
        <SmallViewportButtons class="hidden-sm-and-up" />
                       

        <div class="d-flex subHeader">
            <div class="align-self-center">
                <div><span class="nbEvents primaire--text">{{ nbEventsDisplayed }}</span> {{ "évènement" + (nbEventsDisplayed > 1 ? "s" : "") }}</div>
                <div>{{ textSortType }}</div>
            </div>
            <v-spacer></v-spacer>
            <div id="pagination" class="d-flex align-stretch align-self-center">
                <v-icon 
                    class="primaire" 
                    :disabled="selectedPage == 1 ? true : false"
                    @click="btsChangePage('before')"
                >fas fa-angle-left</v-icon>
                <select v-model="selectedPage" class="background">
                    <option v-for="(page, i) in pages" :key="i" :value="page">page {{ page }}</option>
                </select>
                <v-icon 
                    class="primaire" 
                    :disabled="selectedPage == pages ? true : false"
                    @click="btsChangePage('after')"
                >fas fa-angle-right</v-icon>
            </div>
        </div>

    </div>
</template>

<script>
    import { mapState } from 'vuex';

    const SmallViewportButtons = () => import(/* webpackChunkName: "SmallViewportButtons" */ '@/components/shared/listeEvenements/ListeFormationsClassementsEtFiltres_SmallViewport')

    export default {
        data() {
            return {
                selectedPage: 1
            }
        },

        components: { 
            SmallViewportButtons
        },

        computed: {
            ...mapState([
                'nbEventsPerPage',
                'sortingParameters',
                'initPagination'    // Pour remettre à la 1ere page (WATCH)
            ]),
            
            nbEventsDisplayed() {
                return this.$store.state.evenements.length;
            },

            // Pour calculer le nb de pages dans liste déroulante partie pagination
            pages() {
                const nbEvents = this.nbEventsDisplayed;
                if((nbEvents % this.nbEventsPerPage) > 0) {
                    return Math.floor(nbEvents/this.nbEventsPerPage) + 1;
                } else {
                    return nbEvents/this.nbEventsPerPage;
                }
            },

            textSortType() {
                let text = "";
                const type = this.sortingParameters.type;
                const dir = this.sortingParameters.direction;
                if(type == 'date') {
                    text = (dir == 'asc' ? 'date' : 'date (antéchronologique)');
                } else if(type == 'titre') {
                    text = (dir == 'asc' ? 'intitulé de formation' : 'intitulé de formation (inversé)');
                } else if(type == 'NbParticipants') {
                    text = (dir == 'asc' ? 'nb de participants (croissant)' : 'nb de participants (décroissant)');
                }
                return "classé(s) par " + text;
            }
        },

        watch: {
            // Retour à la page du début quand nouveaux filtres ou retraits filtres : 
            // On affiche la 1ere page par défaut (v-model 'selectedPage' = 1)
            initPagination(val) { //console.log("WATCH de initPagination", val); //TEST
                if(val) { 
                    this.selectedPage = 1;
                    this.$store.commit('SET_INIT_PAGINATION', false);
                }
            },

            selectedPage() {
                this.$store.commit('SET_SELECTED_PAGE', this.selectedPage);
                window.scrollTo(0,0); // Retour en haut de page
            }
        },

        methods: {
            btsChangePage(val) {
                if(val == 'before' && this.selectedPage > 1) {
                    this.selectedPage--;
                } else if(val == 'after' && this.selectedPage < this.pages) {
                    this.selectedPage++;
                }
            }
        }
    }
</script>

<style scoped>
.wrapSubHeader {
    position: fixed; 
    z-index: 1; 
    width: 100vw; 
}
.subHeader {
    background-color: #ffffff; 
    line-height: 17px; 
    padding:8px 20px; 
    width: 100%;
    box-shadow: 0 3px 3px rgba(0,0,0,0.12);
}

.nbEvents {
    font-size: 20px;
    font-weight: bold;
}

#pagination select {
    cursor: pointer;
    width: 60px;
    text-align: center;
}
#pagination select,
#pagination select option {
    font-size: 14px;
}

#pagination .fas {
    padding: 5px 7px;
    font-size: 13px;
    cursor: pointer;
    color: #ffffff;
}
#pagination .fas:first-child {
    border-radius: 4px 0 0 4px;
}
#pagination .fas:last-child {
    border-radius: 0 4px 4px 0;
}
#pagination .v-icon--disabled {
    background-color: #7f84a6  !important;
    color: #c5c5c5 !important;
    cursor: not-allowed !important;
}
</style>