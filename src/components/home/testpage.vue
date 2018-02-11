<template>
  <div class="container">
    Test page: {{myVar}}
  </div>
</template>


<script>
  export default {
    data() {
      return {
        myVar: "my string"
      };
    },
    created: function() {
    }
  };
</script>
<style scoped>
.container {
  width: 800px;
  padding: 50px;
}
</style>