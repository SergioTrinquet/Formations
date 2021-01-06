import Vue from 'vue'
import Vuex from 'vuex'

import * as firebase from 'firebase/app'
import 'firebase/firestore'
import 'firebase/auth'

import axios from 'axios'


Vue.use(Vuex)

export default new Vuex.Store({
    state:{
        loading: false,
        msgError: null,

        pages: [
            { roles: [null],  routeName: 'accueil', redirection: true },
            { roles: [null], routeName: 'sign_up', btMenu: { icon: 'account_circle', intitule: 'S\'inscrire' } },
            { roles: [null], routeName: 'sign_in', btMenu: { icon: 'lock_open', intitule: 'Se connecter' }    },
            { roles: ['Admin'],  routeName: 'create_event', btMenu: { icon: 'event_note', intitule: 'Créer un évènement' } },
            { roles: ['Admin'],  routeName: 'events_list', btMenu: { icon: 'view_stream', intitule: 'Liste de évènements' } },
            { roles: ['Participant', 'Animateur'],  routeName: 'events_list', redirection: true },
            { roles: ['Animateur'],  routeName: 'participants_list' }
        ],

        currentUser: {
            id_auth: '',
            role: null,
            firstName: '',
            lastName: ''
        },

        /* utilisateurs: [{ id: '', firstName: '', lastName: '', role: '', email: '', password: '', evenements: [], //liste des id evenements }], */
        utilisateurs: [],
        
        animateurs: [], // Tableau destiné à stocker objets aux propriétés 'id' et 'region'

        /* evenements: [{
            id_ev: '', titre: '', description: '', date: '', heure: '', CP: '', adresse: '', image: '', coordonnees: [], // optionnel : Le garde-t-on ?
            id_animateurs: [], //id de(s) (l')animateur(s)
            id_participants: [], //id des participants
            id_createurEvenement: '', // id créateur evenement
        }], */
        evenements: [],
        
        inputRules: {
            mandatory: [v => (v !== null && typeof v !== "undefined" && !!v.trim()) || "Champ obligatoire"],
            email: [v => /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/g.test(v) || "Adresse incorrect"],
            password: [
                v => v.length >= 6 || "6 caractères minimum",
                v => /\d/.test(v) || 'Au moins 1 chiffre !',
                v => /^[\S]+$/g.test(v) || 'Les espaces ne sont pas autorisés !'
            ]
        },
        closeModalAnimateur: false,
        selectAnimateurs: [],
        addedAnimateur: null,
        displayModalRecordedEvent: false,
        displayModalModifiedEvent: false,
        paramsFiltersEvenements: {},
        nbEventsPerPage: 5,
        nbEventsFiltered: 0,
        nbAnimateursMax: 2,
        nbParticipantsMaxParFormation: 30,
        selectedPage: 1,
        sortingParameters: {type: 'date', direction: 'asc'},
        eventToModify: null,
        flagEventDeleted: false,
        eventParticipants: [],
        nbDaysListParticipantsFormEnable: 3,
        filterMyTrainings: false,

        participantsPresenceRecordDone: false, // EN COURS

        displayModalDatePicker: false, // Ajouté le 28/12/2020
        displayModalCitiesList: false, // Ajouté le 28/12/2020
        selectedFilters: {}, // Ajouté le 28/12/2020
        dateRangeText: "", // Ajouté le 31/12/2020
        initPagination: false, // Ajouté le 30/12/2020
        initDatePickerDates: false, // Ajouté le 04/01/2021

        FF_currentUser: 'Vide' //TEST
    },



    mutations: {
        /* setLoadedUtilisateurs(state, payload) {
            state.utilisateurs = payload;
        }, */

        // Appelé dans pages création et modification évènement pour alimenter liste déroulante des animateurs
        setLoadedAnimateurs(state, payload) {
            state.selectAnimateurs = payload;
        },

        setLoadedEvenements(state, payload) {
            state.evenements = payload;
        },
        setInitPagination(state, payload) {
            state.initPagination = payload;
        },

        // Appelé lors création nouvel évènement par Administrateur : VRAIMENT UTILE ??
        /* addEvenement(state, payload) {
            state.evenements.push(payload);
        }, */

        deleteEvent(state, payload) {
            state.evenements = state.evenements.filter(v => v.id_evenement != payload);
        },
        setFlagEventDeleted(state, payload) {
            state.flagEventDeleted = payload;
        },

        setDisplayModalRecordedEvent(state, payload) {
            state.displayModalRecordedEvent = payload;
        },

        setDisplayModalModifiedEvent(state, payload) {
            state.displayModalModifiedEvent = payload;
        },

        addAnimateur(state, payload) {
            // Ici recup de l'objet venant de 'addAnimateur' dans 'actions' et partage de ses propriétés 
            // que l'on dispatche dans les 2 objets 'utilisateurs' et 'animateurs'
            const user = {
                id: payload.id_auth,
                firstName: payload.firstName,
                lastName: payload.lastName,
                role: payload.role,
                email: payload.email,
                password: payload.password,
                evenements: [] // Pas encore d'évènements
            };
            const animateur = {
                id: payload.id_utilisateur,
                profession: payload.region
            };
            //console.log("mutation 1 : " + JSON.stringify(user)); console.log("mutation 2 : " + JSON.stringify(participant)); //TEST
            
            state.utilisateurs.push(user);
            state.animateurs.push(animateur); // Pas rempli initialement => A CORRIGER

            state.selectAnimateurs.push({ id: animateur.id, nom: user.lastName, prenom: user.firstName });
            state.addedAnimateur = animateur.id;
            state.closeModalAnimateur = true;
        },

        fillDataCurrentUser(state, payload) {  console.log("fillDataCurrentUser => ", payload); //TEST
            state.currentUser = {
                id_user: payload.id_user,
                id_auth: payload.data.id_auth,
                role: payload.data.role,
                firstName: payload.data.firstName,
                lastName: payload.data.lastName
            }
        },

        signOut(state) {
            state.currentUser = {
                id_auth: '',
                role: null,
                firstName: '',
                lastName: ''
            }
        },
        setLoading(state, payload) {
            state.loading = payload;
        },
        setMessageError(state, payload) {
            state.msgError = payload;
        },
        setCloseModalAnimateur(state, payload) {
            state.closeModalAnimateur = payload;
        },
        setParamsFiltersEvenements(state, payload) {
            state.paramsFiltersEvenements = payload;
        },
        /* setNbEventsFiltered(state, payload) {
            state.nbEventsFiltered = payload;
        }, */
        setSelectedPage(state, payload) {
            state.selectedPage = payload;
        },
        setSortingParameters(state, payload) {
            state.sortingParameters = payload;
        },
        setEventNumParticipants(state, payload) {
            const idx = state.evenements.findIndex(e => e.id_evenement == payload.id_ev);
            state.evenements[idx].id_participants = payload.eventParticipants;
        },
        setEventToModify(state, payload) {
            state.eventToModify = payload;
        },

        setValueFilterMyTrainings(state, payload) {
            state.filterMyTrainings = payload
        },

        setParticipantsListOfAnEvent(state, payload) {
            let participantsList = [];
            payload.forEach(p => {
                //console.log("p.data.presence", p.id + " " + p.data.lastName, p.presence); //TEST
                participantsList.push({
                    id: p.id,
                    email: p.data.email, 
                    firstName: p.data.firstName, 
                    lastName: p.data.lastName,
                    profession: p.data.profession,
                    presence: p.data.presence
                })
            });
            state.eventParticipants = participantsList;
        },

        setParticipantsPresenceRecord(state, payload) {
            state.participantsPresenceRecordDone = payload;
        },

        // Ajouté le 28/12/2020
        setDisplayModalDatePicker(state, payload) {
            state.displayModalDatePicker = payload;
        },
        setDisplayModalCitiesList(state, payload) {
            state.displayModalCitiesList = payload;
        },
        setDateRangeText(state, payload) {
            state.dateRangeText = payload;
        },
        setSelectedFilters(state, payload) {    //console.log(payload); //TEST
            // Quand personne loguée est un Administrateur
            if("pastEvents" in payload) {
                if(payload.pastEvents) {
                    state.selectedFilters = Object.assign({}, state.selectedFilters, { pastEvents: payload.pastEvents });
                } else {
                    const selectedFilters = Object.assign({}, state.selectedFilters);
                    delete selectedFilters.pastEvents;
                    state.selectedFilters = selectedFilters;
                }
            }

            // Quand personne loguée est un Participant
            if("mesFormations" in payload) {  // Vérification si key 'mesFormations' existe...
                if(payload.mesFormations) {
                    state.selectedFilters = Object.assign({}, state.selectedFilters, { mesFormations: true });
                } else {
                    const selectedFilters = Object.assign({}, state.selectedFilters);
                    delete selectedFilters.mesFormations;
                    state.selectedFilters = selectedFilters;
                }
            }

            // Peu importe le profil de la personne loguée
            if("dateRange" in payload) { 
                if(payload.dateRange.length > 0) {
                    //state.selectedFilters.dates = payload.dateRange; // <= NON, pas de reactivité qd mise à jour tableau de cette façon !!!
                    state.selectedFilters = Object.assign({}, state.selectedFilters, { dates: payload.dateRange });
                } else {
                    const selectedFilters = Object.assign({}, state.selectedFilters);
                    delete selectedFilters.dates;
                    state.selectedFilters = selectedFilters;
                }
            }

            if("villes" in payload) { 
                if(payload.villes.length > 0) {
                    state.selectedFilters = Object.assign({}, state.selectedFilters, { villes: payload.villes });
                } else {
                    const selectedFilters = Object.assign({}, state.selectedFilters);
                    delete selectedFilters.villes;
                    state.selectedFilters = selectedFilters;
                }
            }
        },
        setInitDatePickerDates(state, payload) {
            state.initDatePickerDates = payload;
        },



        // TEST
        FF_currentUser(state, payload) {
            state.FF_currentUser = payload;
        }
        // FIN TEST
    },
    


    actions: {
        // On alimente le currentUser
        setCurrentUser({commit}, payload) { 
            commit('setLoading', true);
            commit('setMessageError', null);

            console.warn("action 'setCurrentUser' => ", payload); //TEST

            const db = firebase.firestore();
            db.collection('utilisateurs')
            .where("id_auth", "==", payload)
            .get()
            .then((querySnapshot) => {
                querySnapshot.forEach((doc) => {    console.log(doc.id); //TEST
                    commit('fillDataCurrentUser', { data: doc.data(), id_user: doc.id });
                });
            })
            .catch((err) => { 
                console.error("Erreur lors de la récupération du currentUser", err);
                commit('setMessageError', err.message); 
            })
            .finally(() => { commit('setLoading', false) });
        },

        
        // PAS UTILISE ACTUELLEMENT : Au chargement du site, récupération des utilisateurs 
        /* loadUtilisateurs({commit}) {
            commit('setLoading', true);
            commit('setMessageError', null);

            firebase.firestore().collection("utilisateurs").get()
            .then((querySnapshot) => {
                let utilisateurs = [];
                querySnapshot.forEach((doc) => {
                    utilisateurs.push(doc.data());
                });
                commit('setLoadedUtilisateurs', utilisateurs);
            })
            .catch((err) => { 
                console.error("Echec du chargement de la liste des utilisateurs !", err);
                commit('setMessageError', err.message); 
            })
            .finally(() => { commit('setLoading', false) });
        }, */

        // Inscription : Ajout participant
        addParticipant({commit}, payload) {
            // Quand User créé dans Firebase, Id créé et renvoyé dans la promesse
            commit('setLoading', true);
            commit('setMessageError', null);

            firebase.auth().createUserWithEmailAndPassword(payload.email, payload.password)
            .then(u => {
                const newParticipant = {
                    id_auth: u.user.uid,
                    firstName: payload.prenom,
                    lastName: payload.nom,
                    role: 'Participant',
                    email: payload.email,
                    password: payload.password,
                    profession: payload.profession
                }

                // Ici ajout des autres propriétés que que email et password dans outil
                const db = firebase.firestore();
                db.collection('utilisateurs')
                .add({
                    ...newParticipant,
                    evenements: [],
                    presence: []
                })
                .then(docRef => {
                    commit('fillDataCurrentUser', { data: newParticipant, id_user: docRef.id }); // Mise à jour données utilisateur en cours
                })
                .catch(error => { throw error });

            })
            .catch(error => {
                console.error("Code d'erreur : " + error.code + " | Message d'erreur : " + error.message); //TEST
                let errMsg = "";
                if(error.code == "auth/email-already-in-use") {
                    errMsg = "Cette adresse e-mail est déjà utilisée par un autre compte.";
                } else {
                    errMsg = error.message;
                }
                commit('setMessageError', errMsg);
            })
            .finally(() => {
                commit('setLoading', false);
            });
            
        },

        // Connexion utilisateur (participant, animateur ou admin via email/password)
        signIn({commit}, payload) {
            commit('setLoading', true);
            commit('setMessageError', null);

            firebase.auth().signInWithEmailAndPassword(payload.email, payload.password)
            .then((u) => {
                // Recherche des données utilisateurs à partir de 'user.uid' pour pouvoir alimenter le currentUser via la fonction de mutation 'fillDataCurrentUser'
                const db = firebase.firestore();
                db.collection('utilisateurs')
                .where("id_auth", "==", u.user.uid)
                .get()
                .then((querySnapshot) => {
                    querySnapshot.forEach(function (doc) {
                        console.log('signIn', doc.id, ' => ', doc.data()); //TEST
                        commit('fillDataCurrentUser', { data: doc.data(), id_user: doc.id });
                    });
                });
            })
            .catch((error) => {
                console.error("Code d'erreur : " + error.code + " | Message d'erreur : " + error.message); //TEST
                let msgError = "";
                if(error.code == "auth/user-not-found") {
                    msgError = "Il n'y a pas d'utilisateur enregistré avec cette adresse mail. Cet utilisateur a peu être été supprimé.";
                } else if(error.code == "auth/wrong-password") {
                    msgError = "Le mot de passe est incorrect !";
                } else {
                    msgError = error.message;
                }
                commit('setMessageError', msgError);
             })
             .finally(() => {
                commit('setLoading', false);
             });
        },

        // Déconnexion
        signOut({commit}) {
            commit('setLoading', true);
            commit('setMessageError', null);

            firebase.auth().signOut()
            .then(function() {
                commit('signOut');
            }).catch(function(error) {
                commit('setMessageError', error.message);
            }).finally(() => {
                commit('setLoading', false);
            });
        },


        // Pour alimentation liste déroulante dans form. de création d'Animateur
        loadAnimateurs({commit}) {
            commit('setLoading', true);
            commit('setMessageError', null);

            const db = firebase.firestore();
            db.collection('utilisateurs')
            .where("role", "==", "Animateur")
            .get()
            .then((querySnapshot) => {
                const animateurs = [];
                querySnapshot.forEach(doc => {
                    animateurs.push({
                        id: doc.id,
                        nom: doc.data().lastName,
                        prenom: doc.data().firstName
                    });

                });
                commit('setLoadedAnimateurs', animateurs);
            })
            .catch((err) => {
                console.error("Erreur dans 'loaAnimateurs'", err);
                commit('setMessageError', err.message); 
            })
            .finally(() => { commit('setLoading', false) });
        },


        // Profil Administrateur exclusivement : Création d'un Animateur
        addAnimateur({state, commit}, payload) {
            commit('setLoading', true);
            commit('setMessageError', null);

            const newAnimateur = {
                firstName: payload.prenom,
                lastName: payload.nom,
                role: 'Animateur',
                email: payload.email,
                password: payload.password,
                evenements: []
            }

            // Check si demande vient bien d'Administrateur (donc si c'est Administrateur qui est logué)         
            if(state.currentUser.role == "Admin") {

                // Appel coté serveur pour création d'utilisateur sans se connecter (et changer) via admin SDK car impossible coté client
                // Ici, contrairement aux autres mutations, 'return' pour chaque appel asynchrone car on veut retourner une promesse dans la vue qui appelle cette mutation afin d'appeler un traitement quand ts ces appels asynchrones sont terminés
                // Path commençant ici par '^/api' est interprété par le proxy dans fichier 'vue.config.js' pour pointer vers serveur de dev. Node.js
                return axios.post('/api/createAnimateur', {
                        email: newAnimateur.email,
                        password: newAnimateur.password
                    }
                ).then((json) => {
                    
                    const db = firebase.firestore();
                    return db.collection('utilisateurs').add({ ...newAnimateur, id_auth: json.data.userRecord_uid })
                    .then((docRef) => { 
                        //console.log("Document écrit dans collection 'utilisateurs' avec l'ID: ", docRef.id); //TEST                           
                        return db.collection('animateurs').add({ id_utilisateur: docRef.id, region: payload.region })
                        .then(() => {
                            //console.log("Document écrit dans collection 'animateurs' avec l'ID: ", docRef.id); //TEST                       
                            commit('addAnimateur', { ...newAnimateur, id_utilisateur: docRef.id, region: payload.region });
                        })
                        .catch((error) => { 
                            console.error("Error adding document dans collection 'animateurs' : ", error);
                            throw error;
                        });
                    })
                    .catch((error) => {
                        console.error("Error adding document dans collection 'utilisateurs' : ", error);
                        throw error;
                    });
                    
                })
                .catch((error) => {
                    // >>> IMPORTANT ! <<< : Si Animateur déjà créé, soulève une erreur mais Vue CLI (et webpack en particuliers) au lieu de renvoyer l'intitulé exact de l'erreur provenant de NOde.js, renvoie un message d'erreur générique qui est trop vague => Voir comment remédier à cela
                    console.error("==> ", JSON.stringify(error)); //TEST
                    console.error("Code d'erreur : " + error.code + " | Message d'erreur : " + error.message); //TEST
                    commit('setMessageError', error.message);
                }).finally(() => {
                    commit('setLoading', false);
                });

            } else {
                commit('setMessageError', "Vous n'avez pas les droits pour ajouter un animateur");
                commit('setLoading', false);
            }
            
        },
        
        
        // Pour obtenir les infos nécessaires aux paramétrages des filtres dans page de liste des évènements
        async paramsFiltreEvenements({state, commit}, payload = null) {
            commit('setLoading', true);
            commit('setMessageError', null);

            const db = firebase.firestore();

            console.log("payload dans 'paramsFiltreEvenements'", payload); //TEST

            // A FACTORISER CAR EST DEJA UTILISE CI-DESSOUS !!!
            const today = new Date();
            const month = (today.getMonth()+1).toString();
            const day = today.getDate().toString();
            const currentDate = today.getFullYear().toString() + "-" + (month.length == 1 ? ("0" + month) : month) + "-" + (day.length == 1 ? ("0" + day) : day);           
            //

            let collectionEvenements = db.collection('evenements');
            if(payload == null) { // Sélection et classement des évènements par défaut. En revanche qd "includePastTrainings" in payload, on affiche ttes les formations sans restriction de dates
                collectionEvenements = collectionEvenements.where("date" , ">=", currentDate);
            }
            collectionEvenements = collectionEvenements.orderBy("date");
            
            // Si personne loguée a un profil 'Animateur', ne doit voir dans filtres que les villes et les dates de ses réunions
            let evenementsAnimateur = null; // Pour stocker ses évènements lorsque profil 'Animateur'
            if(state.currentUser.role == "Animateur") {
                evenementsAnimateur = await db.collection('utilisateurs')
                .doc(state.currentUser.id_user)
                .get()
                .then(querySnapshot => querySnapshot.data().evenements)
                .catch(err => { 
                    commit('setLoading', false);
                    console.error("Erreur lors de la récupération des paramètres de filtres (cas de profil 'Animateur')", err);
                    commit('setMessageError', "Etape de récupération des paramètres de filtres (cas de profil 'Animateur') : " + err.message); 
                });
            }

            
            return collectionEvenements
            .get()
            .then((querySnapshot) => {
                // Partie filtrage qd profil Animateur
                let docs = querySnapshot.docs;   
                if(evenementsAnimateur !== null) {
                    docs = docs.filter(d => evenementsAnimateur.includes(d.id));
                } 

                let allCities =  [];
                let allDates = [];
                docs.forEach((doc) => {
                    allDates.push(doc.data().date); // Propriété de l'objet stocké ds Firestore
                    allCities.push(doc.data().ville); // Propriété de l'objet stocké ds Firestore
                });

                // Suppression des doublons ds chacun des tableaux
                allDates = [...allDates].filter((date, i, self) => self.indexOf(date) == i);
                allCities = [...allCities].filter((city, i, self) => self.indexOf(city) == i).sort();

                commit('setParamsFiltersEvenements', { villes: allCities, minDate: allDates[0], maxDate: allDates[allDates.length - 1] });
            })
            .catch((err) => { 
                console.error("Erreur lors de la récupération des paramètres de filtres", err);
                commit('setMessageError', err.message); 
            })
            .finally(() => { commit('setLoading', false) });
        },


        // Profil Administrateur et Participant : Chargement de la liste des évènements
        /* async loadEvenements({state, commit}, payload = null) { */ // Mis en comm. le 05/01/2021
        async loadEvenements({state, commit}, payload) { // Ajouté le 05/01/2021
            commit('setLoading', true);
            commit('setMessageError', null);

            // Récupération date du jour
            const today = new Date();
            const month = (today.getMonth()+1).toString();
            const day = today.getDate().toString();
            const currentDate = today.getFullYear().toString() + "-" + (month.length == 1 ? ("0" + month) : month) + "-" + (day.length == 1 ? ("0" + day) : day);           
            
            const db = firebase.firestore();
            let collectionEvenements = db.collection('evenements');
            let collectionUtilisateurs = db.collection('utilisateurs');
            let evenementsParticipantOuAnimateur = null; // Utilisé lorsque profil 'participant' ou animateur'
                
            console.log(">>>>>>===== payload dans 'loadEvenements =====<<<<<<", payload); //TEST
            //for(var prop in payload) { console.log("Propriété de payload", prop); } //TEST
            
            // Ici par défaut, les évènements doivent être ceux après la date du jour et classés par date.
            // Si des paramètres de filtres sont passés, ils prendront la place de ceux par défaut
            /* if(payload == null) { 
                // Sélection et classement des évènements par défaut (qd arrivée sur la page ou quand aucun filtre et aucun tri)
                collectionEvenements = collectionEvenements.where("date" , ">=", currentDate).orderBy("date");
            } else { */  // Mis en comm. le 05/01/2021

                // Si pas de filtre sur date(s) et pas affichage des évènements antérieurs à la date du jour
                if(!("dates" in payload) && !("pastEvents" in payload)) {
                    //console.log("payload n'a pas la propriété 'dates' ni de propriété 'pastEvents'"); //TEST
                    collectionEvenements = collectionEvenements.where("date" , ">=", currentDate);
                }

                if("dates" in payload) {
                    // Check si tableau de dates a une date...
                    if(payload.dates.length == 1) {
                        collectionEvenements = collectionEvenements.where("date" , "==", payload.dates[0]);
                    } else { //... ou deux
                        for(let i=0; i < payload.dates.length; i++) {
                            collectionEvenements = collectionEvenements.where("date" , (i == 0 ? ">=" : "<="), payload.dates[i]);
                        }
                    }
                }
                
                if("villes" in payload) {
                    // TODO: Checker si 'in' avec une seule ville fonctionne! Sinon faire une condition avec "==" si 1 ville et 'in' si plusieurs
                    collectionEvenements = collectionEvenements.where('ville' , 'in', payload.villes);
                }

                collectionEvenements = collectionEvenements.orderBy("date");
                
            /* } */ // Mis en comm. le 05/01/2021
            

            
            // lorsque profil 'Participant' ou 'Animateur'
            if((payload !== null && "mesFormations" in payload) || (state.currentUser.role == "Animateur")) {
                // Récupération tableau listant les id_evenements au(x)quel(s) le participant est inscrit
                evenementsParticipantOuAnimateur = await collectionUtilisateurs
                .doc(state.currentUser.id_user)
                .get()
                .then(querySnapshot => querySnapshot.data().evenements)
                .catch(err => { 
                    commit('setLoading', false);
                    console.error("Erreur lors de la récupération des évènements du participant/de l'animateur", err);
                    commit('setMessageError', "Etape de récupération des évènements " + ("mesFormations" in payload ? "du participant" : ("profil" in payload && payload.profil == state.currentUser.role ? "de l'animateur" : "")) + " : " + err.message); 
                });

                console.log("evenementsParticipantOuAnimateur =>", evenementsParticipantOuAnimateur); //TEST
                // Ici problème car pas possible de rajouter la close 'where' suivante à cause de restrictions liées à Firestore. On est obligé de filtrer après avoir récupérer les data via code JS plus bas
                //collectionEvenements = collectionEvenements.where(firebase.firestore.FieldPath.documentId(), "in", evenementsParticipantOuAnimateur).orderBy(firebase.firestore.FieldPath.documentId());
            }



            // Récupération liste des évènements et du/des animateurs de chacun de ces évènements
            return collectionEvenements
            .get()
            .then(querySnapshot => {

                // Partie filtrage qd participant ne veut afficher que ses formations ou bien Animateur ne voit que les formations qu'il doit animer au chargement de la page de liste des formations
                let docs = querySnapshot.docs;   
                if(evenementsParticipantOuAnimateur !== null) {
                    docs = docs.filter(d => evenementsParticipantOuAnimateur.includes(d.id));
                }

                // Pour communiquer le nb d'évènements après filtre(s) mais avant pagination : Sert au calcul du nb de pages notamment
                //commit('setNbEventsFiltered', docs.length);

                ///// Partie Pagination /////
                /* var artPerPg = state.nbEventsPerPage;
                var numPg = (payload !== null && "numPage" in payload ? payload.numPage : 1);
                var from = artPerPg * (numPg - 1);
                var lastVisible = docs[parseInt(from)]; //console.log("lastVisible", lastVisible.data()); //TEST
                collectionEvenements.startAt(lastVisible).limit(artPerPg).get().then(querySnapshot => { */
                ///// FIN Partie Pagination /////

                let events = [];
                docs.forEach(doc => {

                    // Pour retrouver les noms des animateurs de l'évènement
                    let event_animateur = doc.data().id_animateurs;
                    // "firebase.firestore.FieldPath.documentId()" correspond à l'ID des éléments de la collection 'utilisateurs'
                    let listeAnimateurs = [];
                    collectionUtilisateurs
                    .where(firebase.firestore.FieldPath.documentId(), 'in', event_animateur)
                    .get()
                    .then(querySnapshot => {
                        querySnapshot.forEach((doc) => { 
                            listeAnimateurs.push({
                                "id": doc.id,
                                "prenom": doc.data().firstName,
                                "nom": doc.data().lastName
                            });
                        })
                    })
                    .catch((error) => { 
                        console.error("Erreur dans l'étape pour retrouver les noms des animateurs de l'évènement", error);
                        throw error;
                    });

                    let data = doc.data();
                    events.push({
                        "id_evenement": doc.id,
                        "id_participants":data.id_participants,
                        "heure":data.heure,
                        "id_createurEvenement": data.id_createurEvenement,
                        "animateurs": listeAnimateurs,
                        "titre": data.titre,
                        "coordonnees":{"y": data.coordonnees.y,"x": data.coordonnees.x},
                        "image": data.image,
                        "CP": data.CP,
                        "date": data.date,
                        "adresse": data.adresse,
                        "ville": data.ville,
                        "description": data.description
                    });

                });
                
                commit('setLoadedEvenements', events);

                /////// ICI FAIRE LE orderBy et la pagination !! ///////
                /* }); */
                /////// FIN :  orderBy et la pagination !! ///////

            })
            .catch(err => { 
                console.error("Erreur lors de la récupération des évènements", err);
                commit('setMessageError', err.message); 
            })
            .finally(() => { commit('setLoading', false) });
        },



        // Profil Administrateur exclusivement : Ajout évènement
        addEvenement({state, commit}, payload) {
            commit('setLoading', true);
            commit('setMessageError', null);

            const newEvenement = {
                ...payload,
                id_createurEvenement: state.currentUser.id_auth,
                id_participants: []
            };

            const db = firebase.firestore();
            db.collection('evenements')
            .add(newEvenement)
            .then((docRef) => {
                console.log(docRef.id); //TEST
                //commit('addEvenement', { ...newEvenement, id_ev: docRef.id });
                
                // Ajout id évènement à l'Animateur ou aux Animateurs s'ils sont plusieurs
                const collectionUtilisateurs = db.collection('utilisateurs');
                payload.id_animateurs.forEach(id_a => { // Boucle car potentiellement plusieurs animateurs à mettre à jour
                    console.log("id animateur", id_a); //TEST
                    collectionUtilisateurs
                    .doc(id_a) // On pointe sur le bon Animateur
                    .update({ evenements: firebase.firestore.FieldValue.arrayUnion(docRef.id) }) // On ajoute l'id de l'evenement au tableau d'id de la propriété 'evenements'
                    .then(() => { 
                        //console.log("Animateur " + id_a + " mis à jour avec la donnée ", docRef.id); //TEST 
                        commit('setDisplayModalRecordedEvent', true);
                    })
                    .catch(error => { 
                        console.error(`Erreur lors de l'update dans collection 'utilisateurs' (phase d'ajout de l'id evenement au tableau d'id de la propriété 'evenements' pour l'animateur '${id_a}')`, error);
                        throw error; 
                    });
                });

                // Si pas d'animateurs pour l'évènement créé : Erreur
                if(payload.id_animateurs.length == 0) {
                    throw new Error(`L'évènement '${docRef.id}' que vous venez de créer n'a pas d'animateur(s) affecté(s).`);
                }
            })
            .catch(error => { commit('setMessageError', error.message) })
            .finally(() => { commit('setLoading', false) });
        },


        // Profil Participants : Inscription à une formation
        registerEvent({ state, commit }, payload) {
            // Dans collection 'evenements', ajout de l'id utilisateur (payload.id_user) dans la propriété 'id_participants' en vérifiant que l'id ne s'y trouve pas déjà (=> utilisateur déjà inscrit)
            // Dans collection 'utilisateur', ajout de l'id evenement (payload.id_event) dans propriété 'evenements' (en vérifiant que l'id evenement ne s'y trouve pas déjà)
            commit('setLoading', true);
            commit('setMessageError', null);

            const db = firebase.firestore();
            const collectionEvenements = db.collection('evenements');
            const collectionUtilisateurs = db.collection('utilisateurs');
            const eventToModify = collectionEvenements.doc(payload.id_event);

            return db.runTransaction(transaction => {
                // This code may get re-run multiple times if there are conflicts.
                return transaction.get(eventToModify).then(async querySnapshot => {
                    if (!querySnapshot.exists) { throw "L'évènement à modifier n'existe pas ou plus."; }

                    let event = querySnapshot.data();

                    // Retrait/ajout id de l'evenement dans propriété 'evenements' de la collection 'utilisateurs'
                    await collectionUtilisateurs
                    .doc(payload.id_user)
                    .get()
                    .then(querySnapshot => {
                        console.log("data utilisateur =>", querySnapshot.data()); //TEST
                        let participant = querySnapshot.data();
                        let evenementsParticipant = participant.evenements;
                        if(payload.registry) { // Si demande d'inscription de la part du participant...
                            evenementsParticipant.push(payload.id_event);
                        } else { // ...Sinon si demande de désinscription
                            evenementsParticipant.splice(evenementsParticipant.indexOf(payload.id_event), 1);
                        }
                        console.log("evenementsParticipant", evenementsParticipant); //TEST

                        // Update prop 'evenements' de la collection 'utilisateurs'
                        transaction.update(collectionUtilisateurs.doc(payload.id_user), { evenements: evenementsParticipant });
                    })
                    .catch(error => { throw error });

                    ////// NOTE DU 15/12/2020 //////
                    /* //Pour remplacer code plus haut, essayer de faire quelque chose du genre:
                    transaction.update(collectionUtilisateurs.doc(payload.id_user), { evenements: (
                        payload.registry ? 
                        firebase.firestore.FieldValue.arrayUnion(payload.id_event) : 
                        firebase.firestore.FieldValue.arrayRemove(payload.id_event)
                    ) }); */
                    ////// FIN NOTE DU 15/12/2020 //////
                    


                    //console.log(event, (payload.registry ? "Inscription" : "Désinscription")); //TEST
                    // Si demande d'inscription, on ajoute le participant à la liste des participants de l'évènement...
                    if(payload.registry) {
                        event.id_participants.push(payload.id_user);
                    } else { // ...et si désinscription, on le supprime.
                        event.id_participants = [...event.id_participants].filter(e => e != payload.id_user);
                    }

                    // Modification de la liste des participants dans l'évènement : Mise à jour dans Firestore
                    transaction.update(eventToModify, event);

                    return event.id_participants;
                });
            }).then(eventParticipants => {
                // Mise à jour du state
                commit('setEventNumParticipants', { 
                    id_ev: payload.id_event, 
                    eventParticipants: eventParticipants 
                });

                // Cas ici ou il faut mettre à jour la liste des formations pour la/lesquelle(s) le participant s'est inscrit : 
                // Si le filtre est activé, lorsque le participant se désinscrit d'une formation, celle-ci doit disparaitre de la liste filtrée
                if(payload.registry == false && state.filterMyTrainings) {
                    commit('deleteEvent', payload.id_event);
                }

                console.log("Transaction successfully committed!");
            })
            .catch((error) => { console.log("Transaction failed: ", error); commit('setMessageError', error.message) })
            .finally(() => { commit('setLoading', false) });   
        },


        // Profil Administrateur uniquement : Modification d'un évènement
        modifyEvenement({ commit }, payload) {
            commit('setLoading', true);
            commit('setMessageError', null);
            
            const db = firebase.firestore();
            const collectionEvenements = db.collection('evenements');
            const collectionUtilisateurs = db.collection('utilisateurs');
            const eventToModify = collectionEvenements.doc(payload.id_event);

            return db.runTransaction(function(transaction) {
                // This code may get re-run multiple times if there are conflicts.
                return transaction.get(eventToModify).then(async querySnapshot => {
                    if (!querySnapshot.exists) { throw "L'évènement à modifier n'existe pas ou plus."; }

                    let event = querySnapshot.data();

                    // console.log("Action 'modifyEvenement'", 
                    // "Données venant de la collection 'evenements'", event, 
                    // "Données venant du formulaire de saisie", payload.data_event
                    // ); //TEST
                    
                    // Modification (éventuelle) dans collection 'utilisateurs' :
                    // Comparaison du/des animateurs du payload (du formulaire de saisie de modif d'evenement)
                    // et du/des animateurs enregistrés dans Firestore : Si différence entre les 2, on update ds collection 'utilisateurs'
                    let animateurs_bdd = event.id_animateurs;
                    let animateurs_form = payload.data_event.id_animateurs;
                    if(JSON.stringify(animateurs_bdd.sort()) !== JSON.stringify(animateurs_form.sort())) { // Si modif de saisie sur animateur(s)
                        
                        // Identification du/des animateurs pour qui il faut ajouter OU supprimer la formation
                        let animateurs_addEvent = [];
                        animateurs_form.forEach(a => {
                            if(!animateurs_bdd.includes(a)) {
                                animateurs_addEvent.push({ id_anim: a, action: "add" }); // Animateurs à qui il faut ajouter la formation
                            } else {
                                animateurs_bdd.splice(animateurs_bdd.indexOf(a), 1);
                            }
                        });
                        
                        const animateurs_supprEvent = animateurs_bdd.map(a => { 
                            return { id_anim: a, action: "delete"};
                        }); // Animateurs à qui il faut retirer la formation
                        const animateurs_changeEvent = animateurs_addEvent.concat(animateurs_supprEvent);
                        const id_animateurs_changeEvent = animateurs_changeEvent.map(a => a.id_anim);
                        //console.warn("animateurs_changeEvent", animateurs_changeEvent, "id_animateurs_changeEvent", id_animateurs_changeEvent); //TEST
                        

                        // Ajout ou Suppression ds Firestore de l'evenement pour le(s) animateur(s) concerné(s)
                        await collectionUtilisateurs
                        .where(firebase.firestore.FieldPath.documentId(), "in", id_animateurs_changeEvent)
                        .get()
                        .then(querySnapshot => {
                            querySnapshot.forEach((doc) => {
                                let listEvents = doc.data().evenements; // Liste formations de l'animateur
                                const typeAction = animateurs_changeEvent
                                    .map(a => { if(a.id_anim == doc.id) return a.action; })
                                    .filter(a => typeof a !== "undefined")
                                    .toString();
                                
                                if(typeAction == "delete") {
                                    //console.log("Nom Animateur pour qui SUPPRESSION evenement", doc.id, doc.data().lastName, listEvents); //TEST 
                                    // Suppression de la formation ds liste des formations de l'animateur                               
                                    listEvents.splice(listEvents.indexOf(payload.id_event), 1);
                                } else if(typeAction == "add") {
                                    //console.log("Nom Animateur pour qui AJOUT evenement", doc.id, doc.data().lastName, listEvents); //TEST                                
                                    // Ajout de la formation ds liste des formations de l'animateur
                                    listEvents.push(payload.id_event);
                                }
                                
                                // Update de la propriété "evenements" pour cet utilisateur
                                transaction.update(collectionUtilisateurs.doc(doc.id), { evenements: listEvents });                               
                            })
                        })
                        .catch(error => { throw error });

                    }

                    // Modification dans collection 'evenements'
                    const fusionDataEvent = Object.assign(event, payload.data_event); // Fusion des infos saisies dans le formulaire avec celles dans Firestore
                    transaction.update(collectionEvenements.doc(payload.id_event), fusionDataEvent); // Mise à jour dans Firestore
                });
            }).then(() => {
                commit('setDisplayModalModifiedEvent', true); // Apparition modal msg signalant que modif est effectuée
                console.log("Transaction successfully committed!");
            })
            .catch((error) => { console.log("Transaction failed: ", error); commit('setMessageError', error.message) })
            .finally(() => { commit('setLoading', false) });
        },


        // Profil Administrateur uniquement : Suppression évènement
        deleteEvent({commit}, payload) {
            // Ici il faut :
            // - Retirer dans 'utilisateurs' l'id evenement du tableau 'evenements' quand il s'agit d'un Animateur: ou plusieurs Animateurs
            // - Retirer dans 'utilisateurs' l'id evenement du tableau 'evenements' quand il s'agit de participants
            // - supprimer l'évènement
            
            commit('setLoading', true);
            commit('setMessageError', null);

            const db = firebase.firestore();

            /*================ Transaction : FONCTIONNE !! ==============*/
            const eventToDelete = db.collection('evenements').doc(payload);
            return db.runTransaction(transaction => {
                // This code may get re-run multiple times if there are conflicts.
                return transaction.get(eventToDelete).then(async querySnapshot => {
                    //console.log("Action 'deleteEvent'", querySnapshot.data()); //TEST
                    
                    if (!querySnapshot.exists) { throw "L'évènement à supprimer n'existe pas ou plus."; }

                    let event = querySnapshot.data();
                    // Suppression enregistrements dans propriété 'evenements' de la collection 'utilisateurs' 
                    // regroupant notamment les animateurs et les participants
                    let id_AnimAndPart = event.id_animateurs.concat(event.id_participants); // Regroupement des id Animateurs et Participants de l'évènement à supprimer
                    let nb_AnimAndPart = id_AnimAndPart.length;
                    let nbDizaine = Math.floor(nb_AnimAndPart / 10);
                    let collectionUtilisateurs = db.collection('utilisateurs');
                    let f = 0;
                    console.log("id_AnimAndPart => ", id_AnimAndPart, "nbDizaine => ", nbDizaine, "Modulo de id_AnimAndPart => ", nb_AnimAndPart % 10); //TEST

                    // ...Si + de 10 items ds tableau, il faut slicer le tableau pour n'avoir que des tableaux de 10 items au maximum : Boucle sur requete car pas plus de 10 items possibles avec opérateur "in", et impossible de faire une seule requete en multipliant les clauses "where" par autant de slice car on ne peut pas cumuler les "where" avec "in" comme opérateur
                    for(let i=0; i < nbDizaine; i++) {
                        await collectionUtilisateurs
                        .where(firebase.firestore.FieldPath.documentId(), "in", id_AnimAndPart.slice(f, f += 10))
                        .get()
                        .then((querySnapshot) => {
                            querySnapshot.forEach((doc) => {
                                //console.log("doc à modifier (BOUCLE)", doc.id, doc.data()); //TEST
                                
                                let listEvents = doc.data().evenements;
                                console.log("payload => " + payload, " | listEvents => " + listEvents, " | listEvents.indexOf(payload) => " + listEvents.indexOf(payload)); //TEST
                                listEvents.splice(listEvents.indexOf(payload), 1); // Suppression de l'id correspondant à la réunion supprimée ds propr. "evenements" de l'utilisateur
                                console.log("listEvents => " + listEvents); //TEST

                                transaction.update(collectionUtilisateurs.doc(doc.id), { evenements: listEvents }); // Update de la propriété "evenements" pour cet utilisateur
                            })
                        }) 
                        .catch(error => { throw error });
                    }
                    // ...Si reste des items malgré la boucle précédente (par ex 4 pour 64 items ou 2 pour 12 items) par 10,
                    // ou si moins de 10 items ds tableau...
                    if((nb_AnimAndPart % 10) > 0) {
                        await collectionUtilisateurs
                        .where(firebase.firestore.FieldPath.documentId(), "in", id_AnimAndPart.slice(f, (f + nb_AnimAndPart % 10)))
                        .get()
                        .then((querySnapshot) => {
                            querySnapshot.forEach((doc) => {
                                //console.log("doc à modifier (MODULO)", doc.id, doc.data()); //TEST
                                
                                let listEvents = doc.data().evenements;
                                console.log("payload => " + payload, " | listEvents => " + listEvents, " | listEvents.indexOf(payload) => " + listEvents.indexOf(payload)); //TEST
                                listEvents.splice(listEvents.indexOf(payload), 1); // Suppression de l'id correspondant à la réunion supprimée ds propr. "evenements" de l'utilisateur
                                console.log("listEvents => " + listEvents); //TEST
                                
                                transaction.update(collectionUtilisateurs.doc(doc.id), { evenements: listEvents }); // Update de la propriété "evenements" pour cet utilisateur
                            })
                        })
                        .catch(error => { throw error });
                    }
                    
                    transaction.delete(eventToDelete);
                })
                .catch(error => { throw error });
            }).then(() => {
                commit('deleteEvent', payload); // Rafraichissement affichage écran
                commit('setFlagEventDeleted', true); //Pour réinitialisation des filtres
                console.log("Transaction successfully committed!");
            })
            .catch((error) => { console.log("Transaction failed: ", error); commit('setMessageError', error.message) })
            .finally(() => { commit('setLoading', false) });
            /*============================== FIN Transaction ================================*/
            


            /*================ Même chose que ci-dessus mais avec batch ==============*/
            /*=======  Version batch V1 =======*/
            /*
            // Get a new write batch
            var batch = db.batch();

            db.collection('evenements')
            .doc(payload)
            .get()
            .then(async (querySnapshot) => {
                let event = querySnapshot.data();

                // Suppression enregistrements dans propriété 'evenements' de la collection 'utilisateurs' 
                // regroupant notamment les animateurs et les participants
                let id_AnimAndPart = event.id_animateurs.concat(event.id_participants); // Regroupement des id Animateurs et Participants de l'évènement à supprimer
                let nb_AnimAndPart = id_AnimAndPart.length;
                let nbDizaine = Math.floor(nb_AnimAndPart / 10);
                let collectionUtilisateurs = db.collection('utilisateurs');
                let f = 0;
                //console.log("id_AnimAndPart => ", id_AnimAndPart, "nbDizaine => ", nbDizaine, "Modulo de id_AnimAndPart => ", nb_AnimAndPart % 10); //TEST

                // ...Si + de 10 items ds tableau, il faut slicer le tableau pour n'avoir que des tableaux de 10 items au maximum : Boucle sur requete car pas plus de 10 items possible avec opérateur "in", et impossible de faire une seule requete en multipliant les clauses "where" par autant de slice car on ne peut pas cumuler les "where" avec "in" comme opérateur
                for(let i=0; i < nbDizaine; i++) {

                    let querySnapshot = await collectionUtilisateurs
                    .where(firebase.firestore.FieldPath.documentId(), "in", id_AnimAndPart.slice(f, f += 10))
                    .get();

                    querySnapshot.forEach((doc) => {
                        console.log("doc à modifier (boucle)", doc.id, doc.data()); //TEST
                        
                        let listEvents = doc.data().evenements;
                        //console.log("payload => " + payload, " | listEvents => " + listEvents, " | listEvents.indexOf(payload) => " + listEvents.indexOf(payload)); //TEST
                        listEvents.splice(listEvents.indexOf(payload), 1); // Suppression de l'id correspondant à la réunion supprimée ds propr. "evenements" de l'utilisateur
                        //console.log("listEvents => " + listEvents); //TEST

                        // Update de la propriété "evenements" pour cet utilisateur
                        batch.update(collectionUtilisateurs.doc(doc.id), {"evenements": listEvents});
                    })
                    
                }
                

                // FONCTIONNE !! Version avec Async/await
                // ...Si reste des items malgré la boucle précédente (par ex 4 pour 64 items ou 2 pour 12 items) par 10,
                // ou si moins de 10 items ds tableau...
                if((nb_AnimAndPart % 10) > 0) {

                    let querySnapshot = await collectionUtilisateurs
                    .where(firebase.firestore.FieldPath.documentId(), "in", id_AnimAndPart.slice(f, (f + nb_AnimAndPart % 10)))
                    .get();

                    querySnapshot.forEach((doc) => {
                        console.log("doc à modifier (modulo)", doc.id, doc.data()); //TEST
                        
                        let listEvents = doc.data().evenements;
                        console.log("payload => " + payload, " | listEvents => " + listEvents, " | listEvents.indexOf(payload) => " + listEvents.indexOf(payload)); //TEST
                        listEvents.splice(listEvents.indexOf(payload), 1); // Suppression de l'id correspondant à la réunion supprimée ds propr. "evenements" de l'utilisateur
                        console.log("listEvents => " + listEvents); //TEST
                        
                        // Update de la propriété "evenements" pour chaque utilisateur de la boucle
                        batch.update(collectionUtilisateurs.doc(doc.id), {"evenements": listEvents});
                    })
                    
                }

                // Commit the batch
                await batch.commit();
                console.log("Batch commité avec succès !!");
                
                commit('deleteEvent', payload); // Rafraichissement affichage écran
            })
            .catch((error) => { commit('setMessageError', error.message) })
            .finally(() => { commit('setLoading', false) });
            */
            /*=======  FIN Version batch V1 =======*/



            /*=======  Version batch V2 : Testé, Fonctionne !! =======*/    /*
            let collectionEvenements = db.collection('evenements');

            // Création d'un batch pour écrire dans les tables simultanément
            var batch = db.batch();

            // Lecture des propriétés de l'évènement à supprimer...
            collectionEvenements
            .doc(payload)
            .get()
            .then((querySnapshot) => {
                let event = querySnapshot.data();

                // On veut supprimer enregistrements dans propriété 'evenements' de la collection 'utilisateurs' 
                // regroupant notamment les animateurs et les participants
                let id_AnimAndPart = event.id_animateurs.concat(event.id_participants); // Regroupement des id Animateurs et Participants de l'évènement à supprimer
                let nb_AnimAndPart = id_AnimAndPart.length;
                let nbDizaine = Math.floor(nb_AnimAndPart / 10);
                let collectionUtilisateurs = db.collection('utilisateurs');
                let f = 0;
                //console.log("id_AnimAndPart => ", id_AnimAndPart, "nbDizaine => ", nbDizaine, "Modulo de id_AnimAndPart => ", nb_AnimAndPart % 10); //TEST

                let promises = [];

                // ...Si + de 10 items ds tableau, on le slice pour n'avoir que des tableaux de 10 items au maximum : Boucle sur requete car pas plus de 10 items possible avec opérateur "in", et impossible de faire une seule requete en multipliant les clauses "where" par autant de slice car on ne peut pas cumuler les "where" avec "in" comme opérateur
                for(let i=0; i < nbDizaine; i++) {
                    let promise = collectionUtilisateurs
                    .where(firebase.firestore.FieldPath.documentId(), "in", id_AnimAndPart.slice(f, f += 10))
                    .get()
                    .then((querySnapshot) => {
                        querySnapshot.forEach((doc) => {
                            console.log("doc à modifier (BOUCLE)", doc.id, doc.data()); //TEST
                            
                            let listEvents = doc.data().evenements;
                            console.log("payload => " + payload, " | listEvents => " + listEvents, " | listEvents.indexOf(payload) => " + listEvents.indexOf(payload)); //TEST
                            listEvents.splice(listEvents.indexOf(payload), 1); // Suppression de l'id correspondant à la réunion supprimée ds propr. "evenements" de l'utilisateur
                            //console.log("listEvents => " + listEvents); //TEST

                            // Update de la propriété "evenements" pour cet utilisateur
                            batch.update(collectionUtilisateurs.doc(doc.id), {"evenements": listEvents});
                        })
                    });

                    promises.push(promise);
                }

                // ...Si reste des items malgré la boucle précédente (par ex 4 pour 64 items ou 2 pour 12 items) par 10,
                // ou si moins de 10 items ds tableau...
                if((nb_AnimAndPart % 10) > 0) {
                    let promise1 = collectionUtilisateurs
                    .where(firebase.firestore.FieldPath.documentId(), "in", id_AnimAndPart.slice(f, (f + nb_AnimAndPart % 10)))
                    .get()
                    .then((querySnapshot) => {
                        querySnapshot.forEach((doc) => {
                            console.log("doc à modifier (MODULO)", doc.id, doc.data()); //TEST
                            
                            let listEvents = doc.data().evenements;
                            console.log("payload => " + payload, " | listEvents => " + listEvents, " | listEvents.indexOf(payload) => " + listEvents.indexOf(payload)); //TEST
                            listEvents.splice(listEvents.indexOf(payload), 1); // Suppression de l'id correspondant à la réunion supprimée ds propr. "evenements" de l'utilisateur
                            //console.log("listEvents => " + listEvents); //TEST
                            
                            // Update de la propriété "evenements" pour chaque utilisateur de la boucle
                            batch.update(collectionUtilisateurs.doc(doc.id), {"evenements": listEvents});
                        })
                    });

                    promises.push(promise1);
                }

                //console.log("promises.length => ", promises.length); //TEST
                
                // Avantage avec Promise.All: Les promesses ne s'executent pas les unes après les autres, mais ttes en même temps et qd la dernière est resolved, on peut commiter le batch => Plus rapide que la version Async/await
                Promise.all(promises).then(values => { 
                    console.log(values); // [3, 1337, "foo"]

                    batch.delete(collectionEvenements.doc(payload)); // Ajout ds le batch de la demanse de suppression de l'évènement
                    batch.commit().then(() => { 
                        console.log("!! Batch commité avec succès !!"); //TEST
                        
                        commit('deleteEvent', payload); // Rafraichissement affichage écran
                    });
                });

            })
            .catch((error) => { commit('setMessageError', error.message) })
            .finally(() => { commit('setLoading', false) });
            /*=======  FIN Version batch V2 =======*/
            /*============================== FIN batch ================================*/

        },


        /// TEST LISTENERS ///
        /* listener_addEvent() {
            const db = firebase.firestore();
            db.collection("evenements")
            //.doc("SF")
            .onSnapshot(function(doc) {
                var source = doc.metadata.hasPendingWrites ? "Local" : "Server";
                console.log("Fonction listener", source, " data: ", doc.data());
            });
        }, */
        /// FIN TEST ///

        // Profil Animateur uniquement : Récupération des participants à la formation dont l'id est passé dans le payload.
        // Appelé quand clic sur bouton 'Liste des participants' ds pg de liste des formations
        getParticipantsEvenement({commit}, payload) {
            commit('setLoading', true);
            commit('setMessageError', null);

            const db = firebase.firestore();

            // Recherche des utilisateurs inscrits à cet évènement ET qui ont le statut de participant
            db.collection('utilisateurs')
            .where('evenements', 'array-contains', payload)
            .where('role', '==', 'Participant')
            .get()
            .then(querySnapshot => {
                if(querySnapshot.empty) { console.log("Pas d'utilisateurs pour cette formation !"); }
                let listeParticipants = [];
                querySnapshot.forEach(doc => {
                    let presence = "presence" in doc.data() ? doc.data().presence.filter(e => e.id_ev == payload) : null;
                    listeParticipants.push({ id: doc.id, data: doc.data(), presence: presence });
                });
                commit('setParticipantsListOfAnEvent', listeParticipants);
            })
            .catch(error => { 
                console.log("Erreur lors de la récupération des participants d'une formation", error); 
                commit('setMessageError', error.message);
            })
            .finally(() => { commit('setLoading', false) });
        },


        // Profil Animateur uniquement : Enregistrement des participants présents ou non à une formation
        async recordPresenceParticipants({ commit, dispatch }, payload) {
            console.log("payload dans 'recordPresenceParticipants' =>>", payload); //TEST

            commit('setLoading', true);
            commit('setMessageError', null);

            const db = firebase.firestore();
            const collectionUtilisateurs = db.collection('utilisateurs'); 

                        // TEST : A VIRER
                        /* OK */
                        /* let toto = collectionUtilisateurs.where(firebase.firestore.FieldPath.documentId(), "in", [ "RWy20OWU1kLcYTiUDsAC" ]).get();
                        let titi = collectionUtilisateurs.where(firebase.firestore.FieldPath.documentId(), "in", [ "CitW2wRiLh2rAV6T6nN9" ]).get();
                        const [totoQuerySnapShot, titiQuerySnapShot] = await Promise.all([toto, titi]);
                        const totoArray = totoQuerySnapShot.docs;
                        const titiArray = titiQuerySnapShot.docs;
                        let allArray = totoArray.concat(titiArray);
                        allArray.forEach(doc => {
                            console.log("======>", doc.data()); 
                        }) */

                        /* OK */
                        /* await Promise.all([
                            collectionUtilisateurs.where(firebase.firestore.FieldPath.documentId(), "in", [ "RWy20OWU1kLcYTiUDsAC", "irplZHoJtwmSgsjaPaqz" ]).get(), 
                            collectionUtilisateurs.where(firebase.firestore.FieldPath.documentId(), "in", [ "CitW2wRiLh2rAV6T6nN9" ]).get()
                        ])
                        .then(querySnapshots => {
                            // Autant de querySnapshot que de queries dans le Promise.All
                            querySnapshots.forEach(querySnapshot => {
                                querySnapshot.docs.forEach(doc => console.log("doc.data() => ", doc.data()));
                            });
                        })
                        .catch(err => console.error(err)); */
                        // FIN TEST : A VIRER


            // Récupération liste des participants sur lesquels il faut ecrire.
            dispatch('concatAllDocs', payload)
            .then(querySnapshot => {
                querySnapshot.forEach(doc => {
                    var docUser = collectionUtilisateurs.doc(doc.id);
                    docUser
                        .get()
                        .then(user => {
                            // On détermine si appel a déjà été réalisé ou pas par l'animateur (il en a la possibilité pdt un laps de temps déterminé dans une variable du state à compter de la date de formation)
                            const callAlreadyDone = user.data().presence.filter(p => p.id_ev == payload.id_formation);
                            console.log("user.data()", user.data(), "callAlreadyDone[0]", callAlreadyDone[0]); //TEST
                            //console.log("callAlreadyDone pour '" + doc.id + "' =>>", callAlreadyDone[0]); //TEST

                            // Valeur de la coche faite par l'animateur lors de l'appel pour signaler si participant est présent ou non
                            const presence = payload.resultAppel.filter(p => p.id_user == doc.id);
                            const obj = { id_ev: payload.id_formation, isPresent: presence[0].isPresent };
                            
                            // Si aucun appel fait à propos présence du participant à la formation (donc id formation pas présent dans prop. 'presence'), on ajoute juste l'objet signalant la présence ou pas du participant à la formation
                            // Si appel déjà fait (donc id formation présente dans tableau 'presence'), on remplace la totalité du tableau d'objets de la propriété 'presence'
                            var queryType = null;
                            var dataToUpdate = null;
                            if(typeof callAlreadyDone[0] == 'undefined') { // Si pas d'appel fait avant...
                                queryType = 'arrayUnionRequired';
                                dataToUpdate = obj;
                            } else { // ...sinon si appel a déjà été fait...
                                queryType = 'replaceEntireArray';
                                let newArrayPresence = user.data().presence.filter(p => p.id_ev != payload.id_formation);
                                newArrayPresence.push(obj);
                                dataToUpdate = newArrayPresence;
                            }
                    
                            return { queryType: queryType, dataToUpdate: dataToUpdate };
                        })
                        .then(data => {
                            //console.warn("data", data); //TEST
                            docUser.update({ presence: 
                                data.queryType == 'arrayUnionRequired' ? 
                                firebase.firestore.FieldValue.arrayUnion(data.dataToUpdate) : 
                                data.dataToUpdate
                            });

                            this.commit('setParticipantsPresenceRecord', true); // Pour faire apparaitre modal comme quoi l'enregistrement est fait
                        })
                        .catch(error => {  throw error });
                });
            })
            .catch(error => { 
                console.log("Erreur lors de la phase d'enregistrement des présences des participants à une formation", error); 
                commit('setMessageError', error.message);
            })
            .finally(() => { commit('setLoading', false) });
            
        },
        async concatAllDocs(context, payload) {
            // On isole les id_user qui vont ensuite servir pour la requete 'where'
            let listeParticipants = [];
            listeParticipants = payload.resultAppel.map(p => p.id_user);
            
            const db = firebase.firestore();
            const collectionUtilisateurs = db.collection('utilisateurs');

            // En raison des limitations de Firestore, on ne peut pas faire de clause 'in' avec un tableau ayant plus de 10 entrées.
            // On découpe donc le tableau des participants ayant fait l'objet d'une modification sur leur présence
            // en plusieurs tableaux de 10 entrées. Il y aura donc autant de requetes que de tableaux d'ou 
            // la création d'un tableau de stockage de requetes
            let queries = [];
            while(listeParticipants.length) {
                queries.push(collectionUtilisateurs.where(firebase.firestore.FieldPath.documentId(), "in", listeParticipants.splice(0, 10)).get());
            }
            
            // Promise.all sur requetes qui permet de les executer en parallèles jusqu'à ce qu'elles soient ttes executées 
            const queriesSnapShot = await Promise.all(queries);
            // On veut retourner tous les documents de ttes les requetes dans un même tableau (ici 'allDocs')
            let allDocs = [];
            for(let querySnapshot of queriesSnapShot) { // Autant de querySnapshot que de queries ds le Promise.All...
                allDocs.push(querySnapshot.docs);
            }

            return allDocs.flat(); // On "aplatit" le tableau de tableaux pour y avoir tous les docs au même niveau
        },



        //TEST
        FF_currentUser({ commit }) {
            var txt = "";
            var user = firebase.auth().currentUser;
            if (user) {
                // User is signed in.
                txt = "currentUser : " + user.email + " | user.uid : " + user.uid;
            } else {
                // No user is signed in.
                txt = "Pas de currentUser";
            }
            commit('FF_currentUser', txt);
        }
        //FIN TEST

    },


    
    getters: {
        currentUser(state) {
            const fullDataCurrentUser = state.utilisateurs.find(u => u.id_auth == state.currentUser.id_auth);
            return (typeof fullDataCurrentUser == 'undefined' ? state.currentUser : fullDataCurrentUser);
        },
        menu(state) {
            return state.pages.filter(p => p.roles.indexOf(state.currentUser.role) > -1 && 'btMenu' in p);
        },
        pageRedirection(state) {
            //return state.pages.filter(p => p.redirection == true); 
            // ou
            return state.pages.filter(p => 'redirection' in p);
        },
        // IMPORTANT : Voir si soit on le supprime et on appelle ds le composant 'this.$store.state.events', soit on récupère la partie traitement des filtres/pagination/classement du composant à ici
        events(state) {
            return state.evenements;
        },

        selectAnimateurs(state) {
            return state.selectAnimateurs.sort();
        },
        rangeEvents(state) {
            const from = ((parseInt(state.selectedPage) - 1) * state.nbEventsPerPage) + 1;
            const to = state.selectedPage * state.nbEventsPerPage;
            return { from: from, to: to };
        },
        eventParticipants(state) {
            return state.eventParticipants.sort((a, b) => a.lastName > b.lastName);
        },


        FF_currentUser(state) { return state.FF_currentUser; } //TEST
    }
});