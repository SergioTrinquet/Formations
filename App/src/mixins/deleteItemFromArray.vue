<script>
    export default {
        methods: {
            deleteItemFromArray(array, itemToRemove) {
                return array.filter(v => v != itemToRemove);
            }
        }
    }
</script>