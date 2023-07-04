<script>
    import VueDatePicker from '@vuepic/vue-datepicker';
    import '@vuepic/vue-datepicker/dist/main.css'
    import SelectComponents from '../Common/SelectComponents.vue';

    export default{
        name: "CreateTaskModal",
        components:{
            VueDatePicker,
            SelectComponents,
        },
        props:{
           priorities:Array,
           isDropdownOpen: null,
           projectData:Array,
           EditMode:false,
           EditData:{},
            
        },
        data(){
            return{
                Task_Details:{
                    name: "",
                    deadline: "",
                    description:"",
                    priority: null,
                    p_id: null,
                },
                priority_name:"",
                
                
                
            }
        },
        methods: {
            toggleDrop(){
                this.$emit("toggleDrop")
            },
            cancelModal() {
                this.$emit("cancel-modal");
            },

            createTask(){
                
                this.$emit("create-task", { task: this.Task_Details})
            },

            selectPriority(priority) {
                this.Task_Details["priority"] = priority.id;
                this.priority_name = priority.task_priority               
            },

            makeSelection(data){
                const {select} = data
                this.Task_Details.priority= select.id
            },
          
        },
        mounted(){
            if(this.EditData && this.EditMode=== true){
                console.log(this.EditData, "solution")
                this.Task_Details.name= this.EditData.task_name;
                this.Task_Details.deadline = this.EditData.dedadline.replace(/-/g, ".")
                this.Task_Details.description = this.EditData.description
                this.Task_Details.priority = this.EditData.priority

            }
       
        },
        
    }
</script>

<template>
        <div class="modal-overlay">
            
            <div class="modal"> 
                <div class="close">
                    <i class="close large red icon" @click="cancelModal"></i>
                </div>
                <div class="header">
                    
                    <h1 v-if="this.EditMode=== false">Let's create a task!</h1>
                    <h1 v-if="this.EditMode=== true">Edit Mode</h1>
                    
                    
                </div>
          
              
                <div class="forms">

                    <div class="form-container">
                        <form class="ui form" @submit.prevent="createTask" novalidate>
                            <div class="field">
                                <label>Task Name</label>
                                <input type="text" name="name" placeholder="Name" v-model="Task_Details.name">
                            </div>
                           
                            <div class="field">
                                <label>Task Deadline</label>
                                <VueDatePicker v-model="Task_Details.deadline"
                                :enable-time-picker="false"
                                model-type="yyyy.MM.dd"
                                format="yyyy-MM-dd"
                                >{{ Task_Details.deadline }}</VueDatePicker>
                            </div>
                            <div class="field">
                                <label>Description</label>
                                <textarea type="texarea" name="description" placeholder="Details" v-model="Task_Details.description"></textarea>
                            </div>
                            <div class="field">
                                <label>Select Priority</label>
                            </div>
                            <SelectComponents :VforArray="this.priorities" :editname="this.EditData.priority" @select="makeSelection"></SelectComponents>

                            <button class="ui green button" type="submit">Create</button>
                        </form>
                    </div>
                    
              </div>
              
            </div>
            
      </div>
</template>

<style scoped> 
    .ui.form textarea:not([rows]){
        height: auto;
        min-height: 9em;
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
    height: 650px;
    width: max-content;
    margin: auto;
    border-radius: 20px;
    padding:30px
    }
    .ui.input{
        width: 500px;
        height: auto;
    }
    .form-container{
        height: 520px;
    }

    .form{
        margin-top: 0;
    }
  
    .header{
        text-align: center;
    }
    .field label{
        font-weight: bold;
        color: rgb(0 0 0 / 62%) !important  
    }
    .ui.green.button{
        top:15px
    }
    .close{
        width: 60px;
        left:84%;
        cursor: pointer;
    }
</style>