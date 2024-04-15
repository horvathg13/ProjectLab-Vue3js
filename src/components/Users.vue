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
  import EventHandler from "@/components/Common/EventHandler/eventHandler.vue";
  import serviceClient from "../ServiceClient";
  import * as Promis from "axios";

  export default {
    components: {
      EventHandler,
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
            /*Event Handler*/
            message:"",
            serverError:'',
            errorArray:[],

            /*Popup Control*/
            showModal:false,
            show_popup:false,
            show_error_popup:false,
            show_reset_password_manual_modal:false,
            show_role_selector_modal:false,
            triggerModal:false,
            triggerValue: null,

            /*Form fields*/
            name:"",
            email:"",
            url:"",
            role_id:"",
            role_name:"",

            /*Dropdown*/
            isDropdownOpen: false,

            /*Button Control*/
            adminbuttons:{},
            tryAgain:null,

            /*Others*/
            user:{},
            getusers:Array,
            getroles:Array,
            dataSave:[],
            func:'',
            userRole:{},
        }
    },

    watch:{
        '$store.state.userRole'(newValue) {
            this.userRole = newValue;
        },
    },
    
    methods:{
        trigger(data){
            const{trigger} = data
            this.triggerValue = trigger
            if(this.triggerValue === true){
                if(this.func === 'BannUser'){
                    this.BanUser();
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
            this.triggerModal = false
            this.triggerValue = null
            this.user.id = this.dataSave.id
            this.user.name = this.dataSave.name
            this.user.roles= this.dataSave.roles?this.dataSave.roles.trim().split(","):[]
            this.show_role_selector_modal = true
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
            this.tryAgain=true;

            ServiceClient.createUser(this.name,this.email).then((response) =>{
              if (response.status === 200){
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
              this.tryAgain=false
              this.serverError=error
              this.show_error_popup=true
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
              ServiceClient.getUsers().then(users=>{
                this.getusers = users
              }).catch((error) => {
                this.serverError=error;
                this.show_error_popup = true
              });
          },

          getRoles(){
            ServiceClient.getRoles().then(roles=>{
              this.getroles = roles
            }).catch((error) => {
              this.serverError=error;
              this.show_error_popup = true
            });
          },

          BanUser() {
              this.triggerModal = false;
              this.triggerValue = null;
              ServiceClient.banUser(this.dataSave.id).then((result)=>{
                  this.show_popup = true;
                  setTimeout(() => {
                    this.show_popup = false;
                  }, 1500);
                  this.getusers=result
              }).catch((error) => {
                console.log(error)
                if(error.response){
                  this.serverError=error;
                  this.show_error_popup = true;
                }
              });
          },
          PasswordResetManual(){
              this.triggerModal = false;
              this.triggerValue = null;
              ServiceClient.passwordResetManual(this.dataSave.id).then((response) => {
                if (response.status === 200) {
                  this.url = response.data.data.url
                  this.show_popup = true
                  this.show_reset_password_manual_modal = true;
                  setTimeout(() => {
                    this.show_popup = false
                  }, 1500)
                }
              }).catch((error) => {
                this.serverError=error;
                this.show_error_popup = true;
              });
          },

          userToRole(data) {
              this.user={};
              const { selectedRole, user_id, remove } = data
              this.tryAgain=true;

              ServiceClient.userToRole(user_id,selectedRole,remove).then(() => {
                  this.show_popup = true
                  setTimeout(() => {
                    this.show_popup = false
                    this.show_role_selector_modal = false
                  }, 1500)
              }).catch((error) => {
                if(error.response){
                  this.serverError=error;
                  this.show_error_popup = true;
                  this.tryAgain=false
                  this.open_show_role_selector_modal()
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
              ServiceClient.getUsersButton().then(buttons=>{
                this.adminbuttons= buttons
              }).catch((error) => {
                if (error.response && error.response.status) {
                  this.serverError=error;
                  this.show_error_popup = true;
                }
              });
          },

          closeErrorModal(){
            this.show_error_popup=false
          }
        },
        beforeRouteEnter(to, from, next) {
            ServiceClient.accessAdmin().then(isAdmin => {
              if(isAdmin) {
                next();
              }else {
                next('/accessdenied');
              }
            }).catch(error => {
              console.error(error);
              next('/accessdenied');
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
        <EventHandler
            :successPopup="show_popup"
            :error-popup="show_error_popup"
            :errorarray="errorArray"
            :serverError="serverError"
            @close="closeErrorModal"
        />
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
            <RoleSelectorModal v-if="show_role_selector_modal===true" @toggleDrop= "toggleDropdown" @cancel-modal="cancelModal" @attachRole="userToRole" :getusers="this.getusers" :getroles="this.getroles" :isDropdownOpen="this.isDropdownOpen" :user="this.user" :tryAgain="this.tryAgain"></RoleSelectorModal>
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
