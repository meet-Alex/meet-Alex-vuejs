<template>
    <div class="container1 flex">
      <!--  <b-breadcrumb :items="breadCrum" /> -->
      
        <div v-if="showTermList.length>0">
            <table class='toprow'> 
                <tr>
                <td class="findTermWidth">
                <!--  <findterm :change="getTerm"/> -->
                </td>
                <td class='alignright'>
                    <button class="button-close" v-on:click="closeAll" title="Clear all">
                        <i class="fa fa-times fa-lg" aria-hidden="true"></i>
                    </button>
                </td>
                </tr>
            </table>      
            <term-display  v-for="(term, index) in showTermList" :key="term.id" :id="term.id"  :term="term" :index="index" />
        </div>
        <div v-else>
            No terms to display. Use the search box to display a term.
        </div>
    </div>
</template>

<script>
import termDisplay from "components/term/partial/term-display.vue";
import { mapGetters, mapState, mapMutations } from "vuex";

export default {
     components: { termDisplay},
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
         this.$store.dispatch("REFRESH_TERMLIST");
        if (this.$route.params.id!=='none') {
            this.$store.dispatch("FETCH_TERM", {id:this.$route.params.id, position:0});
        }
    },
    methods: {
        ...mapMutations(["clearTermList"]),
        getTerm: function(term) {
            console.log(term);
               this.$store.dispatch("FETCH_TERM", {id:term.id, position:0});
        },
        closeAll: function () {
            console.log('clearing');
            this.clearTermList();
        }
    }
}
</script>

<style scoped>
.findTermWidth {
    width:20rem;
}
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
button:hover {
  cursor: pointer;
}
</style>
