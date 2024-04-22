<script>
   import ServiceClient from '../ServiceClient'
   import Success_Popup from './Common/Success_Popup.vue'
   import EventHandler from "@/components/Common/EventHandler/eventHandler.vue";


export default{
    name: "ResetPassword",
    components: {
      EventHandler,
    },
    data() {
        return {
            name: "",
            email: "",
            password: "",
            c_password:"",
            errors: [],
            userData: {},
            login_succeded: false,
            error_popup:false,
            disablefield: false
        };
    },
   
    methods: {

        findUser(){
            ServiceClient.findUserByToken(this.$route.params.token).then(response=>{
              this.name = response.name
              this.email = response.email
            }).catch(error=>{
              console.log(error);
              if(error.response){
                this.errors.push(error.response.data?.error)
                this.error_popup=true
              }
            })
        },

        resetPassword() {
            this.closeErrorModal()
            this.disablefield = true;
            ServiceClient.resetPassword(this.email, this.password, this.c_password).then(response => {
                this.login_succeded = true;
                setTimeout(() => {
                  this.$router.push({path: "/login"});
                }, 1300);
            }).catch((error) => {
              this.disablefield= false
              if (error.response.status) {
                if (error.response.data.message) {
                  this.errors = Object.values(error.response.data.message).flatMap(y => y)
                } else {
                  this.errors = ["Server error occurred"]
                }
              }
              this.error_popup=true
            });
        },
      closeErrorModal(){
            this.errors=[];
            this.error_popup=false
      },

    },
    mounted() {
        this.findUser()
    },
}
    
</script>

<template>
    
    <div class="main-container">
        <div class="background greeting">
        </div>
        <EventHandler
            :successPopup="login_succeded"
            :error-popup="error_popup"
            :errorarray="errors"
            @close="closeErrorModal"
        />
        <div class="content-container">
            <div class="centerd-component-container">
                
                <div class="form-container">
                    <div class="HP-title">
                            <h1>Welcome {{name}}</h1>
                            <h2>Please, set your new password</h2>
                    </div>
                    <form class="ui big form" @submit.prevent="resetPassword" novalidate>
                        <div class="field">
                            <label><span>P</span>assword</label>
                            <input type="password" name="password" :disabled="disablefield" placeholder="password" v-model="password">
                        </div>
                        <div class="field">
                            <label><span>C</span>onfirm password</label>
                            <input type="password" name="password" :disabled="disablefield" placeholder="confirm password" v-model="c_password">
                        </div>
                        <button class="big ui green button" type="submit" :disabled="disablefield">Reset</button>
                    </form>
                
                </div>
            </div>
        </div>
    </div>

</template>
<style scoped>
.HP-title{
    text-align: center;
    width: auto;
    max-width: 800px;
}
.HP-title h1{
    overflow: hidden;
    text-overflow: ellipsis;

}
</style>