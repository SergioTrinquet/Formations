<template>
    <div>
      
        <v-text-field
            v-model="evenement.titre"
            type="text"
            label="Titre"
            :rules="rules.mandatory"
            light
        >
        </v-text-field>

        <v-textarea
            v-model="evenement.description"
            label="Description"
            rows="2"
            :rules="rules.mandatory"
            auto-grow
            row-height="18" 
            light
        >
        </v-textarea>

        <!-- Champ date -->
        <v-dialog
          ref="dialogDate"
          v-model="modalDate"
          :return-value.sync="evenement.date"
          persistent
          width="290px"
        >
          <template v-slot:activator="{ on }">
            <v-text-field
              v-model="formatedDate"
              label="Date de l'évènement"
              readonly
              v-on="on"
              class="inputLeft"
              :rules="rules.mandatory"
              clearable
              light
            ></v-text-field>
          </template>
          <v-date-picker 
            v-model="evenement.date" 
            scrollable 
            first-day-of-week="1"
            color="primaire"
            :min="minDate"
            :max="maxDate"
            :allowed-dates="allButWeekends"
          >
            <v-spacer></v-spacer>
            <v-btn text color="primaire" @click="modalDate = false">Annuler</v-btn>
            <v-btn text color="primaire" @click="$refs.dialogDate.save(evenement.date)">OK</v-btn>
          </v-date-picker>
        </v-dialog>

        <!-- Champ heure -->
        <v-dialog
          ref="dialogHour"
          v-model="modalHour"
          :return-value.sync="evenement.heure"
          persistent
          width="290px"
        >
          <template v-slot:activator="{ on }">
            <v-text-field
              v-model="evenement.heure"
              label="Heure de l'évènement"
              readonly
              v-on="on"
              class="inputRight"
              :rules="rules.mandatory"
              clearable
              light
            ></v-text-field>
          </template>
          <v-time-picker
            v-if="modalHour"
            v-model="evenement.heure"
            format="24hr"
            min="08:00"
            max="19:00"
            scrollable
            color="primaire"
          >
            <v-spacer></v-spacer>
            <v-btn text color="primaire" @click="modalHour = false">Annuler</v-btn>
            <v-btn text color="primaire" @click="$refs.dialogHour.save(evenement.heure)">OK</v-btn>
          </v-time-picker>
        </v-dialog>

        <v-text-field
            v-model="evenement.adresse"
            type="text"
            label="Adresse"
            :rules="rules.mandatory"
            light
        >
        </v-text-field>

        <v-text-field
            v-model="evenement.CP"
            type="text"
            label="Code Postal"
            class="inputLeft"
            :rules="rules.mandatory"
            light
        >
        </v-text-field>
        <v-text-field
            v-model="evenement.ville"
            type="text"
            label="Ville"
            class="inputRight"
            :rules="rules.mandatory"
            light
        >
        </v-text-field>

        <v-text-field
            v-model="evenement.coordonnees.x"
            type="text"
            label="Latitude"
            class="inputLeft"
            :rules="coord_rule_lat"
            light
        >
        </v-text-field>
        <v-text-field
            v-model="evenement.coordonnees.y"
            type="text"
            label="Longitude"
            class="inputRight"
            :rules="coord_rule_long"
            light
        >
        </v-text-field>

        <v-select
            v-model="evenement.animateurs"
            :items="listSelectAnimateurs"
            label="Choix animateur(s)"
            :rules="animateurs_rule"
            multiple
            counter="2"
            item-color="primaire"
            small-chips
            light
            :item-text="e => e.prenom + ' ' + e.nom + ' (' + e.region + ')'"
            item-value="id"
            return-object
        >
        </v-select>

        <div class="wrapSentenceCreateAnimateur">
          Vous ne trouvez pas le bon animateur pour cet évènement ? <a @click="dialogAddAnimateur">Créez le</a> !
        </div>

    </div>
</template>

<script>
import formatageDate from '@/mixins/formatageDate';
import datePickersAllowedDates from '@/mixins/datePickerAllowedDates';

export default {
    props: {
          evenement: {
              type: Object,
              required: true
          }
      },

    mixins: [
      formatageDate, 
      datePickersAllowedDates
    ],

    data() {
        return {
            modalDate: false,
            modalHour: false,

            coord_rule_lat: [
                v => /^-?\d{1,2}[.]{1}\d+$/g.test(v) || "Coordonnée incorrect",
                v => v >= -90 && v <= 90 || "La latitude doit être comprise entre -90° et 90°"
            ],
            coord_rule_long: [
                v => /^-?\d{1,3}[.]{1}\d+$/g.test(v) || "Coordonnée incorrect",
                v => v >= -180 && v <= 180 || "La longitude doit être comprise entre -180° et 180°"
            ]
        }
    },

    computed: {
        formatedDate() {
            return this.formatDate(this.evenement.date);
        },
        minDate() { // Doit-on passer par une computed property ou directement une method ?
            return this.calculMinMaxDate(1);
        },
        maxDate() { // Doit-on passer par une computed property ou directement une method ?
            return this.calculMinMaxDate(365);
        },
        rules() {
            return this.$store.state.inputRules;
        },
        listSelectAnimateurs() {
            return this.$store.getters.getSelectAnimateurs;
        },
        animateurs_rule() {
            const nbAnimateursMax = this.$store.state.nbAnimateursMax;
            return [
                v => v.length > 0 || "Sélectionnez au moins un animateur",
                v => v.length < (nbAnimateursMax + 1) || "Pas plus de " + nbAnimateursMax + " animateurs"
            ]
        }
    },

    methods: {
        calculMinMaxDate(nbJours) {
            const dateToday = new Date().getTime(); // nb de millisec. depuis le 01/01/1970
            let dateMin = new Date().setTime(dateToday + (nbJours * 24 * 3600 * 1000)); // Calcul nb de millisec. depuis le 01/01/1970 moins 'nbJours'
            return new Date(dateMin).toISOString().substr(0, 10); // Retour au format 'aaaa-mm-dd'
        },
        dialogAddAnimateur() {
            this.$emit('eventDisplayModalAddAnimateur', true);
        }
    },

    mounted() {
        this.$store.dispatch('loadAnimateurs');
    }
}
</script>

<style scoped>
  .v-input {
    font-size: 0.95em;
  }
  .v-text-field input { line-height: 15px; } /* N'override pas Vuetify */

  .wrapSentenceCreateAnimateur {
    padding: 10px 0 20px;
  }
</style>