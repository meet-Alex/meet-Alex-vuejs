<template>
    <div id="coldetail" class="container1 flex" >
        <br>
      <!--  <b-breadcrumb :items="breadCrum" /> -->
        <!-- Collection title and action menu -->
        <template>
          <table style="width: 100%;">
              <tr>
                  <td class="compact title-header">
                      Collection: {{collection.collection_name}}
                  </td>
                  <td align="right" v-if="collection.editable">
                      <b-nav class="float-right">
                          <button  v-bind:class="{'button-close':true, red:editMode}" v-on:click="changeEditmode">
                            <i class="fa fa-pencil" aria-hidden="true" title="Edit this collection"></i>
                          </button>
                          <b-dropdown variant="link" size="lg" no-caret title='Actions' :disabled="$route.params.id==='new'">
                              <template slot="button-content">
                              <i class="fa fa-ellipsis-h grey" aria-hidden="true"></i>
                              </template>
                                  <b-dropdown-item title="***todo***">Bookmark</b-dropdown-item>
                                  <b-dropdown-item title="***todo***">Contribute</b-dropdown-item>
                                  <b-dropdown-item v-if="collection.editable" v-on:click="doImport" title="Import terms and relations from file">Import data</b-dropdown-item>
                                  <b-dropdown-divider></b-dropdown-divider>
                                  <b-dropdown-item v-on:click="deleteCollection" title="Delete this collection">Delete</b-dropdown-item>
                        </b-dropdown>       
                      </b-nav>
                  </td>
              </tr>
          </table>
          <b-card no-body>
              <b-tabs no-body small  v-model="selectedTab" class='nopadding'>
                  <b-tab title="Collection" class='nopadding' >
                      <collectionDetails v-if="selectedTab===0" v-model="editMode" />
                      <!-- the v-if is to force a beforeDestory, so the update collection api is called when another tab is selected -->
                  </b-tab>
                  <template v-if="collection.id !==-1">
                    <b-tab title="Terms" class='nopadding'>
                        <termList :editMode="editMode" />
                    </b-tab>
                    <b-tab title="Relations">
                        <relationList  :editMode="editMode" :showHeader="true" />
                    </b-tab>
                    <b-tab title="Graph">
                        <visual v-if="selectedTab===3" :id="1" v-model="editMode" :collectionId="''+$route.params.id"  />
                    </b-tab>
                     <b-tab v-if="editMode" title="Import">
                          <collection-import :id="collection.id" />
                    </b-tab>
                  </template>
              </b-tabs>
          </b-card>
        </template>
    </div>
</template>

<script>
import collectionDetails from "components/collection/partial/collection-details.vue";
import termList from          "components/term/partial/term-list.vue";
import relationList from      "components/term/partial/relation-list.vue";
import visual from            "components/visual/visual.vue";
import collectionImport from  'components/collection/partial/collection-import.vue';

import { mapGetters, mapState, mapMutations } from "vuex";

export default {
  components: { collectionDetails, termList, relationList, visual, collectionImport },
  data() {
    return {
      editMode: false,
      selectedTab: 0
    };
  },
  created: function() {
    console.log(this.$route.params)
    if (this.$route.params.id !== "new") {
      if (this.$route.params.tab && this.$route.params.tab === "terms") {
        this.selectedTab = 1;
      } else if (
        this.$route.params.tab &&
        this.$route.params.tab === "relations"
      ) {
        this.selectedTab = 2;
      }
    } else {
      this.editMode = true;
    }
  },
  methods: {
    deleteCollection: function() {
      console.log("delete collection");
      var r = confirm(
        "This will delete the collection and its terms and relations. \n Are you sure you want to delete this collection?"
      );
      if (r) {
        this.$store
          .dispatch("DELETE_COLLECTION", this.collection)
          .then(response => {
            this.$router.push("/collections");
          });
      }
    },
    doImport: function() {
      this.editMode=true; 
      this.$nextTick(function() {
          this. selectedTab = 4
        });
    },
    changeEditmode: function () {
      if (this.selectedTab===4) {
        this.selectedTab=1;
      }
      this.editMode=!this.editMode
    }
  },
  computed: {
    ...mapState(["collection"]),
    breadCrum: function() {
      return [
        {
          text: "Home",
          to: { name: "Home" }
        },
        {
          text: "Collections",
          to: { name: "collections" }
        },
        {
          text: this.collection ? this.collection.collection_name : "",
          active: true
        }
      ];
    }
  },
  mounted: function() {
    this.$store.dispatch("FETCH_COLLECTION", this.$route.params.id);
  }
};
</script>
<style scoped>
.table {
  border: 1px solid grey;
}
.nav-link {
  padding: 0px !important;
}
button {
  background: none;
  border: none;
  color: grey;
}
button:focus {
  outline: 0 !important;
}
 button:hover, i:hover {
        cursor: pointer;
    }
.red {
  color: red;
}
</style>
