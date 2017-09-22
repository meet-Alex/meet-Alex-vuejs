<template>

   <div>
        <div style="text-align:center">
        <span class='alex'><br><br><br><br><br>a l e x</span>
        </div>
        <div class='alex-below'></div>
   </div>

</template>



<script>
    export default {
        data() {
            return {
                isDropdownOpen: false
            }
        },
        created: function () {
            this.getToken();
        },
        methods: {
            getToken: function() {
                 this.$http.post('login',   {"email": "admin@meet-alex.org", "password": ""}
                 )
                 .then(response => {
                    return response.json();
                })
                 .then(data=>{console.log(data)})
                 
            }
        }
    }

</script>



