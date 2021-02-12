<template>

    <v-overlay :value="display" opacity="0.75">
        <transition :name="transition" appear>
            <div :class="['customModal', cssClass]" :style="style">
                <div v-if="msgAlert !== null && typeof msgAlert !== 'undefined'" class="alert" ref="alert">{{ msgAlert }}</div>
                <div v-if="header" class="headerModal primaireLight">{{ header }}</div>
                <slot></slot>
            </div>
        </transition>
    </v-overlay>

</template>

<script>
export default {
    props: {
        display: {
            //type: Boolean // Empeche modal de s'ouvrir ds certains cas ?
        }, 
        width: {
            type: String
        }, 
        height: {
            type: String
        },
        cssClass: {
            type: String
        },
        header: {
            type: String
        },
        msgAlert: {
            type: String
        },
        transition: {
            type: String,
            default: "fadeInFromBottom"
        }
    },
    computed: {
        style() {
            return (this.width ? 'width:' + this.width + ';' : '') + (this.height ? 'height:' + this.height + ';' : '')
        }
    }
}
</script>

<style scoped>
    .customModal {
        background-color: #fff;
        border-radius: 3px;
        padding: 4px;
        text-align: center;
        font-size: 17px;
        color: #585858;
        text-align: center;
        line-height: 24px;
        position: relative;
        /* height: 70%;
        position: fixed;
        transform: translate(-50%, -50%); */
    }

    .headerModal {
        color: #fff;
        padding: 10px 30px;
        border-radius: 2px 2px 0 0;
    }

    .alert {
        position: absolute;
        background-color: #fd5656;
        color: #fff;
        width: 100%;
        border-radius: 3px;
        padding: 10px 20px;
        margin: -65px 0 0 -4px;
        animation: 0.3s ease-in-out 3s forwards theFadeOut;
    }

    @keyframes theFadeOut {
        from { opacity: 1; }
        to { opacity: 0; }
    }
</style>