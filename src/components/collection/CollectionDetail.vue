<template>
    <div class="container flex">
        <br>
        <b-breadcrumb :items="breadCrum" />
        <!-- Collection title and action menu -->

        <table style="width: 100%;">
            <tr>
                <td class="compact title-header">
                    Collection: {{collection.collection_name}}
                </td>
                <td align="right" v-if="collection.editable">
                    <b-nav class="float-right">
                        <button  v-bind:class="{'button-close':true, red:editMode}" v-on:click="editMode=!editMode">
                          <i class="fa fa-pencil" aria-hidden="true" title="Edit this collection"></i>
                        </button>
                        <b-dropdown variant="link" size="lg" no-caret title='Actions' :disabled="$route.params.id==='new'">
                            <template slot="button-content">
                            <i class="fa fa-ellipsis-h grey" aria-hidden="true"></i>
                            </template>
                                <b-dropdown-item title="***todo***">Bookmark</b-dropdown-item>
                                <b-dropdown-item title="***todo***">Contribute</b-dropdown-item>
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
                      <visual v-if="selectedTab===3" id="aa" v-model="editMode" :collectionId="''+$route.params.id"  />
                  </b-tab>
                </template>
            </b-tabs>
        </b-card>

    </div>
</template>

<script>
import collectionDetails from "../../plugins/collection-details.vue";
import termList from "../../plugins/term-list.vue";
import relationList from "../../plugins/relation-list.vue";
import visual from "../../plugins/visual.vue";
import { mapGetters, mapState } from "vuex";

export default {
  components: { collectionDetails, termList, relationList, visual },
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
          text: this.collection ? this.collection.name : "",
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
