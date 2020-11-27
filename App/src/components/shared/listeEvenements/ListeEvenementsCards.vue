<template>
    <div class="blocsEvent" v-if="events.length > 0">
        
        <!-- 
        currentUser : {{ currentUser }} <br />
        rangeEvents: {{ rangeEvents }} <br/>
        sortingParameters.type: {{ sortingParameters.type }} - sortingParameters.direction: {{ sortingParameters.direction }}<br/>
        currentUser.role => {{ currentUser.role }}<br />
        -->

        <v-card
            v-for="(event, i) in events" :key="event.id_ev" 
            :class="['blocEvent', isPast(event.date) ? 'obsolete' : '']"
            :data-past="isPast(event.date)"
        >       
            <div class="dateEvent primaire">{{ formatDate(event.date) }}</div>
            
            <app-bandeauInscription 
                v-if="currentUser.role == 'Participant'" 
                :idParticipants="event.id_participants"
            ></app-bandeauInscription>
            
            <div class="headerEvent d-flex">
                <span class="titreEvent flex-grow-1 align-self-center">{{ event.titre | uppercase }}</span>
                <span class="nbParticipants align-self-center">
                    <template v-if="currentUser.role == 'Participant'">
                        <span class="nb placesDispos">{{ nbParticipantsMaxParFormation - event.id_participants.length }}</span><span>place(s) dispo.</span>
                    </template>
                    <template v-else>
                        <span class="nb">{{ event.id_participants.length }}</span><span>participant(s)</span>
                    </template>
                </span>
            </div>
            <div class="mainInfos">
                <div class="description">{{ event.description }}</div>
                <div>image: {{ event.image }}</div>
                <div class="blockData">
                    <div class="map" :id="'map_' + i" :data-x="event.coordonnees.x"  :data-y="event.coordonnees.y"></div>
                    <div class="otherData">
                        <label>Où ?</label>
                        <div>{{ event.adresse }}</div>
                        <div>{{ event.CP }} {{ event.ville | uppercase }}</div>

                        <label>Quand ?</label>
                        <div>Le {{ formatDate(event.date) }} à {{ event.heure }}</div>

                        <label>Animé par qui ?</label>
                        <span class="listeAnimateurs" v-for="(animateur, j) in event.animateurs" :key="animateur.id">
                            {{ listAnim(animateur.prenom, animateur.nom, j) }}
                        </span>
                    </div>
                </div>
            </div>
            <v-divider></v-divider>
            <v-card-actions>
                <v-spacer></v-spacer>
                <component :is="buttonsCard" v-bind="buttonsCardProperties(event)"></component>
            </v-card-actions>
        </v-card>
    </div>
    <div v-else-if="events.length == 0 && eventsLoaded" class="msgNoEvents"><v-icon>far fa-grimace</v-icon>Pas d'évènements, désolé !</div>
</template>

