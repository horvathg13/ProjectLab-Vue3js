<script>
    
    import {store} from "../VuexStore"
    import ServiceClient from '../ServiceClient'
    import Success_Popup from './Common/Success_Popup.vue'
    import EventHandler from "@/components/Common/EventHandler/eventHandler.vue";


    export default{
        name: "Login",
        components: {
          EventHandler,
            Success_Popup,
        },
        data() {
            return {
                user: {},
                email: "",
                password: "",
                errors: [],
                user_name: "",
                userData: {},
                login_succeded: false,
                disablefield: false,
                serverError:'',
                error_popup:false,
            };
        },
    
        methods: {
            async login() {
                this.closeErrorModal()
                this.errors = [];
                this.user_name = "";
                this.disablefield = true;

                ServiceClient.login(this.email, this.password).then((response)=>{
                      if (response.data.success) {
                        this.login_succeded = true;
                        store.commit("setUserData", response.data.data)
                        localStorage.setItem("token", response.data.data.token);

                        Promise.all([
                          ServiceClient.getUserRoles(),
                          ServiceClient.getManagerNotifications(),
                          ServiceClient.getNotifications(),
                        ]).then(()=>{this.$router.push({path: "/home"})})
                      }
                }).catch((error) => {
                  this.disablefield= false
                  this.serverError=error;
                  this.error_popup=true;
                });
            },
            getNotifications(){
                ServiceClient.getNotifications();
            },
            getManagerNotifications(){
              ServiceClient.getManagerNotifications();
            },
            getUserRoles(){
              ServiceClient.getUserRoles();
            },
            close(){
                this.errors=[]
            },
            closeErrorModal(){
              this.error_popup=false;
              this.errors=[];
              this.serverError='';
            }
        },
        mounted() {
        },
        
    }
</script>

<template>
    <div class="main-container">
        <div class="background greeting"></div>

        <EventHandler
            :successPopup="login_succeded"
            :error-popup="error_popup"
            :errorarray="errors"
            :serverError="serverError"
            @close="closeErrorModal"
        />

        <div class="content-container">
          <div class="form-container login-container">
              <div class="form-title login-title">
                      <h1><span>L</span>og in</h1>
              </div>
              <form class="ui big form" @submit.prevent="login" novalidate>
                  <div class="field">
                      <label><span>E</span>-mail</label>
                      <input type="email" name="email" :disabled="disablefield" placeholder="email" v-model="email">
                  </div>
                  <div class="field">
                      <label><span>P</span>assword</label>
                      <input type="password" name="password" :disabled="disablefield" placeholder="password" v-model="password">
                  </div>
                  <button class="big ui green button" type="submit" :disabled="disablefield">Login</button>
              </form>
          </div>
        </div>
    </div>

</template>

<style scoped>
    .form-container.login-container{
      display: flex;
      flex-direction: column;
      padding: 15px;
    }
    .form-title.login-title{
      text-align: center;
      width: 100%;
    }
    .login-title h1{
      font-size: 65px !important;
    }
    .background.login{
        filter: blur(10px) grayscale(0.35) hue-rotate(1091deg);
    }
    
</style>