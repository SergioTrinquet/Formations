<template>

    <v-overlay 
        :value="message !== null && display" 
        opacity="0.75" 
        z-index="11"
    >
        <v-alert 
            type="error" 
            icon="fas fa-exclamation-triangle"
            class="modalAlert"
        >
            <v-icon 
                light 
                @click="display = false"
                class="iconCloseModal white modalError"
            >fas fa-times</v-icon>
            <div class="header">ERREUR</div>
            {{ message }}
        </v-alert>
    </v-overlay>

</template>

<script>
export default {
    props: {
        message: {
            required: true
        }
    },

    watch: {
        message (val) {
            if(val != null) {
                this.display = true;
            }
        }
    },

    data() {
        return {
            display: true
        }
    }
}
</script>

<style scoped>
    .modalAlert {
        max-width: 80vw;
        padding: 16px 40px 16px 16px;
    }
    .header {
        font-weight: bold;
    }
</style>