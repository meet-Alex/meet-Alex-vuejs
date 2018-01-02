<template>
    <div id="app">
        <app-header></app-header>
        <router-view></router-view>
        <notifications group="foo" />
    </div>
</template>

<script>
    import Header from './components/Header.vue';
    export default {
        components: {
            appHeader: Header
        }
    }
</script>

<style>

</style>
