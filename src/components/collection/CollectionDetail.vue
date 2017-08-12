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
    background-color: rgba(0, 0, 0, 0.05);
}
</style>



<template>
    <div class="container">
         <b-breadcrumb :items="breadCrum"/>

       
       <b-form-radio id="btnradios1"
                  class="mb-4"
                  buttons
                  size="sm"
                  v-model="viewType"
                  :options="viewOptions" />
    
        <table v-if="viewType<2" class="table table-striped table-bordered">   
                  <tbody>
                      <tr class="" v-for="term in collection.terms">
                          <td v-bind:class="{compact:viewType===1, name:1}">
                              <router-link :to="{ name: 'termDetail', params: { id: term.id } }">{{ term.term_name }}</router-link>
                          </td>
                          <td v-bind:class="{compact:viewType===1, def:1}">
                              {{ term.term_definition }}
                          </td>
                      </tr>
                  </tbody>
        </table>
         <table v-if="viewType===2" class="table">   
                  <tbody>
                      <tr v-bind:class="{greyRow:term.alternate}" v-for="term in termIndex">
                          <td class="letter">
                              {{ term.letter }}
                          </td>
                          <td class="compact">
                              <router-link :to="{ name: 'termDetail', params: { id: term.id0 } }">{{ term.name0 }}</router-link>
                          </td>
                             <td class="compact">
                               <router-link :to="{ name: 'termDetail', params: { id: term.id1 } }">{{ term.name1 }}</router-link>
                          </td>
                             <td class="compact">
                                <router-link :to="{ name: 'termDetail', params: { id: term.id2 } }">{{ term.name2 }}</router-link>
                          </td>
                             <td class="compact">
                                <router-link :to="{ name: 'termDetail', params: { id: term.id3 } }">{{ term.name3 }}</router-link>
                          </td>
                      </tr>
                  </tbody>
        </table>

       




    </div>
</template>

<script>
    export default {
        data() {
            return {
                collection: [],
                letters: [],
                viewType:1,
                termIndex:[],
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
                            },
                            {
                                text: 'terms',
                                 active:true
                            }
                        ],
                viewOptions: [{ text: 'Full', value: 0 },
                { text: 'Compact', value: 1 },
                { text: 'Index', value: 2 }]
            }
        },
        created: function () {
            this.fetchCollection();
            this.init();

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


                    //calculate index with 4 columns and a first letter
                    var indexLine={};
                    
                    var thisTerm, prevTerm, prevAlternate;
                    var col=1;
                    thisTerm=this.collection.terms[0];
                    var indexLine={letter:thisTerm.term_name[0],
                                name0:thisTerm.term_name,
                                id0:thisTerm.id,
                                name1:"",
                                id1:null,
                                name2:"",
                                id2:null,
                                name3:"",
                                id3:null,
                                alternate:0
                    };
                    for(var i=1;i<this.collection.terms.length;i++) {
                        thisTerm=this.collection.terms[i];
                        prevTerm=this.collection.terms[i-1];
                        if (thisTerm.term_name[0]!=prevTerm.term_name[0]||col===4) {
                            this.termIndex.push(indexLine);
                            col=0;
                            
                            indexLine={letter:(thisTerm.term_name[0]!=prevTerm.term_name[0])?thisTerm.term_name[0]:"",
                                name0:"",
                                id0:null,
                                name1:"",
                                id1:null,
                                name2:"",
                                id2:null,
                                name3:"",
                                id3:null,
                                alternate:(thisTerm.term_name[0]!=prevTerm.term_name[0])?1-indexLine.alternate:indexLine.alternate
                            }
                        }
                        indexLine["name"+col]=thisTerm.term_name;
                        indexLine["id"+col]=thisTerm.id;

                        col++;
                    }
                     this.termIndex.push(indexLine);

                    console.log(this.termIndex);
                });
            },
            init: function() {
               
            }
        }
    }
</script>
