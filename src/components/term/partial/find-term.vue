<template>

    <div class="Typeahead">
        <!-- optional indicators -->
        <i class="fa fa-spinner fa-spin" v-if="loading"></i>
        <template v-else>
        
        <i class="fa fa-search" v-show="isEmpty"></i>
        <i class="fa fa-times" v-show="isDirty" @click="reset"></i>
        </template>

        <!-- the input field -->
        <input
            class="inputField"  
            type="text"
            placeholder=""
            autocomplete="on"
            v-model="query"
            @keydown.down="down"
            @keydown.tab="tabPressed"
            @keydown.up="up"
            @keydown.enter="hit"
            @keydown.esc="reset"
            @blur="reset"
            @input="update"
            >
    <!--        ref="focusIt" -->
            

        <!-- the list -->
        <ul >
        <!-- for vue@1.0 use: ($item, item) -->
        <li v-for="(item, $item) in items" :class="activeClass($item)" @mousedown="hit" @mousemove="setActive($item)">
          <div>
              <table style="width: 100%;table-layout:fixed">
                <tr>
                    <td class='term-name' v-text="item.term_name"></td>
                    <td class="term-collection" v-text="item.collection_name"></td>
                </tr>
                <tr> 
                    <td colspan="2" v-html="item.term_definition" class='term-description'> </td>
                </tr>
            </table>
          </div>
        </li>
        </ul>
 
</div>
</template>

<script>
import VueTypeahead from 'vue-typeahead'

export default {
     name: "find-term",
  extends: VueTypeahead, 
  props: {change:{type:Function},
          relation:{type:Object},
          prefill:{type:String}
 },

  data () {
    return {
      // The source url
      // (required)
      src: 'terms',

      // The data that would be sent by request
      // (optional)
      data: {},

      // Limit the number of items which is shown at the list
      // (optional)
      limit: 10,

      // The minimum character length needed before triggering
      // (optional)
      minChars: 1,

      // Highlight the first item in the list
      // (optional)
      selectFirst: false,

      // Override the default value (`q`) of query parameter name
      // Use a falsy value for RESTful query
      // (optional)
      queryParamName: 'search',
      searchName: ''
    }
  },
  created : function(){
      this.query=this.prefill||"";
       console.log("created", this.prefill, this.query);
  },
  mounted : function () {
      console.log("mounted");
      //  if (this.query.length)
     //  {this.$refs["focusIt"].focus()}
     //  this.$refs["focusIt"].focus();
  },
   watch: {
    query: function (val) {
      console.log(val);
      if (val.length===0) {
          this.$emit('hasText', {hasText:false, text:val});
      } else if (val.length===1) {
          this.$emit('hasText', {hasText:true, text:val});
      }
    }
   },

  methods: {
    // The callback function which is triggered when the user hits on an item
    // (required)
    onHit (item) {
        
      if (this.relation) {
            this.change(item, this.relation);
            this.query=item.term_name;
            console.log(this.query);
      } else {
          this.change(item);
      }
      if (!this.prefill) {
       //this.reset();
      }
    },
    tabPressed(e) {
        if (!this.items.length) return;  // if tab is pressed and there is no selection-list, do normal behaviour, else tab is move up/down in list
        e.preventDefault();
        if (e.shiftKey) {
            this.up();
        } else {
        this.down();
        }
    },
    cancel () {
        console.log('cancelled');
    },
    // The callback function which is triggered when the response data are received
    // (optional)
    prepareResponseData (data) {
      console.log(data, this.items);
     // this.items=data;
      return data
    }
  }
}
</script>

<style scoped>
    .inputField {
         width:calc(100% - 40px);
    }
    .Typeahead {
    position: relative;
    margin-bottom:0px;
    width:100%;
    }
    .Typeahead table tr td{
        border:none;
        padding:0px;
    }
    .Typeahead__input {
    width: 100%;
    font-size: 14px;
    color: #2c3e50;
    line-height: 1.42857143;
    box-shadow: inset 0 1px 4px rgba(0,0,0,.4);
    -webkit-transition: border-color ease-in-out .15s,-webkit-box-shadow ease-in-out .15s;
    transition: border-color ease-in-out .15s,box-shadow ease-in-out .15s;
    font-weight: 300;
    padding: 12px 26px;
    border: none;
    border-radius: 22px;
    letter-spacing: 1px;
    box-sizing: border-box;
    }
    .Typeahead__input:focus {
    border-color: #4fc08d;
    outline: 0;
    box-shadow: inset 0 1px 1px rgba(0,0,0,.075),0 0 8px #4fc08d;
    }
    .fa-times {
    cursor: pointer;
    }
    i {
  
    position: relative;
    top: 0px;
    left: 0px;
    opacity: 0.4;
    width:20px;
    }
    ul {
    position: absolute;
    padding: 0;
    margin-top: 8px;
    /*min-width: 100%; */
    text-align:left;
    width:600px;
    background-color: rgb(253, 253, 253);
    list-style: none;
    border-radius: 4px;
    box-shadow: 0 0 10px rgba(0,0,0, 0.25);
    z-index: 1000;
    }
    li {
    padding: 4px 16px;
    border-bottom: 1px solid #ccc;
    cursor: pointer;
    color:black;
    }
    li:first-child {
    border-top-left-radius: 4px;
    border-top-right-radius: 4px;
    }
    li:last-child {
    border-bottom-left-radius: 4px;
    border-bottom-right-radius: 4px;
    border-bottom: 0;
    }
    span {
    display: block;
    color: #2c3e50;
    }
    .active {
    background-color: #dfecd0
    }
    .active span {
    color: white;
    }
    .term-name {
    font-weight: 700;
    font-size: 1rem;
   
    }
    .term-collection {
    font-weight: 400;
    font-style: italic;
    font-size: 0.8rem;
    float: right;
    color:orange;
    }
    .term-description {
        font-size: 0.8rem;
        width:600px;

    }
    .screen-name {
    font-style: italic;
    }
    
   
</style>