<script>
    import VueDatePicker from '@vuepic/vue-datepicker';
    import '@vuepic/vue-datepicker/dist/main.css'
    import SelectComponents from '../Common/SelectComponents.vue';
    import VueClickAway from 'vue3-click-away';
    export default{
        name: "CreateProjectModal",
        components:{
            VueDatePicker,
            SelectComponents
        },
        directives:{
            VueClickAway
        },
        props:{
            getusers:Array,
            isDropdownOpen: null,
            selected:{},
            EditMode:false,
            EditData:{},
            tryAgain:null,
            
            
        },
        data(){
            return{
                p_name:"",
                p_id:null,
                selectedManager:{
                    id: "",
                    name: "",
                    email: "",
                },
                date: '',
                buttonDisable:false  
                
            }
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
        
        methods: {
           
            cancelModal() {
                this.$emit("cancel-modal");
            },

            createProject(){
                this.buttonDisable=true
                this.$emit("create-project", { p_name: this.p_name, manager:this.selectedManager, date: this.date, p_id: this.p_id})
            },


            makeSelection(data){
                const {select} = data
                this.selectedManager= select
            },
            
          
        },
        mounted(){
            if(this.EditData && this.EditMode=== true){
                this.p_name= this.EditData.name;
                this.selectedManager.id = this.EditData.manager_id,
                this.selectedManager.name = this.EditData.manager,
                this.selectedManager.email = this.EditData.manager_email
                this.date = this.EditData.deadline.replace(/-/g, ".")
                this.p_id = this.EditData.project_id
            }
       
        },
    }
</script>

<template>
        <div class="modal-overlay">
            
            <div class="modal" v-click-away="cancelModal"> 
                <div class="close">
                    <i class="close large red icon" @click="cancelModal"></i>
                </div>
                <div class="header">
                    
                    <h1 v-if="this.EditMode === false">Let's create a new project!</h1>
                    <h1 v-if="this.EditMode === true">Edit Mode</h1>
                </div>
          
              
                <div class="forms">

                    <div class="form-container">
                        <form class="ui form" @submit.prevent="createProject" novalidate>
                            <div class="field">
                                <label>Project Name</label>
                                <input :disabled="buttonDisable" type="text" name="name" placeholder="Name" v-model="p_name">
                            </div>
                            <div class="field"><label>Select a Manager</label></div>
                            <SelectComponents :disable="buttonDisable" :VforArray="this.getusers.map(u=>({id:u.id, name:u.name + ' (' + u.email + ')'}))" :editProject="this.EditData" @select="makeSelection"></SelectComponents>
                            <div class="field" >
                                <label>Enter Deadline</label>
                                <VueDatePicker :disabled="buttonDisable" v-model="this.date"
                                :enable-time-picker="false"
                                model-type="yyyy.MM.dd"
                                format="yyyy-MM-dd"                            
                                >{{ date }}</VueDatePicker>
                                
                            </div>
                    
                            <button v-if="EditMode===true" :disabled="buttonDisable" class="ui green button" type="submit">Edit</button>
                            <button v-else :disabled="buttonDisable" class="ui green button" type="submit">Create</button>

                        </form>
                    </div>
                    
              </div>
              
            </div>
            
      </div>
</template>

<style scoped>  

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