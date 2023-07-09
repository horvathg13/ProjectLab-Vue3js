<script>
  import ServiceClient from '../ServiceClient';
import ErrorPopup from './Common/ErrorPopup.vue';
import AddUserModal from './Modals/AddUserModal.vue';
import AreYouSureModal from './Modals/AreYouSureModal.vue';
import RoleSelectorModal from './Modals/RoleSelectorModal.vue';
import Success_Popup from './Common/Success_Popup.vue';
import ResetPasswordManualModal from './Modals/ResetPasswordManualModal.vue';
import ContentTitle from './Common/ContentTitle.vue';
import CircularMenu from './Common/CircularMenu.vue';

  export default {
    components: {
        AddUserModal,
        Success_Popup,
        ErrorPopup,
        ResetPasswordManualModal,
        RoleSelectorModal,
        AreYouSureModal,
        ContentTitle,
        CircularMenu
    },
    data() {
        return {
            message:"",
            showModal:false,
            show_popup:false,
            show_error_popup:false,
            name:"",
            email:"",
            url:"",
            getusers:Array,
            getroles:Array,
            show_reset_password_manual_modal:false,
            show_role_selector_modal:false,
            role_id:"",
            role_name:"",
            isDropdownOpen: false,
            user:{},
            triggerModal:false,
            triggerValue: null,
            dataSave:[],
            func:'',
        }
    },
   
    methods:{
        trigger(data){
            const{trigger} = data
            this.triggerValue = trigger
            console.log(this.triggerValue)
            
            if(this.triggerValue === true){
                if(this.func === 'BannUser'){
                    this.BannUser();
                }else if(this.func === 'open_show_role_selector_modal'){
                    this.open_show_role_selector_modal();
                }else if(this.func === 'PasswordResetManual'){
                    this.PasswordResetManual()
                }
            }else if(this.triggerValue===false){
                this.triggerModal=false;
                this.triggerValue=null;
            }
        },
        toggleDropdown() {
            this.isDropdownOpen = !this.isDropdownOpen;
            console.log("dropping")
        },
        open_show_role_selector_modal(){
            this.triggerModal = true;
            this.triggerModal = false;
            this.triggerValue = null;
            this.user.id = this.dataSave.id;
            this.user.name = this.dataSave.name;
            this.show_role_selector_modal = true;
            console.log(this.user);
            
        },
        updateModal(){
            
            if(this.showModal==false){
                this.showModal = true
            }
            
        },

        cancelModal(){
            this.showModal = false
            this.show_reset_password_manual_modal=false
            this.show_role_selector_modal = false
            this.url = ""
        },

        createUser(data){
            const { name, email } = data;
            
            this.name = name;
            this.email= email;
            console.log(this.name, this.email)
            
            let formData = new FormData();
            formData.append("name", this.name);
            formData.append("email", this.email);
            let url ="http://127.0.0.1:8000/api/createuser";
                ServiceClient.post(url,formData).then((response) =>{
                    console.log(response);
                    if (response.status == 200){
                        this.message = response.data.message;
                        this.show_popup = true
                        this.url = response.data.data.url
                        console.log(response.data.data.url)
                        setTimeout(() => {
                            this.show_popup = false
                            this.message = "";
                        },  2000)
                       
                    }
                }).catch((error) => {
                        
                    if (error.response && error.response.status === 400) {
                        if (error.response.data && error.response.data.message) {
                            this.show_error_popup = true
                            setTimeout(() => {
                                this.show_error_popup = false
                            },  2000)
                            
                        }
                    }
                });
            
        },
        copy(){
            console.log(this.url.length)
            if(this.url.length>0){
                navigator.clipboard.writeText(this.url)
                .then(() => {
                    this.message="URL copied to clipboard"
                    this.show_popup = true
                    setTimeout(() => {
                        this.show_popup = false
                        this.message="";
                    },  2000)
                
                })
                .catch((error) => {
                    this.message="Failed to copy URL to clipboard!"
                    console.error("Failed to copy URL to clipboard:", error);
                    this.show_error_popup = true
                    setTimeout(() => {
                            this.show_error_popup = false
                            this.message = "";
                    },  2000)
                });
            }else{
                this.show_error_popup = true
                setTimeout(() => {
                        this.show_error_popup = false
                },  2000)
                
            }
        },

            getUsers(){
                let url ="http://127.0.0.1:8000/api/getusers";
                ServiceClient.post(url).then((response) =>{
                        
                        if (response.status == 200){
                            
                            this.getusers=response.data
                            console.log(response)
                            
                        
                        }
                    }).catch((error) => {
                            
                        if (error.response && error.response.status) {
                            if (error.response.data && error.response.data.message) {
                                this.message = "Database error occured!"
                                this.show_error_popup = true
                                setTimeout(() => {
                                    this.show_error_popup = false
                                    this.message = "";
                                },  2000)
                                
                            }
                        }
                    });
            },

            getRoles(){
                let url ="http://127.0.0.1:8000/api/getroles";
                ServiceClient.post(url).then((response) =>{
                        
                        if (response.status == 200){
                            
                            this.getroles = response.data.roles
                            console.log( this.getroles)
                            
                        
                        }
                    }).catch((error) => {
                            
                        if (error.response && error.response.status) {
                            if (error.response.data && error.response.data.message) {
                                this.message=error.response.data.message
                                this.show_error_popup = true
                                setTimeout(() => {
                                    this.show_error_popup = false
                                    this.message = "";
                                },  2000)
                                
                            }
                        }
                    });
            },

            BannUser() {
                this.triggerModal = false;
                this.triggerValue = null;

                let url = `http://127.0.0.1:8000/api/bann-user/${this.dataSave.id}`;
                ServiceClient.post(url)
                    .then((response) => {
                        if (response.status === 200) {
                            this.show_popup = true;
                            this.getUsers();
                            setTimeout(() => {
                                this.show_popup = false;
                                
                            }, 1500);
                            this.url = response.data.data.url;
                        }
                    })
                    .catch((error) => {
                        if (error.response && error.response.status) {
                            if (error.response.data && error.response.data.message) {
                                this.message=error.response.data.message
                                this.show_error_popup = true;
                                setTimeout(() => {
                                    this.show_error_popup = false;
                                    this.message="";
                                }, 2000);
                            }
                        }
                    });
            
            },
            PasswordResetManual(){
                
                this.triggerModal = false;
                this.triggerValue = null;

                let url = `http://127.0.0.1:8000/api/password-reset-manual/${this.dataSave.id}`;
                ServiceClient.post(url).then((response) => {

                    if (response.status == 200) {
                        this.url = response.data.data.url
                        console.log(response)
                        this.show_popup = true
                        this.show_reset_password_manual_modal = true;
                        setTimeout(() => {
                            this.show_popup = false
                            
                        }, 1500)


                    }
                }).catch((error) => {

                    if (error.response && error.response.status) {
                        if (error.response.data && error.response.data.message) {
                            this.show_error_popup = true
                            setTimeout(() => {
                                this.show_error_popup = false
                            }, 2000)

                        }
                    }
                });
               
            },

            userToRole(data) {

                const { role_id, role_name, user_id } = data
                this.user_id = user_id
                this.role_id = role_id,
                    this.role_name = role_name

                let url = `http://127.0.0.1:8000/api/user-to-role/${user_id}/${role_name}`;
                ServiceClient.post(url).then((response) => {
                    if (response.status == 200) {

                        console.log(response)
                        this.show_popup = true
                        this.getUsers()
                        setTimeout(() => {
                            this.show_popup = false
                            this.show_role_selector_modal = false
                        }, 1500)
                    }


                }).catch((error) => {

                    if (error.response && error.response.status) {
                        if (error.response.data && error.response.data.message) {
                            this.show_error_popup = true
                            setTimeout(() => {
                                this.show_error_popup = false
                            }, 2000)

                        }
                    }
                });
            },
            
            DataSave(kiskutya){
                const {data, str} = kiskutya
                this.dataSave = kiskutya.data;
                this.func = kiskutya.str
                console.log(kiskutya)
                this.triggerModal= true

            },


        

        },
        
        mounted(){
            this.getUsers()
            this.getRoles()
        }
    }

        
