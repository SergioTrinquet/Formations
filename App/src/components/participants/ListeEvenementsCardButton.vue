<template>
    <div>
        <span v-if="isRegistered()">
            <v-btn 
                depressed 
                class="bt_event bt_red" 
                @click="registerEvent(idEvent, false)"
            >
                Se désinscrire
            </v-btn>
        </span>
        <span v-else>
            <v-btn 
                depressed 
                class="bt_event bt_green" 
                :disabled="canRegister(idParticipants.length)" 
                @click="registerEvent(idEvent, true)"
            >
                S'inscrire
            </v-btn>
        </span>
    </div>
</template>

<script>
    export default {
        props: {
            idEvent: {
                type: String,
                require: true
            },
            idParticipants: {
                type: Array,
                require: true
            }
        },

        computed: {
            currentUser() {
                return this.$store.getters.currentUser;
            },
            nbParticipantsMaxParFormation() {
                return this.$store.state.nbParticipantsMaxParFormation;
            },
        },

        methods: {
            isRegistered() {
                return this.idParticipants.includes(this.currentUser.id_user);
            },
            canRegister(nbParticipants) {
                return !(nbParticipants < this.nbParticipantsMaxParFormation);
            },
            async registerEvent(id_ev, registry) {
                //alert(`Inscription de l'utilisateur ${this.currentUser.id_auth} (id_user: ${this.currentUser.id_user}) à la formation n° ${id_ev}`); //TEST
                const c = confirm(`Confirmez votre ${registry ? "inscription" : "désinscription"} à la formation svp!`);
                if(c) {
                    await this.$store.dispatch('registerEvent', {
                        id_user: this.currentUser.id_user, 
                        id_event: id_ev, registry: registry 
                    });
                }
            }
        }
    }
</script>