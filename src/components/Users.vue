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
import {store} from '../VuexStore'

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
            adminbuttons:{},
            userRole:{},
            AddNewUser:false,
            errorarray:[],
            tryAgain:null,
        }
    },
    watch:{
        '$store.state.userRole'(newValue) {
            this.userRole = newValue;
        }
    },
    
    methods:{
        trigger(data){
            const{trigger} = data
            this.triggerValue = trigger
            
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
        },
        open_show_role_selector_modal(){
            this.triggerModal = true;
            this.triggerModal = false;
            this.triggerValue = null;
            this.user.id = this.dataSave.id;
            this.user.name = this.dataSave.name;
            this.user.roles= this.dataSave.roles?this.dataSave.roles.trim().split(","):[];
            this.show_role_selector_modal = true;
            
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
            this.url = "",
            this.tryAgain=null
        },

        createUser(data){
            const { name, email } = data;
            
            this.name = name;
            this.email= email;
            
            let formData = new FormData();
            formData.append("name", this.name);
            formData.append("email", this.email);
            let url ="/api/createuser";
                ServiceClient.post(url,formData).then((response) =>{
                    if (response.status == 200){
                        this.message = response.data.message;
                        this.show_popup = true
                        this.url = response.data.data.url
                        setTimeout(() => {
                            this.getUsers();
                            this.show_popup = false
                            this.message = "";
                        },  2000)
                       
                    }
                }).catch((error) => {
                    this.tryAgain=null
                    if(error.response.data.validatorError){
                        this.errorArray=error.response.data.validatorError
                        this.show_error_popup=true
                        setTimeout(() => {
                            this.tryAgain=false
                            this.show_error_popup = false
                            this.errorArray=[];
                        },  2000)
                    }
                    if (error.response && error.response.data.message) {
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
                let url ="/api/getusers";
                ServiceClient.post(url).then((response) =>{
                        
                        if (response.status == 200){
                            
                            this.getusers=response.data
                            
                        
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
                let url ="/api/getroles";
                ServiceClient.post(url).then((response) =>{
                        
                        if (response.status == 200){
                            
                            this.getroles = response.data.roles
                            
                        
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

                let url = `/api/bann-user/${this.dataSave.id}`;
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

                let url = `/api/password-reset-manual/${this.dataSave.id}`;
                ServiceClient.post(url).then((response) => {

                    if (response.status == 200) {
                        this.url = response.data.data.url
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
                this.user={};
                const { selectedRole, user_id, remove } = data
                let dataTravel = {}
                dataTravel.user_id = user_id
                dataTravel.selectedRole = selectedRole,
                dataTravel.remove=remove;
                let url = '/api/user-to-role/';
                ServiceClient.post(url,dataTravel).then((response) => {
                    if (response.status == 200) {
                        this.message=response.data.message
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
                            this.message=error.response.data.message
                            this.show_error_popup = true
                           
                            setTimeout(() => {
                                this.cancelModal();
                                this.show_error_popup = false
                                this.message=""
                            }, 2000)

                        }
                    }
                });
            },
            
            DataSave(kiskutya){
                const {data, str} = kiskutya
                this.dataSave = kiskutya.data;
                this.func = kiskutya.str
                this.triggerModal= true

            },
            getUsersButton(user){
               
                let url="/api/get-users-buttons"
                ServiceClient.post(url).then(response => {
                    if (response.status == 200){
                        for(let i in response.data){
                            this.adminbuttons = response.data[i]
                           
                        }
                        this.adminbuttons = this.adminbuttons.admin.slice(0,3)
                    }
                
                }).catch((error) => {
                    if (error.response && error.response.status) {
                        if (error.response.data && error.response.data.message) {
                            this.message = error.response.data.message
                            this.show_error_popup = true
                            setTimeout(() => {
                                this.show_error_popup = false
                                this.message = ""
                            }, 2000)

                        }
                    }
                });
            },
            setUserRole(){
                ServiceClient.post('/api/getUserRole').then(response => {
                    store.commit("setuserRole",response.data)
                }).catch(error =>{
                    console.log(error);
                });
            }


        

        },
        beforeRouteEnter(to, from, next) {
            ServiceClient.post('/api/getUserRole').then(response => {
                if(response.status === 200){
                    store.commit("setuserRole",response.data)
                    const userRole = response.data
                    if(userRole.code !== 404){
                        const isAdmin= userRole.some(item=>item.role === "Admin");
                        if(isAdmin === false){
                            next('/accessdenied')
                        }else{
                            next();
                        }
                    }else{
                        next('/accessdenied')
                    }
                }
                
            }).catch(error =>{
                console.log(error);
            });
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
            <ErrorPopup v-if="show_error_popup==true" :message="this.message" :errorarray="this.errorArray"></ErrorPopup>
        </Transition>
        <div class="content-container">
        
            <div class="centerd-component-container">
                <div class="scrolling-table-container">
                    <table class="ui selectable striped table">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Name</th>
                                <th>E-mail</th>
                                <th>Role</th>
                                <th>
                                <button class="ui right floated small primary labeled icon button" @click="updateModal"><i class="user plus icon"></i>Add</button>
                                </th>
                                
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="user in getusers" :key="user.id">
                                <td>{{user.id}}</td>
                                <td :style="{overflow:'hidden', textOverflow:'ellipsis'}">{{user.name}}</td>
                                <td :style="{overflow:'hidden', textOverflow:'ellipsis'}">{{user.email}}</td>
                                <td>{{user.roles}}</td>
                                <td>
                                    <CircularMenu
                                    @click="getUsersButton(user)"
                                    :buttons="this.adminbuttons"
                                    :data="user"
                                    :component="this.$route.name"
                                    @DataSaveEmit="DataSave"
                                    @DataSaveRolesEmit="DataSave"
                                    @DataSaveResetPassword="DataSave"></CircularMenu>
                                </td>
                            </tr>
                        </tbody>
                        <tfoot class="full-width">
                            <tr>
                                
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
                <AddUserModal v-if="showModal==true"
                @cancel-modal="cancelModal"
                @create-user="createUser" 
                @copy-to="copy" 
                :Url="this.url"
                :tryAgain="this.tryAgain"></AddUserModal>
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

<style scoped>
.ui.table.uniq td{
    overflow: auto;
    text-overflow: ellipsis;
}
</style>
