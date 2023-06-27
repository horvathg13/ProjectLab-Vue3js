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
           projectData:Array
            
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
        
    }
</script>

<template>
        <div class="modal-overlay">
            
            <div class="modal"> 
            
                <div class="header">
                    
                    <h1>Let's create a task!</h1>
                    
                    
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
                                :flow="flow"
                                :enable-time-picker="false"
                                model-type="yyyy.MM.dd"
                                >{{ Task_Details.deadline }}</VueDatePicker>
                            </div>
                            <div class="field">
                                <label>Description</label>
                                <textarea type="texarea" name="description" placeholder="Details" v-model="Task_Details.description"></textarea>
                            </div>
                            <div class="field">
                                <label>Select Priority</label>
                            </div>
                            <SelectComponents :VforArray="this.priorities" @select="makeSelection"></SelectComponents>
                            <!--<div class="ui fluid selection dropdown" @click="toggleDrop" :class="{ active: Task_Details.priority }">
                                <i class="dropdown icon"></i>
                                <input type="hidden" name="user" v-model="Task_Details.priority"/>
                                    <div class="selected-text">{{priority_name}} </div>
                                    <div class="menu" :class="{ active: isDropdownOpen }" >
                                        <div class="item" v-for="priority in priorities" :key="priority.id" @click="selectPriority(priority)">
                                            {{ priority.task_priority }}
                                        </div>
                                    </div>
                            </div>-->
                            <button class="ui green button" type="submit">Create</button>
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
</style>