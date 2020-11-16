<template>

    <v-container fluid>

        <!-- <app-errorMsg :message="msgError" v-if="msgError !== null"></app-errorMsg> -->

        <app-modal :display="displayModalWelcome">
            <div>Heureux de vous retrouver {{ currentUser.firstName + " " + currentUser.lastName }}</div>
            <v-btn @click="displayModalWelcome = !displayModalWelcome" depressed>Fermer</v-btn>
        </app-modal>

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
                        ref="formConn"
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
                            <v-spacer></v-spacer> {{ currentUser.role }}
                            <v-btn 
                                class="bt_green" 
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
            validConn: false,
            displayModalWelcome: false
        }
    },
    computed: {
        msgHint() { 
            return this.connection.password === "" ? "6 caractères minimum, sans espaces, contenant au moins un chiffre" : "" 
        },
        currentUser() {
            return this.$store.getters.currentUser;
        },
        /* msgError() {
            return this.$store.state.msgError;
        }, */
        rules() {
            return this.$store.state.inputRules;
        }
    },
    watch: {        
        currentUser(val) {
            // Redirection en fonction du role de l'utilisateur connecté
            let pathName = '';
            if(val.role == 'Participant') {
                pathName = 'events';
            } else if(val.role == 'Animateur') {
                pathName = 'participants_list';
            } else if(val.role == 'Admin') {
                pathName = 'events_list';
            } else {
                this.msgError = "L'intitulé de votre role est erroné : " + val.role;
            }

            if(pathName != '') {
                // Apparition msg bienvenue
                this.displayModalWelcome = true;
                // Redirection au bout de 3 sec
                setTimeout(() => {
                    this.$router.push({ name: pathName });
                }, 3000);
            }
        }
    },
    methods: {
        onValidate() {
            //this.$refs.formConn.validate(); // <= Est-ce utile ou pas ? A tester !!

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