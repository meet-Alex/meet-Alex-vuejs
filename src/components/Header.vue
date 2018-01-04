<template>
    <div class="div-flex01">
        <b-navbar toggleable type="dark" variant="dark" toggle-breakpoint="md">
            <b-nav-toggle target="nav_collapse"></b-nav-toggle>
            <div class="container">
                <b-navbar-brand href="/"> <img src="../images/navbar-icon.png"> meet-Alex</b-navbar-brand>
                <b-collapse is-nav id="nav_collapse">
                    <b-navbar-nav>
                        <b-nav-item><router-link :to="{ name: 'collections' }" >Collections </router-link></b-nav-item>
                    </b-navbar-nav>
                     <b-navbar-nav>
                        <b-nav-item><router-link :to="{ name: 'termDetail', params: { id:'none' } }" >Terms</router-link></b-nav-item>
                    </b-navbar-nav>
                    <b-navbar-nav class="ml-auto">
                        <b-nav-item v-if="!userinfo.loggedin"><router-link :to="{ name: 'Login' }" >Login </router-link></b-nav-item>
                        <b-nav-item v-if="userinfo.loggedin"><router-link :to="{ name: 'Login' }" >{{userinfo.name}} </router-link></b-nav-item>
               
                    </b-navbar-nav>
                </b-collapse>
            </div>
        </b-navbar>
    </div>
</template>

<script>
import { mapState, mapMutations } from "vuex";

export default {
  data() {
    return {};
  },
  methods: {
      ...mapMutations(["getLogin"])
  },
  created: function() { 
      this.getLogin();
  },
  computed: {
    ...mapState(["userinfo"])
  }
};
</script>
<style scoped>
img {
  width: 40px;
}
.bg-dark {
  background-color: #2c3e50 !important;
}
</style>
