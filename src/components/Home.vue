<template>

   <div>
        <div style="text-align:center">
        <span class='alex'><br><br><br><br><br>a l e x</span>
        </div>
        <div class='alex-below'></div>
   </div>

</template>



<script>
    import {mapGetters } from 'vuex';
     
    export default {
        data() {
            return {
                isDropdownOpen: false
            }
        },
        created: function () {
            this.getLogin();
            this.$store.dispatch("FETCH_COLLECTIONS");
        },
        methods: {
             ...mapGetters(['getLogin'])
        }
    }

</script>



