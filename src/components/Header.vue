<style>
</style>

<template>
    <div class="div-flex01">
    <b-navbar toggleable type="inverse" variant="inverse" toggle-breakpoint="md" class="my-nav">
      <b-nav-toggle target="nav_collapse"></b-nav-toggle>
      <b-navbar-brand href="/">Home</b-navbar-brand>
      <b-collapse is-nav id="nav_collapse">
        <b-nav is-nav-bar>
          <b-nav-item href="/collections">Collections</b-nav-item>
            <b-nav-item href="/login">Login</b-nav-item>
        </b-nav>
      </b-collapse>
    </b-navbar>
    </div>
   
</template>

<script>
    export default {
        data() {
            return {
                isDropdownOpen: false,
                userEmail:""
            }
        }
    }
</script>
