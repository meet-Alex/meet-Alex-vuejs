<template>
    <div class="container">
      <collectionimport :id="$route.params.id" />
    </div>
</template>

<script>
  
    import collectionimport from '../../plugins/collection-import.vue';

    import { mapGetters, mapState } from 'vuex';

    export default {
        components: { collectionimport},
        data() {
            return {
              
            }
        },
        created: function() {
           
        },
        computed: { 
           
        }
    }
</script>

<style scoped>
    
</style>
