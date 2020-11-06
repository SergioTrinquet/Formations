<template>
    <v-container>
        <v-row>
            <v-col cols="6" offset="3" class="encart">
                <div class="badPath pa-4"><v-icon class="mr-2">error</v-icon>Oups! La page que vous vouliez afficher n'existe pas.</div>
                <a href="/">Retour à la page d'accueil</a>
            </v-col>
        </v-row>
    </v-container>
</template>

<style scoped>
    .encart {
        background-color: #fff;
        border-radius: 3px;
        padding: 30px;
        margin-top: 30px;
        text-align: center;
    }
    .badPath {
        font-size: 20px;
        color: #585858;
    }
    .encart a {
        display: inline-block;
        background-color: #2ce263;
        border-radius: 3px;
        padding: 5px 20px;
        font-size: 14px;
        color: #fff;
        font-weight: bold;
        text-decoration: none;
        transition: 0.2s all ease-in-out;
    }
    .encart a:hover {
        background-color: #2bc75a;
    }
</style>