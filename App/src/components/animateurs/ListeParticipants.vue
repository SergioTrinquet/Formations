<template>
    <!-- <v-container fluid class="pa-0">
        <v-row>
            <v-col> -->

            <div id="toto"><!-- V2 -->
                <div style="text-align: right;">
                    <a class="btListeFormations" @click="$router.go(-1)">Retour à la liste des formations</a>
                </div>
                <!-- <div>{{ $route.params.event }}</div> --><div>{{ event }}</div>
                <div class="d-flex flex-column justify-center align-center">
                    <div class="explication">
                        Cette liste sert à l'appel des participants lors de la formation.<br/>
                        Il n'est possible de cocher la présence du participant que le jour même de la formation.
                    </div>
                    <div class="dataFormation">
                        <span class="date">{{ formatDate(event.date) }}</span> - 
                        <span class="titre">{{ event.titre }}</span>
                    </div>
                    <div class="NbParticipants">{{ sentenceNbParticipants }}</div>
                    <div class="legende">
                        <span>Nom</span>
                        <span>Prénom</span>
                        <span>Profession</span>
                        <span>adresse mail</span>
                        <span>Présence</span>
                    </div>
                    <div v-for="(participant, i) in eventParticipants" :key="i" class="lgnParticipant" :ref="i">
                        <span>{{ participant.lastName }}</span>
                        <span>{{ participant.firstName }}</span>
                        <span>{{ participant.profession }}</span>
                        <span>{{ participant.email }}</span>
                        <span><input type="checkbox" v-model="presences" :value="participant.id" @change="selectionParticipant"/></span>
                    </div>
                    {{ presences }} <!-- TEST -->
                    <v-btn class="bt_green btLarge" depressed block :disabled="presences.length == 0" @click="recordPresenceParticipants">Enregistrer</v-btn>
                </div>

            </div> <!-- V2 -->

            <!-- </v-col>
        </v-row>
    </v-container> -->
</template>

<script>
    import formatageDate from '@/mixins/formatageDate';

    export default {

        props: {
            event: {
                type: Object,
                required: true
            },
        },

        mixins: [formatageDate],
        
        data() {
            return {
                // TEMPORAIRE : JUSTE POUR MISE EN PAGE
                /* participants: [
                    { lastName: "POLUX", firstName: "Jean", email: "xxx@yyy.fr", profession: "Avocat" },
                    { lastName: "TRINQUET", firstName: "Jacques", email: "sss@ddd.fr", profession: "Medecin" },
                    { lastName: "MARTIN", firstName: "Pierre", email: "ddd@jjj.com", profession: "Plombier" },
                ], */
                presences: []
            }
        },

        computed: {
            // Pas besoin !! Se trouve déjà dans la prop passée en params dans la route !!
            eventParticipants() { console.log(this.$store.state.eventParticipants); //TEST
                return this.$store.state.eventParticipants;
            },
            sentenceNbParticipants() {
                const nbPart = this.eventParticipants.length;
                return nbPart > 0 ? `${nbPart} participant${nbPart > 1 ? "s" : ""}` : "Pas encore de participants à cette formation";
            }
        },

        methods: {
            selectionParticipant() {
                console.log("clic !!!!"); //TEST
            },
            recordPresenceParticipants() {
                this.$store.dispatch('recordPresenceParticipants', this.presences); // A CREER
            }
        },

        async mounted() {
            // Chargement des participants de la formation
            await this.$store.dispatch('getParticipantsEvenement', this.$route.params.event.id_evenement);
        }
    }
</script>

<style scoped>
    .btListeFormations {
        cursor: pointer;
        padding: 3px 10px;
        margin: 10px;
        border-radius: 3px;
        color: rgb(2, 31, 126);
        font-size: 0.9em;
        text-decoration: none;
    }
    .dataFormation {
        margin: 7px;
        font-size: 1.3em;
    }
    .dataFormation .date {

    }
    .dataFormation .titre {
        color: #444444;
    }
    .explication,
    .legende,
    .lgnParticipant {
        width: 50vw;
        min-width: 700px;
    }
    .btLarge {
        width: 50vw !important;
        min-width: 700px !important;
        margin: 20px;
    }
    .explication {
        background-color:#016fff;
        color: #fff;
        margin: 0 0 30px 0;
        padding: 10px 20px;
    }
    .NbParticipants {
        text-align: left;
    }
    .legende,
    .lgnParticipant {
        display: flex;
        padding: 5px 20px;
    }
    .lgnParticipant {
        background-color: #fff;
        border-radius: 4px;
        margin: 0 0 7px;
        box-shadow: 0px 0px 3px rgba(0,0,0,0.3);
    }
    .legende > span,
    .lgnParticipant > span {
        flex-grow: 1;
        text-align: left;
    }
    .legende > span:last-child,
    .lgnParticipant > span:last-child { 
        text-align: right;
    }
    .lgnParticipant > span:last-child { 
        text-align: center;
    }
</style>