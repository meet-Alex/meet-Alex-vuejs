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
                <td align="right">
                    <b-nav class="float-right">
                        <b-form-checkbox v-model="editMode">
                            Edit
                        </b-form-checkbox>
                        <b-nav-item-dropdown :disabled="$route.params.id==='new'" text="Actions" right title='Actions for this collection'>
                            <b-dropdown-item title="***todo***">Bookmark</b-dropdown-item>
                            <b-dropdown-item title="***todo***">Contribute</b-dropdown-item>
                            <b-dropdown-divider></b-dropdown-divider>
                            <b-dropdown-item title="***todo***">Archive</b-dropdown-item>
                        </b-nav-item-dropdown>
                    </b-nav>
                </td>
            </tr>
        </table>
        <b-card no-body>
            <b-tabs no-body small  v-model="selectedTab" class='nopadding'>
                <b-tab title="Collection" class='nopadding' >
                    <collectionDetails v-model="editMode" />
                </b-tab>
                <b-tab title="Terms" class='nopadding'>
                    <termList v-model="editMode" />
                </b-tab>
                <b-tab title="Relations">
                    <relationList v-model="editMode" />
                </b-tab>
                <b-tab title="Graph">
                     <visual v-if="selectedTab===3" id="aa" v-model="editMode" :collectionId="''+$route.params.id"  />
                </b-tab>
            </b-tabs>
        </b-card>

    </div>
</template>

<script>
import collectionDetails from "../../plugins/collection-details.vue";
import termList from "../../plugins/term-list.vue";
import relationList from "../../plugins/relation-list.vue";
import visual from "../../plugins/visual.vue";
import { mapGetters, mapState, mapMutations } from "vuex";

export default {
  components: { collectionDetails, termList, relationList, visual },
  data() {
    return {
      editMode: false,
      selectedTab: 0
    };
  },
  created: function() {
    this.fetchCollection(this.$route.params.id);
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
  methods: {
    ...mapMutations(["fetchCollection"])
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

</style>
