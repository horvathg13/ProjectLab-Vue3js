
<script>
  export default{
    props:{
      message:"",
       
    },
    data(){
        return{
            
                
      }
    },
    methods:{
       

    },

}
</script>
<template>
   
    <div class="popup">
        <div class="popup-content">
            <div class="popup-icon">
                <i class="big white check circle icon"></i>
            </div>
            <div class="popup-text">
                <h1>{{message ? message:"Success!"}}</h1>
            </div>
        </div>
    
        
        
    </div>
  
</template>
<style scoped>
.popup {
  border-radius: 30px;
  width: fit-content;
  position: fixed;
  top: 10%;
  left: 50%;
  margin:auto;
  transform: translate(-50%, -50%);
  background: rgb(28, 177, 23);
  padding: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
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