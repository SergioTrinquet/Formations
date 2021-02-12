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
               Enregistrer
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
                        coordonnees: {
                            x: this.evenement.coordonnees.x,
                            y: this.evenement.coordonnees.y
                        },
                        id_animateurs: this.evenement.animateurs.map(a => a.id)
                    }

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