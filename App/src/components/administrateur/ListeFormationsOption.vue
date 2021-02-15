<template>
    <div class="d-flex align-center">       
        <input type="checkbox" v-model="pastTrainings" @change="execFilterSelection" id="chbx_anciennesFormations">
        <label for="chbx_anciennesFormations">Afficher les anciennes formations</label>
    </div>
</template>

<script>
    export default {
        computed: {
            pastEvents() {
                return this.$store.getters.getPastEvents;
            },


////////////////////////// AJOUTE LE 21/01/2021 ///////////////////////////////
            selectedDateRange() {
                return this.$store.getters.getSelectedDateRange;
            },
            selectedCities() {
                return this.$store.getters.getSelectedCities;
            },
            
            // Computed pour les paramètres d'initialisation des filtres 'dates' et 'villes'
            initialisationFilters() {
                let paramsFiltersEvenements = this.$store.state.paramsFiltersEvenements;
                return {
                    villes: paramsFiltersEvenements.villes.map(v => v.toUpperCase()), 
                    dates: {
                        min: paramsFiltersEvenements.minDate, 
                        max: paramsFiltersEvenements.maxDate
                    }
                }
            },
/////////////////////////// FIN AJOUT LE 21/01/2021 //////////////////////////////



        },

        watch: {
            pastEvents(val) {
                this.pastTrainings = val;
            },



////////////////////////// AJOUTE LE 21/01/2021 ///////////////////////////////
        // Déclenché qd clic sur 'Anciennes formations'
        initialisationFilters(val, oldVal) {
            console.warn("WATCH => initialisationFilters", val, oldVal); //TEST

            if(Object.keys(oldVal).length > 0 && oldVal.constructor === Object) { // Check si oldVal n'est pas un objet vide (cas à l'arrivée ds la page)
 
                // Actions sur les chips qd cas de figure ou après désélection de 'formations passées', les filtres sélectionnés doivent être corrigés
                // Si 'formations passées' est désactivé...
                if(this.pastEvents == false) {
                    let alertMsg = "";
                    // Ajouté
                    let cities = [];

                    // Filtre 'dates'
                    if(this.selectedDateRange.length > 0) { // Si l'utilisateur a sélectionné une ou des dates dans les filtres...
                        this.selectedDateRange.forEach((d, i) => {
                            if(this.dateToInteger(d) < this.getCurrentDate()) {
                                console.log("La " + i + "eme date "  + d + " est < à date du jour !!!"); // TEST
                                alert("La " + i + "eme date "  + d + " est < à date du jour !!!"); //TEST
                            }
                        });
                        // - Si juste 1 date
                        // Si date 0 < date du jour => On supprime la date 0 (equivaut à suppression du filtre 'dates')
                        // - Si 2 dates
                        // Si date 0 < date du jour ET date 1 > date du jour => On échange date 0 par date du jour ou date de la 1ere formation après date du jour
                        // Si date 0 < date du jour ET date 1 < date du jour => On supprime les 2 dates (equivaut à suppression du filtre 'dates')
                        
                        // donc :
                        
                        const currentDate = this.getCurrentDate();
                        if(this.selectedDateRange.length == 1 && (this.dateToInteger(this.selectedDateRange[0]) < currentDate) || 
                        this.selectedDateRange.length == 2 && (this.dateToInteger(this.selectedDateRange[0]) < currentDate) && (this.dateToInteger(this.selectedDateRange[1]) < currentDate)) {
                           this.selectedDateRange = [];
                           alertMsg = "La suppression de l'affichage des formations passées est incompatible avec la sélection des dates que vous avez entrées pour filtrer les données : Le filtre 'date' est supprimé !";
                        }
                        if(this.selectedDateRange.length == 2 && (this.dateToInteger(this.selectedDateRange[0]) < currentDate) && (this.dateToInteger(this.selectedDateRange[1]) > currentDate)) {
                            this.selectedDateRange[0] = [currentDate.slice(0, 4), "-", currentDate.slice(4, 6), "-", currentDate.slice(6, 8)].join('');
                            alertMsg = "La suppression de l'affichage des formations passées est incompatible avec la sélection des dates que vous avez entrées pour filtrer les données : Le filtre 'date' est modifié, la plage de dates antérieure à aujourd'hui est supprimée !";
                        }
                        console.warn("this.selectedDateRange => ", this.selectedDateRange); //TEST
                    }

                    // Filtre 'villes'
                    if(this.selectedCities.length > 0) { // Si l'utilisateur a sélectionné une ou plusieurs villes dans les filtres...
                        // Ici comparaison des villes entre oldVal et val pour voir différence et isoler les intrus pour les exclure
                        if(oldVal.villes.length > val.villes.length) {
                            // On isole la/les ville(s) qui n'accueillent plus de formations suite au bt 'formations passées' désactivée
                            let villesToDelete = oldVal.villes.filter(v => val.villes.indexOf(v) === -1);
                            cities = this.selectedCities.filter(v => villesToDelete.indexOf(v) === -1);
                            console.log("villesToDelete :", villesToDelete, "Villes qui restent :", cities); //TEST
                            alertMsg += `\nLa suppression de l'affichage des formations passées est incompatible avec certaines villes sélectionnées pour filtrer les données : le(s) filtre(s) ${villesToDelete.join(", ")} a/ont été supprimé(s) !`
                        }
                    }

                    if(alertMsg !== "") { 
                        alert(alertMsg); 
                        
                        // Ajouté
                        this.$store.commit('SET_SELECTED_FILTERS', { 'villes': cities });
                    }

                }
                
            }
        },
////////////////////////// FIN AJOUT LE 21/01/2021 ///////////////////////////////



        },

        data() {
            return {
                pastTrainings: false
            }
        },
        
        methods: {
            async execFilterSelection() {
                // Affectation propriété dans l'objet qui regroupe tous les filtres
                this.$store.commit('SET_SELECTED_FILTERS', { 'pastEvents': this.pastTrainings });

                // Pour recharger les paramètres d'initialisation des filtres 'dates' et 'villes'
                if(this.pastTrainings) {
                    await this.$store.dispatch('paramsFiltreEvenements', { includePastTrainings: true });
                } else {
                    await this.$store.dispatch('paramsFiltreEvenements');
                }
            }
        },
        
        mounted() {
            this.pastTrainings = this.pastEvents;
        }
    }