<script>
    import bandeauInscription from '@/components/participants/ListeEvenementsBandeauInscription';
    import cardButtonParticipant from '@/components/participants/ListeEvenementsCardButton';
    import cardButtonsAdmin from '@/components/administrateur/ListeEvenementsCardButtons';
    import cardButtonAnimateur from '@/components/animateurs/ListeEvenementsCardButton';

    import formatageDate from '@/mixins/formatageDate';
    import currentDate from '@/mixins/currentDate';
    import map from '@/mixins/map';
    import dateToInt from '@/mixins/dateToInt';
    
    import uppercase from '@/filters/uppercase.js';

    export default {
        mixins: [
            formatageDate, 
            currentDate, 
            dateToInt, 
            map
        ],

        filters: { uppercase },

        components: {
            'app-bandeauInscription': bandeauInscription
        },

        data() {
            return {
                eventsLoaded: false,
                dateOfTheDay: null,
            }
        },

        computed: {
            currentUser() {
                return this.$store.getters.currentUser;
            },
            nbParticipantsMaxParFormation() {
                return this.$store.state.nbParticipantsMaxParFormation;
            },

            buttonsCard() {
                const role = this.currentUser.role;
                let component = null;
                if(role == 'Participant') {
                    component = cardButtonParticipant;
                } else if(role == 'Admin') {
                    component = cardButtonsAdmin;
                } else if(role == 'Animateur') {
                    component = cardButtonAnimateur;
                }
                return component;
                //return (role == 'Participant' ? cardButtonParticipant : (role == 'Admin' ? cardButtonsAdmin : ''));
            },

            sortingParameters() {
                return this.$store.state.sortingParameters;
            },
            rangeEvents() {
                return this.$store.getters.rangeEvents;
            },

            // Filtres fait dans Firestore (dans le VUEX), mais classement et pagination du coté Front car impossibilité de classer par un champ si le filtrage (via clause '.where')
            // est fait à partir d'un autre champ, d'ou certains cas de figure impossibles à gérer intégralement avec Firestore : c'est la raison pour laquelle la partie 'sorting' puis pagination qui se fait à la fin, dont gérées dans le component et non via Firestore.
            events() {
                if(!this.eventsLoaded) { // Si évènements pas encore chargés dans le hook 'mounted'... 

                    return []; 

                } else { //...Sinon si chargés...
                    let events = this.$store.getters.events;

                    // Partie classements
                    switch(this.sortingParameters.type) {
                        case 'titre' :
                            events = [...events].sort((a, b) => {
                                let a_titre = a.titre.trim().toLowerCase();
                                let b_titre = b.titre.trim().toLowerCase();
                                return a_titre == b_titre ? 0 : (this.sortingParameters.direction == 'asc') ? (a_titre > b_titre ? 1 : -1) : (a_titre < b_titre ? 1 : -1);
                            });
                            break;
                        case 'NbParticipants':
                            events = [...events].sort((a, b) => {
                                // Classé par nbr de participants puis par ordre alpha sur 'titre' qd nbr de participant(s) identique(s)
                                let a_nbParticipants = a.id_participants.length;
                                let b_nbParticipants = b.id_participants.length;
                                if(a_nbParticipants > b_nbParticipants) {
                                    return this.sortingParameters.direction == 'asc' ? 1 : -1;
                                } else if(a_nbParticipants < b_nbParticipants) {
                                    return this.sortingParameters.direction == 'asc' ? -1 : 1;
                                } else if(a_nbParticipants == b_nbParticipants) {
                                    let a_titre = a.titre.trim().toLowerCase();
                                    let b_titre = b.titre.trim().toLowerCase();
                                    return a_titre == b_titre ? 0 : (a_titre > b_titre ? 1 : -1);
                                }
                            });
                            break;
                        case 'date':
                            if(this.sortingParameters.direction == 'desc') {
                                // Classement par ordre antéchronologique
                                events = [...events].sort((a, b) => {
                                    return parseInt(b.date.replace(/-/g, "")) - parseInt(a.date.replace(/-/g, ""));
                                });
                            } 
                            break;
                    }

                    // Partie pagination
                    return events.slice(parseInt(this.rangeEvents.from) - 1, this.rangeEvents.to);
                }
            }
        },

        watch: {
            events(val, oldval) {
                console.log("Dans le watch de 'events'", "nb d'évènements => " + val.length, "Ancien nb d'evenements =>" + oldval.length); //TEST
                // A chaque modif de la data 'events' (au chargement de la page, qd clic sur filtre(s) ou classement(s))...
                this.$nextTick(()=>{    //...on attend la modification du DOM concerné par le changement de la data 'events'...
                    this.initMaps();    //...Pour recharger les maps
                })
            },
        },

        
        methods: {
            listAnim(prenom, nom, i) {
                return (i > 0 ? " - " : "") + prenom + " " + nom;
            },
            initMaps() {
                let maps = document.querySelectorAll('.map');      
                let x, y;
                maps.forEach(m => {
                    x = parseFloat(m.getAttribute("data-x"));
                    y = parseFloat(m.getAttribute("data-y"));
                    this.createMap(m.id, x, y);
                })
            },

            isPast(date) {
                if(this.dateOfTheDay == null) {
                    return false;
                }  else {
                    return (this.dateToInteger(date) < this.dateToInteger(this.dateOfTheDay) ? true : false);
                }
            },

            buttonsCardProperties(ev) {
                const role = this.currentUser.role;
                let props = null;
                switch(role) {
                    case "Participant":
                        props = { 
                            idEvent: ev.id_evenement, 
                            idParticipants: ev.id_participants 
                        };
                        break;
                    case "Admin":
                        props = { 
                            event: ev,
                            isPast: this.isPast(ev.date)
                        };
                        break;
                    case "Animateur":
                        props = { 
                            event: ev
                        };
                        break;
                }
                return props;
            }
        },

        async mounted() {
            this.dateOfTheDay = this.getCurrentDate();

            /* if(this.currentUser.role == "Animateur") {
                await this.$store.dispatch('loadEvenements', this.currentUser.role);
            } else { */
                await this.$store.dispatch('loadEvenements'); // Sans payload, version par defaut qui renvoie les évènements postérieures à la date du jour et classés par date
            /* } */
            this.eventsLoaded = true;
            this.$emit("onEventsLoaded");
        }
    }
