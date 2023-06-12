<script>
    import VueDatePicker from '@vuepic/vue-datepicker';
    import '@vuepic/vue-datepicker/dist/main.css'
    import MultipleSelectComponents from '../Common/MultipleSelectComponents.vue'
    
    export default{
        name: "TaskAttachModal",
        components:{
            VueDatePicker,
            MultipleSelectComponents,
        },
        props:{
            getProjectParticipants:Array,
            getActiveTaskParticipants:Array,
            
        },
        data(){
            return{
                selected_employee:[],
                
                
            }
        },
        methods: {
            cancelModal() {
                this.$emit("cancel-modal");
            },

            attach(){
                this.$emit("attach-user", {selected_employee: this.selected_employee})
            },

            makeSelection(data){
                const {select}=data

                this.selected_employee = data
            }

          
        },
        mounted(){
           
        }
        
    }
</script>

<template>
        <div class="modal-overlay">
            
            <div class="modal"> 
            
                <div class="header">
                    
                    <h1>Employee Controll Panel</h1>
                    
                </div>
          
              
                <div class="forms">

                    <div class="form-container">

                        <form class="ui form" @submit.prevent="attach" novalidate>
                           
                            <div class="field"><label>Remove or Add Active Employee(s)</label></div>
                            <MultipleSelectComponents :VforArray="this.getProjectParticipants.map(u=>({id:u.id, name:u.name + ' (' + u.email + ')'}))" @select="makeSelection"></MultipleSelectComponents>
                            
                    
                            <button class="ui green create button" type="submit">That's it!</button>
                        </form>
                    </div>
                    <div class="cancel">
                        <button class="ui red button" @click="cancelModal">Cancel</button>
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