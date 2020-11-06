<template>
    <div class="wrapSubHeader">
        <div class="d-flex subHeader">
            <div class="align-self-center">
                <div><span class="nbEvents primaire--text">{{ nbEventsFiltered }}</span> {{ "évènement" + (nbEventsFiltered > 1 ? "s" : "") }}</div>
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
    export default {
        data() {
            return {
                selectedPage: 1
            }
        },

        props: [
            'initPagination'
        ],

        computed: {
            nbEventsPerPage() {
                return this.$store.state.nbEventsPerPage;
            },
            nbEventsFiltered() {
                return this.$store.state.nbEventsFiltered;
            },

            // Pour calculer le nb de pages dans liste déroulante partie pagination
            pages() {
                const nbEvents = this.nbEventsFiltered;
                if((nbEvents % this.nbEventsPerPage) > 0) {
                    return Math.floor(nbEvents/this.nbEventsPerPage) + 1;
                } else {
                    return nbEvents/this.nbEventsPerPage;
                }
            },

            sortingParameters() {
                return this.$store.state.sortingParameters;
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
            initPagination() {
                // Retour à la page du début quand nouveaux filtres ou retraits filtres : 
                // On affiche la 1ere page par défaut (v-model 'selectedPage' = 1)
                this.selectedPage = 1;
            },

            selectedPage() {
                this.$store.commit('setSelectedPage', this.selectedPage);
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
    height:50px;
}
.subHeader {
    position: fixed; 
    z-index: 1; 
    background-color: #ffffff; 
    line-height: 17px; 
    padding:8px 20px; 
    width: 100%; 
    /* opacity: 0.6; */
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