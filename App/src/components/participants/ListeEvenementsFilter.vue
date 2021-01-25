<template>
    <button 
        :class="(myTrainings ? 'selected primaire' : 'primaireLight')" 
        @click="execFilterSelection"
    >
        <slot name="iconLeft"></slot>
        Mes formations
        <slot name="iconRight"></slot>
    </button>
</template>

<script>
    export default {
        computed: {
            mesFormations() {
                return this.$store.getters.mesFormations;
            },
        },

        watch: {
            mesFormations(val) {
                this.myTrainings = val;
            }
        },

        data() {
            return {
                myTrainings: false
            }
        },

        methods: {
            execFilterSelection() {
                this.myTrainings = !this.myTrainings; 

                // Affectation dans variable qui regroupe tous les filtres du booleen 'myTrainings'
                this.$store.commit('setSelectedFilters', { 'mesFormations': this.myTrainings });
                
                // Indique si filtre activé ou non dans Vuex. 
                // Utile quand désinscription d'une formation : Si le filtre est activé, la formation en question ne doit plus apparaitre après désinscription 
                this.$store.commit('setValueFilterMyTrainings', this.myTrainings);
            }
        }
    }
</script>