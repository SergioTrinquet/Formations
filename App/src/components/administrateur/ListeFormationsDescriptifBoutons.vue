<template>
    <div>
        <v-btn depressed class="bt_green" @click="changeEvent" :disabled="isPast">Modifier</v-btn>
        <v-btn depressed class="bt_green" @click="deleteEvent">Supprimer</v-btn>
    </div>
</template>

<script>
    export default {
        props: {
            event: {
                type: Object,
                required: true
            },
            isPast: {
                type: Boolean,
                required: true
            }
        },

        methods: {
            changeEvent() {
                this.$store.commit('SET_EVENT_TO_MODIFY', null); // Ajouté le 18/01/2021
                this.$store.commit('SET_EVENT_TO_MODIFY', this.event);
            },
            async deleteEvent() {
                const c = confirm("Confirmez la suppression de cette formation svp!"); 
                if(c) {
                    await this.$store.dispatch('deleteEvent', this.event.id_evenement);
                }
            },
        }
    }
</script>

<style scoped>
    .bt_green:first-child {
        margin-right: 8px;
    }
</style>