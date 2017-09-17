<style>
.tinymce-inline {
    border: 1px solid lightblue;
    border-radius: 5px;
    padding: 0px;
}

.mce-edit-focus {
    border: 1px solid blue;
}

.mce-content-body {
    padding: 5px;
    border-radius: 5px;
}

.inline-edit {
    display: table;
    width: 100%;
}

.inline-edit-row {
    display: table-row;
}

.inline-edit-cell {
    display: table-cell;
}

.mce-ico.mce-i-fa {
    display: inline-block;
    font: normal normal normal 14px/1 FontAwesome;
    font-size: inherit;
    text-rendering: auto;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
}
.fa-trash {
   color:red !important;
}
</style>

<template>
    <div class="inline-edit">
        <div class="inline-edit-row">
            <div class="inline-edit-cell name tinymce-inline"  >
                <tinymce id="nameEditor" v-model="editTerm.term_name" :options="tinymceOptionsBasic" @change="changed" :content="initTerm.term_name"></tinymce>
            </div>
            <div class="inline-edit-cell def tinymce-inline">
                <tinymce id="descriptionEditor" v-model="editTerm.term_definition" :options="tinymceOptions" @change="changed" :content="initTerm.term_definition"></tinymce>
            </div>
        </div>
    </div>
</template>

<script>
import Vue from 'vue';
export default {
    name: "editTermList",
    props: {
        editTerm: Object,
        termList: Array,
        value: String,
        content: {
            type: String,
            default: ''
        },
    },
    data() {
        var that = this;
        return {
             tinymceOptionsBasic:{
                setup: function(ed) {
                    ed.addButton('apply', {
                        icon: 'fa fa-check-circle',
                        cmd: 'mceApply',
                        title: 'Apply changes'
                    });
                    ed.addButton('expand', {
                        icon: 'fa fa-expand',
                        cmd: 'mceExpand',
                        title: 'Full-screen edit'
                    });
                     ed.addButton('trash', {
                        icon: 'fa fa-trash',
                        cmd: 'mceRemove',
                        title: 'Remove term'
                    });
                    ed.addButton('cancel', {
                        icon: 'fa fa-times-circle',
                        cmd: 'mceCancel',
                        title: 'Cancel'
                    });
                    ed.addCommand('mceApply', function() {
                        that.updateTerm();
                    });
                      ed.addCommand('mceRemove', function() {
                        that.removeTerm();
                    });
                },
                inline: true,
                plugins: 'advlist autolink link image lists charmap print preview paste',
                skin: 'lightgray',
                menubar: false,
                toolbar: 'apply expand cancel | trash | undo redo',
                statusbar: false,
                branding: false,
                theme: 'modern',
                content_css: 'css/app_mce.css',
                paste_as_text: true,
                mode: "textareas",
                force_br_newlines: false,
                force_p_newlines: false,
                forced_root_block: ''
            },
             tinymceOptions: {
                setup: function(ed) {
                    ed.addButton('apply', {
                        icon: 'fa fa-check-circle',
                        cmd: 'mceApply',
                        title: 'Apply changes'
                    });
                    ed.addButton('expand', {
                        icon: 'fa fa-expand',
                        cmd: 'mceExpand',
                        title: 'Full-screen edit'
                    });
                     ed.addButton('trash', {
                        icon: 'fa fa-trash',
                        cmd: 'mceRemove',
                        title: 'Remove term'
                    });
                    ed.addButton('cancel', {
                        icon: 'fa fa-times-circle',
                        cmd: 'mceCancel',
                        title: 'Cancel'
                    });
                    ed.addCommand('mceApply', function() {
                        that.updateTerm();
                    });
                      ed.addCommand('mceRemove', function() {
                        that.removeTerm();
                    });
                    ed.on("keydown", function(e){
                        if (this.id!=='descriptionEditor') return;
                        var keynum;
                        if(window.event) { // IE                    
                        keynum = e.keyCode;
                        } else if(e.which){ // Netscape/Firefox/Opera                   
                        keynum = e.which;
                        }
                        if (keynum===9) {
                            that.updateTerm();
                            tinymce.get('nameEditor').focus();
                             e.preventDefault();  
                        }
                    });
                },
                inline: true,
                plugins: 'advlist autolink link image lists charmap print preview paste',
                skin: 'lightgray',
                menubar: false,
                toolbar: 'apply expand cancel | trash | undo redo | bold italic underline | bullist numlist',
                statusbar: false,
                branding: false,
                theme: 'modern',
                content_css: 'css/app_mce.css',
                paste_as_text: true,
                mode: "textareas",
                force_br_newlines: false,
                force_p_newlines: false,
                forced_root_block: ''
            },
            emptyTerm: { id: 0, term_name: "", term_definition: "" },
            initTerm: { id: 0, term_name: "", term_definition: "" }
        }
    },
    created: function() {
        this.initTerm = JSON.parse(JSON.stringify(this.editTerm));
        tinymce.baseURL = "../node_modules/tinymce";
       
        console.log('created');
       
    },
    mounted: function() {
       
    },
    methods: {
        changed: function() { },
        addTerm: function() {
            this.$emit('input', this.editTerm);
        },
        updateTerm: function() {
            if (this.editTerm.id == 0 && this.editTerm.term_name.length) {
                var addedTerm = JSON.parse(JSON.stringify(this.editTerm));
                addedTerm.id = this.generateId();
                this.termList.push(addedTerm);
                this.initTerm = JSON.parse(JSON.stringify(this.emptyTerm));
                tinymce.get('nameEditor').setContent('');
                tinymce.get('descriptionEditor').setContent('');
            }
        },
        removeTerm: function() {
            // emit remove request to parent
            this.$root.$emit('removeTerm', this.editTerm.id);
        },
        generateId: function() {
            return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
                var r = Math.random() * 16 | 0,
                    v = c == 'x' ? r : (r & 0x3 | 0x8);
                return v.toString(16);
            });
        }
    },
    watch: {
    }
   
}
</script>