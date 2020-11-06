<script>
    export default {
        methods: {
            getCurrentDate() {
                const today = new Date();
                const month = (today.getMonth()+1).toString();
                const day = today.getDate().toString();
                return today.getFullYear().toString() + (month.length == 1 ? ("0" + month) : month)  + (day.length == 1 ? ("0" + day) : day);
            }
        }
    }
</script>