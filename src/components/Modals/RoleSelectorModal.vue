<script>
    export default{
        name: "RoleSelectorModal",
        props:{
            getusers:Array,
            getroles:Array,
            isDropdownOpen:null,
            user:{},
        },
        data(){
            return{
                selectedRole:{
                    id: "",
                    name: "",
                },
                buttonDisable:false,
            }
        },
        methods: {
            toggleDrop(){
                this.$emit("toggleDrop")
            },
            cancelModal() {
                this.$emit("cancel-modal")
                this.buttonDisable=false
            },

            attachRole(){
                this.buttonDisable=true,
                this.$emit("attachRole", { role_id: this.selectedRole.id, role_name: this.selectedRole.name, user_id: this.user.id })
            },

            selectRole(role) {
                this.selectedRole["id"] = role.id;
                this.selectedRole["name"] = role.role_name;
                               
            },

           

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
                    <i class="exclamation huge triangle icon"></i>
                    <h2>You Activated The Role Selector Mode!</h2>
                    
                </div>
                <form class="ui form" @submit.prevent="attachRole" novalidate>
                    <div class="field">
                        <label>Selected User: {{user.name}}</label>
                    </div>
                    <div class="field"><label>Select a Role</label></div>
                    <div class="ui fluid selection dropdown" @click="toggleDrop" :class="{ active: selectedRole.name }">
                        <i class="dropdown icon"></i>
                        <input type="hidden" name="roles" v-model="selectedRole.id">
                            <div class="selected-text">{{ selectedRole.name  }}</div>
                            <div class="menu" :class="{ active: isDropdownOpen }" >
                                <div class="item" v-for="role in getroles" :key="role.id" @click="selectRole(role)">
                                    {{ role.role_name }}
                                </div>
                            </div>
                    </div>
                    
                    <button class="ui green button" type="submit" :disabled="buttonDisable">Create</button>
                </form>
               
                    
                    
                
                   
                    
                    
                
              
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
    background-color: #e8da52;
    height: 400px;
    width: 500px;
    margin: auto;
    border-radius: 20px;
    padding:20px
    }
    .ui.input{
        width: auto;
        height: auto;
        display: flex;
        margin: 0 auto
    }

    .ui.form{
        height: auto;
        
    }
    .form{
        top:0px;
        margin:0px ;
        padding:20px;
        height: 0px;
    }
    .cancel{
        margin:0;
        
        width: fit-content;
    }
    .header{
        text-align: center;
    }
   
    .ui.red.button{
        margin-top: 7%;
        left: 38%;
    }
    .ui.green.button{
        top:20px
    }
    .field label{
        font-weight: bold;
        color: rgb(0 0 0 / 62%) !important  
    }

    .close{
        width: 60px;
        left:80%;
        cursor: pointer;
    }
</style>