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
                let pastEvents = this.$store.state.selectedFilters.pastEvents;
                return typeof pastEvents == 'undefined' ? false : pastEvents;
            }
        },

        watch: {
            pastEvents(val) {
                this.pastTrainings = val;
            }
        },

        data() {
            return {
                pastTrainings: false
            }
        },
        
        methods: {
            async execFilterSelection() {
                // Affectation propriété dans l'objet qui regroupe tous les filtres
                this.$store.commit('setSelectedFilters', { 'pastEvents': this.pastTrainings });

                // Pour recharger les paramètres d'initialisation des filtres 'dates' et 'villes'
                if(this.pastTrainings) {
                    await this.$store.dispatch('paramsFiltreEvenements', { includePastTrainings: true });
                } else {
                    await this.$store.dispatch('paramsFiltreEvenements');
                }
            }
        }
        
        , mounted() {
            console.log("Composant monté !!!!!!!!!!!!!!!!!!!!!! pastEvents : ", this.pastEvents); //TEST
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