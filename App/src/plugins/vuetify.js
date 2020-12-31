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
                primaireLighter: colors.indigo.lighten2,
                secondaire: colors.pink.lighten2,
                background: colors.indigo.lighten5

                // "6a00a3","06d6a0","1b9aaa","ef476f"
                //, primaire: '#393473', secondaire: '#FF298A', tertiaire: '#FFD567'
            },
            dark: {},
        }
    },
    icons: {
        iconfont: 'fa',
    },
});