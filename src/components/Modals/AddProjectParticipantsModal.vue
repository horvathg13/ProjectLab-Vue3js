<script>
    import SelectComponents from '../Common/SelectComponents.vue';
    import MultipleSelectComponents from '../Common/MultipleSelectComponents.vue';
    import VueClickAway from "vue3-click-away";
    export default{
        name: "AddProjectParticipantModal",
        components:{
           SelectComponents,
           MultipleSelectComponents,
           
        },
        directives:{
            VueClickAway
        },
        props:{
            getusers:Array,
            projectData:{},
            participants:Array,
            tryAgain:null
        },
        watch:{
          'tryAgain':{
            immediate:true,
            deep:true,
            handler(newValue){
              if(newValue== false){
                this.buttonDisable=newValue
              }
            }
          }
        },
        data(){
            return{
                selected_user:[],
                buttonDisable:false,
                SelectComp_getActiveTaskParticipants:[],
                remove_employee:[],
                clear:false
            }
        },
        methods: {
            toggleDrop(){
                this.$emit("toggleDrop")
            },
            cancelModal() {
                this.$emit("cancel-modal");
            },

            createParticipant(){
                this.buttonDisable=true,
                this.$emit("add-participants", { selected: this.selected_user, remove_employee:this.remove_employee});
                this.selected_user=[];
                this.remove_employee=[];
                this.clear=!this.clear;
            },

            makeSelection(data) {
                const {select} = data
                this.selected_user=data
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
        <div  class="modal-overlay"  >
            
            <div class="modal" ><!--v-click-away="cancelModal"--> 
                <div class="close-container">
                    <i class="close large red icon" @click="cancelModal" ></i>
                </div>
                <div class="header">
                    
                    <h1>Add Employee To Project</h1>
                    
                </div>
                <div class="title">
                    <h3>Selected Project: {{ projectData.name ? projectData.name:"" }}</h3>
                    <h3>Manager: {{ projectData.manager ? projectData.manager:"" }}</h3>
                </div>
          
              
                <div class="forms">

                    <div class="form-container">
                        <form class="ui form" @submit.prevent="createParticipant" novalidate>
                           
                            <div class="field"><label>Employees</label></div>
                            <MultipleSelectComponents 
                            :disable="buttonDisable" 
                            :VforArray="this.getusers.map(u=>({id:u.id, name:u.name + ' (' + u.email + ')'}))"
                            :VforActiveArray="this.participants.map(u=>({id:u.id, name:u.name + ' (' + u.email + ')'}))" 
                            :updateSelected="clear"
                            @select="makeSelection"
                            @detach-user="detach"></MultipleSelectComponents>
                            
                    
                            <button :disabled="buttonDisable" class="ui green button create" type="submit">Done</button>
                        </form>
                    </div>
                    
                </div>
              
            </div>
            
      </div>
</template>

<style scoped>
  @media screen and (max-width:280px ){
    .title{
      display: none;
    }
  }
    .title{
        top:15px
    }
    .title h3{
        overflow: hidden;
        text-overflow: ellipsis;
    }
    .ui.green.button.create{
        top:15px
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
    height: 450px;
    width: auto;
    margin: auto;
    border-radius: 20px;
    padding:30px;
    max-width:600px
    }
    .ui.input{
        width: 500px;
        height: auto;
    }
    .form-container{
        height: 150px;
    }

    .form{
        height: 150px;
    }
    .header{
        text-align: center;
        margin-bottom:10px
    }
    .field label{
        font-weight: bold;
        color: rgb(0 0 0 / 62%) !important  
    }
</style>