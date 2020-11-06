# formations

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


### CORRECTIONS A APPORTER : Fait par Serge
- exporter dans un fichier séparé tout ce qui est appel à l'API Firebase (voir si interessant)
- Voir pourquoi quand on arrive sur le site, on passe d'abord par redirect.js sans être authentifié dans le currentUser, puis ensuite identification. Ce décalage fait apparaitre l'alert signalant que l'on est pas identifié alors qu'ensuite si.
- Extraire les règles de controle de champ de saisie (rules) pour en faire un fichier général appelés par la suite dans les fichiers qui en ont besoin (partiellement fait)
- Page liste des évènements (partie Admin) : Faire modif. d'un évènement avec un encart qui apparait, faire un composant card qui pourra aussi être appelé ds parie Animateurs et partie Participants
- Regrouper soit dans un rep. server les fichiers et dossier concernant le code server, soit faire un dossier regroupant les objets d'identification Firebase pour le front et le back dans le même dossier