

<template>
    <div class="div-flex01">
        <b-navbar toggleable type="dark" variant="dark" toggle-breakpoint="md">
            <b-nav-toggle target="nav_collapse"></b-nav-toggle>
            <div class="container">
            <b-navbar-brand href="/"> <img src="../images/navbar-icon.png"> meet-Alex</b-navbar-brand>
            
            <b-collapse is-nav id="nav_collapse">
                <b-nav is-nav-bar>
                    <b-nav-item href="/collections">Collections</b-nav-item>
                    <b-nav-item href="/login">Login</b-nav-item>
                </b-nav>
            </b-collapse>
            </div>
        </b-navbar>
    </div>
</template>

<script>
export default {
    data() {
        return {
            isDropdownOpen: false,
            userEmail: ""
        }
    }
}
</script>
<style>
  img {
      width:40px;
  }
  .bg-dark {
    background-color: #2c3e50 !important;
}
</style>
