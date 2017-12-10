<template>
    <div class="term-container-div" v-on:mouseenter="showMenus=true" v-on:mouseleave="showMenus=false">
        <div v-bind:class="{'div-menu-top':true, hide:!showMenus}">
            <b-nav class="float-right">
                <button v-bind:class="{'button-close':true, red:editMode}" v-on:click="editMode=!editMode">
                    <i class="fa fa-pencil" aria-hidden="true" title="Edit this term"></i>
                </button>
                <b-dropdown variant="link" size="lg" no-caret title='Actions'>
                    <template slot="button-content">
                    <i class="fa fa-ellipsis-h grey" aria-hidden="true"></i>
                    </template>
                        <b-dropdown-item>Copy</b-dropdown-item>
                        <b-dropdown-item>Edit</b-dropdown-item>
                        <b-dropdown-divider></b-dropdown-divider>
                        <b-dropdown-item>Archive</b-dropdown-item>
                </b-dropdown>
                <button class="button-close" v-on:click="closeWindow" title="Hide this term">
                    <i class="fa fa-times" aria-hidden="true"></i>
                </button>
            </b-nav>
        </div>
        <table class='term-header'>
          <tr>
            <td class="term-title">{{term.term_name}} </td>
            <td class="term-collection" title="Go to collection"> 
               <router-link :to="{ name: 'collectionDetail', params: { id: term.collection.id, tab:'terms' } }">  {{term.collection.collection_name}} </router-link>
            </td>
          </tr>
        </table>
 

        <div v-if="!editMode" class="term-desciption-div" v-html="term.term_definition"> </div>
        <div v-if="editMode && term.term_definition">
            <strong>Description:</strong>
            <tinymce id="nameEditor" v-model="term.term_definition" :options="tinymceOptions" @change="changed"></tinymce>
        </div>
        <div v-if="viewType>0">
            <div v-if="!editMode" class="term-addinfo" v-html="term.term_definition"> </div>
        <div v-if="editMode && term.term_definition">
            <strong>Additional notes:</strong>
            <tinymce id="notesEditor" v-model="term.term_definition" :options="tinymceOptions" @change="changed"></tinymce>
        </div>
        </div>

        <div class="term-details" v-if="viewType>1">
          <span class="subtitle"> Relations </span>

              <relationListTerm v-model="editMode" :term="term" :index="index"/>
        </div>
        


            <div v-bind:class="{'div-menu-bottom':true, hide:!showMenus}">
                  <button class="button" v-if="viewType===0" v-on:click="viewType=2" title="Hide this term">
                    <i class="fa fa-angle-down fa-lg grey" aria-hidden="true"></i>
                </button>
                 <button class="button" v-else v-on:click="viewType=0" title="Hide this term">
                    <i class="fa fa-angle-up fa-lg grey" aria-hidden="true"></i>
                </button>
        </div>     
    </div>
</template>

<script>
import Vue from "vue";
import globalData from "../global_data";
import { mapGetters, mapState, mapMutations } from "vuex";
import relationListTerm from "../plugins/relation-list-term.vue";

export default {
  name: "termDisplay",
  components: {relationListTerm},
  props: {
    term: { type: Object, required: true },
    index: { type: Number, required: true }
  },

  data() {
    return {
      viewType: 0,
      editMode: false,
      showMenus: false,
      viewOptions: [
        { text: "Description", value: 0 },
        { text: "Notes", value: 1 },
        { text: "All", value: 2 },
        { text: "Visual", value: 3 }
      ],
      tinymceOptions: {
        setup: function(ed) {},
        inline: false,
        plugins:
          "advlist autolink link image lists charmap print preview paste",
        skin: "lightgray",
        menubar: false,
        toolbar: "undo redo | bold italic underline | bullist numlist",
        statusbar: false,
        branding: false,
        theme: "modern",
        statusbar: true,
        resize: true,
        content_css: "css/app_mce.css",
        paste_as_text: true,
        mode: "textareas",
        force_br_newlines: false,
        force_p_newlines: false,
        forced_root_block: ""
      }
    };
  },
  created: function() {},
  methods: {
    ...mapMutations(["removeTermFromList", "fetchTerm"]),
    changed: function() {},
    closeWindow: function() {
      console.log("removing", this.index);
      this.removeTermFromList(this.index);
    }
  },
  computed: {
    ...mapState(["showTermList"])
  }
};
</script>



<style scoped>

table.term-header {
  width: calc(100% - 80px);
}
td.term-collection {
  float:right;
  color:lightgrey;
  border:none;
  padding:0px 8px;
  border-radius: 5px;
}

.term-container-div {
  border: 1px solid lightgrey;
  border-radius: 5px;
  padding: 0.1em 1em 1em 1em;
  margin-bottom: 1em;
  position: relative;
}
.term-container-div h2 {
  font-size: 1.1em;
  margin: 0em 0em 0em 0em;
}
.term-header-div {
  font-size: 1.2em;
  font-weight: 600;
}
.term-title {
  font-size: 1.2em;
  font-weight: 600;
  margin-top: 0px;
}
.term-description-div {
  font-size: 1em;
  font-weight: 400;
}
.fa-2 {
    width: 2rem;
}
div.term-addinfo {
  font-size: 0.9rem;
  font-weight: 400;
  border-top: 1px solid lightgrey;
  margin-top: 0.3em;
}
div.term-details {
   font-size: 0.9rem;
  font-weight: 400;

  margin-top: 0.3em;

}
.term-header-div .nav-link {
  font-size: 0.8rem;
  padding: 0px;
  font-weight: 400;
  color: #0275d8;
}
.button-close {
  padding: 0px;
  background: none;
  border: none;
  color: grey;
}
button {
 
  background: none;
  border: none;
  color: grey;
}
.div-menu-top {
  position: absolute;
  right: 5px;
  top: -8px;
}
.div-menu-bottom {
  position: absolute;
  left: 10px;
  bottom: -5px;
}
.grey {
    color:grey;
}
.red {
    color:red;
}
.hide {
    display:none;
}
button:focus {outline:0 !important;}
button:hover, i:hover {
  cursor: pointer;
}

.subtitle {
  font-size: 0.9rem;
  font-weight: 700;
}
table.relations {
  margin:0px 0px;
  border:none;
  padding:5px;
}
table.relations td {
  padding:0px 10px;
  background-color: #f9f9f9;
  border:1px solid white;
}

</style>