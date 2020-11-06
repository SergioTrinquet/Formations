import Vue from 'vue';
import Vuetify from 'vuetify/lib';

Vue.use(Vuetify);

import '@fortawesome/fontawesome-free/css/all.css'; // Pour font-awesome
import fr from 'vuetify/es5/locale/fr';
import colors from 'vuetify/lib/util/colors';

export default new Vuetify({
    lang: {
        locales: { fr },
        current: 'fr'
    },
    theme: {
        themes: {
            light: {
                primaire: colors.indigo.darken1,
                primaireDark: colors.indigo.darken3,
                primaireLight: colors.indigo.lighten1,
                secondaire: colors.pink.lighten2,
                //background: colors.grey.lighten3
                background: colors.indigo.lighten5

                //, primaire: '#393473', secondaire: '#FF298A', tertiaire: '#FFD567'
            },
            dark: {},
        }
    },
    icons: {
        iconfont: 'fa',
    },
});