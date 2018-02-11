<template>
    <div id="app">
        <app-header></app-header>
        <router-view></router-view>
        <notifications group="foo" />
        <show-loader></show-loader>
       
    </div>
</template>

<script>
    import header from 'components/generic/header.vue';
    import Loader from 'components/generic/loader.vue';
    export default {
        components: {
            appHeader: header,
            showLoader: Loader
        }
    }
</script>

<style>

</style>
