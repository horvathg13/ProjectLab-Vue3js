
<script>
  export default{
    props:{
      message:"",
      errorarray:Array,
      serverError:'',
    },
    data(){
        return{
            
                
      }
    },
    methods:{
      closeErrorPopup(){
        this.$emit('close-error', false);
      }

    },

  }

</script>

<template>
    <div class="popup">
      <div class="closeIcon">
        <i class="close icon" @click="closeErrorPopup"></i>
      </div>
        <div class="popup-content">
            <div class="popup-icon">
                <i class="big exclamation triangle icon"></i>
            </div>
            <div class="popup-text" v-if="this.errorarray" >
              <ul v-for="error in errorarray">
                <li>{{ error }}</li>
              </ul>
            </div>
            <div class="popup-text" v-if="this.serverError?.response?.data?.validatorError" >
              <ul v-for="error in serverError?.response?.data?.validatorError">
                <li>{{ error}}</li>
              </ul>
            </div>
            <div class="popup-text" v-if="this.serverError?.response?.data && !this.serverError?.response?.data?.validatorError" >
              <ul>
                <li>{{ serverError.response?.data?.message ?  serverError.response?.data?.message : 'Server Error Occurred'}}</li>
              </ul>
            </div>
            <div class="popup-text" v-if="this.message">
                <h1>{{message ? message:"Something wrong!"}}</h1>
            </div>
        </div>
    </div>

        
        

  
</template>
<style scoped>
.popup {
  border-radius: 30px;
  width: fit-content;
  position: fixed;
  top: 15%;
  left: 50%;
  margin:auto;
  transform: translate(-50%, -50%);
  background: rgb(212, 7, 7);
  padding: 15px 25px;
  align-items: center;
  justify-content: center;
  z-index: 999999;
}
.closeIcon{
  color:white;
  font-size: 20px;
  height: 25px;
  width: auto;
  margin-left: 25px;
  float: right;
}
.closeIcon i{
  float: right;
  z-index: 9999;
}
.closeIcon i:hover {
  color: yellow;
  cursor: pointer;
}
.popup-content {
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: bold;
}
.popup-text h1{
  font-size: 25px;
}
.popup-text ul li{
  list-style: none;
}
.drop-enter-active {
  animation: bounce-in 0.5s;
}
.drop-leave-active{
    transition: all 0.5s;
}

.drop-leave-to {
    animation: bounce-out 0.5s;
}

@keyframes bounce-in {
  0% {
    transform: scale(0) translate(-50%, -50%);
  }
  50% {
    transform: scale(1.25) translate(-50%, -50%);
  }
  100% {
    transform: scale(1) translate(-50%, -50%);
  }
}
@keyframes bounce-out {
  0% {
    transform: scale(1) translate(-50%, -50%);
  }
  50% {
    transform: scale(1.25) translate(-50%, -50%);
  }
  100% {
    transform: scale(0) translate(-50%, -50%);
  }
}
</style>