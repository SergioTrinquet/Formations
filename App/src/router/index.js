import Vue from 'vue'
import VueRouter from 'vue-router'

import Accueil from '@/components/Accueil'
import AdminCreationEvenement from '@/components/administrateur/CreationEvenement'
import AdminListeEvenements from '@/components/administrateur/ListeEvenements'
import ListeParticipants from '@/components/animateurs/ListeParticipants'
import Evenements from '@/components/participants/Evenements'
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
            component: AdminListeEvenements,
            beforeEnter: (to, from, next) => {
                Redirect('events_list', next);
            }
        },
        {
            path: '/listParticipants',
            name: 'participants_list',
            component: ListeParticipants,
            beforeEnter: (to, from, next) => {
                Redirect('participants_list', next);
            }
        },
        {
            path: '/events',
            name: 'events',
            component: Evenements,
            beforeEnter: (to, from, next) => {
                Redirect('events', next);
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