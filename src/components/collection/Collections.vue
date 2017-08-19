<style>
.name1 {
     width:250px;
    font-weight: 400;
    padding-right: 10px;
}
.subscript {
    font-size: 0.7em;
    color:grey;
}
.table1 {
    margin:0px!important;
    padding:0px;
}
.table1 tr td {
    padding:0px !important;
    height:0.7em !important;
   
}
.table1 tr {
     margin-top:-10px !important;
      height:0.7em !important;
          line-height: 1;
}

</style>

<template>
    <div class="container">
        <b-breadcrumb :items="breadCrum"/>
        <h4> Overview collections </h4>
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
            <div v-if="collections[0]">
                <table  v-if="viewType<2" class="table">
                     <tbody>
                            <tr v-for="collection in filteredList">
                              
                                        <td v-bind:class="{compact:viewType===1, name1:1}">
                                            <router-link :to="{ name: 'collectionDetail', params: { id: collection.id } }">{{ collection.collection_name }}</router-link>
                                        </td>
                                        <td v-bind:class="{compact:viewType===1, def:1}" v-html="$options.filters.highlight(collection.collection_description, filter)+collectionDetails(collection)">
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
                                    <router-link :to="{ name: 'collectionDetail', params: { id: term.id } }">{{ term.name }}</router-link>
                                </td>
                            </tr>
                        </tbody>
                </table>
            </div>
            <div v-else>
                <p>No collections found.</p>
            </div>
        
    </div>
</template>

<script>
    export default {
        data() {
            return {
                collections: [],
                viewType:0,
                filter:"",
                termIndex:[],
                breadCrum : [
                                {
                                    text: 'Home',
                                    href: '/',
                                }, {
                                    text: 'Collections',
                                    active: true
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
            this.fetchCollections();
        },
         computed: {
            filteredList: function(){
                console.log(this.collections);
             //   if (!this.collections.length) return null;
                var self=this;
                return this.collections.filter(
                    function(collection){
                        return (collection.collection_name.toLowerCase().indexOf(self.filter.toLowerCase())>=0) ||
                               (collection.collection_description.toLowerCase().indexOf(self.filter.toLowerCase())>=0)

                    });
            }
         },
        methods: {
            fetchCollections: function() {
                var self=this;
                this.$http.get('collections')
                .then(response => {
                    return response.json();
                })
                .then (data => {
                    //data is an object, change it to array
                    self.collections = Object.keys(data).map(key => data[key]);
                     this.makeIndex(4);
                });
            },
             makeIndex: function(nrOfColumns) {
                    var thisTerm, prevTerm;
                    thisTerm=this.collections[0];
                    var indexLine={letter:thisTerm.collection_name[0],
                                col:[]
                    };
                    indexLine.col.push({
                      name:thisTerm.collection_name,
                                id:thisTerm.id
                                });
                    for(var i=1;i<this.collections.length;i++) {
                        thisTerm=this.collections[i];
                        prevTerm=this.collections[i-1];
                        if (thisTerm.collection_name[0]!=prevTerm.collection_name[0]||indexLine.col.length>=nrOfColumns) {
                            this.termIndex.push(indexLine);
                            indexLine={letter:(thisTerm.collection_name[0]!=prevTerm.collection_name[0])?thisTerm.collection_name[0]:"",
                               col:[]
                            }
                        }
                        indexLine.col.push({name:thisTerm.collection_name, id:thisTerm.id});
                    }
                     this.termIndex.push(indexLine);
            },
            collectionDetails: function(collection) {
                return (this.viewType===1)?"":"<br> <span class='subscript'>" +
                collection.term_count + " terms | "+
                collection.ontologies_count +" relations | "+
                "Owner:"+collection.owner_name+ " | "+
                "Updated:"+collection.updated_at+"</span>"
            }
        }
    }
</script>
