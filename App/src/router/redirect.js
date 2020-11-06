import store from '../store'

export default (path, next) => {
    // Si le currentUser a les droits d'accès à la page...
    const authorizedPath = store.state.menuItems.find(i => {
        return i.routeName == path && i.roles.indexOf(store.getters.currentUser.role) > -1;
    });
    if(typeof authorizedPath !== 'undefined') {
        next();
    } else {
        alert(`Vous avez le rôle de ${store.getters.currentUser.role}.\nVous n'avez pas les droits d'accès à cette page ("${path}").\nVous allez être redirigé vers la page d'accueil.`);
        next({ name: "accueil" }); // redirection vers page d'accueil
    }
} 