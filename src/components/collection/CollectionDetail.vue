<style>
.compact{
    display:table-cell;
    white-space: nowrap;
    overflow:hidden;
    text-overflow: ellipsis;
    width: auto;
    color:grey;
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
      display:table-cell;
    white-space: nowrap;
    overflow:hidden;
    text-overflow: ellipsis;
}
.table>tbody>tr>td {
   padding:2px;
}


</style>



<template>
    <div class="container">
         <b-breadcrumb :items="breadCrum"/>

       
       <b-form-radio id="btnradios1"
                  class="mb-4"
                  buttons
                  v-model="viewType"
                  :options="viewOptions" />
        <span>Picked: {{ viewType }}</span>


        <table class="table table-striped table-bordered">
                  
                  <tbody>
                      <tr class="" v-for="term in collection.terms">
                          <td class="name">
                              {{ term.term_name }}
                          </td>
                          <td class="compact">
                              {{ term.term_definition }}
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
                { text: 'Terms', value: 2 }]
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
                    this.breadCrum[2].text=this.collection.collection_name;
                });
            },
            init: function() {
               
            }
        }
    }
</script>
