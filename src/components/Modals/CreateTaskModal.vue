<script>
    import VueDatePicker from '@vuepic/vue-datepicker';
    import '@vuepic/vue-datepicker/dist/main.css'
    import SelectComponents from '../Common/SelectComponents.vue';
    import VueClickAway from 'vue3-click-away';

    export default{
        name: "CreateTaskModal",
        components:{
            VueDatePicker,
            SelectComponents,
        },
        directives:{
            VueClickAway
        },
        props:{
           priorities:Array,
           isDropdownOpen: null,
           projectData:Array,
           EditMode:false,
           EditData:{},
           readOnlyMode:false,
           tryAgain:null,
           createNewTask:Boolean,

        },
        data(){
            return{
                SelectCompData:{},
                Task_Details:{
                    id:null,
                    name: "",
                    deadline: "",
                    description:"",
                    priority: "",
                    p_id: null,
                },
                priority_name:"",
                buttonDisable:Boolean,
            }
        },
        watch:{
            'EditData':{
                immediate:true,
                deep:true,
                flush:true,
                handler(newValue){
                    this.SelectCompData = newValue
                }
            },
            'readOnlyMode':{
                immediate:true,
                deep:true,
                handler(newValue){
                    this.buttonDisable=newValue
                }
            },
            'tryAgain':{
                immediate:true,
                deep:true,
                handler(newValue){
                    if(newValue==false){
                        this.buttonDisable=newValue
                    }
                }
            }
        },
        methods: {
           
            toggleDrop(){
                this.$emit("toggleDrop")
            },
            cancelModal() {
                this.SelectCompData ={}
                this.$emit("cancel-modal");
            },

            createTask(){
                this.buttonDisable = true
                this.$emit("create-task", { task: this.Task_Details})
            },

            selectPriority(priority) {
                this.Task_Details["priority"] = priority.id;
                this.priority_name = priority.task_priority               
            },
        },
        mounted(){
            if(this.EditData!== null && this.EditMode=== true || this.EditData!== null && this.readOnlyMode=== true){
                this.Task_Details.name= this.EditData.task_name?this.EditData.task_name:this.EditData.name;
                this.Task_Details.deadline = this.EditData.deadline ? this.EditData.deadline: this.EditData.deadline
                this.Task_Details.description = this.EditData.description
                this.Task_Details.priority = this.EditData.priority_id ? this.EditData.priority_id: this.EditData.priorityId
                this.Task_Details.id = this.EditData.task_id?this.EditData.task_id:this.EditData.id
            }
        },
        
    }
</script>

<template>
        <div class="modal-overlay">
            
            <div class="modal" v-click-away="cancelModal"> 
                <div class="close-container">
                    <i class="close large red icon" @click="cancelModal"></i>
                </div>
                <div class="header">
                    <h1 v-if="(this.EditMode=== false || this.EditMode=== null) && (this.readOnlyMode === false || this.readOnlyMode === null) && (this.createNewTask===true)">Let's create a task!</h1>
                    <h1 v-if="this.EditMode=== true">Edit Mode</h1>
                    <h1 v-if="this.readOnlyMode === true">Task Details</h1>
                </div>
                <div class="forms">
                    <div class="form-container">
                        <form class="ui form" @submit.prevent="createTask" novalidate>
                            <div class="field">
                                <label>Task Name</label>
                                <input :readonly="buttonDisable" type="text" name="name" placeholder="Name" v-model="Task_Details.name" @change="Task_Details.name">
                            </div>
                            <div class="field">
                                <label>Task Deadline</label>
                                <input type="date" :disabled="buttonDisable" v-model="Task_Details.deadline">
                            </div>
                            <div class="field" >
                                <label> Priority</label>
                            </div>
                              <select v-model="Task_Details.priority" :disabled="buttonDisable">
                                <option value="" selected>Select a priority</option>
                                <option v-for="priority in this.priorities" :value="priority.id" >{{ priority.name}}</option>
                              </select>

                            <div class="field">
                                <label>Description</label>
                                <textarea :readonly="buttonDisable" type="texarea" name="description" placeholder="Details" v-model="Task_Details.description"></textarea>
                            </div>
                            

                            <button v-if="(this.readOnlyMode === false || this.readOnlyMode === null) && (this.EditMode=== false || this.EditMode=== null) && (this.createNewTask===true)"  :disabled="buttonDisable" class="ui green button" type="submit">Create</button>
                            <button v-if="(this.readOnlyMode === false || this.readOnlyMode === null) && this.EditMode=== true && (this.createNewTask===false || this.createNewTask===null || this.createNewTask === undefined) "  :disabled="buttonDisable" class="ui green button" type="submit">Edit</button>
                        </form>
                    </div>
              </div>
            </div>
            
      </div>
</template>

<style scoped>
    .ui.form .field :disabled{
        opacity: 1;
    }

    .dp__outer_menu_wrap {
        position:unset !important
    }
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