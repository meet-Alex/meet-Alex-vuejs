<template>
  <div class="example-drag">
    <div class="upload">
     <span class="title-header"> Import collection, terms or relations </span>
     <br><br>
      <table>
        <tr>
        <td>
          <div class="text-center p-5 border1">
            <h4>Drop files to import<br/>or</h4>
            <label for="file" class="btn btn-primary">Select Files</label>
          </div>
           <div class="messages" v-if="files.length">
                <ul>
                <li v-for="(file, index) in files" :key="file.id">
                    <span>{{file.name}}</span>
                    <span v-if="file.error" class="error">{{file.error}}</span>
                    <span v-else-if="file.success" class="success">success</span>
                    <span v-else-if="file.active" class="active">active</span>
                </li>
                </ul>
            </div> 
        </td>
        <td class="explanation">
            <h5> How to use </h5>
            <h6> Excel template </h6>
            Use the form to create a new Collection and upload a .xlsx (Excel) file.
            This page can be used to import to a new Collection. 
            The Excel file to be used contains two different sheets. 
            <ul>
                <li>
                    Terms sheet: must contain terms and definitions. Make sure that every term is unique.
                </li>
                <li>
                    Ontology sheet: is used for importing all relations between terms. 
                    There's a validation on the integrity of the content, so in any case the integrity is not correct an error message will be displayed and the upload process will be aborted.
                </li>
            </ul>
            You can use this <a href="/src/items/import_template.xlsx"> template</a>.
            <br><br>
            <h6> Alex file </h6>
            Upload a file you exported from A-Lex, a .alex file

            <br><br>
        </td>
        </tr>
     
      </table>

      <div v-show="$refs.upload && $refs.upload.dropActive" class="drop-active">
    		<h3>Drop files to upload</h3>
      </div>

      <div class="example-btn">
        <file-upload
          class="btn btn-primary btn-xs"
          post-action="/upload/post"
          :multiple="false"
          :drop="true"
          :drop-directory="false"
          v-model="files"
           @input-filter="inputFilter"
          @input-file="inputFile"
          ref="upload">
          Import file
        </file-upload>
       
      </div>
    </div>
   
  </div>
</template>


<script>
import FileUpload from 'vue-upload-component'
export default {
     name: "collection-import",
  components: {
    FileUpload,
  },
  data() {
    return {
      files: [],
    }
  },
  methods : {
  inputFile(newFile, oldFile, prevent) {
      console.log(newFile, oldFile)
       this.$refs.upload.active = true
      if (newFile && !oldFile) {
        this.$nextTick(function () {
          this.edit = true
        })
      }
      if (!newFile && oldFile) {
        this.edit = false
      }
    },
    inputFilter(newFile, oldFile, prevent) {
         console.log(newFile, oldFile)
         return
        
      if (newFile && !oldFile) {
        if (!/\.(gif|jpg|jpeg|png|webp)$/i.test(newFile.name)) {
          alert('Your choice is not a picture')
          return prevent()
        }
      }
      if (newFile && (!oldFile || newFile.file !== oldFile.file)) {
        newFile.url = ''
        let URL = window.URL || window.webkitURL
        if (URL && URL.createObjectURL) {
          newFile.url = URL.createObjectURL(newFile.file)
        }
      }
    }
  }
}
</script>

<style scoped>
table tr td {
    vertical-align: top;
}
.explanation {
    border-left: 1px solid lightgrey;
    padding-left: 10px;
}
.error {
    background-color: red;
    color:white;
    padding:0px 5px;
}
.success {
    background-color: green;
     color:white;
    padding:0px 5px;
}
.active {
    background-color: blue;
     color:white;
    padding:0px 5px;
}
.example-btn {
  display: none;
}
h4 {
    font-size:20px;
}
.example-drag {
    padding:1rem;
}
.example-drag label.btn {
  margin-bottom: 0;
}
.messages {
    margin: 10px 0px 0px 0px;
}
ul {
  list-style-type: none;
  padding:0px;
  margin:0px;
}

.example-drag .drop-active {
  top: 0;
  bottom: 0;
  right: 0;
  left: 0;
  position: fixed;
  z-index: 9999;
  opacity: .6;
  text-align: center;
  background: #000;
}
.example-drag .drop-active h3 {
  margin: -.5em 0 0;
  position: absolute;
  top: 50%;
  left: 0;
  right: 0;
  -webkit-transform: translateY(-50%);
  -ms-transform: translateY(-50%);
  transform: translateY(-50%);
  font-size: 40px;
  color: #fff;
  padding: 0;
}
.example-drag .border1 {
    border:3px dashed black;
    border-radius: 6px;
    background-color: lightgrey;
    margin:0px 50px 0px 0px;
   
}
</style>



