<template>
   <div class="container">
       <br><br>
    <b-form @submit="onSubmit">
      <b-form-group 
                    label="Email address:" label-for="emailInput"
                    description="Provide your email you used to register">
        <b-form-input id="emailInput"
                      type="email" v-model="form.email" required
                      placeholder="Enter email"
        ></b-form-input>
      </b-form-group>
      <b-form-group
                    label="Password:" label-for="passwordInput">
        <b-form-input id="passwordInput"
                      type="password" v-model="form.password" required
                      placeholder="Enter your password"
        ></b-form-input>
      </b-form-group>
      <b-form-group>
        <b-form-checkbox v-model="form.rememberMe" id="rememberMe">
          Remember me
        </b-form-checkbox>
      </b-form-group>
      <b-button type="submit" variant="primary">Login</b-button>
    </b-form>
   </div>
</template>



<script>
    import globalData from '../global_data';
    export default {
        data() {
            return {
                isDropdownOpen: false,
                 form: {
                    email: '',
                    password: '',
                    rememberMe: false
                }
            }
        },
        created: function () {
        },
        methods: {
            getToken: function() {
                 this.$http.post('login',   {"email": this.form.email, "password": this.form.password}
                 )
                 .then(response => {
                    return response.json();
                })
                 .then(data=>{
                     globalData.userInfo.email=this.form.email;
                     globalData.userInfo.token=data.token;
                     console.log(globalData.userInfo)})
                  //  this.$router.push('collections')
            },
            onSubmit: function(evt) {
                evt.preventDefault();
                 this.getToken();
            }
        }
    }
/*
      this.$http.post('login',   {params:{"email": "admin@meet-alex.org", "password": "Password123"}, 
                                            headers: {"Content-type":"application/x-www-form-urlencoded"}}
                 )
*/
</script>



