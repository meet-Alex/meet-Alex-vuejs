<template>
    <div :id="id" :ref="id">
    </div>
</template>

<script>
require('tinymce');
import Vue from 'vue'
export default {
    name: "tinymce",
    props: {
        id: {
            type: String,
            required: true
        },
        options: Object,
        //    content: {
        //        type: String,
        //         default: ''
        //     },
        value: String
    },
    data() {
        return {
            content: ""
        }
    },
    watch: {
        // content(){
        //       tinymce.get(this.id).setContent(this.content)
        //   }
    },
    created() {
        tinymce.baseURL = "../node_modules/tinymce";
    },
    mounted() {
        //Initial configuration
        this.content = this.value ? JSON.parse(JSON.stringify(this.value)) : "";
        
        console.log(this.content);
        let options = {}
        let s1 = new Function()
        let config = (editor) => {
            editor.on('NodeChange Change KeyUp', (e) => {
                this.$emit('input', tinymce.get(this.id).getContent())
                this.$emit('change', tinymce.get(this.id), tinymce.get(this.id).getContent())
            })
            editor.on('init', (e) => {
                if (this.content != undefined) tinymce.get(this.id).setContent(this.content)
                this.$emit('input', this.content)
            })
        }

        //Default configuration
        s1 = (e) => config(e)
        if (typeof this.options == 'object') {

            options = Object.assign({}, this.options)
            if (!this.options.hasOwnProperty('selector')) options.selector = '#' + this.id
            if (typeof this.options.setup == 'function') {
                s1 = (editor) => {
                    config(editor)
                    this.options.setup(editor)
                }
            }

        } else options.selector = '#' + this.id

        options.setup = (editor) => s1(editor);
        

        Vue.nextTick(() => {tinymce.init(options)
            tinymce.get(this.id).setContent(this.content)
        });
    },
    beforeDestroy() {
        tinymce.execCommand('mceRemoveEditor', false, this.id)
    }
}
</script>