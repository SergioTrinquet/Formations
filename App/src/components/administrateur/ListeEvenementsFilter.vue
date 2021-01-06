<template>
    <v-switch
        :label="label" 
        color="primaire" 
        v-model="pastTrainings" 
        @change="emitFilterParam"
        class="switch"
        hide-details="true"
    ></v-switch>
</template>

<script>
    export default {
        props: {
            pastEvents: {
                type: Boolean,
                required: true
            },
            label: {
                type: String,
                required: true
            }
        },
        
        watch: {
            pastEvents(val) {
                this.pastTrainings = val;
            }
        },

        data() {
            return {
                pastTrainings: false
            }
        },

        methods: {
            emitFilterParam() {
                this.$emit('emitFilterValue');  // VRAIMENT UTILE ????
                this.$store.commit('setSelectedFilters', { 'pastEvents': this.pastTrainings }); // Affectation dans variable qui regroupe tous les filtres du booleen 'pastTrainings'
            }
        }
    }
</script>