<script>
import axios from "axios"
import Success_Popup from "./Common/Success_Popup.vue"
import { Transition } from "vue"
import ServiceClient from "../ServiceClient"
import EventHandler from "@/components/Common/EventHandler/eventHandler.vue";
import errorPopup from "@/components/Common/ErrorPopup.vue";
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
            show_popup: false,
            error_popup:false,
            serverError: {}
        }
    },
    components: {
      EventHandler,
        Transition,
        Success_Popup
    },
    methods:{
        async register(){
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
            if(this.c_password !== this.password){
                this.errors.push("Passwords do not match")
            }
            

            if(!this.errors.length){
                ServiceClient.register(this.name, this.email, this.password, this.c_password).then((response) =>{
                  if (response.status == 200){
                    this.show_popup = true
                    setTimeout(() => {
                      this.$router.push({path: "/login"})
                    }, 1300)
                  }
                }).catch((error) => {
                  this.serverError=error;
                  console.log(this.serverError.response);
                  this.error_popup=true;
                });
            }else{
              this.error_popup=true
            }
        },
        close(){
            this.errors=[]
        },
        closeErrorModal(){
          this.error_popup=false;
        }
    },
    mounted(){
    }
}
</script>

<template>
    <div class="main-container">
        <div class="background register">
        </div>
        <EventHandler
            :successPopup="show_popup"
            :error-popup="error_popup"
            :errorarray="errors"
            :serverError="serverError"
            @close="closeErrorModal"

        />
        
        <div class="centerd-component-container">
            <div class="reg-img">
            </div>
            
            <div clas="form-container">
               
                <div class="form-title">
                        <h1><span>R</span>egister</h1>
                </div>
                <form class="ui large form error" @submit.prevent="register" novalidate>

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