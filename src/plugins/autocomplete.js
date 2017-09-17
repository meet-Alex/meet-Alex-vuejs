import autocomplete from './autocomplete.vue'

function plugin(Vue){   
    if(plugin.installed) return
    Vue.component('autocomplete', autocomplete)
}

export default plugin