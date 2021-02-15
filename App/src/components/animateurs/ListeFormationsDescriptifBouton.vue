<template>
    <div>
        <v-btn 
            depressed 
            class="bt_green" 
            :disabled="event.id_participants.length == 0" 
            @click="redirectListeParticipants()"
        >
            Liste des participants
        </v-btn>
    </div>
</template>

<script>
    export default {
        props: {
            event: {
                type: Object,
                required: true
            }
        }, 

        methods: {
            redirectListeParticipants() {
                this.$router.push({ name: `participants_list`, params: { event: this.event } });
            }
        }
    }
</script>
    