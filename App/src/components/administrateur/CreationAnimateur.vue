<template>
    <div class="wrapper">
        <v-icon 
            light 
            @click="onClose"
            class="iconCloseModal white"
        >fas fa-times</v-icon>

        <v-form v-model="validForm">
            <v-text-field
                light
                color="primaire"
                v-model="animateur.nom"
                type="text"
                label="Nom"
                class="inputLeft"
            >
            </v-text-field>

            <v-text-field
                light
                color="primaire"
                v-model="animateur.prenom"
                type="text"
                label="Prénom"
                class="inputRight"
            >
            </v-text-field>

            <v-select
                light
                color="primaire"
                v-model="animateur.region"
                :items="regions"
                label="Région"
            >
            </v-select>

            <v-text-field
                light
                color="primaire"
                v-model="animateur.email"
                type="email"
                label="adresse mail"
                :rules="rules.email"
                prepend-icon="fas fa-at"
            >
            </v-text-field>

            <v-text-field
                light
                color="primaire"
                v-model="animateur.password"
                :hint="msgHint"
                :type="switchIcon ? 'text' : 'password'"
                label="Mot de passe"
                :rules="rules.password"
                prepend-icon="fas fa-lock"
                :append-icon="switchIcon ? 'mdi-eye-off' : 'mdi-eye'"
                @click:append="switchIcon = !switchIcon"
            >
            </v-text-field>

            <v-btn
                light
                @click="onValidate"
                :disabled="!validForm"
            >Enregistrer</v-btn>
        </v-form>
    </div>
</template>

<script>
export default {
    data() {
        return {
            animateur: {
                nom: '',
                prenom: '',
                region: '',
                email: '',
                password: ''
            },
            regions: [
                "Auvergne-Rhône-Alpes",
                "Bourgogne-Franche-Comté",
                "Bretagne",
                "Centre-Val de Loire",
                "Corse",
                "Grand Est",
                "Guadeloupe",
                "Guyane",
                "Hauts-de-France",
                "Île-de-France",
                "Martinique",
                "Mayotte",
                "Normandie",
                "Nouvelle-Aquitaine",
                "Occitanie",
                "Pays de la Loire",
                "Provence-Alpes-Côte d'Azur",
                "La Réunion"
            ],
            switchIcon: false,
            validForm: false
        }
    },
    computed: {
        msgHint() { 
            return this.animateur.password === "" ? "6 caractères minimum, sans espaces, contenant au moins un chiffre" : "" 
        },
        rules() {
            return this.$store.state.inputRules;
        }
    },
    methods: {
        onClose() {
            this.$emit('eventClose');
        },
        onValidate() {
            // Enregistrement dans Firebase
            this.$store.dispatch('addAnimateur', this.animateur)
            .then(() => {
                // On ferme l'encart quand le traitement asynchrone d'enregistrement d'un nouvel animateur est terminé
                this.onClose(); 
            });
        }
    }
}
</script>

<style scoped>
.wrapper {
    padding: 25px;
}
</style>