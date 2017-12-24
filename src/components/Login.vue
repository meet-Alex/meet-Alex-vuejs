<template>
<div>
 <div v-if="userinfo.loggedin">
   <div class="container">
     <b-button v-on:click="logOff" variant="primary">Log out</b-button>
      <b-button v-on:click="cancelLogOff" variant="primary">Cancel</b-button>
   </div>
 </div>

  <div v-if="!userinfo.loggedin">
   <div class="container">
       <div class="title-header" v-if="!isRegister">Login</div>
       <div class="title-header" v-if="isRegister">Register new account</div>
       <br>
    <b-form @submit="onSubmit1">
      <b-form-group horizontal label="Email address:" label-for="emailInput">
        <b-form-input id="emailInput"  :state="emailOk"  aria-describedby="inputEmailFeedback"
                      type="email" v-model="form.email" required
                      placeholder="Enter email">
        </b-form-input>
          <b-form-invalid-feedback id="inputEmailFeedback">
                Provide a valid email adress
            </b-form-invalid-feedback>
      </b-form-group>
      <b-form-group horizontal v-if="isRegister" label="Name:" label-for="nameInput">
        <b-form-input id="nameInput" :state="nameOk"  aria-describedby="inputNameFeedback"
                      type="text" v-model="form.name" required
                      placeholder="Enter full name">
        </b-form-input>
        <b-form-invalid-feedback id="inputNameFeedback">
               Full name must be at least 4 characters
        </b-form-invalid-feedback>
      </b-form-group>
        <b-form-group horizontal v-if="isRegister" label="Nickname:" label-for="nickNameInput">
        <b-form-input id="nickNameInput"
                      type="text" v-model="form.nickName" required
                      placeholder="If you don't want your name to be exposed enter a nick name">
        </b-form-input>
      </b-form-group>
      
      <b-form-group horizontal label="Password:" label-for="passwordInput">
        <b-form-input id="passwordInput" :state="pwOk"  aria-describedby="inputPwFeedback"
                      type="password" v-model="form.password" required
                      placeholder="Enter your password"
        ></b-form-input>
              <b-form-invalid-feedback id="inputPwFeedback">
               Password must be at least 5 characters
        </b-form-invalid-feedback>
      </b-form-group>
        <b-form-group horizontal v-if="isRegister" label="Confirm Password:" label-for="confirmPasswordInput">
            <b-form-input id="confirmPasswordInput" :state="pwConfirmOk"  aria-describedby="inputLiveFeedback"
                        type="password" v-model="form.passwordConfirm" required
                        placeholder="Repeat your password">
            </b-form-input>
            <b-form-invalid-feedback id="inputLiveFeedback">
                Passwords must be identical
            </b-form-invalid-feedback>
        </b-form-group>

      <b-form-group  v-if="isRegister">
            <label class="control-label">Terms of use</label>
            <div >
                <div style="border: 1px solid #e5e5e5; height: 200px; overflow: auto; padding: 10px;">
                    <p>These Website Standard Terms and Conditions (these “Terms” or these “Website Standard Terms and Conditions”) contained here on this webpage, shall govern your use of this website.</p>
                    <p>These Terms apply in full force and effect to your use of this Website and by using this Site you accept all terms and conditions in full. You must not use https://www.meet-alex.org, if you have any objection to any of these Website Standard Terms and Conditions.</p>
                    <p>Other than content you own, which you may have chosen to include on this Website, Meet-Alex and/or its licensors own all rights to the intellectual property and material contained in this Website. You are granted a limited license only, subject to the restrictions provided in these Terms, for purposes of viewing the material contained on https://www.meet-alex.org.</p>
                    <p>Meet-Alex makes no express or implied warranties or representations of any kind with regards to this Website or the materials contained on this Website. In addition no content contained on this Website shall be considered as providing advice to you.</p>
                    <p>Under no circumstances shall Meet-Alex, or any of its officers, directors and employees, be liable to you for anything resulting from or connected to your use of this Website. Meet-Alex, including its officers, directors and employees shall not be liable for any indirect, consequential or special liability resulting from or in any way related to your use of this Website.</p>
                    <p>These Terms may be revised at any time Meet-Alex sees fit, and you are expected to review such terms on a regular basis to ensure your understanding of all terms and conditions governing use of this Website.revise the updated date at the bottom of this page. By using this Website you are acknowledging your responsibility to do so.</p>
                    <p>These Terms, including any legal notices and disclaimers contained on this Website, constitute the entire agreement between Meet-Alex and you with regards to your use of this Website, and replace all prior agreements and understandings with respect to the same.</p>
                    <p>These Terms will be governed by and construed in accordance with the laws of The Netherlands, and you submit to the nonexclusive jurisdiction of the courts located in The Netherlands for the resolution of any disputes.</p>
                </div>
            </div>
		</b-form-group>
         <b-form-group  v-if="isRegister">
        <b-form-checkbox  :state="acceptOk"  aria-describedby="inputAcceptFeedback" v-model="form.acceptTerms">
          I agree with the terms and conditions
        </b-form-checkbox>
         <div v-if="!form.acceptTerms" class="invalid-fb" >
                You must accept the terms to use this service
            </div>
      </b-form-group>

      <!--
      <b-form-group>
        <b-form-checkbox v-model="form.rememberMe" id="rememberMe">
          Remember me
        </b-form-checkbox>
      </b-form-group>
      -->
      <b-button v-if="!isRegister" :disabled="!loginOk" v-on:click="onSubmit" variant="primary">Login</b-button>
       <b-button v-if="isRegister" :disabled="!registerOk"  v-on:click="onSubmit" variant="primary">Register</b-button>

      <div v-if="!isRegister">
          Do not have an account? 
            <button class='link' v-on:click="isRegister=true">Register</button>
      </div>
       <div v-if="isRegister">
          Already have an account? 
            <button class='link' v-on:click="isRegister=false">Login</button>
      </div>
    </b-form>
   </div>
  </div>
