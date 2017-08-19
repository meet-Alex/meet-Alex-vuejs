<style>
.compact{
    display:table-cell;
    white-space: nowrap;
    overflow:hidden;
    text-overflow: ellipsis;
   
}
.def{
     width: auto;
}
.table{
    margin:0;
    padding:0;
    display:table;
    table-layout: fixed;
    width:100%;
    max-width:100%;
}
.name{
    width:180px;
    font-weight: 400;
}
.table>tbody>tr>td {
   padding:2px;
}
.letter {
    font-weight: 800;
    width:2em;
}
.greyRow {
  /*  border-top: 1px solid rgba(0, 0, 0, 0.05); */
}
.borderless tr td {
    border: none !important;
    padding: 0px !important;
}
.label {
    margin-top:2em;
    font-weight:800;
}
.infotable {
    font-size:0.8em;
}
.infotable tr td:nth-child(1) {
    padding-right:2em;
}
.infotable tr td:nth-child(2) {
    color:grey;
}
.relationtable {
    width: auto !important;
}
.relationtable tr td:nth-child(2) {
    min-width: 16em;
}
.relationtable tr td:nth-child(1) {
    min-width: 30em;
}
.relationtable tr td:nth-child(3) {
    min-width: 30em;
}

.filterInput {
    padding:0.1rem 0.5rem 0.1rem 0.5rem !important;
}
.highlight {
  background-color: yellow;
}
.relationtable th {
    padding:0px !important;
}
</style>

