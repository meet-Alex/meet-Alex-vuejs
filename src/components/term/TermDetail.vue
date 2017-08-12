<style>

</style>



<template>
    <div class="container">
         <b-breadcrumb :items="breadCrum"/>

 
    {{term.term_name}} <br>
    {{term.term_definition}}
    </div>
</template>

<script>
    export default {
        data() {
            return {
                term: {},
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
                        ]
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
