<script>
export default {
    methods: {
        allButWeekends(val) {
            const DTF = new Intl.DateTimeFormat("fr-FR", {weekday: "long"});
            const jourEnFrancais = DTF.format(new Date(val));
            return (jourEnFrancais !== 'samedi' && jourEnFrancais !== 'dimanche' ? val : '');
        }
    }
}
</script>
