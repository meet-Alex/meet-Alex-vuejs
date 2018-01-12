<template>
    <div id="app">
        <app-header></app-header>
        <router-view></router-view>
        <notifications group="foo" />
        <show-loader></show-loader>
       
    </div>
</template>

<script>
    import Header from './components/Header.vue';
    import Loader from './plugins/Loader.vue';
    export default {
        components: {
            appHeader: Header,
            showLoader: Loader
        }
    }
</script>

<style>

</style>
