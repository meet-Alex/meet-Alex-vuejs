<template>
    <div class="container flex">
        <b-breadcrumb :items="breadCrum" />

        <div v-for="(term, index) in showTermList">
        <termdisplay  :term="term" :index="0" :newTerm="newTerm" />
        </div>
             <b-button v-on:click="createTerm" variant="primary" size="sm">Create</b-button>

         
    </div>
</template>

<script>
import termdisplay from "../../plugins/termDisplay.vue";
import findterm from "../../plugins/findTerm.vue";
import { mapGetters, mapState, mapMutations } from "vuex";

export default {
  components: { termdisplay, findterm },
  data() {
    return {
      emptyTerm: {
        term_name: "",
        term_description: "",
        id: -1,
        collection: { },
        collection_id: 0
      },
      viewType: 0,
      newTerm: true,
      editMode: false,
      breadCrum: [
        {
          text: "Home",
          to: { name: "Home" }
        },
        {
          text: "Terms"
        }
      ]
    };
  },
  computed: {
    ...mapState(["showTermList", "collection"])
  },
  created: function() {
      this.emptyTerm.collection_id=this.collection.id;
      this.emptyTerm.collection=this.collection;
      this.emptyTerm.position=0;
      this.clearTermList();
      this.fetchTerm(this.emptyTerm);
  },
  methods: {
    ...mapMutations(["clearTermList", "fetchTerm"]),
    createTerm: function() {
      if (this.showTermList[0].term_name.length) {
        this.$store.dispatch("ADD_TERM", this.showTermList[0]).then(newTerm => {
          console.log("gelukt");
          console.log(newTerm)
          this.clearTermList();
          
          
        newTerm.position=0;
        newTerm.collection={id:this.collection.id}
          this.fetchTerm(newTerm);
          this.term=this.showTermList[0];

          console.log(this.showTermList);
        });
      }

    }
  }
};
</script>

<style scoped>
.findTermWidth {
  width: 20rem;
}
.alignright {
  float: right;
}
.toprow {
  width: 100%;
}
.button-close {
  padding: 0px;
  background: none;
  border: none;
  color: grey;
}
button:focus {
  outline: 0 !important;
}
button:hover {
  cursor: pointer;
}
</style>
