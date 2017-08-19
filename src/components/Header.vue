<style>


.alex {
font-weight:normal;font-variant:small-caps;color:#000000;letter-spacing:0em;word-spacing:3em;font-size:78px;text-align:left;font-family:trebuchet MS, sans-serif;line-height:0;
}


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

.infotable {
    font-size:0.8em;
}
.infotable tr td:nth-child(1) {
    padding-right:2em;
}
.infotable tr td:nth-child(2) {
    color:grey;
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


.sort_headerup:before{
    content: '';
    background:url('https://encrypted-tbn3.gstatic.com/images?q=tbn:ANd9GcSj3XfIpf-OOJRCcWz4iN2CU3qMKVVbj0p0bRvKNGVo1U9pk_8ZIlyR8pWreA');
    background-size:cover;
        position:absolute;
    width:20px;
    height:20px;
    margin-left:-20px;
}
.sort_headerdown:before{
    content: 'x';
    background:url('https://encrypted-tbn3.gstatic.com/images?q=tbn:ANd9GcSj3XfIpf-OOJRCcWz4iN2CU3qMKVVbj0p0bRvKNGVo1U9pk_8ZIlyR8pWreA');
    background-size:cover;
        position:absolute;
    width:20px;
    height:20px;
    margin-left:-20px;
}
.unactive {
    color:lightgrey;
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

.term-container-div {
    border:1px solid lightgrey;
    border-radius:5px;
    padding:0.1em 1em 1em 1em;
}
.term-container-div h2 {
    font-size:1.1em;
    margin:0em 0em 0em 0em;
}
.term-header-div {
    font-size:1.2em;
    font-weight: 600;
}
.term-title-div {
    font-size:1.2em;
    font-weight: 600;
    margin-top:-10px;
}
.term-description-div {
    font-size:1em;
    font-weight: 400;
}
.term-addinfo-div {
    font-size:0.8rem;
    font-weight: 200;
    border-top:1px solid lightgrey;
    margin-top: 0.3em;
}
.term-header-div .nav-link {
    font-size:0.8rem;
    padding:0px;
    font-weight: 400;
    color:#0275d8;
}
.form-control {
        font-size: 0.8rem !important;
}
.name1 {
     width:250px;
    font-weight: 400;
    padding-right: 10px;
}
.subscript {
    font-size: 0.7em;
    color:#b3b3b3;
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
.info-badge {
    font-size:0.7em;
    background-color: white;
    color:grey;
    padding:0px 3px;
    border-radius: 2px;
    border:1px solid  #d8d3d3;
}
.title-header {
    letter-spacing:1px;
  
    font-size:1.3em !important;
    font-weight: 500!important;
       font-family: "Lato","Helvetica Neue",Helvetica,Arial,sans-serif !important;

}
.nav {
    display: inline-block;
    font-size: 0.9rem;
    letter-spacing: 0px;   
    
}
.float-right {
    float:right;
}


.nav .dropdown-item {
    font-size:0.8rem;
    padding: 3px 1rem;
}
.nav .dropdown-menu {
    font-size:0.7em;
    min-width: 5em;
}

table .nav li a {
    padding:0em 1em;
}
h3  {
 
     font-size:1.1em !important;
    font-weight: 500!important;
       font-family: "Lato","Helvetica Neue",Helvetica,Arial,sans-serif !important;
       margin:0px !important;
}


</style>

<template>
    <b-navbar toggleable type="inverse" variant="inverse" toggle-breakpoint="md" class="my-nav">
      <b-nav-toggle target="nav_collapse"></b-nav-toggle>
      <b-navbar-brand href="/">Home</b-navbar-brand>
      <b-collapse is-nav id="nav_collapse">
        <b-nav is-nav-bar>
          <b-nav-item href="/collections">Collections</b-nav-item>
        </b-nav>
      </b-collapse>
    </b-navbar>
</template>

<script>
    export default {
        data() {
            return {
                isDropdownOpen: false
            }
        }
    }
</script>