</script>

<style scoped>
    .blocEvent {
        margin: 60px 0 0 0;
    }
    .blocEvent.obsolete {
        box-shadow: 0 0 0px 6px rgba(255,0,0,0.5) inset;
    }
    .dateEvent {
        color: #ffffff;
        border-radius: 3px 3px 0 0;
        font-size: 14px;
        font-weight: bold;
        margin: 0 15px 0 0;
        padding: 2px 15px;
        position: absolute;
        margin: -40px 0 0 0;
        letter-spacing: 0.05em;

        margin: -25px 0 0 15px;
    }
    .headerEvent,
    .nbParticipants {
        color: #e84763;
    }
    .headerEvent {
        font-size: 17px;
        padding: 15px 15px 18px 15px;
        border-bottom: dashed 1px #cecece;
    }
    .titreEvent {
        padding: 0 20px 0 0;
        font-size: 20px;
        line-height: 20px;
    }
    .nbParticipants {
        text-align: center;
        padding: 8px;
        line-height: 14px;
        border-radius: 4px;
        background-color: #e8476224;
        border: solid 1px #e84763;
    }
    .nbParticipants .nb {
        font-size: 20px;
        font-weight: bold;
        display: block;
    }
    .nbParticipants  .nb.placesDispos {
        min-width: 70px;
    }
    .nbParticipants span:last-child {
        font-size: 11px;
    }
    .mainInfos {
        padding: 20px 30px;
    }
    .description {
        margin: 0 0 8px 0;
        color: #737373;
        font-size: 15px;
        line-height: 16px;
        text-align: justify;
    }
    .blockData {
        background-color: #f5f5f5;
        padding: 10px;
        border-radius: 8px;
    }

    .listeAnimateurs {
        font-style: italic;
    }
    label {
        color: #e84763;
    }
    .blockData label {
        display: block;
        border-bottom: dotted 3px #fff;
    }

    .map { 
        height: 200px; 
        width: 60%;    
        min-width: 350px;
        display: inline-block;
        z-index: 0;
    }
    .otherData {
        width: 40%;
        display: inline-block;
        vertical-align: top;
        padding: 0 0 0 3%;
        line-height: 18px;
    }
    .otherData label {
        margin: 10px 0 0 0;
    }
    
    .msgNoEvents {
        margin: 35% auto 0 auto;
        border-radius: 3px;
        box-shadow: 0 0 20px rgba(0,0,0,0.15);
        font-size: 19px;
        text-align: center;
        background-color: #ffffff;
        padding: 15px;
        width: 60%;
        color: #5f5f5f;
    }
    .msgNoEvents i { margin: 0 10px 0 0; }
</style>