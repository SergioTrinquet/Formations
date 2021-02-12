<template>
    <div>
        <!-- Modal final avec redirection vers liste des évènements -->
        <app-modal :display="recordPresenceParticipantsDone">
            <div class="wrapperContentModal">
                <div>Les données de l'appel sont enregistrées</div>
                <v-btn @click="endRecordAppelParticipants" depressed>Fermer</v-btn>
            </div>
        </app-modal>

        <div class="linkBack">
            <a @click="quitPage"><v-icon>fas fa-arrow-left</v-icon>Retour <span class="facultatif">à la liste des formations</span></a>
        </div>
        <!-- <div>{{ $route.params.event }}</div> -->
        <!-- <div style="margin: 30px 0 0 0">{{ event }}</div> -->
        <div class="d-flex flex-column justify-center align-center">
            
            <div class="col-lg-8 col-sm-10 col-12 
                        mx-sm-4 px-sm-4  mx-0 px-0
                        wrapperListeParticipants"
            >

                <div class="explication">
                    <v-icon class="iconeInfo">fas fa-info-circle</v-icon>
                    <span>
                        Cette liste sert à l'appel des participants lors de la formation
                        <span v-if="disabledForm">Ce formulaire n'est actif qu'à compter de la date de formation et ce pendant {{ nbDaysListParticipantsFormEnable }} jour(s)</span>
                    </span>
                </div>

                <div class="dataFormation">
                    <div style="align-items: stretch;">
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

                <transition-group 
                    v-on:beforeEnter="beforeEnter" 
                    v-on:enter="enter" appear
                >
                
                    <div v-for="(participant, i) in eventParticipants" :key="i" class="lgnParticipant"
                        :data-index="i"
                    >
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

                </transition-group>

                <!-- TEST -->
                <!-- presences => {{ presences }} 
                <br />initialStatePresences => {{ initialStatePresences }} -->
                <!-- TEST -->
                <v-btn 
                    class="bt_green" depressed block
                    :disabled="disabledRecordButton || disabledForm" 
                    @click="recordPresenceParticipants"
                >
                    Enregistrer
                </v-btn>

            </div>

        </div>
    </div>
</template>

