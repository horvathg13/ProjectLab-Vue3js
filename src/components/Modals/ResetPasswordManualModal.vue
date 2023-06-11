<script>
    export default{
        name: "ResetPasswordManualModal",
        props:{
            Url:""
        },
        data(){
            return{
                
            }
        },
        methods: {
            cancelModal() {
                this.$emit("cancel-modal");
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
                    <i class="exclamation huge triangle icon"></i>
                    <h2>You Activated The Manual Password Reset Mode!</h2>
                    
                </div>
          
              
                

                <div class="form-container">
                    <div class="ui action input">
                    <input type="text" :value="Url" placeholder="Generated Login Link">
                        <button class="ui teal right labeled icon button" @click="copyToClipboard">
                            <i class="copy icon"></i>
                            Copy
                        </button>
                    </div>
                    
                    <button class="ui red button" @click="cancelModal">Cancel</button>
                    
                    
                </div>
                   
                    
                    
                
              
            </div>
            
      </div>
</template>

<style scoped>

    .modal-overlay {
    
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
    background-color: #e8da52;
    height: 400px;
    width: 500px;
    margin: auto;
    border-radius: 20px;
    padding:20px
    }
    .ui.input{
        width: auto;
        height: auto;
        display: flex;
        margin: 0 auto
    }
    .form-container{
        height: 120px;
        margin:0 auto;
        width: auto;
        top:150px
        
    }


   
    .header{
        text-align: center;
    }
   
    .ui.red.button{
        margin-top: 7%;
        left: 38%;
    }
</style>