<template>
    <div class="container">
         <b-breadcrumb :items="breadCrum"/>
         <h4> Collection: {{this.collection.collection_name}} </h4>
         <span class="fa fa-plus" aria-hidden="true"></span>
         <b-tabs>
        <!-- Terms Tab =================== -->
            <b-tab title="Terms">
                
                <table style="width: 100%;"> 
                    <tr>
                        <td v-if="viewType<2" style="width: 20em" >
                            <input v-model="filter" class="form-control filterInput" placeholder="Type to filter...">
                        </td>
                        <td align="right">
                            <b-form-radio id="btnradios1"
                            buttons
                            size="sm"
                            v-model="viewType"
                            :options="viewOptions" />
                        </td>
                    </tr>
                </table>
            

                <table v-if="viewType<2" class="table">   
                        <tbody>
                            <tr class="" v-for="term in filteredList">
                                <td v-bind:class="{compact:viewType===1, name:1}">
                                    <router-link :to="{ name: 'termDetail', params: { id: term.id } }" v-html="$options.filters.highlight(term.term_name, filter)"></router-link>
                                </td>
                                <td v-bind:class="{compact:viewType===1, def:1}" v-html="$options.filters.highlight(term.term_definition, filter)">
                                </td>
                            </tr>
                        </tbody>
                </table>
                <table v-if="viewType===2" class="table borderless">   
                        <tbody>
                            <tr v-bind:class="{greyRow:indexLine.letter!==''}" v-for="indexLine in termIndex">
                                <td class="letter">
                                    {{ indexLine.letter }}
                                </td>
                                <td class="compact" v-for="term in indexLine.col">
                                    <router-link :to="{ name: 'termDetail', params: { id: term.id } }">{{ term.name }}</router-link>
                                </td>
                            </tr>
                        </tbody>
                </table>
            </b-tab>
 
        <!-- Relations Tab =================== -->
            <b-tab title="Relations">
                 <table style="width: 100%;"> 
                    <tr>
                    <td v-if="viewType<2" style="width: 20em" >
                        <input v-model="filterRelation" class="form-control filterInput" placeholder="Type to filter...">
                    </td>
                    <td>
                    </td>
                    </tr>
                 </table>
                 <table class="table relationtable">
                     <thead>
                         <tr><th v-for="column in ['Subject', 'Relation', 'Object']">
                         <a href="#" v-on:click="sortBy(column)" v-bind:class="{active: sortKey == column}">{{column}}</a>
                         
                         </th></tr>
                     </thead>
                        <tbody>
                            
                            <tr class="" v-for="relation in filteredRelationList">
                                <td>
                                    <router-link :to="{ name: 'termDetail', params: { id: relation.subject.id } }" v-html="$options.filters.highlight(relation.subject.term_name, filterRelation)"></router-link>         
                                </td>
                                <td v-html="$options.filters.highlight(relation.relation.relation_name, filterRelation)">
                                </td>
                                <td>
                                      <router-link :to="{ name: 'termDetail', params: { id: relation.object.id } }" v-html="$options.filters.highlight(relation.object.term_name, filterRelation)"></router-link>
                                </td>
                            </tr>
                        </tbody>
                </table>
            </b-tab>

        <!-- Collection Tab =================== -->
            <b-tab title="Collection" >
               <div class="label">Name</div>
                <b-form-input :readonly="Boolean(true)" v-model.trim="collection.collection_name"></b-form-input>
                 <div class="label">Description</div>
               <!-- This contains a bug: https://github.com/bootstrap-vue/bootstrap-vue/issues/833
                   <b-form-input textarea :readonly="Boolean(false)" v-model="collection.collection_description"></b-form-input> -->
                {{collection.collection_description}}
                <br><br>
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

            </b-tab>
        </b-tabs>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                collection: [],
                letters: [],
                viewType:0,
                termIndex:[],
                relationList:[],
                filter:"",
                filterRelation:"",
                relationTableSort:{column:"Subject", o1:"subject", o2:"term_name", order:1},
                breadCrum : [
                                {
                                    text: 'Home',
                                    href: '/',
                                }, {
                                    text: 'Collections',
                                    href: '/collections',
                                },
                                {
                                    text: '',
                                    active:true
                                }
                            ],
                viewOptions: [  
                                { text: 'Full', value: 0 },
                                { text: 'Compact', value: 1 },
                                { text: 'Index', value: 2 }
                             ]
            }
        },
        created: function () {
            this.fetchCollection();
         
        },
        computed: {
            filteredList: function(){
                if (!this.collection.terms) return null;
                var self=this;
                return this.collection.terms.filter(
                    function(term){
                        return (term.term_name.toLowerCase().indexOf(self.filter.toLowerCase())>=0) ||
                               (term.term_definition.toLowerCase().indexOf(self.filter.toLowerCase())>=0)

                    });
            },
             filteredRelationList: function(){
                if (!this.relationList.length) return null;
                var self=this;
                var result= this.relationList.filter(
                    function(relation){
                        return (relation.subject.term_name.toLowerCase().indexOf(self.filterRelation.toLowerCase())>=0) ||
                               (relation.object.term_name.toLowerCase().indexOf(self.filterRelation.toLowerCase())>=0) ||
                                (relation.relation.relation_name.toLowerCase().indexOf(self.filterRelation.toLowerCase())>=0)

                    });
                    return result.sort((a, b) => this.relationTableSort.order * a[this.relationTableSort.o1][this.relationTableSort.o2].localeCompare(b[this.relationTableSort.o1][this.relationTableSort.o2]));
            }
        },
        methods: {
            fetchCollection: function() {
                this.$http.get('collections/' + this.$route.params.id)
                .then(response => {
                    return response.json();
                })
                .then (data => {
                    console.log(data);
                    this.collection = data;
                    //fill breadcrum
                    this.breadCrum[2].text=this.collection.collection_name;
                    this.makeIndex(4);
                    this.makeRelations();
                });
            },
            makeIndex: function(nrOfColumns) {
                    var thisTerm, prevTerm;
                    thisTerm=this.collection.terms[0];
                    var indexLine={letter:thisTerm.term_name[0],
                                col:[]
                    };
                    indexLine.col.push({
                      name:thisTerm.term_name,
                                id:thisTerm.id
                                });
                    for(var i=1;i<this.collection.terms.length;i++) {
                        thisTerm=this.collection.terms[i];
                        prevTerm=this.collection.terms[i-1];
                        if (thisTerm.term_name[0]!=prevTerm.term_name[0]||indexLine.col.length>=nrOfColumns) {
                            this.termIndex.push(indexLine);
                            indexLine={letter:(thisTerm.term_name[0]!=prevTerm.term_name[0])?thisTerm.term_name[0]:"",
                               col:[]
                            }
                        }
                        indexLine.col.push({name:thisTerm.term_name, id:thisTerm.id});
                    }
                     this.termIndex.push(indexLine);
            },
            makeRelations: function() {
                var ontology, term, orgRelation;
                var relation={}, relationList=[];
                var i,a;
                 for(i=0;i<this.collection.ontologies.length;i++) {
                     ontology=this.collection.ontologies[i];
                     // replace ids by the objects
                     for(a=0;a<this.collection.terms.length;a++) {
                        term=this.collection.terms[a];
                        if (ontology.subject_id===term.id) {
                            relation.subject=term;
                        }
                        if (ontology.object_id===term.id) {
                            relation.object=term;
                        }
                        if (ontology.subject && ontology.subject) {
                            break;
                        }
                    }
                    for(a=0;a<this.collection.relations.length;a++) {
                        orgRelation=this.collection.relations[a];
                        if (ontology.relation_id===orgRelation.id) {
                            relation.relation=orgRelation;
                            break;
                        }
                    }
                     this.relationList.push(JSON.parse( JSON.stringify( relation ) ));
                }
            },
            sortBy: function(column) {
                this.relationTableSort.order=(this.relationTableSort.column===column)?this.relationTableSort.order*-1:1;
                this.relationTableSort.column=column;
                this.relationTableSort.o1=(column=="Object")?"object":(column=="Subject")?"subject":"relation";
                this.relationTableSort.o2=(column=="Object")?"term_name":(column=="Subject")?"term_name":"relation_name";
            }
        }
    }
</script>
