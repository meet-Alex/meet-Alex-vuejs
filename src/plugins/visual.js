import Visual from './visual.vue'

function plugin(Vue){   
    if(plugin.installed) return
    Vue.component('visual', Visual)
}

export default plugin