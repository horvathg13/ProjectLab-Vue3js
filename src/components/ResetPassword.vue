<script>
   import ServiceClient from '../ServiceClient'
   import Success_Popup from './Common/Success_Popup.vue'


export default{
    name: "ResetPassword",
    components: { 
        Success_Popup,
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
            disablefield: false
        };
    },
   
    methods: {

        findUser(){
            let url=`/api/findUser/${this.$route.params.token}`
            ServiceClient.get(url).then((response)=>{
                if(response.data.success==true){
                    this.name = response.data.name,
                    this.email = response.data.email
                }else{
                    this.errors.push(response.data.error)
                }
               
            });
                
            
        },

        resetPassword() {

            let formData = new FormData();
            formData.append("email", this.email);
            formData.append("password", this.password);
            formData.append("confirm_password", this.c_password);
            let url = "/api/resetpassword";
            this.disablefield = true;

            ServiceClient.post(url, formData).then(response => {
                if (response.data.status === 200) {
                   
                    this.login_succeded = true;

                    setTimeout(() => {
        
                        this.$router.push({path: "/login"});

                    }, 1300);
                    
                  
                }
            }).catch((error) => {
                this.disablefield= false        
                if (error.response.status) {
                if (error.response.data.message) {
                    this.errors = Object.values(error.response.data.message).flatMap(y => y)
                    
                } else {
                    this.errors = ["Server error occurred"] 
                }
                }
            });
        },
        close(){
            this.errors=[]
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
        <Transition name="drop">
                <Success_Popup v-if="login_succeded"></Success_Popup>
        </Transition>
        <div class="content-container">
            <div class="centerd-component-container">
                
                <div class="form-container">
                    <div class="HP-title">
                            <h1>Welcome {{name}}</h1>
                            <h2>Please, set your new password</h2>
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