<template>
    <div class="container flex">
        <div class="flex01">
            <b-breadcrumb :items="breadCrum" />
        </div>
        <div class='flex01'>
            <span class='title-header'>Overview collections</span>
             <a class="float-right" href="\collections\new" title='Create a new collection'>Create collection</a>
        </div>
        <div class='tableOptions'>
            <table style="width: 100%;">
                <tr>
                    <td style="width: 20em">
                        <input :disabled="viewType === 2" v-model="filter" class="form-control filterInput" placeholder="Type to filter...">
                    </td>
                    <td align="right">
                        <b-nav class="float-right">
                           
                            <b-nav-item-dropdown :disabled="viewType===2" text="Sort" right title='Sort the collections'>
                                <b-dropdown-item v-on:click="sortType=0">Authorisation</b-dropdown-item>
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
        </div>
        <div class='tableContent' ref='tabcontent'>
            <vue-scrollbar classes="my-scrollbar" v-bind:style="{ 'max-height': tabheight + 'px' }">
                <div class='scroll-me'>
                    <div v-if="collections[0]">
                        <table v-if="viewType<2" class="table">
                            <tbody>
                                <tr v-for="collection in filteredList">

                                    <td v-bind:class="{compact:viewType===1, name1:1}">
                                        <router-link :to="{ name: 'collectionDetail', params: { id: collection.id } }" v-html="$options.filters.highlight(collection.collection_name, filter)"> </router-link><br>
                                        <span class='info-badge' v-if="collection.authorisation===1" variant="info" title="You have bookmarked this collection. You cannot edit it">Bookmarked</span>
                                        <span class='info-badge' v-if="collection.authorisation===2" variant="info" title="You can edit this collection">Contributor</span>
                                        <span class='info-badge' v-if="collection.authorisation===3" variant="info" title="You are the owner of this collection">Owner</span>
                                    </td>
                                    <td v-bind:class="{compact:viewType===1, def:1}">
                                        
                                        <div v-html="$options.filters.highlight(collection.collection_description, filter)"> </div>
                                        <div>
                                        <span class='subscript'>
                                            <router-link :to="{ name: 'collectionDetail', params: { id: collection.id, tab:'terms' } }">  {{collection.term_count }} terms </router-link>
                                            |
                                            <router-link :to="{ name: 'collectionDetail', params: { id: collection.id, tab:'relations' } }">  {{collection.ontologies_count}} relations </router-link>
                                            | 
                                            <i class='fa fa-user-circle' title='Collection owner'> {{collection.owner_name}} </i>  |
                                            <i class='fa fa-calendar-o' title='Last update'> {{collection.updated_at}} </i>
                                        </span>
                                        </div>
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
            </vue-scrollbar>
        </div>
    </div>

</template>

<script>
    import VueScrollbar from 'vue2-scrollbar';
    require('vue2-scrollbar/dist/style/vue2-scrollbar.css');
    import globalData from '../../global_data';
  
    export default {
         components: { VueScrollbar },
        data() {
            return {
                tabheight:500,
                collections: [],
                viewType:0,
                filter:"",
                sortType:0,
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
        mounted:function () {
            window.addEventListener('resize',  this.handleWindowResize);
            this.$nextTick(this.handleWindowResize);
        },
         beforeDestroy: function () {
            window.removeEventListener('resize', this.handleWindowResize)
        },
        created: function () {
            this.fetchCollections();
            console.log(globalData.userInfo);
        },
         computed: {
            filteredList: function(){
                console.log(this.collections);
             //   if (!this.collections.length) return null;
                var self=this;
                var list=this.collections.filter(
                    function(collection){
                        return (collection.collection_name.toLowerCase().indexOf(self.filter.toLowerCase())>=0) ||
                               (collection.collection_description.toLowerCase().indexOf(self.filter.toLowerCase())>=0)

                    });
                list.sort(function (a, b) {
                       var result;
                       if (self.sortType===0) {
                        result=(a.authorisation===b.authorisation)?a.collection_name.localeCompare(b.collection_name):b.authorisation-a.authorisation;
                        } else if (self.sortType===1) {
                            result=a.collection_name.localeCompare(b.collection_name);
                        }  else if (self.sortType===2) {
                            result=b.created_at.localeCompare(a.created_at);
                        } else if (self.sortType===3) {
                            result=b.updated_at.localeCompare(a.updated_at);
                           
                        }
                        return result;
                    });

                return list;
            }
         },
        methods: {
            handleWindowResize: function(){
                this.tabheight = this.$refs.tabcontent.clientHeight-20;
                console.log(this.tabheight);
            },
           
            fetchCollections: function() {
                var self=this;
                console.log(globalData.userInfo.token);
                this.$http.get('collections', {body:{_token:globalData.userInfo.token}})
                .then(response => {
                    console.log(response);
                    return response.json();
                })
                .then (data => {
                    console.log(data);
                    //data is an object, change it to array
                    self.collections = Object.keys(data).map(key => data[key]);
                     this.makeIndex(4);
                    //TODO: faked bookmark

                    self.collections.forEach(function(collection) {
                        collection.authorisation=0;
                    });
                    self.collections[3].authorisation=1;
                    self.collections[1].authorisation=1;
                    self.collections[6].authorisation=2;
                    self.collections[8].authorisation=3;
                    self.collections[9].authorisation=3;
                  
                },
                function(error){
                    console.log(error);
                    var data=error.data;
                       self.collections = Object.keys(data).map(key => data[key]);
                     this.makeIndex(4);
                    //TODO: faked bookmark

                    self.collections.forEach(function(collection) {
                        collection.authorisation=0;
                    });
                    self.collections[3].authorisation=1;
                    self.collections[1].authorisation=1;
                    self.collections[6].authorisation=2;
                    self.collections[8].authorisation=3;
                    self.collections[9].authorisation=3;
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
                return (this.viewType===1)?"":""
            }
        }
    }
</script>
