<script>
import Success_Popup from "@/components/Common/Success_Popup.vue";
import ErrorPopup from "@/components/Common/ErrorPopup.vue";
export default{
  components: {ErrorPopup, Success_Popup},
  props:{
    errorMessage:'',
    successMessage:"",
    errorarray:Array,
    successPopup:'',
    errorPopup:'',
    serverError:''
  },

  methods:{
    close(){
      this.$emit('close');
    }
  }

}
</script>

<template>
  <Transition name="drop">
    <Success_Popup v-if="successPopup==true" :message="this.successMessage"></Success_Popup>
  </Transition>
  <Transition name="drop">
    <ErrorPopup v-if="errorPopup==true" :message="this.errorMessage" :errorarray="this.errorarray"  :serverError="this.serverError" @close-error="close"></ErrorPopup>
  </Transition>
</template>

<style scoped>

</style>