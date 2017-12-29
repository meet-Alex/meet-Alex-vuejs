<template>
    <div class='content' >
        <tablemenu v-if="showHeader" v-model="relationMenu" :showSortAuth='false' :showMenu="false" />
        <div class='tableContent' ref='tabcontent'>
            <table class="table relationtable">
                <tbody>
                    <tr>
                        <td v-for="column in ['Subject', 'Relation', 'Object']">
                            <a href="#" v-on:click="sortBy(column)">{{column}}</a>
                            <i v-if="column===relationTableSort.column&&relationTableSort.order===1" class="fa fa-sort-desc"></i>
                            <i v-if="column===relationTableSort.column&&relationTableSort.order===-1" class="fa fa-sort-asc"></i>
                            <i v-if="column!==relationTableSort.column" class="fa fa-sort unactive"></i>
                        </td>
                        <td>
                        </td>
                    </tr>
                    <tr v-if="editMode&&editRelationId!==0">
                        <td>
                            <b-button v-on:click="editRelationId=0" variant="default" size="sm">New Relation</b-button>
                        </td>
                        <td></td>
                        <td></td>
                        <td></td>
                    </tr>
                    <tr v-if="editMode&&editRelationId===0">
                        <td v-if="editCol===1">
                           <findterm :id="'a'" v-if="editCol===1" :prefill="newRelation.subject.term_name" :new="true" :relation="newRelation" :change="updateNewRelSubject"/>
                        </td>
                        <td v-else v-on:click="clickTest(0,1)">
                              <span v-if="newRelation.subject.term_name">{{newRelation.subject.term_name}}  </span>
                              <span v-else class="askinput"> Select term </span>
                        </td>
                        <td v-if="editCol===2">
                            <input ref="newInput" class="form-control lightblue" type="text" v-model="newRelation.name"  @keydown.tab="tabPressed">
                        </td>
                         <td v-if="editCol!==2" v-on:click="clickTest(0,2)">
                              <div v-if="newRelation.name">{{newRelation.name}}  </div>
                              <div v-else class="askinput"> provide name </div>
                        </td>
                        <td  v-if="editCol===3">
                           <findterm :id="'b'" v-if="editCol===3" :prefill="newRelation.object.term_name" :new="true" :relation="newRelation" :change="updateNewRelObject"/>
                        </td>
                        <td v-else v-on:click="clickTest(0,3)">
                              <span v-if="newRelation.object.term_name">{{newRelation.object.term_name}}  </span>
                              <span v-else class="askinput"> Select term </span>
                        </td>
                    </tr>
                   <tr v-if="!editMode" class="" v-for="relation in filteredRelationList">
                      <template v-if="!term">
                         
                        <td>
                            <router-link :to="{ name: 'termDetail', params: { id: relation.subject.id } }" v-html="$options.filters.highlight(relation.subject.term_name, relationMenu.filter)"></router-link>
                        </td>
                        <td v-html="$options.filters.highlight(relation.name, relationMenu.filter)">
                        </td>
                        <td>
                            <router-link :to="{ name: 'termDetail', params: { id: relation.object.id } }" v-html="$options.filters.highlight(relation.object.term_name, relationMenu.filter)"></router-link>
                        </td>
                        <td></td>
                      </template>
                      <template v-else>

                    
                        <td v-if="relation.type===0" class='bold'> {{relation.subject.term_name}} </td>
                        <td v-else class="link" v-on:click="fetchTerm({termId:relation.subject.id,position:index+1})" >
                        {{relation.subject.term_name}} 
                        </td>
                        <td> {{relation.name}} </td>
                        <td v-if="relation.type===1" class='bold'> {{relation.object.term_name}} </td>
                        <td v-else class="link" v-on:click="fetchTerm({termId:relation.object.id,position:index+1})" >
                        {{relation.object.term_name}} 
                        </td>
                        <td></td>
                        </template>
                    </tr>

                    <tr v-if="editMode"  v-for="(relation, index) in filteredRelationList">
                        <td v-if="relation.id===editRelationId && editCol===1">
                            <findterm :prefill="relation.subject.term_name" :relation="relation" :change="updateSubject"/>
                        </td>
                        <td v-else v-on:click="clickTest(relation.id,1)">
                            {{relation.subject.term_name}}
                        </td>     
                        <td v-if="relation.id===editRelationId && editCol===2">
                            <input ref="newInput" class="form-control lightblue" type="text" v-model="relation.name" @change="updateRelName(relation)">
                        </td>
                         <td v-else  v-on:click="clickTest(relation.id,2)">
                            {{relation.name}}
                        </td>
                        <td v-if="relation.id===editRelationId && editCol===3">
                             <findterm :prefill="relation.object.term_name" :relation="relation" :change="updateObject"/>
                        </td>
                         <td v-else v-on:click="clickTest(relation.id,3)">
                            {{relation.object.term_name}}
                        </td>

                        <td>
                            <a  href="#" class='iconbutton' v-on:click="remRelation(relation.id, $event)">
                                <i class="fa fa-trash" aria-hidden="true"></i>
                            </a>
                        </td>
                    </tr>
                </tbody>
            </table>
            <a href="#"></a>
        </div>
    </div>
</template>

<script>
import Vue from "vue";
import globalData from "../global_data";
import { mapGetters, mapState, mapMutations } from "vuex";
import tablemenu from "./tablemenu.vue";
import findterm from "./findTerm.vue";

