<template>
    <div class="chbxMesFormations d-flex align-center">
        <input type="checkbox" v-model="myTrainings" @change="emitFilterParam" id="chbx_mesFormations">
        <label for="chbx_mesFormations">{{ label }}</label>
    </div>
</template>

<script>
    export default {
        props: {
            mesFormations: {
                type: Boolean,
                required: true
            },
            label: {
                type: String,
                required: true
            }
        },

        watch: {
            mesFormations(val) {
                this.myTrainings = val;
            }
        },

        data() {
            return {
                myTrainings: false
            }
        },

        methods: {
            emitFilterParam() {
                // emit au composant parent
                this.$emit('emitFilterValue', { origin: 'Participant' , mesFormations: this.myTrainings });
                
                // Indique si filtre activé ou non dans Vuex. Utile quand désinscription d'une formation : Si le filtre est activé, la formation en question ne doit plus apparaitre après désinscription 
                this.$store.commit('setValueFilterMyTrainings', this.myTrainings);
            }
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
        left: 0;
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
        width: 75%;
    }

    /* Aspect de la case */
    [type="checkbox"]:not(:checked) + label:before,
    [type="checkbox"]:checked + label:before {
        content: '';
        position: absolute;
        left: 0;
        top: 0.3em;
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
        top: 1em;
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