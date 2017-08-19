<style>

</style>



<template>
    <div class="container">
         <b-breadcrumb :items="breadCrum"/>
        <div class="term-container-div">
            <div class="term-header-div">
                  <table style="width: 100%;"> 
                    <tr>
                    <td>
                        <b-nav>
                            <b-nav-item-dropdown id="nav7_ddown" text="Actions" left>
                                <b-dropdown-item>Copy</b-dropdown-item>
                                <b-dropdown-item>Edit</b-dropdown-item>
                                <b-dropdown-divider></b-dropdown-divider>
                                <b-dropdown-item>Archive</b-dropdown-item>
                            </b-nav-item-dropdown>
                            </b-nav>
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
                 
            </div>
            <div class="term-title-div">{{term.term_name}} </div>
            <div class="term-desciption-div">{{term.term_definition}} </div>
            <div class="term-addinfo-div" v-if="viewType>0">{{term.term_definition}} </div>
            <div class="term-addinfo-div" v-if="viewType>1">**Todo** <br>Relations+other information</div>
        </div>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                term: {},
                viewType:0,
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
                                href:''
                            },
                            {
                                text: '',
                                 active:true
                            }
                        ],
                 viewOptions: [{ text: 'Description', value: 0 },
                { text: 'Notes', value: 1 },
                { text: 'All', value: 2 },
                 { text: 'Visual', value: 3 }]
            }
        },
        created: function () {
            this.fetchTerm();
        },
        methods: {
            fetchTerm: function() {
                this.$http.get('terms/' + this.$route.params.id)
                .then(response => {
                    return response.json();
                })
                .then (data => {
                    console.log(data);
                    this.term=data;
                    this.breadCrum[2].text=this.term.collection.collection_name;
                    this.breadCrum[2].href="/collections/"+this.term.collection.id;
                     this.breadCrum[3].text=this.term.term_name;
                });
            }
        }
    }
</script>
