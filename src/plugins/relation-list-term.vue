<template>
    <div class='content' >  
        <div class='tableContent' ref='tabcontent'>
            <table class="table relationtable">
                <tbody>
                    <tr>
                        <td v-for="column in ['Subject', 'Relation', 'Object']">
                            <a href="javascript:" v-on:click="sortBy(column)">{{column}}</a>
                            <i v-if="column===relationTableSort.column&&relationTableSort.order===1" class="fa fa-sort-desc"></i>
                            <i v-if="column===relationTableSort.column&&relationTableSort.order===-1" class="fa fa-sort-asc"></i>
                            <i v-if="column!==relationTableSort.column" class="fa fa-sort unactive"></i>
                        </td>
                        <td>
                        </td>
                    </tr>
                    <tr v-if="value&&editRelationId!==0">
                        <td>
                            <b-button v-on:click="editRelationId=0" variant="default" size="sm">New Relation</b-button>
                        </td>
                        <td></td>
                        <td></td>
                        <td></td>
                    </tr>
                    <tr v-if="value&&editRelationId===0">
                        <td ref='newRelFocus'>
                            <autocomplete :new="true" :suggestions="collection.terms" v-model="newRelation.subject" :displayName="newRelation.subject.term_name"></autocomplete>
                        </td>
                        <td>
                            <input class="form-control lightblue" type="text" v-model="newRelation.name">
                        </td>
                        <td>
                            <autocomplete :new="true" :suggestions="collection.terms" v-model="newRelation.object" :displayName="newRelation.object.term_name"></autocomplete>
                        </td>
                        <td></td>
                    </tr>
                    <tr v-if="!value" class="" v-for="relation in filteredRelationList">
                        <td v-if="relation.type===0" class='bold'> {{relation.subject.term_name}} </td>
                        <td v-else class="link" v-on:click="fetchTerm({termId:relation.subject.id,position:index+1})" >
                        {{relation.subject.term_name}} 
                        </td>
                        <td> {{relation.relation.relation_name}} </td>
                        <td v-if="relation.type===1" class='bold'> {{relation.object.term_name}} </td>
                        <td v-else class="link" v-on:click="fetchTerm({termId:relation.object.id,position:index+1})" >
                        {{relation.object.term_name}} 
                        </td>
                        <td></td>
                    </tr>
                    <tr v-if="value" v-on:click="clickTest(relation.id)" v-for="(relation, index) in filteredRelationList">
                        <td v-if="relation.id!==editRelationId">
                            {{relation.subject.term_name}}
                        </td>
                        <td v-else>
                            <autocomplete :new="false" :suggestions="collection.terms" v-model="relation.subject" :displayName="relation.subject.term_name"></autocomplete>
                        </td>

                        <td v-if="relation.id!==editRelationId">
                            {{relation.relation.relation_name}}
                        </td>
                        <td v-else>
                            <input class="form-control lightblue" type="text" v-model="relation.relation.relation_name">
                        </td>

                        <td v-if="relation.id!==editRelationId">
                            {{relation.object.term_name}}
                        </td>
                        <td v-else>
                            <autocomplete :new="false" :suggestions="collection.terms" v-model="relation.object" :displayName="relation.object.term_name"></autocomplete>
                        </td>
                        <td>
                            <a v-if="relation.id==editRelationId" href="javascript:" class='iconbutton' v-on:click="removeRelation(relation.id, $event)">
                                <i class="fa fa-trash" aria-hidden="true"></i>
                            </a>
                        </td>
                    </tr>
                </tbody>
            </table>
          
        </div>
    </div>
</template>

<script>
import Vue from "vue";
import globalData from "../global_data";
import { mapGetters, mapState, mapMutations } from "vuex";
import tablemenu from "./tablemenu.vue";

export default {
  name: "relationListTerm",
  components: { tablemenu },

  data() {
    return {
      globalData: globalData,
      editTermId: 0,
      editRelationId: -1,
      newRelation: {
        subject: { term_name: "" },
        name: "",
        object: { term_name: "" },
        id: 0
      },
      relationMenu: {
        filter: "",
        viewType: globalData.VIEWTYPE.FULL,
        sortType: globalData.SORTTYPE.NAME
      },
      relationList: [],
      relationTableSort: {
        column: "Subject",
        o1: "subject",
        o2: "term_name",
        order: 1
      }
    };
  },
  props: {
    value: { type: Boolean, required: true },
    term: {type: Object, required: true},
    index: {type:Number, required:true}
  },
  created: function() {
      console.log(this.term);
      var that=this;
      this.$root.$on('addRelation', function() {
            if (that.newRelation.subject.term_name.length &&
                that.newRelation.subject.term_name.length &&
                that.newRelation.name.length) {
                console.log('add it now!!');
                that.relationList.push({ subject: that.newRelation.subject, name: that.newRelation.name, object: that.newRelation.object, id: that.generateId() });
                that.newRelation = { subject: { term_name: "" }, name: "", object: { term_name: "" }, id: 0 };

                // reset new input field; and set focus on input field in the first cell
                that.editRelationId = -1;
                that.$nextTick(function() {
                    that.editRelationId = 0;
                    that.$nextTick(function() {
                        console.log('>>>');
                        that.$refs.newRelFocus.children[0].children[0].focus();
                    });
                });
            }
        });
  },
  methods: {
       ...mapMutations(["removeTermFromList", "fetchTerm"]),
   removeRelation: function(id, event) {
            this.relationList = this.relationList.filter(function(relation) {
                return relation.id != id;
            });
            if (event) event.stopPropagation();
        },
        generateId: function() {
            return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
                var r = Math.random() * 16 | 0,
                    v = c == 'x' ? r : (r & 0x3 | 0x8);
                return v.toString(16);
            });
        },
        clickTest: function(relationId) {
            console.log("clicked", relationId);
            this.editRelationId = relationId;
        },
        sortBy: function(column) {
            this.relationTableSort.order = (this.relationTableSort.column === column) ? this.relationTableSort.order * -1 : 1;
            this.relationTableSort.column = column;
            this.relationTableSort.o1 = (column == "Object") ? "object" : (column == "Subject") ? "subject" : "relation";
            this.relationTableSort.o2 = (column == "Object") ? "term_name" : (column == "Subject") ? "term_name" : "relation_name";
        }
  },
  computed: {
    ...mapState(["collection"]),
    filteredRelationList: function() {
        if (!this.term.relations||!this.term.relations.length) return null;
        var self = this;
        var result = this.term.relations;
        result.map(relation => relation.id=relation.relation.id);
        return result.sort((a, b) => this.relationTableSort.order * a[this.relationTableSort.o1][this.relationTableSort.o2].localeCompare(b[this.relationTableSort.o1][this.relationTableSort.o2]));
    }
  }
};
</script>

<style scoped>
 .content {padding-top:0.5rem}
 .bold {
  font-weight: 600;
}
.link {
  color:blue;
}
.link:hover {
  text-decoration: underline;
  cursor: pointer;
}

</style>