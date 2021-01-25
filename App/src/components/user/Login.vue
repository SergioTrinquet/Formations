<template>
    <v-container fluid>
        <v-row>
            <v-col
                class="col-10 offset-1 
                col-sm-8 offset-sm-2
                col-md-6 offset-md-3"
            >
                <v-card 
                    elevation="2"
                    class="my-10"
                    id="essai_signIn"
                >
                    <v-toolbar flat dense color="secondaire" dark>Connexion</v-toolbar>
                    <v-form 
                        v-model="validConn"
                    >
                        <v-card-text style="width:80%; margin: 0 10%;">
                        
                            <v-text-field
                                v-model="connection.email"
                                type="email"
                                label="adresse mail"
                                :rules="rules.email"
                                prepend-icon="fas fa-at"
                            >
                            </v-text-field>

                            <v-text-field
                                v-model="connection.password"
                                :hint="msgHint"
                                :type="switchIcon ? 'text' : 'password'"
                                label="Mot de passe"
                                :rules="rules.password"
                                prepend-icon="fas fa-lock"
                                :append-icon="switchIcon ? 'mdi-eye-off' : 'mdi-eye'"
                                @click:append="switchIcon = !switchIcon"
                            >
                            </v-text-field>

                        </v-card-text>
                        <v-divider></v-divider>
                        <v-card-actions>
                            <v-spacer></v-spacer>
                            <v-btn 
                                class="bt_green" 
                                depressed
                                :disabled="!validConn"
                                @click="onValidate"
                            ><v-icon class="mr-2 small">fas fa-check</v-icon>Valider</v-btn>
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
        return {
            connection: {
                email: '',
                password: ''
            },
            switchIcon: false,
            validConn: false
        }
    },
    computed: {
        msgHint() { 
            return this.connection.password === "" ? "6 caractères minimum, sans espaces, contenant au moins un chiffre" : "" 
        },
        rules() {
            return this.$store.state.inputRules;
        }
    },

    methods: {
        onValidate() {
            if(this.validConn) {
                // Check si login/passwd existe dans Firebase
                this.$store.dispatch('signIn', this.connection);
            }
        }
    }
}
</script>

<style>
    #essai_signIn .v-icon { font-size: 17px; }
</style>