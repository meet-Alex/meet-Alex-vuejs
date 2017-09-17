import editTermList from './edit-term-list.vue'

function plugin(Vue){   
    if(plugin.installed) return
    Vue.component('editTermList', editTermList)
}

export default plugin