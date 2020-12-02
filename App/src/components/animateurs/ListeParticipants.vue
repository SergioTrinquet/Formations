<template>
    <div>
        <div style="text-align: right;">
            <a class="btListeFormations" @click="$router.go(-1)">Retour à la liste des formations</a>
        </div>
        <!-- <div>{{ $route.params.event }}</div> -->
        <!-- <div style="margin: 30px 0 0 0">{{ event }}</div> -->
        <div class="wrapperListeParticipants d-flex flex-column justify-center align-center">
            <div class="explication">
                Cette liste sert à l'appel des participants lors de la formation.<br/>
                Il n'est possible de cocher la présence du participant que le jour même de la formation.
            </div>
            <div class="msgInfoEnableForm" v-if="disabledForm">Ce formulaire n'est actif qu'à compter de la date de formation et ce pendant {{ nbDaysListParticipantsFormEnable }} jour(s)</div>
            <div class="dataFormation">
                <div>
                    <span class="date primaire">{{ formatDate(event.date) }}</span> 
                    <span class="titre primaire--text">{{ event.titre }}</span>
                </div>
            </div>

            <div class="NbParticipants">{{ sentenceNbParticipants }}</div>
            <div class="legende">
                <span>Nom</span>
                <span>Prénom</span>
                <span>Profession</span>
                <span class="email">Adresse mail</span>
                <span>Présence</span>
            </div>
            <div v-for="(participant, i) in eventParticipants" :key="i" class="lgnParticipant">
                <span>{{ participant.lastName | capitalizeOnEveryWords }}</span>
                <span>{{ participant.firstName | capitalizeOnEveryWords }}</span>
                <span>{{ participant.profession | capitalizeOnEveryWords }}</span>
                <span class="email">{{ participant.email }}</span>
                <span>
                    <input 
                        type="checkbox" 
                        v-model="presences" 
                        :value="participant.id" 
                        @change="selectionParticipant" 
                        :disabled="disabledForm" 
                    />
                </span>
            </div>
            {{ presences }} <!-- TEST -->
            <br />onArrivalPresences => {{ onArrivalPresences }} <!-- TEST -->
            <br />disabledRecordButton => {{ disabledRecordButton }} <!-- TEST -->
            <v-btn 
                class="bt_green btLarge" depressed block
                :disabled="disabledRecordButton || disabledForm" 
                @click="recordPresenceParticipants"
            >
                Enregistrer
            </v-btn>
        </div>
    </div>
</template>

