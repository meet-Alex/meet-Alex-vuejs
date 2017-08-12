<style>
   
</style>

<template>
    <b-navbar toggleable type="inverse" variant="inverse" toggle-breakpoint="md" class="my-nav">
      <b-nav-toggle target="nav_collapse"></b-nav-toggle>
      <b-navbar-brand href="/">Home</b-navbar-brand>
      <b-collapse is-nav id="nav_collapse">
        <b-nav is-nav-bar>
          <b-nav-item href="/collections">Collections</b-nav-item>
        </b-nav>
      </b-collapse>
    </b-navbar>
</template>

<script>
    export default {
        data() {
            return {
                isDropdownOpen: false
            }
        }
    }
</script>
