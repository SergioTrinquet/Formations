<template>

    <v-container fluid>
        <v-row>
            <v-col 
                class="col-12 offset-0 
                col-sm-10 offset-sm-1  
                col-md-8 offset-md-2"
            >

                <v-card
                    elevation="2"
                    class="my-10 intro"
                >
                    <v-toolbar flat dense color="primaireLight" dark>Inscription</v-toolbar>
                    <v-form
                        ref="form"
                        v-model="valid"
                    >
                        <v-card-text class="pb-10" style="width:70%; margin: auto auto;">
                            <v-row>
                                <v-col cols="5" class="py-0">
                                    <v-text-field
                                        v-model="inscription.nom"
                                        type="text"
                                        label="Nom"
                                        :rules="rules.mandatory"
                                    >
                                    </v-text-field>
                                </v-col>
                                <v-col cols="2" class="py-0"></v-col>
                                <v-col cols="5" class="py-0">
                                    <v-text-field
                                        v-model="inscription.prenom"
                                        type="text"
                                        label="Prénom"
                                        :rules="rules.mandatory"
                                    >
                                    </v-text-field>
                                </v-col>
                            </v-row>
                            
                            <v-text-field
                                v-model="inscription.profession"
                                type="text"
                                label="Profession"
                                :rules="rules.mandatory"
                            >
                            </v-text-field>
                            
                            <v-text-field
                                v-model="inscription.email"
                                type="email"
                                label="adresse mail"
                                :rules="rules.email"
                            >
                            </v-text-field>

                            <v-text-field
                                v-model="inscription.password"
                                :hint="msgHint"
                                :type="switchIcon1 ? 'text' : 'password'"
                                label="Mot de passe"
                                :rules="rules.password"
                                :append-icon="switchIcon1 ? 'mdi-eye-off' : 'mdi-eye'"
                                @click:append="switchIcon1 = !switchIcon1"
                            >
                            </v-text-field>

                            <v-text-field
                                v-model="inscription.confirmPassword"
                                :type="switchIcon2 ? 'text' : 'password'"
                                label="Confirmez votre mot de passe"
                                :rules="confirmPassword_rule"
                                :append-icon="switchIcon2 ? 'mdi-eye-off' : 'mdi-eye'"
                                @click:append="switchIcon2 = !switchIcon2"
                            >
                            </v-text-field>

                            <!-- <v-text-field v-bind="test_TextField"></v-text-field> -->
                        </v-card-text>
                        <v-divider></v-divider>
                        <v-card-actions>
                            <div class="mx-auto my-1">
                                <v-btn v-on:click="onValidate" :disabled="!valid" class="mr-5 bt_green" depressed>Enregistrer</v-btn>
                                <!-- <v-btn v-on:click="onReset">Réinitialiser</v-btn> -->
                            </div>
                        </v-card-actions>
                    </v-form>
                </v-card>
            </v-col>
        </v-row>
    </v-container>
</template>

<script>
export default {
    data() {
        return  {
            valid: false,
            inscription: {
                nom: '',
                prenom: '',
                profession: '',
                email: '',
                password: '',
                confirmPassword: ''
            },
            confirmPassword_rule: [
                confirmation => !!confirmation.trim() || "Champ obligatoire",
                confirmation => confirmation === this.inscription.password || "Ne correspond pas !!"
            ],
            switchIcon1: false,
            switchIcon2: false

            /* test_TextField: {
                label: 'XXXX',
                type: 'text'
            } */
        }
    },
    computed: {
        currentUser() {
            return this.$store.getters.currentUser;
        },
        msgHint() {
            return this.inscription.password === "" ? "6 caractères minimum, sans espaces, contenant au moins un chiffre" : "";
        },
        rules() {
            return this.$store.state.inputRules;
        }
    },
    methods: {
        onValidate() {
            //this.$refs.form.validate();

            if(this.valid) {
                // Sur saisie : Retrait espaces inutiles et on met tout en minuscules
                const newParticipant = {
                    prenom: this.inscription.prenom.trim().toLowerCase(),
                    nom: this.inscription.nom.trim().toLowerCase(),
                    profession: this.inscription.profession.trim().toLowerCase(),
                    email: this.inscription.email,
                    password: this.inscription.password,
                    confirmPassword: this.inscription.confirmPassword
                };

                this.$store.dispatch('createParticipant', newParticipant); // Inscription dans Firestore
            } else {
                alert('Erreur(s) de saisie');
            }
        },
        /* onReset() {
            this.$refs.form.reset();
        } */
    }
}
</script>


<style scoped>
.intro {
    animation: introInscription 0.6s;
}
@keyframes introInscription {
    0% {
        opacity: 0;
        transform: translateY(100px);
    }
    100% {
        opacity: 1;
        transform: translateY(0);
    }
}
</style>