export default {
  name: "relationList",
  components: { tablemenu, findterm },

  data() {
    return {
      globalData: globalData,
      editTermId: 0,
      editRelationId: -1,
      editCol: 0,
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
      //  relationList: [],
      relationTableSort: {
        column: "Subject",
        o1: "subject",
        o2: "term_name",
        order: 1
      }
    };
  },
  props: {
    editMode: { type: Boolean, required: true },
     term: {type: Object, required: false},
    index: {type:Number, required:false},
    showHeader :{ type: Boolean, required: true }
  },
  created: function() {
    this.editCollectionId=this.term?this.term.collection_id:this.collection.id;
  },
  methods: {
    ...mapMutations(["addRelation", "removeRelation", "changeRelation", "fetchTerm"]),
    tabPressed(e) {
      e.preventDefault();
      this.focusNewInput();
    },
    addNewRelation() {
      this.focusNewInput();
      if (
        this.newRelation.subject.term_name.length &&
        this.newRelation.object.term_name.length &&
        this.newRelation.name.length
      ) {
        this.addRelation({
          relation: this.newRelation,
          collectionId: this.editCollectionId
        });
        this.newRelation = {
          subject: { term_name: "" },
          name: "",
          object: { term_name: "" },
          id: 0
        };
        this.editRelationId = -1;
        this.$nextTick(function() {
          this.editRelationId = 0;
        });
      }
    },
    focusNewInput() {
      if (this.editCol === 1) {
        this.editCol = 2;
        var that = this;
        this.$nextTick(function() {
          that.$refs["newInput"].focus();
        });
      } else if (this.editCol === 2) {
        this.editCol = 3;
      } else {
        this.editCol = 1;
      }
    },
    updateNewRelSubject(newterm, relation) {
      relation.subject = newterm;
      this.addNewRelation();
    },
    updateNewRelObject(newterm, relation) {
      relation.object = newterm;
      this.addNewRelation();
    },
    updateNewRelName(relation) {
      this.addNewRelation();
    },
    updateSubject(newterm, relation) {
      var newRel = JSON.parse(JSON.stringify(relation));
      newRel.subject = JSON.parse(JSON.stringify(newterm));
      this.changeRelation({
        relation: newRel,
        collectionId: this.editCollectionId
      });
      this.editCol = 0;
    },
    updateObject(newterm, relation) {
      var newRel = JSON.parse(JSON.stringify(relation));
      newRel.object = JSON.parse(JSON.stringify(newterm));
      this.changeRelation({
        relation: newRel,
        collectionId: this.editCollectionId
      });
      this.editCol = 0;
    },
    updateRelName(relation) {
      var newRel = JSON.parse(JSON.stringify(relation));
      this.changeRelation({
        relation: newRel,
        collectionId: this.editCollectionId
      });
      this.editCol = 0;
    },
    remRelation: function(id, event) {
      this.removeRelation(id);
      if (event) event.stopPropagation();
    },
    clickTest: function(relationId, col) {
      var that = this;
      this.editRelationId = -1;
      this.$nextTick(function() {
        that.editRelationId = relationId;
        that.editCol = col;
        if (that.editCol === 2) {
          this.$nextTick(function() {
            var inp=that.$refs["newInput"];
            if (Array.isArray(inp)) {
               inp[0].focus();
            } else {
              inp.focus();
            }
          });
        }
      });
    },
    sortBy: function(column) {
      this.relationTableSort.order =
        this.relationTableSort.column === column
          ? this.relationTableSort.order * -1
          : 1;
      this.relationTableSort.column = column;
      this.relationTableSort.o1 =
        column == "Object"
          ? "object"
          : column == "Subject" ? "subject" : "relation";
      this.relationTableSort.o2 =
        column == "Object"
          ? "term_name"
          : column == "Subject" ? "term_name" : "name";
    }
  },
  computed: {
    ...mapState(["collection", "collection_relationList"]),
    filteredRelationList: function() {

      var relationList=this.term? this.term.relations:this.collection_relationList;
      if (!relationList || !relationList.length)
        return null;
      var self = this;
      var result = relationList.filter(function(relation) {
        return (
          relation.subject.term_name
            .toLowerCase()
            .indexOf(self.relationMenu.filter.toLowerCase()) >= 0 ||
          relation.object.term_name
            .toLowerCase()
            .indexOf(self.relationMenu.filter.toLowerCase()) >= 0 ||
          relation.name
            .toLowerCase()
            .indexOf(self.relationMenu.filter.toLowerCase()) >= 0
        );
      });
      if (this.relationTableSort.o1 !== "relation") {
        return result.sort(
          (a, b) =>
            this.relationTableSort.order *
            a[this.relationTableSort.o1][
              this.relationTableSort.o2
            ].localeCompare(
              b[this.relationTableSort.o1][this.relationTableSort.o2]
            )
        );
      } else {
        return result.sort(
          (a, b) =>
            this.relationTableSort.order *
            a[this.relationTableSort.o2].localeCompare(
              b[this.relationTableSort.o2]
            )
        );
      }
    }
  }
};
</script>

<style scoped>
.content {
  padding-top: 0.5rem;
}
.askinput {
  color: grey;
  font-style: italic;
}
.link {
  color:blue;
}
.link:hover {
  text-decoration: underline;
  cursor: pointer;
}
</style>