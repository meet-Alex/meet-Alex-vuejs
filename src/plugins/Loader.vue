<template>
     <div v-if="isLoading"  style="position: absolute; left: 50%; top: 50%">
    <div style="position: relative; left: -50%; top:-50%;">
      <i class="fa fa-spinner fa-spin fa-3x"></i>
    </div>
  </div>
</template>

<script>
import { mapState, mapMutations } from "vuex";


export default {
      name: "showloader",
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
    width:40px;
    height:40px;
    margin:auto;
}
i {
     position:relative;
    top: calc(50% - 15px); /* 50% - 3/4 of icon height */
    left: calc(50% - 25px);
}

</style>