<script>
    import formatageDate from '@/mixins/formatageDate';
    import capitalizeOnEveryWords from '@/filters/capitalizeOnEveryWords';

    export default {
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
                presences: [],
                disabledForm: false,
                initialStatePresences: [],
                disabledRecordButton: true,
                scrollYvalue: 0,
                scrollYvalueforNoOpacity: 120
            }
        },

        computed: {
            // Pas besoin !! Se trouve déjà dans la prop passée en params dans la route !!
            eventParticipants() {
                return this.$store.getters.eventParticipants;
            },
            sentenceNbParticipants() {
                const nbPart = this.eventParticipants.length;
                return nbPart > 0 ? `${nbPart} participant${nbPart > 1 ? "s" : ""} inscrit${nbPart > 1 ? "s" : ""}` : "Pas encore de participants à cette formation";
            },
            nbDaysListParticipantsFormEnable() {
                return this.$store.state.nbDaysListParticipantsFormEnable;
            },
            recordPresenceParticipantsDone() {
                return this.$store.state.recordPresenceParticipantsDone;
            }
        },

        watch: {
            // Permet aux checkboxes d'être cochés ou non au chargement (cas ou appel a déjà eu lieu)
            eventParticipants(val) {
                let partPresents = [];
                const self = this;
                val.forEach(p => {
                    if(typeof p.presence !== "undefined") { // Si propriété 'presence' existe, donc si appel a déjà été fait...
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

                // Affectation var. de comparaison pour déterminer ensuite si bt 'Enregistrer' doit être en disabled ou pas
                this.initialStatePresences.push(...this.presences);
            }
        },

        methods: {
            // Pour animation sur liste de noms sur entrée page
            beforeEnter(el){
                el.style.opacity = 0;
                el.style.transform = "translateX(-50px)";
                el.style.transition = "all 0.10s ease"
            },
            // Pour animation sur liste de noms sur entrée page (suite)
            enter(el) {   //console.log(el.dataset.index); //TEST
                var delay = el.dataset.index * 100;
                setTimeout(() => { el.style.opacity = 1; el.style.transform = "translateX(0)" }, delay);
            },

            // Gestion opacité du bandeau sous le header
            setBandeauOpacity() {
                this.scrollYvalue = window.scrollY;
                let flag = false;
                if(this.scrollYvalue > this.scrollYvalueforNoOpacity) {
                    this.scrollYvalue = this.scrollYvalueforNoOpacity;
                    if(!flag) { this.displayBackgroundColor() }
                    flag = true;
                } else {
                    this.displayBackgroundColor();
                    flag = false;
                }
            },
            quitPage() {
                window.removeEventListener("scroll", this.setBandeauOpacity);
                this.$router.go(-1);
            },


            displayBackgroundColor() {
                let valOpacity = this.scrollYvalue / this.scrollYvalueforNoOpacity;
                document.querySelector(".linkBack").style.backgroundColor = `rgba(255, 255, 255, ${valOpacity})`;
            },

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

                // Comparaison avec sélection des participants à l'arrivée sur la page afin de savoir si on a besoin de soumettre l'enregistrement suite à changement dans sélection ou pas
                this.disabledRecordButton = this.initialStatePresences.sort().toString() === this.presences.sort().toString() ? true : false;
            },
            recordPresenceParticipants() {
                let appel = [];
                // Récupération des données de l'appel
                this.eventParticipants.forEach(p => {
                    appel.push({ 
                        id_user: p.id, 
                        isPresent: this.presences.includes(p.id) 
                    });
                });
                // Enregistrement ds Firestore
                this.$store.dispatch('recordPresenceParticipants', {id_formation: this.event.id_evenement, resultAppel: appel});
            },
            endRecordAppelParticipants() {
                this.$store.commit('SET_RECORD_PRESENCE_PARTICIPANTS', false);
                this.$router.push({ name: 'events_list' });
            }
        },

        async mounted() {
            // Pour gérer l'opacité du bandeau sous le header
            window.addEventListener("scroll", this.setBandeauOpacity);

            // Chargement des participants de la formation
            await this.$store.dispatch('getParticipantsEvenement', this.$route.params.event.id_evenement);
            // Pour rendre ou non les éléments du formulaire modifiables
            this.enableForm();
        }

    }
</script>

<style scoped>
    .linkBack {
        position: fixed;
        z-index: 1;
        width: 100%;
        text-align: right;
        padding: 10px;
        background-color: rgba(255, 255, 255, 0);
        /* box-shadow: 0px 4px 4px #0000001a; */
        /* transition: all 1s ease-in-out; */
    }
    .linkBack a {
        cursor: pointer;
        padding: 3px 10px;
        margin: 10px 8px;
        border-radius: 4px;
        text-decoration: none;
    }
    .linkBack .v-icon {
        margin: 0 7px 0 0;
    }
    .linkBack a,
    .linkBack .v-icon {
        font-size: 0.9em;
        color: rgb(2, 31, 126);
        transition: all 0.4s ease-in-out;
    }
    .linkBack a:hover {
        background-color: #3949AB;
    }
    .linkBack a:hover,
    .linkBack a:hover .v-icon {
        color: #fff;
    }
    .dataFormation {
        font-size: 1.3em;
        text-align: center;
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
        line-height: 1em;
        margin: auto;
    }
    .wrapperListeParticipants {
        margin: 50px 0;
    }
    .bt_green {
        margin: 30px 0 0 0;
    }
    .explication {
        background-color:#4093ff;
        color: #fff;
        margin: 0 0 40px 0;
        padding: 15px 20px;
        font-size: 1em;
        line-height:1.1em;
        display: flex;
        border-radius: 4px;
    }
    .explication > span { 
        flex-basis: 1;
        margin: auto 0;
    }
    .iconeInfo {
        color: #ffffff;
        margin: auto 15px auto 0;
        font-size: 1.3em;
    }
    .NbParticipants {
        text-align: left;
        margin: 20px 0;
        color: #283593;
        border-bottom: dotted 1px #283593;
    }
    .legende,
    .lgnParticipant {
        display: flex;
        align-items: center;
        padding: 10px 20px;
        flex-wrap: wrap;
    }
    .legende {
        color: #575555;
        font-weight: bold;
        font-size: 14px;
    }
    .lgnParticipant {
        font-size: 0.9em;
        background-color: #fff;
        border-radius: 4px;
        margin: 0 0 10px;
        min-height: 3.2em;
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

    .wrapperContentModal {
        padding: 25px;
    }

    /* Pour les écrans/fenetres de navigateur de 600px et moins */
    @media screen and (max-width: 600px) {
        .linkBack .facultatif { display: none; }
        .lgnParticipant { 
            margin: 0;    
        }
        .explication,
        .lgnParticipant,
        .bt_green {
            border-radius: 0; 
        }
        .bt_green {
            height: 50px !important;
        }
        .dataFormation > div {
            flex-direction: column;
        }
        .wrapperListeParticipants {
            padding: 0;
            margin: 50px 0 0 0;
        }
        .explication { margin: 0; }
        .dataFormation .date {
            font-size: 0.8em;
            padding: 3x;
        }
        .NbParticipants {
            border-width: 0;
            text-align: center;
        }
    }
</style>