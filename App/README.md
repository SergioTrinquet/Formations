Projet formations
=

## Pourquoi cette appli ?
La société pour laquelle je travaillais auparavant proposait parmi ses prestations l'organisation de séminaires, mais aucun outil informatique n'était disponible pour s'inscrire en tant que participant. Je me suis dit qu'il serait interessant et formateur de tenter d'en créer un. Le but étant d'apprendre à maitriser:
* Vue.js et certain éléments de son écosystème (Vuex, vue-router, Vuetify), 
* Firebase

## Que fait cette appli ? (Description fonctionnelle)
Cette application liste des formations/séminaires/évènements (peut importe la terminologie employée) auxquels des participants peuvent s'inscrire.
~~permet d'administrer et de présenter des formations ~~

On y trouve 3 types de profil utilisateur:
* Le profil Administrateur.  
Il est créé directement dans la section Authentification de la console Firebase.
* Le profil Animateur.  
Les animateurs sont créés par le profil Administrateur via un formulaire dédié dans l'application.
* Le profil Participant.  
Les participants sont créés par les utilisateurs de l'application eux-mêmes lors de la phase d'inscription.

### Inscription/connexion
Cette application est connectée à un projet Firebase : Il sert à nous authentifier (avec Firebase authentication) et donne accès à une base de données de type NoSQL (avec Firebase Cloud Firestore).  
La gestion de l'inscription et de la connexion au site se fait donc via l'authentification Firebase avec la méthode de connexion par e-mail/mot de passe.

Quel que soit le type de profil, il est obligatoire de se connecter pour acccéder aux fonctionnalités.  
Si cela a déjà été fait lors d'une précédente visite et que l'utilisateur ne s'est pas déconnecté ensuite (icone en haut à droite du header), l'application identifie l'utilisateur de sorte qu'il n'a pas besoin de se loguer à nouveau.



### Liste des formations
Cette page liste les formations à venir : Les formations antérieures à la date du jour ne sont plus visibles.  
Elle est accessible à tous les profils, mais certaines fonctionnalités sont limitées à un profil particulier.  
Des tris et filtres sont disponibles pour affiner sa recherche.

Types de tri sur la liste :
* par ordre chronologique sur la date de formation,
* par ordre antéchronologique sur la date de formation,
* Par ordre alphabétique sur le titre de la formation, 
* Par odre anti-alphabétique sur le titre de la formation,
* Par nombre de participants croissant,
* Par nombre de participants décroissant

Filtres sur la liste :
* Par date(s)
* Par ville(s)
Selon le profil connecté, d'autres filtres sont accessibles (cf. plus bas).


### Profil Administrateur
Le profil Administrateur est le seul a avoir un menu (visible dans le header).  
Après connexion, l'Administrateur a accès à 2 pages via ce menu :
* La page 'Créer une formation',
* La page 'Liste des formations'

#### Page 'Créer une formation'
L'administrateur a la possibilité de créer une nouvelle formation via un formulaire.  
Tous les champs sont obligatoires (Titre, description, date, heure, adresse, CP, ville, latitude et longitude pour situer le lieu sur une carte, et le ou les animateurs).  
Si l'animateur voulu n'est pas pas présent dans la liste des propositions, l'administrateur peut le créer : Un lien en bas de la page ouvre le formulaire de saisie à cet effet dans une fenêtre modale.

#### Page 'Liste des formations'
Lorsque l'on est connecté en tant qu'administrateur, 2 boutons sont présents en bas de chaque encart formation.  
Ils lui permettent :
* de modifier la formation, mais il ne peut pas modifier/supprimer/ajouter de participant à la formation (fonctionnalité qui pourrait être ajoutée ultérieurement),
* de supprimer la formation.   

 L'administrateur peut afficher les formations antérieures à la date du jour, pour les supprimer si besoin par exemple, mais il ne peut pas les modifier.


### Profil Animateur
#### Page 'Liste des formations'
Après connexion, l'animateur accède directement à la liste des formations.  
Cette liste est limitée aux formations qu'il est en charge d'animer, et seulement celles-ci.
#### Page Liste des participants d'une formation  
En cliquant sur le bouton "Liste des participants" d'une formation, il accède à une page qui lui sert le jour de la tenue de cette formation à faire l'appel afin d'enregistrer la présence ou non des participants.  
A noter que les cases à cocher pour enregistrer les présences ne sont actives que le jour de la formation, et pas avant.  
L'animateur a accès a la liste des participants toute la journée de la formation, de sorte qu'il puisse revenir à cette liste et corriger une erreur si besoin même après avoir validé une première fois.

