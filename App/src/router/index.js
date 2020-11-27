import Vue from 'vue'
import VueRouter from 'vue-router'

import Accueil from '@/components/Accueil'
import AdminCreationEvenement from '@/components/administrateur/CreationEvenement'
import SharedListeEvenements from '@/components/shared/listeEvenements/ListeEvenements'
import ListeParticipants from '@/components/animateurs/ListeParticipants'
import Inscription from '@/components/user/Inscription'
import Connection from '@/components/user/Login'
import UnknownURL from '@/components/shared/base/404'

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
            component: AdminCreationEvenement,
            beforeEnter: (to, from, next) => {
                Redirect('create_event', next);
            }
        },
        {
            path: '/listEvents',
            name: 'events_list',
            component: SharedListeEvenements,
            beforeEnter: (to, from, next) => {
                Redirect('events_list', next);
            }
        },
        {
            path: '/listParticipants',
            name: 'participants_list',
            component: ListeParticipants,
            props: true, // Qd on ne veut pas écrire '$route.params.XXX' à chaque fois dans le composant mais utiliser à la place une prop (du genre 'XXX' plus court)
            beforeEnter: (to, from, next) => {
                Redirect('participants_list', next);
            }
        },
        /* {
            path: '/events',
            name: 'events',
            component: SharedListeEvenements,
            beforeEnter: (to, from, next) => {
                Redirect('events', next);
            }
        }, */
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