</div>
</template>



<script>
import globalData from "../global_data";
import { mapMutations, mapGetters, mapState } from "vuex";
export default {
  data() {
    return {
      isRegister: false,
      isLoggedIn: false,
      form: {
        email: "",
        password: "",
        name: "",
        passwordConfirm: "",
        rememberMe: false,
        acceptTerms: false
      }
    };
  },
  created: function() {
    console.log(this.getLogin());
  },
  computed: {
    ...mapState(["userinfo"]),
    pwConfirmOk() {
      return (
        this.form.password.length === 0 ||
        this.form.password === this.form.passwordConfirm
      );
    },
    pwOk() {
      return this.form.password.length > 4;
    },
    emailOk() {
      return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(
        this.form.email
      );
    },
    nameOk() {
      return this.form.name.length > 3;
    },
    acceptOk() {
      return this.form.acceptTerms;
    },
    loginOk() {
      return this.pwOk && this.emailOk;
    },
    registerOk() {
      return (
        this.pwOk &&
        this.pwConfirmOk &&
        this.nameOk &&
        this.emailOk &&
        this.acceptOk
      );
    }
  },
  methods: {
    ...mapMutations(["updateLogin", "logOut"]),
    ...mapGetters(["getLogin"]),
    login: function() {
      this.$http
        .post("login", { email: this.form.email, password: this.form.password })
        .then(
          response => {
            var data = response.data;
            this.updateLogin(data);
            //this.$router.push("collections");
            console.log(this.getLogin());
            this.$router.go(-1);
          })
          .catch(error => {
            alert(error.response.data.error);
          }
        );
    },
    register: function() {
      this.$http
        .post("register", {
          email: this.form.email,
          password: this.form.password,
          name: this.form.name
        })
        .then(
          response => {
            console.log(response);
            var data = response.data;
            this.updateLogin(data);
           // this.$router.push("collections");
            console.log(this.getLogin());
            this.$router.go(-1);
          })
          .catch(error => {
            console.log(error.response);
            var message = "";
            Object.keys(error.response.data).map(function(key, index) {
              message += error.response.data[key][0];
            });
            alert(message);
          }
        );
    },
    logOff: function() {
      this.logOut();
      this.$router.go(-1);
    },
    cancelLogOff: function() {
      this.$router.go(-1);
    },
    onSubmit1: function(evt) {
      evt.preventDefault();
    },
    onSubmit: function(evt) {
      evt.preventDefault();
      if (!this.isRegister) {
        this.login();
      } else {
        this.register();
      }
    }
  }
};
</script>
<style scoped>
.container {
  width: 800px;
  padding: 50px;
}
button.link {
  background: none;
  border: none;
  color: blue;
  text-decoration: underline;
}
button.link:hover {
  cursor: pointer;
}
.title {
  font-size: 1.4rem;
  color: grey;
  margin: 10px 0px;
}
.invalid-fb {
  margin-top: 0.25rem;
  font-size: 0.875rem;
  color: #dc3545;
}
</style>


