<template>
    <v-form v-model="validForm">
        <slot></slot>
        <v-divider light></v-divider>
        <div class="wrapperValidation">
            <v-btn
                @click="onValidate"
                :disabled="!validForm"
                depressed
                class="bt_green ma-2"
                light
            >
                <v-icon small class="mr-2">fas fa-check</v-icon>Enregistrer
            </v-btn>
        </div>
    </v-form>
</template>

<script>
    export default {
        props: {
            evenement: {
                type: Object,
                required: true
            }
        },

        data() {
            return {
                validForm: false
            }
        },

        computed: {
            justAddedAnimateur() {
                return this.$store.state.addedAnimateur;
            }
        },

        watch: {
            // Pour sélectionner dans le select le nouvel animateur venant d'être créé
            justAddedAnimateur(val) {
                console.log("'justAddedAnimateur' dans 'CreationEvenement'", val); //TEST
                this.evenement.id_animateurs.push(val);
            }
        },

        methods: {
            onValidate() {
                if(this.validForm) {
                    const event = {
                        titre: this.evenement.titre,
                        description: this.evenement.description,
                        date: this.evenement.date,
                        heure: this.evenement.heure,
                        adresse: this.evenement.adresse,
                        CP: this.evenement.CP,
                        ville: this.evenement.ville.toUpperCase(),
                        image: this.evenement.image,
                        coordonnees: {
                            x: this.evenement.coordonnees.x,
                            y: this.evenement.coordonnees.y
                        },
                        id_animateurs: this.evenement.animateurs.map(a => a.id)
                    }

                    //console.log(event); //TEST
                    this.$emit('eventResultValidation', event);
                } 
            }
        }
    }
</script>

<style scoped>
    .wrapperValidation {
        text-align: center;
    }
</style>