<script>
    
    import {store} from "../VuexStore"
    import ServiceClient from '../ServiceClient'
    import Success_Popup from './Common/Success_Popup.vue'


    export default{
        name: "Login",
        components: { 
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
                disablefield: false
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
                    if (error.response){
                        if (error.response.data.message) {
                            this.errors.push(error.response.data.message) 
                            
                        } else {
                            this.errors =["Server error occurred"]
                        }
                    }else{
                        this.errors = ["Server error occurred"]
                    }
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
            }
        },
        mounted() {
        },
        
    }
</script>

<template>
    <div class="main-container">
        <div class="background greeting">
        </div>
        <Transition name="drop">
                <Success_Popup v-if="login_succeded"></Success_Popup>
        </Transition>
        <div class="content-container">
        <div class="centerd-component-container">
            
            <div class="form-container">
                <div class="form-title">
                        <h1><span>L</span>og in</h1>
                </div>
                <div class="ui error thiny message" role="alert" v-if="errors.length">
                        <i class="thiny close icon" @click="close"></i>
                        <div class="error-message-header"><i class="exclamation triangle icon"></i>
                            Attention!
                        </div>
                        <ul class="list">
                            <li v-for="(error,index) in errors" :key="index">
                            {{ error }}
                            </li>
                        </ul>
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