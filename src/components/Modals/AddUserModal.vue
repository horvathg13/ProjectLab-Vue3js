<script>
    export default{
        name: "AddUserModal",
        props:{
            Url:""
        },
        data(){
            return{
                name:"",
                email:"",
            }
        },
        methods: {
            cancelModal() {
                this.$emit("cancel-modal");
            },

            createUser(){
                this.$emit("create-user", { name: this.name, email: this.email })
            },

            copyToClipboard(){
                this.$emit("copy-to")
            }
        },
        
    }
</script>

<template>
        <div class="modal-overlay">
            
            <div class="modal"> 
            
                <div class="header">
                    
                    <h1>Add a user</h1>
                    
                </div>
          
              
                <div class="forms">

                    <div class="form-container">
                        <form class="ui form" @submit.prevent="createUser" novalidate>
                            <div class="field">
                                <label>Name</label>
                                <input type="text" name="name" placeholder="Name" v-model="name">
                            </div>
                            <div class="field">
                                <label>Email</label>
                                <input type="email" name="email" placeholder="Email" v-model="email">
                            </div>
                    
                            <button class="ui green button" type="submit" >Generate</button>
                        </form>
                    </div>
                    <div class="ui action input">
                        <input type="text" :value="Url" placeholder="Generated Login Link">
                            <button class="ui teal right labeled icon button" @click="copyToClipboard">
                                <i class="copy icon"></i>
                                Copy
                            </button>
                    </div>
                    <div class="cancel">
                        <button class="ui red button" @click="cancelModal">Cancel</button>
                    </div>
                    
              </div>
              
            </div>
            
      </div>
</template>

<style scoped>

    .modal-overlay {
    z-index: 9999; 
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    margin:auto;
    display: flex;
    justify-content: center;
    background-color: #221e1eda;
    width: 100%;
    min-height: calc(100vh - 55px);
    
    }

    .modal {
    background-color: white;
    height: 500px;
    width: auto;
    margin: auto;
    border-radius: 20px;
    padding:30px
    }
    .ui.input{
        width: 500px;
        height: auto;
    }
    .form-container{
        height: 250px;
    }

    .form{
        margin-top: 0;
    }
    .cancel{
        margin-top: 12%;
    }
    .header{
        text-align: center;
    }
    .field label{
        font-weight: bold;
        color: rgb(0 0 0 / 62%) !important  
    }
</style>