<template>
    <div v-if="isLoading" class="loader">
        <i class="fa fa-spinner fa-spin fa-3x"></i>
    </div>
</template>

<script>
import { mapState, mapMutations } from "vuex";


export default {
  data() {
    return {};
  },
  methods: {

  },
  created: function() { 
  },
  computed: {
    ...mapState(["isLoading"])
  }
};
</script>
<style scoped>
.loader {
    position:absolute;
    width:100%;
    height:100%;
}
i {
     position:relative;
    top: calc(50% - 15px); /* 50% - 3/4 of icon height */
    left: calc(50% - 25px);
}

</style>
