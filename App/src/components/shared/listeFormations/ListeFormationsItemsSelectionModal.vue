<template>
    <app-modal 
        :cssClass="cssClass"
        :msgAlert="msgAlert"
        transition="fadeInFromTop"
    >
        <v-icon 
            light 
            @click="closeThisModal"
            class="iconCloseModal"
        >fas fa-times</v-icon>

        <div class="selectedItemChips">
            <div v-if="itemChips.length == 0" class="defaultText">{{ defaultTextNoItems }}</div>
            <v-chip v-for="(chip, i) in itemChips" :key="i" 
                class="ma-1" 
                color="primaireLight" 
                small 
                close
                @click:close="deleteItem(chip)"
            >
                {{ chip }}
            </v-chip>
        </div>

        <div class="ItemsListContainer">
            <v-checkbox v-for="(item, i) in listItems" :key="i"
                v-model="selectedCheckboxes" 
                :label="item" 
                :value="item" 
                light 
                hide-details
                color="primaireLight"
                class="chbxItem"
            ></v-checkbox>
        </div>

        <v-btn 
            depressed 
            light
            :disabled="selectedCheckboxes.length == 0"
            @click="emitSelectionItems"
        >Valider</v-btn>
    </app-modal>
</template>

<script>
    export default {

        /* props: [
            'cssClass',
            'defaultTextNoItems',
            'listItems',
            'nbMaxItems',
            'textError',
            'selectedItems'
        ], */
        props: {
            cssClass: {
                type: String
            },
            defaultTextNoItems: {
                type: String
            },
            listItems: {
                type: Array,
                required: true
            },
            nbMaxItems: {
                type: Number,
                required: true
            },
            textError: {
                type: String
            },
            selectedItems: {
                type: Array
            }
        },
        
        data() {
            return {
                selectedCheckboxes: [],
                msgAlert: null
            }
        },

        computed: {
            itemChips() {
                return [...this.selectedCheckboxes].sort(); // On clone et on classe
            }
        },
        
        watch: {
            itemChips(val_now, val_prec) {
                if(this.selectedCheckboxes.length > this.nbMaxItems) {
                    // Identification de l'item de trop
                    const diff = val_now.filter(v => {
                        return val_prec.indexOf(v) == -1
                    });
                    //console.log("diff selection checkboxes => " + diff); //TEST
                    this.deleteItem(diff);
                    this.msgAlert = this.textError;
                } 

                if(val_prec.length == this.nbMaxItems && val_now.length == (this.nbMaxItems - 1)) {
                    this.msgAlert = null;
                }
            }
        },

        methods: {
            deleteItem(item) {
                this.selectedCheckboxes = this.selectedCheckboxes.filter(v => v != item);
            },
            closeThisModal() {
                // Réinitialisations
                this.selectedCheckboxes = []; 
                this.msgAlert = null;
                // Fermeture encart
                this.closeModal();
            },
            emitSelectionItems() {
                this.$emit('onSendItems', this.selectedCheckboxes);
                this.closeModal(); // Fermeture encart
            },
            closeModal() {
                this.$emit('onCloseModal');
            }
        },

        mounted() {
            this.selectedCheckboxes = this.selectedItems;
        }

    }
</script>

<style scoped>
    .selectedItemChips {
        min-height:45px;
        padding: 5px 20px;
    }
    .ItemsListContainer {
        height: calc(100% - 100px);
        overflow-y: auto; 
        background-color: #f5f5f5;
    }
    .chbxItem {
        margin: 6px 0 6px 10px;
    }
    .defaultText {
        line-height: 35px;
    }

    @media screen and (max-width: 600px) {
        .ItemsListContainer + .v-btn {
            width: 100% !important;
            padding: 25px 20px !important;
            border-radius: 0;
            margin: 4px 0 0 0;
        }
    }
</style>