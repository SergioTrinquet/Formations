<template>
    <v-container fluid>
        <v-row>
            <v-col>
                <h2>liste des évènements</h2>

                <div>
                    <v-card
                        v-for="event in events"
                        v-bind:key="event.id"
                    >
                        <div>{{ event.id }}</div>
                        <div>{{ event.titre }}</div>
                    </v-card>
                </div>
            </v-col>
        </v-row>
    </v-container>
</template>



<script>
    export default {
        computed: {
            events() {
                return this.$store.getters.events;
            }
        },

        mounted() {
            this.$store.dispatch('loadEvenements');
        }
    }
</script>