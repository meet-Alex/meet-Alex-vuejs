<template>
    <div class="content">
        <h3>Name</h3>
        <b-form-input v-if="value" v-model="collection.collection_name" class="form-control filterInput" placeholder="Provide name"></b-form-input>
        <span v-if="!value">{{collection.collection_name}}</span>
        <h3>Description</h3>
        <div v-if="value">
            <tinymce id="nameEditor" v-model="collection.collection_description" :options="tinymceOptions" @change="tinyMCE_Changed"></tinymce>
        </div>
        <div v-if="!value" v-html="collection.collection_description"></div>
        <h3>Settings</h3>
        <b-form-checkbox :disabled="!value" v-model="collection.receive_notifications" value="1" unchecked-value="0">
            Notifications
        </b-form-checkbox> <br>
        <b-form-checkbox :disabled="!value" v-model="collection.public" value="1" unchecked-value="0">
            Public
        </b-form-checkbox>
        <br>
        <b-button v-if="$route.params.id==='new'" v-on:click="createCollection" variant="primary" size="sm" :disabled='!collection.collection_name.length'>Create</b-button>
        <b-button v-if="value&&$route.params.id!=='new'" variant="primary" size="sm">Update</b-button>
        <h3>Statistics</h3>
        <table class="infotable">
            <tr>
                <td>Nr of terms</td>
                <td>{{collection.terms?collection.terms.length:0}}</td>
            </tr>
            <tr>
                <td>Nr of relations</td>
                <td>{{collection.ontologies?collection.ontologies.length:0}}</td>
            </tr>
            <tr>
                <td>Created by</td>
                <td>{{collection.owner?collection.owner.name:""}}</td>
            </tr>
            <tr>
                <td>Creation date</td>
                <td>{{collection.created_at}}</td>
            </tr>
            <tr>
                <td>Last update</td>
                <td>{{collection.updated_at}}</td>
            </tr>
        </table>
        <br>
        <h3>Followers</h3>
        ***todo***
    </div>
</template>

<script>
import Vue from "vue";
import globalData from "../global_data";
import { mapGetters, mapState, mapMutations } from "vuex";

export default {
  name: "collectionDetails",
  data() {
    return {
      tinymceOptions: {
        setup: function(ed) {},
        inline: false,
        plugins:
          "advlist autolink link image lists charmap print preview paste",
        skin: "lightgray",
        menubar: false,
        toolbar: "undo redo | bold italic underline | bullist numlist",
        statusbar: true,
        branding: false,
        resize: true,
        theme: "modern",
        content_css: "/app_mce.css",
        paste_as_text: true,
        mode: "textareas",
        force_br_newlines: false,
        force_p_newlines: false,
        forced_root_block: ""
      }
    };
  },
  props: {
    value: { type: Boolean, required: true }
    /*
        displayName: { type: String, required: true },
        routerName: { type: String, default: true },
        inputArray: { type: Array, required: true }
        */
  },
  created: function() {},
  methods: {
    ...mapMutations(["changeCollection"]),
    tinyMCE_Changed: function() {},
    createCollection: function() {
        console.log(this.collection);
        this.$store.dispatch("ADD_COLLECTION", this.collection)
        .then(collection => {
            console.log(collection);
             this.$store.dispatch("FETCH_COLLECTION", collection.id)
            this.$router.replace({ name: 'collectionDetail', params: { id: collection.id }})
         })
    }
  },
  computed: {
    ...mapState(["collection"])
  },
  beforeDestroy: function() {
    console.log("beforedestroy");
    this.changeCollection(this.collection);
  }
};
</script>

<style scoped>
.content {
  padding: 1.5rem;
}
</style>