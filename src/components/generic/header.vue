<template>
    <div class="div-flex01">
        <b-navbar toggleable type="dark" variant="dark" toggle-breakpoint="md">
            <b-nav-toggle target="nav_collapse"></b-nav-toggle>
            <div class="container">
                <b-navbar-brand> <router-link :to="{ name: 'Home' }" >ABN AMRO Lexicon </router-link> </b-navbar-brand>
                <b-collapse is-nav id="nav_collapse">
                    <b-navbar-nav>
                        <b-nav-item><router-link :to="{ name: 'collections' }" >Collections </router-link></b-nav-item>
                    </b-navbar-nav>
                     <b-navbar-nav>
                        <b-nav-item><router-link :to="{ name: 'termDetail', params: { id:'none' } }" >Terms</router-link></b-nav-item>
                    </b-navbar-nav>
                    <b-navbar-nav>
                        <div v-if="showSearchBox" id='searchbox'>
                            <find-term :change="getTerm"/>
                        </div>  
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
    import findTerm from "components/term/partial/find-term.vue";

    export default {
        components: {findTerm},
    data() {
        return {};
    },
    methods: {
        ...mapMutations(["getLogin"]),
        getTerm: function(term) {
                if (this.$route.path.indexOf('/terms/')!==0) {
                    this.$router.push("/terms/"+ term.id);
                } else {
                    this.$store.dispatch("FETCH_TERM", {id:term.id, position:0});
                    this.$router.replace("/terms/"+ term.id);    
                }
            },
    },
    created: function() { 
        this.getLogin();
    },
    computed: {
        ...mapState(["userinfo", "showSearchBox"])
    }
    };
</script>
<style scoped>
    #searchbox {
        margin: 5px 20px;
        width:250px;
    }
    img {
        width: 40px;
    }
    .bg-dark {
        background-color: rgb(0,146,134) !important;
    }
    a {
        color:white;
        padding:8px 6px;
    }
    a :hover {
        background-color: rgb(0,76,76);
        text-decoration: none;
    }
    .navbar-brand {
        font-size: 1.5rem;
        margin-right: 80px;
    }
    .container {
        max-width:100%;
        flex-wrap: nowrap;
     /*   display: flex; */
        line-height:1;
        margin:0px 30px;
    }
</style>
