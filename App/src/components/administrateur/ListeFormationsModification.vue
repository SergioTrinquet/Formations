<template>

    <app-modal 
        width="100vw"
        height="90vh"
        cssClass="col-10 offset-1 col-md-8 offset-md-2"
        header="Evènement à modifier"
    >

        <!-- Modal de création d'animateurs -->
        <app-modal 
            :display="displayModalAddAnimateur" 
            width="100vw" 
            cssClass="col-10 offset-1 col-sm-8 offset-sm-2 col-md-6 offset-md-3"
            header="Ajouter un animateur"
            transition="scale"
        >
            <!-- Ici, v-if seulement utile pour différer chargement du fichier 'CreationAnimateur.js' que qd click pour faire apparaitre le modal (car ce composant est asynchrone), sinon pas utile -->
            <CreationAnimateur 
                v-if="displayModalAddAnimateur"
                @eventClose="displayModalAddAnimateur = !displayModalAddAnimateur"
            ></CreationAnimateur>
        </app-modal>


        <!-- Modal qui apparait qd modif effectuée -->
        <app-modal :display="displayModalModifiedEvent">
            <div class="wrapperModalModifiedEvent">
                <div>La formation a été modifié avec succès</div>
                <v-btn @click="endActionModifiedEvent" depressed>Fermer</v-btn>
            </div>
        </app-modal>
        

        <!-- Icone fermeture modal -->
        <v-icon 
            @click="onClose"
            class="iconCloseModal white"
        >fas fa-times</v-icon>


        <!-- Contenu du modal : Formulaire de modif de la formation -->
        <FormulaireFormation 
            :evenement="theEvent" 
            @eventResultValidation="resultValidation($event)"
        >
            <div class="mainModal">

                <!-- Partie Participants => A FAIRE : Chargements des données participants à partir de leurs id (présent dans 'theEvent'), 
                puis possibilité de supprimer ou ajouter un participant (ajout à partir de la liste des participants) -->
                <!-- <div>Modifier les participants:
                    <div v-for="(id_participant, i) in theEvent.id_participants" :key="id_participant" style="text-align: left;">
                        {{ i + " - " + id_participant }}
                    </div>
                </div> -->
                <!---->

                <InputsFormation
                    :evenement="theEvent"
                    @eventDisplayModalAddAnimateur="displayModalAddAnimateur = true"
                />
            </div>
        </FormulaireFormation>      

    </app-modal>
</template>

<script>
    const CreationAnimateur = () => import(/*webpackChunkName: "CreationAnimateur"*/ '@/components/administrateur/CreationAnimateur')
    import FormulaireFormation from '@/components/administrateur/FormulaireFormation'; 
    import InputsFormation from '@/components/administrateur/InputsFormation';

    export default {
        props: {
            theEvent: {
                //type: Object,
                required: true
            }
        },

        components: {
            CreationAnimateur,
            FormulaireFormation,
            InputsFormation
        },

        data() {
            return {
                displayModalAddAnimateur: false
            }
        },

        computed: {
            displayModalModifiedEvent() {
                return this.$store.state.displayModalModifiedEvent;
            }
        },

        methods: {
            onClose() {
                this.$emit('eventClose');
            },
            async resultValidation(ev) {
                //console.log("Résultat validation", ev, this.theEvent.id_evenement); //TEST
                await this.$store.dispatch('modifyEvenement', { id_event: this.theEvent.id_evenement, data_event: ev });
            },
            endActionModifiedEvent() {
                this.$store.commit('SET_DISPLAY_MODAL_EVENT_MODIFIED', false);
                this.onClose();
            }
        }

    }
</script>

<style scoped>
    .mainModal {
        height: calc(90vh - 100px); 
        overflow-y: auto; 
        padding: 26px;
        box-shadow: 0 -13px 9px -9px rgba(0,0,0,0.2) inset;
    }
    .wrapperModalModifiedEvent {
        padding: 22px 25px;
    }
</style>