<template>
    <div style="text-align:center" class="container1">
        <div>
            <div class='alex' v-if="!modeUp">
                <table style="margin:auto" >
                    <tr>
                        <td class='aleximage'><img class='aleximage' src="src/images/abn amro lexicon logo black.png"></td>
                    </tr>
                    <tr>
                        <td class='alextext'>ABN AMRO Lexicon</td>
                    </tr>
                </table>
            </div>
        </div>
        
        <div id="divFindTerm">
            <find-term :change="getTerm" @hasText="switchMode"  />
        </div>
        <div id="buttons" v-if="!modeUp">
            <br> <br>
            <router-link :to="{ name: 'collections' }"> 
                <span class="btn btn-primary"> Browse collections </span>
            </router-link>
        </div>
    </div>
</template>



<script>
    import {mapGetters } from 'vuex';
    import findTerm from "components/term/partial/find-term.vue";
     
    export default {
         components: {findTerm},
        data() {
            return {
                isDropdownOpen: false,
                viewExplain: false,
                modeUp: false,
                searchText: ""
            }
        },
        mounted: function () {
            console.log('home mounted')
            this.getLogin();
            this.$store.dispatch("FETCH_COLLECTIONS");
            this.$store.commit('showSearchBox', false);
        },
        methods: {
             ...mapGetters(['getLogin']),
            getTerm: function(term) {
                    this.$router.push("/terms/"+ term.id);
            },
            switchMode: function(hasText) {
                this.modeUp=hasText.hasText;
                this.searchText=hasText.text;
            }
        },
         beforeDestroy: function() {
               this.$store.commit('showSearchBox', true);
         }
    }

</script>

<style scoped>
    #divFindTerm {
        padding: 10px 0px 10px 0px;
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
    .nobutton:hover {
        cursor: pointer;
       
    }
   .grey:hover {
         color:blue;
    }
   
    .alex {
    font-weight:normal;
  
    color:#000000;
   
    font-size:64px;
    text-align:center;
      font-family: "Lato","Helvetica Neue",Helvetica,Arial,sans-serif;
   
    margin:auto;
    padding:100px 0px 20px 0px;
   
    }
    .alextext {
        padding:0px 0px 30px 30px;
        vertical-align:bottom;
        color:#2c3e50;
    }
     .aleximage {
       height: 100px;
    }

    

.fade-enter-active, .fade-leave-active {
  transition: opacity .3s
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0
}

@keyframes bounceIn{
  0%{
    opacity: 0;
    transform: scale(0.3) translate3d(0,0,0);
  }
  50%{
    opacity: 0.9;
    transform: scale(1.1);
  }
  80%{
    opacity: 1;
    transform: scale(0.89);
  }
  100%{
    opacity: 1;
    transform: scale(1) translate3d(0,0,0);
  }
}

</style>



