<template>
    <div class="inline-edit">
        <div class="inline-edit-row">
            <div class="inline-edit-cell name">
                <textarea ref="termNameInput" class="form-control lightblue" type="text" v-model="activeTerm.term_name" v-on:keydown="preventEnter($event)"></textarea>
            </div>
            <div class="inline-edit-cell def tinymce-inline">
                <tinymce id="descriptionEditor" v-model="activeTerm.term_definition" :options="tinymceOptions" @change="changed"></tinymce>
               </div>
            <div v-if="isNew" class="inline-edit-cell iconbutton">
                 <a  href="#" class='iconbutton'  v-on:click="addTerm()" >
                    <i class="fa fa-check-circle" aria-hidden="true"></i>
                </a>
            </div>
             <div v-else class="inline-edit-cell iconbutton">
                 <a  href="#" class='iconbutton'  v-on:click="removeTerm()" >
                     <i class="fa fa-trash" aria-hidden="true"></i>
                </a>
            </div>
        </div>
    </div>
</template>

<script>
import { mapGetters } from "vuex";
export default {
  name: "edit-term-list",
  props: {
    editTerm: Object
  },
  data() {
    var that = this;
    return {
      isNew: false,
      isRemoved: false,
      activeTerm: {},
      tinymceOptions: {
        setup: function(ed) {
          ed.addButton("expand", {
            tooltip: "Edit all properties of this term",
            icon: "fa fa-expand",
            onclick: function() {
              that.$router.push({
                name: "termDetail",
                params: { id: that.activeTerm.id, edit: true }
              });
            }
          });
          ed.on("keydown", function(e) {
            if (this.id !== "descriptionEditor") return;
            var keynum;
            if (window.event) {
              // IE
              keynum = e.keyCode;
            } else if (e.which) {
              // Netscape/Firefox/Opera
              keynum = e.which;
            }
            if (keynum === 9) {
                // tab
                if (that.isNew) {
                    that.addTerm();
                    that.$refs.termNameInput.focus();
                    e.preventDefault();
                }
            }
          });
        },
        inline: true,
        plugins:
          "advlist autolink link image lists charmap print preview paste",
        skin: "lightgray",
        menubar: false,
        toolbar: "expand | undo redo | bold italic underline | bullist numlist",
        statusbar: false,
        branding: false,
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
  created: function() {
    if (!this.editTerm) {
      this.isNew = true;
      this.activeTerm = {
        id: 0,
        term_name: "",
        term_definition: "",
        collection_id: this.getActiveCollection().id
      };
    } else {
      this.isNew = false;
      this.activeTerm = JSON.parse(JSON.stringify(this.editTerm));
    }
    tinymce.baseURL = "../node_modules/tinymce";
  },
  beforeDestroy: function() {
    var isDirty=false;
    if (this.editTerm && this.activeTerm) {
       isDirty=!(this.editTerm.term_name===this.activeTerm.term_name && this.editTerm.term_definition===this.activeTerm.term_definition);
    }
    if (this.isNew) {
      this.addTerm();
    } else if (!this.isRemoved && isDirty) {
      console.log('change term');
      this.$store.dispatch("CHANGE_TERM", this.activeTerm);
    }
  },
  methods: {
    ...mapGetters(["getActiveCollection"]),
    preventEnter: function(e) {
      if (e.keyCode === 13) {
        e.preventDefault();
      }
    },
    changed: function() {
    },

    expand: function() {
      this.$router.push("home");
    },
    addTerm: function() {
      if (this.activeTerm.term_name.length) {
        this.$store.dispatch("ADD_TERM", this.activeTerm).then(() => {
          this.activeTerm.term_name = "";
          this.activeTerm.term_definition = "";
          tinymce.get("descriptionEditor").setContent("");
        });
      }
    },
    removeTerm: function() {
      this.$store.dispatch("REMOVE_TERM", this.activeTerm).then(() => {
          this.isRemoved=true;
      });
    }
  }
};
</script>
<style>
.tinymce-inline {
  border: 1px solid lightblue;
  border-radius: 5px;
  padding: 0px;
}

.mce-edit-focus {
  border: 1px solid blue;
}

.mce-content-body {
  padding: 5px;
  border-radius: 5px;
}

.inline-edit {
  display: table;
  width: 100%;
}


.inline-edit-row {
  display: table-row;
}

.inline-edit-cell {
  display: table-cell;
}
.iconbutton {
  width:30px;
}

.mce-ico.mce-i-fa {
  display: inline-block;
  font: normal normal normal 14px/1 FontAwesome;
  font-size: inherit;
  text-rendering: auto;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

.fa-trash {
  color: red !important;
}
</style>