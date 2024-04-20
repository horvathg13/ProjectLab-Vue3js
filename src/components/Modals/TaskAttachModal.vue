<script>
    import VueDatePicker from '@vuepic/vue-datepicker';
    import '@vuepic/vue-datepicker/dist/main.css'
    import MultipleSelectComponents from '../Common/MultipleSelectComponents.vue'
    import VueClickAway from 'vue3-click-away';
    
    export default{
        name: "TaskAttachModal",
        components:{
            VueDatePicker,
            MultipleSelectComponents,
        },
        directives:{
            VueClickAway
        },
        props:{
            getProjectParticipants:Array,
            getActiveTaskParticipants:Array,
            taskData:Array,
            tryAgain:''
        },
        data(){
            return{
                selected_employee:[],
                remove_employee:[],
                SelectComp_getProjectParticipants:[],
                SelectComp_getActiveTaskParticipants:[],
                buttonDisable:false,
                clear:false
            }
        },
        watch:{
            'getProjectParticipants':{
                immediate:true,
                handler(newValue){
                   this.SelectComp_getProjectParticipants = newValue
                }
            },
            'getActiveTaskParticipants':{
                immediate:true,
                handler(newValue){
                    this.SelectComp_getActiveTaskParticipants = newValue
                }
            },
          'tryAgain':{
            immediate:true,
            handler(newValue){
              this.buttonDisable = newValue
              this.selected_employee=[];
              this.remove_employee=[];
            }
          }
        },
        methods: {
            cancelModal() {
                this.$emit("cancel-modal");
            },

            attach(){
                this.$emit("attach-user", {selected_employee: this.selected_employee, remove_employee:this.remove_employee})
                this.selected_employee=[];
                this.remove_employee=[];
                this.clear=!this.clear
            },

            makeSelection(data){
                const {select}=data
                this.selected_employee = data
            },
            detach(data){
                const{detach} = data;
                this.remove_employee = data.remove
            }
        },
        mounted(){
           
        }
        
    }
</script>

<template>
        <div class="modal-overlay">
            
            <div class="modal"> 
                <div class="close">
                    <i class="close large red icon" @click="cancelModal"></i>
                </div>
                <div class="header">
                    
                    <h1>Employee Controll Panel</h1>
                    
                </div>
          
              
                <div class="forms">

                    <div class="form-container">

                        <form class="ui form" @submit.prevent="attach" novalidate>
                           
                            <div class="field"><label>Remove or Add Active Employee(s)</label></div>
                            <MultipleSelectComponents :VforArray="this.SelectComp_getProjectParticipants.length>0 ? this.SelectComp_getProjectParticipants.map(u=>({id:u.id, name:u.name + ' (' + u.email + ')'})) :null" 
                            :VforActiveArray="this.SelectComp_getActiveTaskParticipants.length >0 ? this.SelectComp_getActiveTaskParticipants.map(u=>({id:u.id, name:u.name + ' (' + u.email + ')'})) :null"
                            @select="makeSelection"
                            @detach-user="detach"
                            :update-selected="clear"></MultipleSelectComponents>
                            
                    
                            <button class="ui green create button" type="submit" :disabled="buttonDisable">That's it!</button>
                        </form>
                    </div>
                </div>
              
            </div>
        </div>    
      
</template>

<style scoped>
    .ui.form .field{
        margin: 25px 0 0
    }
    .ui.green.create.button{
        top:30%
    }

    .selected-text{
        color: black;
        
    }
   .ui.fluid.dropdown{
        z-index: 9999;
        
    }

    .ui.fluid.dropdown.active{
        background-color: rgb(101, 241, 101);
    }

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
    height: 400px;
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

    .close{
        width: 60px;
        left:84%;
        cursor: pointer;
    }
</style>