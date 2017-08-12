<style>
.compact{
    display:table-cell;
    white-space: nowrap;
    overflow:hidden;
    text-overflow: ellipsis;
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
    width:150px;
       
  width: 150px;
}
.table>tbody>tr>td {
   padding:2px;
}


</style>



<template>
    <div class="container">
        <ul class="breadcrumb breadcrumb-section">
            <li><router-link :to="{ name: 'Home' }">Home</router-link></li>
            <router-link to="/collections" activeClass="active" tag="li"><a>Collections</a></router-link>
            <li class="active">{{ collection.collection_name }}</li>
            <li class="active"> Terms </li>
        </ul>

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
                letters: []
            }
        },
        created: function () {
            this.fetchCollection();
            this.fetchCollectionLetters();
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
                });
            },
            fetchCollectionLetters: function() {
                this.$http.get('collections/' + this.$route.params.id)
                .then(response => {
                    return response.json();
                })
                .then (data => {
                    this.letters = data;
                });
            }
        }
    }
</script>
