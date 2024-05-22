<script>
    export default{
        name: "AreYouSureModal",
       
        data(){
            return{
                trigger: null,
            }
        },
        methods: {
            response(str){
                this.trigger = str
                this.$emit("trigger", { trigger: this.trigger })
            },
           
                
            

        },
        
    }
</script>

<template>
        <div class="modal-overlay">
            
            <div class="modal"> 
            
                <div class="header">
                    <i class="exclamation huge triangle icon"></i>
                    <h2>Are You Sure?</h2>
                </div>
                <div class="forms">
                    <div class="form-container">
                        <div class="cancel">
                            <button class="ui big green button" @click="response(true)">Yes</button>
                            <button class="ui big red button" @click="response(false)">No</button>
                        </div>
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
    background-color: #e8da52;
    height: 250px;
    width: 500px;
    margin: auto;
    border-radius: 20px;
    padding:20px;
    }
    @media screen and (max-width: 420px){
      .modal .form-container{
        left: 5% !important;
      }
    }
    .ui.input{
        width: 500px;
        height: auto;
    }
    .form-container{
        height: 100px;
        display: inline-flex;
        width: 100%;
        left: 15%;
    }
    .header{
        text-align: center;
    }
   
    .ui.red.button{
        margin-top: 7%;
        left: 80%;
    }

    
</style>