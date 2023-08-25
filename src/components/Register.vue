<script>
import axios from "axios"
import Success_Popup from "./Common/Success_Popup.vue"
import { Transition } from "vue"
import ServiceClient from "../ServiceClient"
export default{
    name:"Register",

    data(){
        return{
            user:{},
            name:"",
            email:"",
            password:"",
            c_password:"",
            errors:[],
            show_popup: false
        }
    },
    components: {
        Transition,
        Success_Popup
    },
    methods:{
        async register(){
            console.log("Submit btn is pressed");
            this.errors=[];
            if(!this.name){
                this.errors.push("Name is required")
            }
            if(!this.email){
                this.errors.push("Valid email is required")
            }
            if(!this.password){
                this.errors.push("Password is required")
            }
            /*if(this.password.length > 8){
                this.errors.push("The password must be min.8 character")
            }*/
            //a jelszó tartalmazzon nagybetűket és számokat is! 
            if(this.c_password !== this.password){
                this.errors.push("Passwords do not match")
            }
            

            if(!this.errors.length){
                let formData = new FormData();
                formData.append("name", this.name);
                formData.append("email", this.email);
                formData.append("password", this.password);
                formData.append("confirm_password", this.c_password);
                
                let url ="/api/register";
                ServiceClient.post(url,formData).then((response) =>{
                    console.log(response);
                    if (response.status == 200){
                        this.show_popup = true
                        console.log(this.show_popup, "in action")
                        setTimeout(() => {
                            this.$router.push({path: "/login"})
                        }, 1300)
                    }
                })  .catch((error) => {
                        
                    if (error.response && error.response.status) {
                        //console.log(error.response)
                        if(error.response.data.validatorError){
                            this.errors=Object.values(error.response.data.validatorError)
                            //console.log(this.errors, "ERRORS")
                            
                            /*setTimeout(() => {
                                this.errors=[];
                            },  2000)*/
                        }
                        if (error.response.data.message) {
                            
                            this.errors = Object.values(error.response.data.message).flatMap(y => y)
                           
                            //alert("Server side form validation is working");
                        }else if(!error.response.data.validatorError && !error.response.data.message){
                            this.errors = ["Server error occurred"] 
                        }
                    }
                });
            }
        },
        close(){
            this.errors=[]
        }
    },
    mounted(){
        console.log(this.$route)
    }
}
</script>

<template>
    <div class="main-container">
        <div class="background register">
        </div>

        <Transition name="drop">
            <Success_Popup v-if="show_popup"></Success_Popup>
        </Transition>
        
        <div class="centerd-component-container">
            <div class="reg-img">
            </div>
            
            <div clas="form-container">
               
                <div class="form-title">
                        <h1><span>R</span>egister</h1>
                </div>
                <form class="ui large form error" @submit.prevent="register" novalidate>
                    <div class="ui error thiny message" role="alert" v-if="errors.length">
                        <i class="thiny close icon" @click="close"></i>
                        <div class="error-message-header"><i class="exclamation triangle icon"></i>
                            Attention! Form validation controll!
                        </div>
                        <ul class="list">
                            <li v-for="(error,index) in errors" :key="index">
                            {{ error }}
                            </li>
                        </ul>
                    </div>
                    <div class="field">
                        <label><span>N</span>ame</label>
                        <input type="text" name="name" placeholder="type your name" v-model="name">
                    </div>
                    
                    <div class="field">
                        <label><span>E</span>-mail</label>
                        <input type="email" name="email" placeholder="email adress" v-model="email">
                    </div>
                    <div class="field">
                        <label><span>P</span>assword</label>
                        <input type="password" name="password" placeholder="password" v-model="password">
                    </div>
                    <div class="field">
                        <label><span>P</span>assword confirm</label>
                        <input type="password" name="password" placeholder="password" v-model="c_password">
                    </div>
                    <button class="big ui green button" type="submit">Register</button>
                </form>
            </div>
        </div>
    </div>

</template>

<style scoped>
    .centerd-component-container{
        display: flex;
    }

</style>