</script>

<style scoped>
    .chbxMesFormations {
        position: relative;
    }    
    [type="checkbox"]:not(:checked), 
    [type="checkbox"]:checked {
        /* Cache la checkbox sans la rendre invisible aux lecteurs d'écran */
        position: absolute;
        left: -10vw;
        opacity: 0.01;
    }
    /* Preparer le label */
    [type="checkbox"]:not(:checked) + label,
    [type="checkbox"]:checked + label {
        position: relative; /* permet de positionner la checkbox */
        padding-left: 2em; /* place pour la box */
        font-size: 1em;
        line-height: 1;
        cursor: pointer; 
    }

    /* Aspect de la case */
    [type="checkbox"]:not(:checked) + label:before,
    [type="checkbox"]:checked + label:before {
        content: '';
        position: absolute;
        left: 0;
        top: 50%;
        transform: translateY(-0.7em);
        width: 1.3em;
        height: 1.3em;
        border: 2px solid rgb(40, 53, 147);
        background: rgba(40, 53, 147, 0.15);
        border-radius: .2em;
        transition: all .4s;
    }
    /* Aspect de la case cochée */
    [type="checkbox"]:checked + label:before {
        background: rgb(40, 53, 147);
    }

    /* Aspect de la coche */
    [type="checkbox"]:not(:checked) + label:after,
    [type="checkbox"]:checked + label:after {
        display: inline-block;
        font-style: normal;
        font-variant: normal;
        text-rendering: auto;
        -webkit-font-smoothing: antialiased;

        font-family: "Font Awesome 5 Free"; 
        font-weight: 900; 
        content: "\f00c";
        
        color: #fff;
        position: absolute;
        top: 50%;
        transform: translateY(-0.7em);
        left: .18em;
        font-size: 0.95em;
        line-height: 0;
        transition: all .4s;
    }

    /* Aspect de la coche non cochée */
    [type="checkbox"]:not(:checked) + label:after {
        opacity: 0;
        transform: scale(0) rotate(90deg);
    }

    /* Aspect de la coche cochée */
    [type="checkbox"]:checked + label:after {
        opacity: 1;
        transform: scale(1) rotate(0);
    }
</style>