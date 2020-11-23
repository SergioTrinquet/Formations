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
                require: true
            }
        },
        
        watch: {
            pastEvents(val) {
                this.pastTrainings = val;
            }
        },

        data() {
            return {
                pastTrainings: false,
                label: "Anciennes formations"
            }
        },

        methods: {
            emitFilterParam() {
                this.$emit('emitFilterValue', { origin: 'Administrateur', pastEvents: this.pastTrainings });
            }
        }
    }
</script>