<script>
    import formatageDate from '@/mixins/formatageDate';
    import capitalizeOnEveryWords from '@/filters/capitalizeOnEveryWords';

    export default {
        /* RESTE A FAIRE :
           ===============
        - Gérer l'enregistrement ds la collection utilisateurs de Firestore
        - Améliorer visuellement les checkboxs avec du CSS
        - Améliorer visuellement la page en général
        */
        filters: {
            capitalizeOnEveryWords
        },

        props: {
            event: {
                type: Object,
                required: true
            },
        },

        mixins: [
            formatageDate
        ],
        
        data() {
            return {
                // TEMPORAIRE : JUSTE POUR MISE EN PAGE
                /* participants: [
                    { lastName: "POLUX", firstName: "Jean", email: "xxx@yyy.fr", profession: "Avocat" },
                    { lastName: "TRINQUET", firstName: "Jacques", email: "sss@ddd.fr", profession: "Medecin" },
                    { lastName: "MARTIN", firstName: "Pierre", email: "ddd@jjj.com", profession: "Plombier" },
                ], */
                presences: [],
                disabledForm: false,

                onArrivalPresences: [], // EN COURS : 02/12/2020
                disabledRecordButton: true  // EN COURS : 02/12/2020
            }
        },

        computed: {
            // Pas besoin !! Se trouve déjà dans la prop passée en params dans la route !!
            eventParticipants() { //console.log(this.$store.getters.eventParticipants); //TEST
                return this.$store.getters.eventParticipants;
            },
            sentenceNbParticipants() {
                const nbPart = this.eventParticipants.length;
                return nbPart > 0 ? `${nbPart} participant${nbPart > 1 ? "s" : ""} inscrit${nbPart > 1 ? "s" : ""}` : "Pas encore de participants à cette formation";
            },
            nbDaysListParticipantsFormEnable() {
                return this.$store.state.nbDaysListParticipantsFormEnable;
            }
        },

        watch: {
            // Permet aux checkboxes d'être cochés ou non au chargement (cas ou appel a déjà eu lieu)
            eventParticipants(val) {
                let partPresents = [];
                const self = this;
                val.forEach(p => {
                    if(typeof p.presence !== "undefined") { // Si propriété 'presence' existe, donc si appel a déjà étét fait...
                        let ipPart = p.id;
                        p.presence.forEach(x => {
                            if(x.id_ev == self.event.id_evenement && x.isPresent == true) { // Si participant a été coché présent pour cette formation...
                                partPresents.push(ipPart);
                            }
                        })
                    }
                })
                //console.log(val, "Dans le watch 'eventParticipants'", partPresents); //TEST
                // Affectation v-model
                this.presences.push(...partPresents);
                // Surlignage des lignes sélectionnées
                this.$nextTick(()=>{ //...on attend la modification du DOM concerné par le changement du computed 'eventParticipants'...
                    document.querySelectorAll(".lgnParticipant input[type='checkbox']").forEach(i => {
                        if(this.presences.includes(i.value)) {
                            i.closest("div").classList.add("lgnSelected");
                        } 
                    });
                });

                
                this.onArrivalPresences.push(...this.presences); // EN COURS : 02/12/2020
            }
        },

        methods: {
            // Pour rendre formulaire enable ou pas en fct° de la date du jour
            enableForm() {
                //const today = new Date(); // Date du  jour au format complet
                //const dateDuJour = new Date(today.getFullYear(), today.getMonth(), today.getDate()); // date du jour sans les heure minutes sec....
                /* POUR PHASE DE DEV. */ const dateDuJour = new Date(2021, 2, 15);

                const [year, month, day] = this.event.date.split('-');
                const dateFormation = new Date(year, month - 1, day);
                const dateFormationPlusDelai = new Date(year, month - 1, parseInt(day) + parseInt(this.nbDaysListParticipantsFormEnable));
                //console.log(">>>>>>>>> dateDuJour", dateDuJour, "this.event.date", this.event.date, "dateFormation", dateFormation, "dateFormationPlusDelai", dateFormationPlusDelai); //TEST
                       
                if(dateDuJour < dateFormation || dateDuJour > dateFormationPlusDelai) {
                    this.disabledForm = true;
                }
            },
            selectionParticipant(e) {
                //console.log("clic !!!!", e.target); //TEST
                const lgn = document.querySelector("[value='" + e.target.value + "']").closest("div");
                lgn.classList.toggle("lgnSelected", e.target.checked);

                // Partie comparaison avec sélection des participants à l'arrivée sur la page afin de savoir si on a besoin de soumettre l'enregistrement car changement dans sélection ou pas
                if(this.onArrivalPresences.sort().toString() === this.presences.sort().toString()) {
                    this.disabledRecordButton = true;
                } else {
                    this.disabledRecordButton = false;
                }
            },
            recordPresenceParticipants() {
                this.$store.dispatch('recordPresenceParticipants', this.presences); // A CREER
            }
        },

        async mounted() {
            // Chargement des participants de la formation
            await this.$store.dispatch('getParticipantsEvenement', this.$route.params.event.id_evenement);
            // Pour rendre ou non les éléments du formulaire modifiables
            this.enableForm();
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
        text-align: center;
        /* background-color: #e8476224; */
        background-color: rgb(195, 203, 255);
    }
    .dataFormation > div {
        display: flex;
    }
    .dataFormation > div > * {
        padding: 10px 20px;
    }
    .dataFormation .date { 
        color: #ffffff;
        font-size: 0.9em;
    }
    .dataFormation .titre { 
        flex-grow: 1;
        /* color: #e84763; */
    }
    .wrapperListeParticipants > * {
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
        margin: 10px 0;
        color: #313131;
        border-bottom: dashed 1px #313131;
    }
    .legende,
    .lgnParticipant {
        display: flex;
        align-items: center;
        padding: 10px 20px;
    }
    .legende {
        color: #575555;
        font-weight: bold;
        font-size: 14px;
        /* border-bottom: dashed 1px #575555;
        margin: 0 0 16px 0;
        padding: 10px 20px 5px 20px; */
    }
    .lgnParticipant {
        font-size: 0.9em;
        background-color: #fff;
        border-radius: 4px;
        margin: 0 0 10px;
        min-height: 3.2em;
        /* box-shadow: 0px 0px 3px rgba(0,0,0,0.3); */
        box-shadow: 0px 0px 0px 2px #cecece inset;
    }
    .lgnParticipant.lgnSelected {
        box-shadow: 0px 0px 0px 2px #2ce263 inset !important;
    }
    .legende > span,
    .lgnParticipant > span {
        flex-grow: 1;
        flex-basis: 0;
        text-align: left;
        line-height: 0.9em;
        margin: 0 2px;
    }
    .legende > span:last-child,
    .lgnParticipant > span:last-child { 
        text-align: center;
        flex-grow: 0.5;
    }
    .legende > span.email,
    .lgnParticipant > span.email {
        flex-grow: 2;
    }
</style>