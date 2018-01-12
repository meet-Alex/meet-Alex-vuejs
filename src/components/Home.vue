<template>
   <div>
        <div style="text-align:center">
            <div class='alex'>
                <table style="margin:auto">
                    <tr>
                        <td><img src="../images/navbar-icon.png"></td>
                <td class='alextext'>A-Lex</td>
                </tr>
                </table>
            </div>
            <div id="findTerm">
                <findterm :change="getTerm"/>
            </div>
            <div id="buttons">
                or <br> <br>
                <router-link :to="{ name: 'collections' }"> 
                     <span class="btn btn-primary"> Browse collections </span>
                </router-link>
                <br> <br>
                <transition name="fade">
                    <button v-if="!viewExplain" class="nobutton" v-on:click="viewExplain=true">
                            <i class="fa fa-angle-down fa-3x grey" aria-hidden="true"></i>
                    </button>
                    <button v-else class="nobutton" v-on:click="viewExplain=false">
                            <i class="fa fa-angle-up fa-3x grey" aria-hidden="true"></i>  
                    </button>
                 </transition>
            </div>
             <transition name="fade">
                <div v-if="viewExplain" id='addinfo'>
                    <h2>Everything you need to describe your data</h2>

                    <h3>Term</h3>
                    <p>The basic unit in meet-Alex. It's a word or a few words combined, used to name something. For example "tomato", "table", or "dinner table", "customer", "name", "colour", "calorie". All information is basically organised by <strong>terms</strong>.</p>  
                   
                    <h3>Description</h3>
                    <p>The mechanism to communicate the meaning of a <strong>term</strong> inside a <strong>collection</strong>. Here you can describe what the term represents (for example "tomato is a fruit"), and how it distincts from other terms (for example which characteristic clearly distincts a "tomato" from an "apple"?). </p>

                    <h3>Relation</h3>
                    <p>The mechanism to structure data, by connecting two <strong>terms</strong> inside a <strong>collection</strong>. <strong>Relations</strong> are always stored in the context of a <strong>collection</strong> though some of the terms which are in the <strong>relation</strong> might be used in other <strong>collections</strong>.</p>

                    <h3>Collection</h3>
                    <p>The mechanism to group a number of <strong>terms</strong> by a user. Currently we only allow creating <strong>terms</strong> through a <strong>collection</strong>. But we also allow using <strong>terms</strong> from other collections inside your collection.</p>
                    <p><strong>Collections</strong> enable management of <strong>terms</strong> and organise collaboration on <strong>terms</strong>.</p>
                </div>
            </transition>
        </div>
   </div>
</template>



<script>
    import {mapGetters } from 'vuex';
    import findterm from "../plugins/findTerm.vue";
     
    export default {
         components: {findterm},
        data() {
            return {
                isDropdownOpen: false,
                viewExplain: false
            }
        },
        mounted: function () {
            this.getLogin();
            this.$store.dispatch("FETCH_COLLECTIONS");
             this.$store.commit('showSearchBox', false);
        },
        methods: {
             ...mapGetters(['getLogin']),
            getTerm: function(term) {
                    this.$router.push("/terms/"+ term.id);
            },
        },
         beforeDestroy: function() {
               this.$store.commit('showSearchBox', true);
         }
    }

</script>

<style scoped>
    #findTerm {
        padding: 40px 0px 10px 0px;
        width:400px;
        margin:auto;
    }
    .grey {
        color:grey;
    }
    .nobutton {
        background:none;
        border:none;
    }
    .nobutton:focus {
      outline:0;
    }
    #addinfo {
        margin:auto;
        width:800px;
        text-align:left;
        font-family: "Lato","Helvetica Neue",Helvetica,Arial,sans-serif;
        font-weight: 400;
        line-height: 1.1;
        color: #2c3e50;
        font-family: "Lato","Helvetica Neue",Helvetica,Arial,sans-serif;
        font-size: 15px;
        line-height: 1.42857143;
        box-shadow: 2px 2px 8px grey;
        padding:10px;
    }
    #addinfo h2, #addinfo h3 {
        margin-top: 21px;
        margin-bottom: 10.5px;
    }
    #addinfo h2 {
        font-size:32px !important;
    }
    #addinfo h3 {
        font-size:22px !important;
    }
    #addinfo p {
            margin: 0 0 10.5px;
    }
    .alex {
    font-weight:normal;
  
    color:#000000;
    letter-spacing:0.1em;
    word-spacing:1em;
    font-size:78px;
    text-align:center;
      font-family: "Lato","Helvetica Neue",Helvetica,Arial,sans-serif;
    line-height:0;
    margin:auto;
    padding:150px 0px 20px 0px;
   
    }
    .alextext {
        padding:0px 0px 30px 30px;
        vertical-align:bottom;
        color:#2c3e50
       
    }

.fade-enter-active, .fade-leave-active {
  transition: opacity .3s
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0
}

</style>



