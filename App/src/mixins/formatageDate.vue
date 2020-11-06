<script>
    export default {
        methods: {
            formatDate(date) {
                if (!date) return null;
                const [year, month, day] = date.split('-');
                return `${day}/${month}/${year}`;
            }
        }
    }
</script>