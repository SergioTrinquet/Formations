<template>
    <div class="signInSignUpWrapper">
        <div class="circle"><v-icon>far fa-user</v-icon></div>
        <div class="content">
            <div>
            <p> Bienvenue dans notre application de Formations/Seminaires.</p>
            <p>Nouveau sur l'appli ? Avant de continuer, inscrivez-vous. Si vous êtes déjà inscrits, connectez-vous!<br/>Bonne expérience.</p>
            </div>
            <button class="bt_green">Inscription</button>
            <div class="delimitation">
               <span>ou</span>
            </div>
            <button>Connection</button>
        </div>
    </div>
</template>

<style scoped>
    .signInSignUpWrapper {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 75%;
        max-width: 500px;
        text-align: center;
        background-color: #fff;
        border-radius: 4px;
        box-shadow: 0px 3px 1px -2px rgba(0, 0, 0, 0.2), 0px 2px 2px 0px rgba(0, 0, 0, 0.14), 0px 1px 5px 0px rgba(0, 0, 0, 0.12);
        overflow-wrap: break-word;
        white-space: normal;
    }
    .circle {
        background-color: #ff00dd;
        padding:2.5em;
        border-radius: 50%;
        position: absolute;
        /* Pour centrer le circle */
        left: 50%;
        transform: translate(-50%, -50%);
    }
    .circle i.v-icon {
        color: #fff;
        font-size: 1.8em;
    }
    .signInSignUpWrapper .content {
        padding: 3em 2em;
    }

    .delimitation {
        border-top: dotted 3px #b0b0b0;
    }
    .delimitation span {
        position: absolute;
        background-color: #ff0000;
        border-radius: 50%;
        width: 35px;
        height: 35px;
        padding: 5px;
        transform: translate(-18px, -18px);
    }
</style>