### Profil Participant
#### Page 'Liste des formations'
Comme pour le profil Animateur, le Participant arrive directement sur la liste des formations après connexion.  
Il trouve dans les encarts de présentation des formations le nombre de place(s) disponible(s), et la présence d'un bouton pour s'y inscrire.  
Lorsqu'il s'inscrit, un bandeau jaune le signale en haut de l'encart formation.  
Si le participant est inscrit, il a la possibilité de se désinscrire (bouton rouge en lieu et place de celui dédié à l'inscription).  
En production, il serait souhaitable de rendre la désinscription moins facile afin de limiter ce genre de demande, et/ou bien de limiter dans le temps cette possibilité jusqu'à X jours avant la tenue de la formation.

Le participant peut filtrer les formations en n'affichant que celles auxquelles il s'est inscrit.  

---

## Installer le projet
- Récupérer ce projet et installez-le
    ```
    npm install
    ```
- Créer un projet Firebase (['Etape 1' dans page en lien ici](https://firebase.google.com/docs/web/setup#create-firebase-project))
- Ajoutez une application Web dans le projet Firebase que vous venez de créer. 
(['Etape 2' dans page en lien ici](https://firebase.google.com/docs/web/setup#create-firebase-project))
- Dans les paramètres de votre projet Firebase (rubrique 'Général'), récupérez votre objet de configuration (objet nommé 'firebaseConfig') ([voir ici pour savoir comment le récupérer](https://support.google.com/firebase/answer/7015592)).  
Inscrivez les propriétés de l'objet de configuration  dans un fichier JS que vous nommerez **"firebase.config.js"** et dont le contenu correspondra à ceci :  

    ```
    export default {
        => Ici, placez les propriétés de l'objet de configuration
    }
    ```
    Placez votre fichier JS "firebase.config.js" à la racine du répertoire "App".  
Ce fichier est appelé dans "main.js" et permettra de se connecter à votre application Firebase.
- Toujours dans les paramètres de votre projet Firebase (rubrique 'Compte de service'), cliquez sur 'Générer une nouvelle clé privée', puis confirmez en cliquant sur 'Générer la clé' et récupérez le fichier JSON contenant la clé. Mettez ce fichier dans le projet sous "/API/firebase_adminSDK_serviceAccountKey".  
Pour finir, dans "/API/index.js", modifier en conséquence le chemin pour la variable 'serviceAccount', ainsi que la valeur de la propriété 'databaseURL' par celle présente dans la rubrique 'Compte de service' de votre projet  
([Toutes les explications ici](https://firebase.google.com/docs/admin/setup?authuser=0))
- Pour créer l'administrateur de l'application, allez dans la console Firebase et dans le menu 'Authentication', ajoutez un utilisateur
- Dans le menu 'Cloud Firestore' dans la console, créer 2 collections : **'evenements'** et **'utilisateurs'** (lien "+ Commencer une collection")
- Dans la collection **'utilisateurs'**, ajoutez un document (lien "+ Ajouter un document")  
Dans ce document, ajoutez les champs 'email', 'firstName', 'id_auth', 'lastName', 'password' et 'role' qui sont tous de type String. Il s'agira de l'administrateur donc donnez comme valeur "Admin" au champ 'role' que vous venez de créer.  
Pour les champs 'email' et 'id_auth', reprenez respectivement les valeurs des champs 'Identifiant' et 'ID utilisateur' de l'utilisateur que vous avez créé lors d'une étape précédente (menu 'Authentication').  
Pour tous les autres champs 'firstName', 'lastName' et 'password', vous êtes libre de choisir.
- C'est fini ! Maintenant connectez-vous en tant qu'administrateur dans l'application avec l'adresse mail et le mot de passe inscrits précédemment dans la collection 'utilisateurs', et créez des formations et des animateurs.  
Vous pouvez aussi créer des participants en vous inscrivant.

---


## RESTE A FAIRE
- Voir droits sur projet Firebase
- Essayer le Hosting
- Ajouter gestion d'erreur comme pour projet villes
- Corriger sur profil Admin qd selection dates et villes 'formations passées' puis plus formations passées
- Voir pourquoi quand on arrive sur le site, on passe d'abord par redirect.js sans être authentifié dans le currentUser, puis ensuite identification. Ce décalage fait apparaitre l'alert signalant que l'on est pas identifié alors qu'ensuite si.


## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```

### Lints and fixes files
```
npm run lint
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).