</script>

<template>
    <div class="main-container">
        <div class="background component">
        </div>
        
        <Transition name="drop">
            <Success_Popup v-if="show_popup==true" :message="this.message"></Success_Popup>
        </Transition>
        <Transition name="drop">
            <ErrorPopup v-if="show_error_popup==true" :message="this.message"></ErrorPopup>
        </Transition>
        <div class="content-container">
            
            <!--<div class="content-title users">
                <h1>Users</h1>
            </div>-->
        
        <div class="centerd-component-container">
            <div class="scrolling-table-container">
                <table class="ui striped table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Name</th>
                            <th>E-mail</th>
                            <th>Role</th>
                            <th>Actions
                            <button class="ui right floated small primary labeled icon button" @click="updateModal"><i class="user plus icon"></i>Add</button>
                            </th>
                            
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="user in getusers" :key="user.id">
                            <td>{{user.id}}</td>
                            <td>{{user.name}}</td>
                            <td>{{user.email}}</td>
                            <td>{{user.roles}}</td>
                            <td>
                                <CircularMenu
                                :data="user"
                                :component="this.$route.name"
                                @DataSaveEmit="DataSave"
                                @DataSaveRolesEmit="DataSave"
                                @DataSaveResetPassword="DataSave"></CircularMenu>
                                <!--<button class="ui small yellow button"><i class="edit icon"></i>Edit</button>
                                <button class="ui small red button" @click="DataSave(user, 'BannUser')"><i class="close icon"></i>Ban user</button>
                                <button class="ui small purple button" @click="DataSave(user, 'open_show_role_selector_modal')"><i class="balance scale icon"></i>Roles</button>
                                <button class="ui small orange button" @click="DataSave(user, 'PasswordResetManual')"><i class="key icon"></i>Reset password</button>-->
                            </td>
                        </tr>
                    </tbody>
                    <tfoot class="full-width">
                        <tr>
                            <th></th>
                            <th></th>
                            <th colspan="4">
                        
                            </th>
                        </tr>
                        
                    </tfoot>
                </table>
           </div>
        </div>
        </div>
        <Transition>
                <AddUserModal v-if="showModal==true" @cancel-modal="cancelModal"
                @create-user="createUser" @copy-to="copy" :Url="this.url"></AddUserModal>
        </Transition> 
        <Transition>
            <ResetPasswordManualModal v-if="show_reset_password_manual_modal==true" @cancel-modal="cancelModal" @copy-to="copy" :Url="this.url"></ResetPasswordManualModal>
        </Transition>
        <Transition>
            <RoleSelectorModal v-if="show_role_selector_modal==true" @toggleDrop= "toggleDropdown" @cancel-modal="cancelModal" @attachRole="userToRole" :getusers="this.getusers" :getroles="this.getroles" :isDropdownOpen="this.isDropdownOpen" :user="this.user"></RoleSelectorModal>
        </Transition>
        <Transition>
            <AreYouSureModal v-if="triggerModal==true" @trigger="trigger"></AreYouSureModal>
        </Transition>
    </div>
</template>
