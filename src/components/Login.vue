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
                this.errors = [];
                this.user_name = "";
                let formData = new FormData();
                formData.append("email", this.email);
                formData.append("password", this.password);
                let url = "/api/login";
                this.disablefield = true;

                ServiceClient.post(url, formData).then(response => {
                    if (response.data.success) {
                    
                        this.login_succeded = true;

                        setTimeout(() => {
                            store.commit("setUserData", response.data.data)
                            localStorage.setItem("token", response.data.data.token);
                            this.getNotifications();
                            this.getManaganerNotifications();
                            this.getUserRoles();
                            this.$router.push({path: "/home"});
                        }, 1400);
                        
                    
                    }
                }).catch((error) => {
                    this.disablefield= false
                    this.serverError=error;
                    this.error_popup=true;
                });
            },
            getNotifications(){
                ServiceClient.post('/api/notifications').then(response => {
                    store.commit("getNotifications",response.data);
                
                }).catch(error =>{
                    console.log(error);
                });
            },
            getManaganerNotifications(){
                ServiceClient.post('/api/get-manager-notification').then(response => {
                    store.commit("getManagerNotifications",response.data);
                }).catch(error =>{
                  console.log(error);
                });
            },
            getUserRoles(){
                ServiceClient.post('/api/getUserRole').then(response => {
                    store.commit("setuserRole",response.data)
                }).catch(error =>{
                    console.log(error);
                });
            },
            close(){
                this.errors=[]
            },
            closeErrorModal(){
              this.error_popup=false;
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
        <div class="centerd-component-container">
            
            <div class="form-container">
                <div class="form-title">
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
    </div>

</template>

<style scoped>
    .background.login{
        filter: blur(10px) grayscale(0.35) hue-rotate(1091deg);
    }
    
</style>