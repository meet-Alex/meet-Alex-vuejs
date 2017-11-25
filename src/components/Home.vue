<template>

   <div>
        <div style="text-align:center">
        <span class='alex'><br><br><br><br><br>a l e x</span>
        </div>
        <div class='alex-below'></div>
   </div>

</template>



<script>
    import { mapMutations, mapGetters } from 'vuex';
     
    export default {
        data() {
            return {
                isDropdownOpen: false
            }
        },
        created: function () {
            this.getLogin();
            this.fetchCollections();
        },
        methods: {
             ...mapMutations(['fetchCollections']),
             ...mapGetters(['getLogin'])
        }
    }

</script>



