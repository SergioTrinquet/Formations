<template>
    <div v-if="isRegistered()" class="bandeauParticipantInscrit">
        <v-icon>far fa-calendar-check</v-icon>Inscrit à cette formation
    </div>
</template>

<script>
    export default {
        props: {
            idParticipants: {
                type: Array,
                required: true
            }
        },

        computed: {
            currentUser() {
                return this.$store.getters.getCurrentUser;
            }
        },

        methods: {
            isRegistered() {
                return this.idParticipants.includes(this.currentUser.id_user);
            }
        }
    }
</script>

<style scoped>
    .bandeauParticipantInscrit {
        background-color: #ffe186; 
        color: #8a7a47; 
        padding: 5px 10px 3px 10px; 
        border-radius: 3px 3px 0 0;
        text-align: right;
        font-weight: bold;
        font-size: 14px;
    }
    .bandeauParticipantInscrit > i {
        font-size: 15px;
        margin: -3px 5px 0 0;
    }
</style>