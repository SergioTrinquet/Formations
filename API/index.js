const express = require('express');
const app = express();
const port = process.env.PORT || 3080;
const bodyParser = require('body-parser');

// Pour communiquer via firebase Admin SDK
var admin = require("firebase-admin");
var serviceAccount = require("./firebase-adminsdk-serviceAccountKey.json"); // Fichier JSON généré dans la console firebase sur le projet en question

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://formations-vue-vuetify.firebaseio.com"
});


// on précise ici qu'on autorise toutes les sources
// puis dans le second header, quels headers http sont acceptés
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});


// Middleware lors des requetes POST
app.use(bodyParser.json()); // Pour parser le json


// Point d'entrée API quand appel coté front (Vue.js)
app.post("/createAnimateur", (req, res) => {
    admin.auth().createUser({
        email: req.body.email,
        emailVerified: false,
        password: req.body.password
        })
    .then((userRecord) => {
        // See the UserRecord reference doc for the contents of userRecord.
        console.log('Création nouveau User:', userRecord.uid);
        res.json({ 'userRecord_uid': userRecord.uid });
    }).catch((error) => {
        console.log('Erreur à la création d\'un nouveau user:', error);
        res.status(error.status || 500).json(error);
    });
});


app.listen(port, () => {
    console.log("J'écoute au port " + port); //TEST
})