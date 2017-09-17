<style>
.dropdown-menu1 {
    position: absolute;
    top: 100%;
    left: 0;
    z-index: 1000;
    float: left;
    min-width: 10rem;
    padding: 0.1rem;

    margin: 0.125rem 0 0;
    font-size: 1rem;
    color: #292b2c;
    text-align: left;
    list-style: none;
    background-color: #fff;
    -webkit-background-clip: padding-box;
    background-clip: padding-box;
    border: 1px solid grey;
    border-radius: 0.25rem;
}
.dropdown-menu1 a {
    color:#292b2c;
    font-size: 0.7rem;
}
.open {
    display: default;
    color:grey;
}
.active {
    color:red;
}
</style>

<template>
    <div style="position:relative" v-bind:class="{'open':openSuggestion}">
        <input class="form-control" type="text" v-model="searchName" @input="updateValue($event.target.value)"
          @keydown.enter = 'enter'
          @keydown.down = 'down'
          @keydown.up = 'up'
        >
        <ul v-if="displayName.length && open" class="dropdown-menu1" style="width:100%">
            <li v-for="(suggestion, index) in matches"
                v-bind:class="{'active': isActive(index)}"
                @click="suggestionClick(index, $event)"
            >
              <a href="#">{{ suggestion.term_name }} <small>{{ suggestion.term_description }}</small>
              </a>
            </li>
        </ul>
    </div>
</template>

<script>
export default {
    name: "autocomplete",
  props: {

    value: {
      type: Object,
      required: true
    },
    displayName: {
        type: String,
        required:true
    },

    suggestions: {
      type: Array,
      required: true
    }

  },

  data () {
    return {
      open: false,
      current: 0,
      inputValue:"",
      searchName:""
    }
  },
  created:function(){
      console.log(this.displayName);
      this.searchName=JSON.parse(JSON.stringify(this.displayName));
  },

  computed: {
    // Filtering the suggestion based on the input
    matches () {
        var that=this;
      return this.suggestions.filter((obj) => {
        return obj.term_name.toLowerCase().indexOf(that.searchName.toLowerCase()) >= 0
      })
    },

    openSuggestion () {
      return this.selection !== '' &&
             this.matches.length !== 0 &&
             this.open === true
    }
  },

  methods: {

    updateValue (value) {
      if (this.open === false) {
        this.open = true
        this.current = 0
      }
      console.log(value);
    // this.$emit('input', value)
    // this.$emit('input', this.matches[this.current])
    },

    // When enter pressed on the input
    enter () {
        console.log(this.matches[this.current]);
      this.$emit('input', this.matches[this.current])
      this.searchName=this.matches[this.current].term_name;
      this.open = false
    },

    // When up pressed while suggestions are open
    up () {
      if (this.current > 0) {
        this.current--
      }
    },

    // When up pressed while suggestions are open
    down () {
      if (this.current < this.matches.length - 1) {
        this.current++
      }
    },

    // For highlighting element
    isActive (index) {
      return index === this.current
    },

    // When one of the suggestion is clicked
    suggestionClick (index, event) {
        console.log("selection clicked", index);
      
      this.$emit('input', this.matches[index]);
        this.searchName=this.matches[index].term_name;
      this.open = false;
       if (event) event.stopPropagation();
    }

  }

}
</script>