<template>
    <div class="container flex">
        <b-breadcrumb :items="breadCrum" />
        <table class='toprow'> <tr>
            <td>
                <findterm :change="getTerm"/>
            </td>
            <td class='alignright'>
                 <button class="button-close" v-on:click="closeAll" title="Clear all">
                    <i class="fa fa-times fa-lg" aria-hidden="true"></i>
                </button>
            </td>
        </tr></table>
        <div v-for="(term, index) in showTermList">
        <termdisplay  :term="term" :index="index" />
        </div>
         
    </div>
</template>

<script>
import termdisplay from "../../plugins/termDisplay.vue";
import findterm from "../../plugins/findTerm.vue";
import { mapGetters, mapState, mapMutations } from "vuex";

export default {
     components: { termdisplay, findterm},
    data() {
        return {
            term: {},
            viewType: 0,
            editMode: false,
            breadCrum: [
                {
                    text: 'Home',
                    to: { name: "Home" }
                }, {
                    text: 'Terms',
                  
                }
            ]
        }
    },
     computed: {
    ...mapState(["showTermList"])
     },
    created: function() {
        this.fetchTerm(this.$route.params.id,0); 
    
    },
    methods: {
        ...mapMutations(["fetchTerm", "clearTermList"]),
        
        getTerm: function(term) {
            console.log(term);
            this.fetchTerm(term.id,0); 
        },
        closeAll: function () {
            console.log('clearing');
            this.clearTermList();
        }
    }
}
</script>

<style scoped>
.alignright {
    float:right;
}
.toprow {
    width:100%;
}
.button-close {
  padding: 0px;
  background: none;
  border: none;
  color: grey;
}
button:focus {outline:0 !important;}

</style>
