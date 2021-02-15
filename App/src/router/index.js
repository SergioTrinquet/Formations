import Vue from 'vue'
import VueRouter from 'vue-router'

import Accueil from '@/components/Accueil'
import SharedListeFormations from '@/components/shared/listeFormations/ListeFormations'

// Remplacement de la version synchrone classique par un chargement asynchrone lorsque l'utilisateur veut aller sur cette page :
// Le composant asynchrone sera automatiquement scindé par webpack sous la forme d'un fichier .js distinct de 'app.js', et chargé en prefetch         
const AdminCreationFormation = () => import(/* webpackChunkName: "AdminCreationFormation" */ '@/components/administrateur/CreationFormation')
const AnimateurListeParticipants = () => import(/* webpackChunkName: "AnimateurListeParticipants" */ '@/components/animateurs/ListeParticipants')
const Inscription = () => import(/* webpackChunkName: "Inscription" */ '@/components/user/Inscription')
const Connection = () => import(/* webpackChunkName: "Connexion" */ '@/components/user/Login')
const UnknownURL = () => import(/* webpackChunkName: "404" */ '@/components/shared/base/404')

import Redirect from './redirect'

Vue.use(VueRouter)

export default new VueRouter({
    routes: [
        {
            path: '/',
            name: 'accueil',
            component: Accueil
        },
        {
            path: '/createEvent',
            name: 'create_event',
            component: AdminCreationFormation,
            beforeEnter: (to, from, next) => {
                Redirect('create_event', next);
            }
        },
        {
            path: '/listEvents',
            name: 'events_list',
            component: SharedListeFormations,
            beforeEnter: (to, from, next) => {
                Redirect('events_list', next);
            }
        },
        {
            path: '/listParticipants',
            name: 'participants_list',
            component: AnimateurListeParticipants,
            props: true, // Qd on ne veut pas écrire '$route.params.XXX' à chaque fois dans le composant mais utiliser à la place une prop (du genre 'XXX' plus court)
            beforeEnter: (to, from, next) => {
                Redirect('participants_list', next);
            }
        },
        {
            path: '/signUp',
            name: 'sign_up',
            component: Inscription
        },
        {
            path: '/signIn',
            name: 'sign_in',
            component: Connection
        },
        {
            path: '/404',
            name: 'Unknown_URL',
            component: UnknownURL
        },
        {
            path: '*',
            redirect: {name: 'Unknown_URL'}
        }
    ],
    mode: 'history'
})