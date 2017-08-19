<style>

</style>

<template>
    <div class="container">
         <b-breadcrumb :items="breadCrum"/>
         <div class="title-header">
              Collection: {{this.collection.collection_name}}
         </div>
         <b-tabs>
        <!-- Terms Tab =================== -->
            <b-tab title="Terms">
                
                <table style="width: 100%;"> 
                    <tr>
                        <td style="width: 20em" >
                            <input :disabled="viewType === 2" v-model="filter" class="form-control filterInput" placeholder="Type to filter...">
                        </td>
                        <td align="right">
                            <b-nav class="float-right">
                            <b-nav-item title='Create a new term in this collection'>Create term</b-nav-item>
                            <b-nav-item-dropdown :disabled="viewType===2" text="Sort" right title='Sort the collections'>
                                <b-dropdown-item v-on:click="sortType=1">Name</b-dropdown-item>
                                <b-dropdown-item v-on:click="sortType=2">Created</b-dropdown-item>
                                <b-dropdown-item v-on:click="sortType=3">Changed</b-dropdown-item>
                            </b-nav-item-dropdown>
                            <b-nav-item-dropdown text="Display" right title='Change the overview of the collections'>
                                <b-dropdown-item v-on:click="viewType=0">Full</b-dropdown-item>
                                <b-dropdown-item v-on:click="viewType=1">Compact</b-dropdown-item>
                                 <b-dropdown-item v-on:click="viewType=2">Index</b-dropdown-item>
                            </b-nav-item-dropdown>
                            </b-nav>
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
                    <td style="width: 20em" >
                        <input v-model="filterRelation" class="form-control filterInput" placeholder="Type to filter...">
                    </td>
                    <td>
                    </td>
                    </tr>
                 </table>
                 <table class="table">
                     <thead>
                         <tr><th v-for="column in ['Subject', 'Relation', 'Object']">
                            <a href="#" v-on:click="sortBy(column)">{{column}}</a>
                            <i v-if="column===relationTableSort.column&&relationTableSort.order===1" class="fa fa-sort-desc"></i>
                            <i v-if="column===relationTableSort.column&&relationTableSort.order===-1" class="fa fa-sort-asc"></i>
                            <i v-if="column!==relationTableSort.column" class="fa fa-sort unactive"></i>
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
                <br>
                <div class="term-container-div">
                    <div class="term-header-div">
                        <table style="width: 100%;"> 
                            <tr>
                            <td>
                                <b-nav>
                                    <b-nav-item-dropdown id="nav7_ddown" text="Actions" left>
                                        <b-dropdown-item>Bookmark</b-dropdown-item>
                                        <b-dropdown-item>Contribute</b-dropdown-item>
                                        <b-dropdown-item>Edit</b-dropdown-item>
                                        <b-dropdown-divider></b-dropdown-divider>
                                        <b-dropdown-item>Archive</b-dropdown-item>
                                    </b-nav-item-dropdown>
                                    </b-nav>
                            </td>
                            </tr>
                        </table>
                        
                    </div>
                  
                    <h3>Name</h3>
                   <!-- <b-form-input :readonly="Boolean(true)" v-model.trim="collection.collection_name"></b-form-input> -->
                   {{collection.collection_name}}
                     <br><br>
                    <h3>Description</h3>
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
                </div>
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
                        console.log(term, self.filter);
                        return (term.term_name.toLowerCase().indexOf(self.filter.toLowerCase())>=0) ||
                               (term.term_definition && term.term_definition.toLowerCase().indexOf(self.filter.toLowerCase())>=0)

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
