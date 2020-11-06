<script>
export default {
    methods: {
        dateToInteger(date) {
            return parseInt(date.replace(/-/g, ""));
        }
    }
}
</script>